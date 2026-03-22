'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

/**
 * Popup/Interstitial ad that shows once per session.
 * Appears after a configurable delay and can be dismissed.
 * Uses sessionStorage to prevent showing more than once per session.
 */
export default function PopupAd({ delayMs = 5000 }: { delayMs?: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const pushed = useRef(false);

    useEffect(() => {
        // Only show once per session
        const alreadyShown = sessionStorage.getItem('whoami_popup_ad_shown');
        if (alreadyShown) return;

        const timer = setTimeout(() => {
            setIsVisible(true);
            sessionStorage.setItem('whoami_popup_ad_shown', 'true');
        }, delayMs);

        return () => clearTimeout(timer);
    }, [delayMs]);

    useEffect(() => {
        if (!isVisible || pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch (e) {
            console.error('PopupAd error:', e);
        }
    }, [isVisible]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden"
                style={{ width: 'min(90vw, 400px)', maxHeight: '80vh' }}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="광고 닫기"
                >
                    <X className="w-4 h-4 text-gray-600" />
                </button>

                {/* Ad Header */}
                <div className="px-5 pt-5 pb-2">
                    <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">SPONSORED</p>
                </div>

                {/* Ad Slot */}
                <div className="px-4 pb-5" style={{ minHeight: 250 }}>
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block', width: '100%', minHeight: 250 }}
                        data-ad-client="ca-pub-3436746262635962"
                        data-ad-slot="SLOT_POPUP_INTERSTITIAL"
                        data-ad-format="rectangle"
                        data-full-width-responsive="true"
                    />
                </div>

                {/* Close CTA */}
                <div className="px-5 pb-5">
                    <button
                        onClick={handleClose}
                        className="w-full py-3 rounded-2xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        콘텐츠로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
