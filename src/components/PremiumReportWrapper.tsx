'use client';

import { ReactNode } from 'react';
import { Crown, Sparkles } from 'lucide-react';

/**
 * PremiumReportWrapper
 *
 * 결제 후 프리미엄 콘텐츠를 감싸는 고급 UI 래퍼.
 * 다크 네이비 + 골드 포인트 컬러 팔레트로 "돈 낸 가치"를 시각적으로 전달.
 */

interface PremiumReportWrapperProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    tier?: string;
}

export default function PremiumReportWrapper({
    children,
    title = '프리미엄 심층 분석',
    subtitle = '당신만을 위해 해독된 리포트',
    tier,
}: PremiumReportWrapperProps) {
    return (
        <div className="premium-report-root">
            {/* ── Premium Header ── */}
            <div className="premium-header">
                <div className="premium-header-bg" />
                <div className="premium-header-content">
                    <div className="premium-badge">
                        <Crown className="w-4 h-4" />
                        <span>{tier === 'master' ? 'MASTER' : tier === 'bundle' ? 'BUNDLE' : 'PREMIUM'}</span>
                    </div>
                    <h2 className="premium-title">{title}</h2>
                    <p className="premium-subtitle">{subtitle}</p>
                    <div className="premium-divider">
                        <Sparkles className="w-3 h-3" />
                    </div>
                </div>
            </div>

            {/* ── Premium Content ── */}
            <div className="premium-content">
                {children}
            </div>

            <style jsx>{`
                .premium-report-root {
                    position: relative;
                    border-radius: 1.5rem;
                    overflow: hidden;
                    background: linear-gradient(180deg, #0B1124 0%, #111D38 4%, #0F1729 96%, #090E1A 100%);
                    border: 1px solid rgba(212, 175, 55, 0.15);
                    box-shadow:
                        0 0 60px rgba(212, 175, 55, 0.04),
                        0 25px 50px rgba(0, 0, 0, 0.25),
                        inset 0 1px 0 rgba(212, 175, 55, 0.08);

                    /* CSS Custom Properties for child component theming */
                    --premium-heading: #E8E0D4;
                    --premium-text: rgba(232, 224, 212, 0.75);
                    --premium-card-bg: rgba(255, 255, 255, 0.03);
                    --premium-card-bg-hover: rgba(255, 255, 255, 0.05);
                    --premium-card-border: rgba(212, 175, 55, 0.06);
                    --premium-card-border-hover: rgba(212, 175, 55, 0.12);
                }

                .premium-header {
                    position: relative;
                    padding: 2.5rem 2rem 2rem;
                    text-align: center;
                }

                .premium-header-bg {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%),
                        radial-gradient(ellipse at 20% 80%, rgba(100, 130, 180, 0.05) 0%, transparent 50%);
                }

                .premium-header-content {
                    position: relative;
                    z-index: 1;
                }

                .premium-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.35rem 1rem;
                    border-radius: 999px;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
                    border: 1px solid rgba(212, 175, 55, 0.25);
                    color: #D4AF37;
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    margin-bottom: 1.25rem;
                }

                .premium-title {
                    font-family: var(--font-geist-sans), serif;
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #E8E0D4;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                    margin: 0;
                }

                .premium-subtitle {
                    font-size: 0.85rem;
                    color: rgba(232, 224, 212, 0.4);
                    margin-top: 0.5rem;
                    letter-spacing: 0.02em;
                }

                .premium-divider {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 1.5rem;
                    color: rgba(212, 175, 55, 0.3);
                }

                .premium-divider::before,
                .premium-divider::after {
                    content: '';
                    flex: 1;
                    max-width: 80px;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
                    margin: 0 0.75rem;
                }

                .premium-content {
                    padding: 1.5rem 1.5rem 2rem;
                }

                /* ── Premium Typography overrides ── */
                .premium-content :global(h3),
                .premium-content :global(h4) {
                    color: #E8E0D4 !important;
                    font-weight: 700;
                }

                .premium-content :global(p) {
                    color: rgba(232, 224, 212, 0.7) !important;
                    font-size: 1rem;
                    line-height: 1.85;
                    letter-spacing: 0.01em;
                }

                .premium-content :global(.analysis-card) {
                    background: rgba(255, 255, 255, 0.03) !important;
                    border: 1px solid rgba(212, 175, 55, 0.08) !important;
                    border-radius: 1rem;
                }

                .premium-content :global(.analysis-card:hover) {
                    border-color: rgba(212, 175, 55, 0.15) !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                }

                @media (min-width: 768px) {
                    .premium-header {
                        padding: 3rem 2.5rem 2rem;
                    }
                    .premium-content {
                        padding: 2rem 2.5rem 2.5rem;
                    }
                    .premium-title {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </div>
    );
}
