'use client';

import { useState } from 'react';
import { ChevronRight, Loader2, CheckCircle, Mail } from 'lucide-react';

interface PaymentButtonProps {
    recordId: string;
    userName: string;
    onUnlock: () => void; // Added for bypass mode
}

export default function PaymentButton({ recordId, userName, onUnlock }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleBypassPayment = async () => {
        if (!email) {
            alert('분석 리포트를 받으실 이메일을 입력해 주세요.');
            return;
        }

        setLoading(true);

        // Simulating a short delay then unlocking immediately (Bypass Mode)
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(true);
            onUnlock(); // Call the parent to reveal content
        }, 800);

        /* PORTONE SDK BYPASSED FOR REVIEW
        try {
            const payment = await PortOne.requestPayment({
                storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || 'store-uuid',
                channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || 'channel-key',
                paymentId: `payment-${crypto.randomUUID()}`,
                orderName: 'Arche Premium Report',
                totalAmount: 9900,
                currency: 'CURRENCY_KRW',
                payMethod: 'EASY_PAY',
                customer: {
                    fullName: userName,
                    email: email,
                },
            });

            if (payment?.paymentId) {
                const res = await fetch('/api/payment/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId: payment.paymentId, recordId, email })
                });

                const result = await res.json();
                if (result.success) {
                    setShowSuccess(true);
                } else {
                    throw new Error('Verification failed');
                }
            }
        } catch (err: any) {
            console.error(err);
            if (err.code !== 'FAILURE_TYPE_CANCELLED') {
                alert('결제 처리 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
        */
    };

    if (showSuccess) {
        return (
            <div className="bg-sage/10 p-8 rounded-2xl border border-sage/20 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-sage" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-2xl font-serif text-foreground">해독이 완료되었습니다!</h2>
                    <p className="text-foreground/70 text-readable leading-relaxed">
                        전체 리포트가 활성화되었습니다. <br />
                        <span className="text-sage font-bold">{email}</span>로도 분석본이 발송되었습니다.
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

    return (
        <div className="w-full space-y-6">
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="email"
                    required
                    placeholder="리포트를 받으실 이메일 주소"
                    className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-sage focus:ring-1 focus:ring-sage/50 transition-all text-foreground text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <button
                onClick={handleBypassPayment}
                disabled={loading}
                className="w-full bg-sage text-white font-bold py-5 rounded-xl flex items-center justify-center gap-2 hover:bg-sage/90 transition-all active:scale-95 shadow-lg shadow-sage/10 disabled:opacity-50 text-xl"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        <span>프리미엄 리포트 해독하기</span>
                        <ChevronRight className="w-6 h-6" />
                    </>
                )}
            </button>

            <div className="flex justify-center gap-6 opacity-40">
                <img src="https://image.rocketpunch.com/company/138133/logo_1596701831.png" alt="kakaopay" className="h-5 grayscale" />
                <span className="text-xs font-sans self-center uppercase tracking-tighter">Secure Payment Simulation</span>
            </div>
        </div>
    );
}
