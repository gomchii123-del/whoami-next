'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdBannerProps {
    /** 광고 슬롯 ID (data-ad-slot). 없으면 자동 광고. */
    slot?: string;
    /** 광고 클라이언트 ID (data-ad-client). 기본값: 환경변수 또는 하드코딩 fallback */
    client?: string;
    /** 광고 포맷 */
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    /** 반응형 여부 */
    responsive?: boolean;
    /** 추가 className */
    className?: string;
    /** 광고 위치 라벨 (개발용, 프로덕션에서는 숨김) */
    label?: string;
}

const AD_CLIENT_ID =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3436746262635962';

/**
 * Google AdSense 배너 컴포넌트
 *
 * - Next.js SSR/SSG 안전: useEffect 내에서만 push 실행
 * - Hydration mismatch 방지: 초기 렌더는 빈 ins 태그만
 * - 중복 push 방지: pushed ref 사용
 * - 프로덕션이 아닐 때는 placeholder 표시
 */
export default function AdBanner({
    slot,
    client,
    format = 'auto',
    responsive = true,
    className = '',
    label,
}: AdBannerProps) {
    const adRef = useRef<HTMLModElement>(null);
    const pushed = useRef(false);

    const clientId = client || AD_CLIENT_ID;
    const isProduction =
        typeof window !== 'undefined' && window.location.hostname !== 'localhost';

    useEffect(() => {
        if (pushed.current) return;
        if (!isProduction) return; // localhost에서는 push 안 함

        const timer = setTimeout(() => {
            try {
                if (adRef.current && !pushed.current) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    pushed.current = true;
                }
            } catch (e) {
                console.warn('[AdBanner] adsbygoogle push error:', e);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [isProduction]);

    // 로컬 개발: placeholder 표시
    if (typeof window !== 'undefined' && !isProduction) {
        return (
            <div
                className={`ad-banner-placeholder ${className}`}
                style={{
                    width: '100%',
                    minHeight: 90,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    background: 'rgba(128,128,128,0.06)',
                    border: '1px dashed rgba(128,128,128,0.2)',
                    margin: '8px 0',
                }}
            >
                <span style={{ fontSize: 11, color: 'rgba(128,128,128,0.4)', fontWeight: 600 }}>
                    📣 광고 영역{label ? ` (${label})` : ''}
                </span>
            </div>
        );
    }

    return (
        <div
            className={`ad-banner ${className}`}
            style={{ textAlign: 'center', overflow: 'hidden', margin: '8px 0' }}
        >
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: 90 }}
                data-ad-client={clientId}
                {...(slot ? { 'data-ad-slot': slot } : {})}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}
