'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseProps {
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    responsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * AdSense 광고 컴포넌트
 *
 * slot이 있으면 해당 슬롯 표시, 없으면 자동 광고 형식으로 렌더링
 * 반드시 <ins class="adsbygoogle"> 태그가 있어야 Google이 광고를 채움
 */
export default function AdSense({
    slot,
    format = 'auto',
    responsive = true,
    className = '',
    style,
}: AdSenseProps) {
    const adRef = useRef<HTMLModElement>(null);
    const pushed = useRef(false);

    useEffect(() => {
        if (pushed.current) return;
        // adsbygoogle.js가 로드된 후 push 시도
        const timer = setTimeout(() => {
            try {
                if (adRef.current && !pushed.current) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    pushed.current = true;
                }
            } catch (e) {
                console.error('AdSense push error:', e);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`ad-container ${className}`} style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: 90, ...style }}
                data-ad-client="ca-pub-3436746262635962"
                {...(slot && !slot.startsWith('SLOT_') ? { 'data-ad-slot': slot } : {})}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}
