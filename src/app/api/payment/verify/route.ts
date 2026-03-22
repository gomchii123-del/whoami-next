/**
 * PortOne 결제 검증 API 라우트
 *
 * [보안 원칙]
 * 프론트엔드의 결제 성공 응답만으로는 위변조 가능성이 있으므로
 * 서버 측에서 PortOne REST API를 통해 실제 결제 상태를 검증합니다.
 *
 * 검증 절차:
 * 1. PortOne REST API로 결제 정보 조회
 * 2. 결제 상태(status === 'PAID') 확인
 * 3. 결제 금액이 요청 금액과 일치하는지 확인
 * 4. 검증 성공 시 DB에 결제 기록 저장 (TODO)
 */

import { NextRequest, NextResponse } from 'next/server';

const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET || '';

interface VerifyRequest {
    paymentId: string;
    txId: string;
    recordId: string;
    email: string;
    productId: string;
    expectedAmount: number;
}

export async function POST(request: NextRequest) {
    try {
        const body: VerifyRequest = await request.json();
        const { paymentId, txId, recordId, email, productId, expectedAmount } = body;

        // ═══════════════════════════════════════
        // 1단계: PortOne REST API로 결제 조회
        // ═══════════════════════════════════════
        const portoneResponse = await fetch(
            `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
            {
                headers: {
                    Authorization: `PortOne ${PORTONE_API_SECRET}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!portoneResponse.ok) {
            console.error('PortOne API error:', portoneResponse.status);
            return NextResponse.json(
                { success: false, message: '결제 정보 조회에 실패했습니다.' },
                { status: 400 }
            );
        }

        const paymentData = await portoneResponse.json();

        // ═══════════════════════════════════════
        // 2단계: 결제 상태 검증
        // ═══════════════════════════════════════
        if (paymentData.status !== 'PAID') {
            console.error(`Payment not completed. Status: ${paymentData.status}`);
            return NextResponse.json(
                { success: false, message: `결제가 완료되지 않았습니다. (상태: ${paymentData.status})` },
                { status: 400 }
            );
        }

        // ═══════════════════════════════════════
        // 3단계: 결제 금액 검증 (위변조 방지)
        // ═══════════════════════════════════════
        const paidAmount = paymentData.amount?.total || paymentData.totalAmount || 0;
        if (paidAmount !== expectedAmount) {
            console.error(`Amount mismatch: paid=${paidAmount}, expected=${expectedAmount}`);
            return NextResponse.json(
                { success: false, message: '결제 금액이 일치하지 않습니다.' },
                { status: 400 }
            );
        }

        // ═══════════════════════════════════════
        // 4단계: 결제 기록 저장 (TODO — Supabase 연동)
        //
        // const { error } = await supabase
        //     .from('payments')
        //     .insert({
        //         payment_id: paymentId,
        //         tx_id: txId,
        //         record_id: recordId,
        //         email,
        //         product_id: productId,
        //         amount: paidAmount,
        //         status: 'PAID',
        //         paid_at: new Date().toISOString(),
        //     });
        // ═══════════════════════════════════════

        console.log(`✅ Payment verified: ${paymentId} (${productId}) — ₩${paidAmount} → ${email}`);

        return NextResponse.json({
            success: true,
            message: '결제가 정상적으로 확인되었습니다.',
            data: {
                paymentId,
                productId,
                amount: paidAmount,
            },
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { success: false, message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
