/**
 * WHOAMI — Firebase Cloud Functions
 *
 * PortOne 결제 검증 API + 웹훅 엔드포인트
 *
 * [배포 명령어]
 *   cd functions && npm install && npm run build
 *   firebase deploy --only functions
 *
 * [환경변수 설정 — Firebase Functions 환경변수]
 *   firebase functions:secrets:set PORTONE_API_SECRET
 *   또는 defineSecret 사용
 */

import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";

// ─────────────────────────────────────────────
// Firebase 초기화
// ─────────────────────────────────────────────
admin.initializeApp();
const db = admin.firestore();

// CORS 허용 도메인
const ALLOWED_ORIGINS = [
    "https://my-web-6f220.web.app",
    "https://my-web-6f220.firebaseapp.com",
    "https://whoami-test.com",
    "http://localhost:3000",
];

function setCorsHeaders(req: any, res: any) {
    const origin = req.headers.origin || "";
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.set("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
}

// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────

/** 상품별 정가 (원) — 프론트와 동기화 필수 */
const PRODUCT_PRICES: Record<string, number> = {
    saju_premium_report: 9900,
    ziwei_premium_report: 9900,
    master_report: 19900,
};

// ─────────────────────────────────────────────
// PortOne REST API 호출
// ─────────────────────────────────────────────

async function getPortOnePayment(paymentId: string, apiSecret: string) {
    const url = `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`;
    const res = await fetch(url, {
        headers: {
            Authorization: `PortOne ${apiSecret}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`PortOne API ${res.status}: ${errorBody}`);
    }

    return res.json();
}

// ═══════════════════════════════════════════════
// 1. 결제 검증 API (프론트에서 호출)
//
//    POST /api/payment/verify  (Firebase Hosting rewrite)
//    Body: { paymentId, txId, recordId, email, productId, expectedAmount }
// ═══════════════════════════════════════════════

export const verifyPayment = onRequest(
    { region: "asia-northeast3", cors: ALLOWED_ORIGINS },
    async (req, res) => {
        if (req.method === "OPTIONS") {
            res.status(204).send("");
            return;
        }

        if (req.method !== "POST") {
            res.status(405).json({ success: false, message: "Method not allowed" });
            return;
        }

        try {
            const { paymentId, txId, recordId, email, productId, expectedAmount } = req.body;

            // 필수 파라미터 검증
            if (!paymentId || !productId || !expectedAmount) {
                res.status(400).json({
                    success: false,
                    message: "필수 파라미터가 누락되었습니다. (paymentId, productId, expectedAmount)",
                });
                return;
            }

            // 서버 측 정가 검증 (프론트 위변조 방지)
            const serverPrice = PRODUCT_PRICES[productId];
            if (serverPrice && serverPrice !== expectedAmount) {
                logger.error(`Price tamper detected: product=${productId}, sent=${expectedAmount}, server=${serverPrice}`);
                res.status(400).json({
                    success: false,
                    message: "상품 가격이 일치하지 않습니다.",
                });
                return;
            }

            // PortOne API Secret (환경변수)
            const apiSecret = process.env.PORTONE_API_SECRET || "";
            if (!apiSecret) {
                logger.error("PORTONE_API_SECRET is not configured");
                res.status(500).json({ success: false, message: "서버 설정 오류" });
                return;
            }

            // ═══ PortOne REST API로 결제 조회 ═══
            const paymentData: any = await getPortOnePayment(paymentId, apiSecret);

            // ═══ 결제 상태 검증 ═══
            if (paymentData.status !== "PAID") {
                logger.error(`Payment not paid: ${paymentId}, status=${paymentData.status}`);
                res.status(400).json({
                    success: false,
                    message: `결제가 완료되지 않았습니다. (상태: ${paymentData.status})`,
                });
                return;
            }

            // ═══ 결제 금액 검증 ═══
            const paidAmount = paymentData.amount?.total ?? paymentData.totalAmount ?? 0;
            if (paidAmount !== expectedAmount) {
                logger.error(`Amount mismatch: paid=${paidAmount}, expected=${expectedAmount}`);
                res.status(400).json({
                    success: false,
                    message: "결제 금액이 일치하지 않습니다.",
                });
                return;
            }

            // ═══ Firestore에 결제 기록 저장 ═══
            await db.collection("payments").doc(paymentId).set({
                paymentId,
                txId: txId || null,
                recordId: recordId || null,
                email: email || null,
                productId,
                amount: paidAmount,
                currency: "KRW",
                status: "PAID",
                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            logger.info(`✅ Payment verified & saved: ${paymentId} (${productId}) — ₩${paidAmount} → ${email}`);

            res.status(200).json({
                success: true,
                message: "결제가 정상적으로 확인되었습니다.",
                data: { paymentId, productId, amount: paidAmount },
            });
        } catch (error: any) {
            logger.error("verifyPayment error:", error);
            res.status(500).json({
                success: false,
                message: error.message || "서버 오류가 발생했습니다.",
            });
        }
    }
);

// ═══════════════════════════════════════════════
// 2. PortOne 웹훅 (PortOne 관리자에서 등록)
//
//    POST /api/payment/webhook  (Firebase Hosting rewrite)
//
//    PortOne에서 결제 상태 변경 시 자동 호출
//    (결제 완료, 취소, 환불 등)
//
//    PortOne 관리자 → 웹훅 URL 등록:
//    https://my-web-6f220.web.app/api/payment/webhook
// ═══════════════════════════════════════════════

export const portoneWebhook = onRequest(
    { region: "asia-northeast3" },
    async (req, res) => {
        if (req.method !== "POST") {
            res.status(405).send("Method not allowed");
            return;
        }

        try {
            const { type, data } = req.body;
            logger.info(`Webhook received: type=${type}`, data);

            const paymentId = data?.paymentId;
            if (!paymentId) {
                res.status(400).json({ message: "Missing paymentId" });
                return;
            }

            const apiSecret = process.env.PORTONE_API_SECRET || "";

            // 웹훅 데이터를 그대로 신뢰하지 않고 PortOne API로 재검증
            const paymentData: any = await getPortOnePayment(paymentId, apiSecret);

            // Firestore 업데이트
            const docRef = db.collection("payments").doc(paymentId);
            const doc = await docRef.get();

            if (doc.exists) {
                await docRef.update({
                    status: paymentData.status,
                    webhookType: type,
                    webhookReceivedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                logger.info(`Webhook update: ${paymentId} → ${paymentData.status}`);
            } else {
                await docRef.set({
                    paymentId,
                    status: paymentData.status,
                    amount: paymentData.amount?.total ?? 0,
                    currency: "KRW",
                    webhookType: type,
                    webhookReceivedAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                logger.info(`Webhook new record: ${paymentId} → ${paymentData.status}`);
            }

            // 결제 취소/환불 처리
            if (paymentData.status === "CANCELLED" || paymentData.status === "FAILED") {
                logger.warn(`Payment ${paymentId} is ${paymentData.status}`);
                // TODO: 프리미엄 콘텐츠 접근 권한 회수 로직
            }

            res.status(200).json({ received: true });
        } catch (error: any) {
            logger.error("Webhook error:", error);
            res.status(500).json({ message: error.message });
        }
    }
);
