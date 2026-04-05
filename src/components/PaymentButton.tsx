'use client';

import { useState } from 'react';
import { ChevronRight, Loader2, CheckCircle, Mail, Shield, CreditCard, AlertTriangle } from 'lucide-react';
import PortOne from '@portone/browser-sdk/v2';

// ─────────────────────────────────────────────
// 상품 정의
// ─────────────────────────────────────────────

export interface PaymentProduct {
    id: string;
    name: string;
    price: number;        // KRW
    description?: string;
    [key: string]: any;   // Allow extra fields from products.ts Product type
}

export const PRODUCTS: Record<string, PaymentProduct> = {
    SAJU_PREMIUM: {
        id: 'saju_premium_report',
        name: '프리미엄 사주 분석 리포트',
        price: 9900,
        description: '대운·세운·월운 상세 분석 + AI 인생 네비게이션',
    },
    ZIWEI_PREMIUM: {
        id: 'ziwei_premium_report',
        name: '프리미엄 자미두수 분석 리포트',
        price: 9900,
        description: '12궁 심층 해독 + 유년 대한 세한 분석',
    },
    MASTER_REPORT: {
        id: 'master_report',
        name: '통합 마스터 리포트',
        price: 19900,
        description: '수비학+사주+타로+자미두수+점성술 5종 통합 분석',
    },
};

// ─────────────────────────────────────────────
// 결제 검증 API 호출 (백엔드)
// ─────────────────────────────────────────────

/**
 * 결제 완료 후 백엔드에 검증 요청
 *
 * 보안 원칙: 프론트에서 결제 성공 응답을 받아도
 * 반드시 서버 측에서 PortOne API로 결제 상태를 재확인해야 함
 */
async function verifyPayment(params: {
    paymentId: string;
    txId: string;
    recordId: string;
    email: string;
    productId: string;
    expectedAmount: number;
}): Promise<{ success: boolean; message?: string }> {
    try {
        const res = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { success: false, message: errorData.message || '서버 검증 실패' };
        }

        return await res.json();
    } catch (err) {
        console.error('Payment verification error:', err);
        return { success: false, message: '서버 연결 오류' };
    }
}

// ─────────────────────────────────────────────
// PaymentButton 컴포넌트
// ─────────────────────────────────────────────

interface PaymentButtonProps {
    recordId: string;
    userName: string;
    product?: PaymentProduct;
    onUnlock: () => void;
}

type PaymentState = 'idle' | 'processing' | 'verifying' | 'success' | 'error';

export default function PaymentButton({
    recordId,
    userName,
    product = PRODUCTS.SAJU_PREMIUM,
    onUnlock,
}: PaymentButtonProps) {
    const [state, setState] = useState<PaymentState>('idle');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ───── 결제 프로세스 ─────
    const handlePayment = async () => {
        // 이메일 검증
        if (!email || !email.includes('@')) {
            setErrorMessage('올바른 이메일 주소를 입력해 주세요.');
            return;
        }

        // PortOne 인증 정보 확인
        const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
        const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
        
        if (!storeId || storeId === 'your-store-id' || !channelKey || channelKey === 'your-channel-key') {
            setErrorMessage('결제 시스템 설정이 완료되지 않았습니다. 관리자에게 문의하세요.');
            return;
        }

        setErrorMessage('');
        setState('processing');

        try {
            // ═══════════════════════════════════════
            // 1단계: PortOne 결제창 호출
            // ═══════════════════════════════════════
            const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

            const response = await PortOne.requestPayment({
                storeId,
                channelKey,
                paymentId,
                orderName: product.name,
                totalAmount: product.price,
                currency: 'CURRENCY_KRW',
                payMethod: 'CARD',
                customer: {
                    fullName: userName || '사용자',
                    email,
                },
                customData: {
                    recordId,
                    productId: product.id,
                },
                redirectUrl: `${window.location.origin}/result/`,
            });

            // ═══════════════════════════════════════
            // 2단계: 결제 결과 확인
            // ═══════════════════════════════════════

            // 사용자가 결제창 닫은 경우
            if (!response) {
                setState('idle');
                return;
            }

            // 결제 실패 케이스
            if (response.code) {
                // 사용자가 취소한 경우 조용히 복귀
                if (response.code === 'FAILURE_TYPE_PG' || response.code === 'FAILURE_TYPE_CANCELLED') {
                    setState('idle');
                    return;
                }
                throw new Error(response.message || '결제 처리 중 오류가 발생했습니다.');
            }

            // ═══════════════════════════════════════
            // 3단계: 결제 성공 → 즉시 잠금 해제
            // (서버 검증은 Firebase Functions 배포 후 활성화)
            // ═══════════════════════════════════════
            setState('success');
            
            // sessionStorage에 결제 정보 저장
            sessionStorage.setItem('whoami_premium_unlocked', 'true');
            sessionStorage.setItem('whoami_payment_id', response.paymentId);
            sessionStorage.setItem('whoami_purchased_product', product.id);
            
            onUnlock();

        } catch (err: any) {
            console.error('Payment error:', err);
            setState('error');
            setErrorMessage(err.message || '결제 처리 중 오류가 발생했습니다.');
        }
    };

    // ───── 결제 성공 UI ─────
    if (state === 'success') {
        return (
            <div className="bg-sage/10 p-8 rounded-2xl border border-sage/20 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-sage" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-2xl font-serif text-foreground">결제가 완료되었습니다!</h2>
                    <p className="text-foreground/70 text-readable leading-relaxed">
                        전체 프리미엄 리포트가 활성화되었습니다. <br />
                        <span className="text-sage font-bold">{email}</span>으로도 분석본이 발송됩니다.
                    </p>
                </div>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="mt-6 text-sage font-bold text-sm hover:underline"
                >
                    위에서 리포트 확인하기
                </button>
            </div>
        );
    }

    // ───── 기본 / 에러 / 로딩 UI ─────
    return (
        <div className="w-full space-y-5">
            {/* 상품 정보 카드 */}
            <div className="bg-gradient-to-r from-sage/5 to-[#B88A6A]/5 rounded-2xl p-5 border border-sage/10">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-serif text-foreground font-bold">{product.name}</h3>
                        {product.description && (
                            <p className="text-sm text-foreground/60 mt-1">{product.description}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-sage">{product.price.toLocaleString()}</span>
                        <span className="text-sm text-foreground/50 ml-0.5">원</span>
                    </div>
                </div>
            </div>

            {/* 이메일 입력 */}
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="email"
                    required
                    placeholder="리포트를 받으실 이메일 주소"
                    className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-sage focus:ring-1 focus:ring-sage/50 transition-all text-foreground text-lg"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                    disabled={state === 'processing' || state === 'verifying'}
                />
            </div>

            {/* 에러 메시지 */}
            {errorMessage && (
                <div className="flex items-center gap-2 text-red-500 text-sm px-1">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* 결제 버튼 */}
            <button
                onClick={handlePayment}
                disabled={state === 'processing' || state === 'verifying'}
                className="w-full bg-sage text-white font-bold py-5 rounded-xl flex items-center justify-center gap-2 hover:bg-sage/90 transition-all active:scale-[0.98] shadow-lg shadow-sage/10 disabled:opacity-60 text-xl"
            >
                {state === 'processing' ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>결제창 로딩 중...</span>
                    </>
                ) : state === 'verifying' ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>결제 검증 중...</span>
                    </>
                ) : state === 'error' ? (
                    <>
                        <CreditCard className="w-6 h-6" />
                        <span>다시 결제하기</span>
                    </>
                ) : (
                    <>
                        <CreditCard className="w-6 h-6" />
                        <span>{product.price.toLocaleString()}원 결제하기</span>
                        <ChevronRight className="w-5 h-5" />
                    </>
                )}
            </button>

            {/* 보안 안내 */}
            <div className="flex items-center justify-center gap-4 text-xs text-foreground/40">
                <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>PortOne 보안 결제</span>
                </div>
                <span>·</span>
                <span>카카오페이 · 토스 · 카드</span>
            </div>
        </div>
    );
}
