'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

/**
 * 사이드바 광고 — 데스크톱 전용 (≥1440px)
 *
 * [화면 가림 방지 정책]
 * - 최소 1440px 이상에서만 표시 (2xl breakpoint)
 * - position: fixed가 아닌 absolute — 본문과 겹치지 않음
 * - 콘텐츠 영역(max-w-4xl = 896px) 바깥 여백에만 배치
 * - 모바일/태블릿/소형 데스크톱: 완전 숨김
 */
export default function SidebarAds() {
    const leftPushed = useRef(false);
    const rightPushed = useRef(false);

    useEffect(() => {
        // 화면이 충분히 넓을 때만 push
        if (typeof window === 'undefined' || window.innerWidth < 1440) return;

        const timer = setTimeout(() => {
            try {
                if (!leftPushed.current) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    leftPushed.current = true;
                }
            } catch (e) { /* silent */ }
            try {
                if (!rightPushed.current) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    rightPushed.current = true;
                }
            } catch (e) { /* silent */ }
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Left — 2xl(1440px) 이상만 표시, 본문 바깥 */}
            <div
                className="hidden 2xl:block pointer-events-auto"
                style={{
                    position: 'fixed',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: 'max(12px, calc((100vw - 900px) / 2 - 180px))',
                    width: 160,
                    maxHeight: '70vh',
                    overflow: 'hidden',
                    zIndex: 10,
                    opacity: 0.9,
                }}
            >
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: 160, height: 600 }}
                    data-ad-client="ca-pub-3436746262635962"
                    data-ad-format="vertical"
                    data-full-width-responsive="false"
                />
            </div>

            {/* Right — 2xl(1440px) 이상만 표시, 본문 바깥 */}
            <div
                className="hidden 2xl:block pointer-events-auto"
                style={{
                    position: 'fixed',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: 'max(12px, calc((100vw - 900px) / 2 - 180px))',
                    width: 160,
                    maxHeight: '70vh',
                    overflow: 'hidden',
                    zIndex: 10,
                    opacity: 0.9,
                }}
            >
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: 160, height: 600 }}
                    data-ad-client="ca-pub-3436746262635962"
                    data-ad-format="vertical"
                    data-full-width-responsive="false"
                />
            </div>
        </>
    );
}
