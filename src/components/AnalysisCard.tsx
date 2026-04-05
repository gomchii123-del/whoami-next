import { ReactNode } from 'react';

interface AnalysisCardProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    isLocked?: boolean;
    sectionNumber?: number;
    accentColor?: string;
}

export default function AnalysisCard({
    title,
    subtitle,
    icon,
    children,
    isLocked = false,
    sectionNumber,
    accentColor,
}: AnalysisCardProps) {
    return (
        <div className={`analysis-card ${isLocked ? 'relative overflow-hidden' : ''}`}>
            <div className={`space-y-6 ${isLocked ? 'filter blur-xl opacity-20 pointer-events-none select-none' : ''}`}>
                {/* ── Section Header ── */}
                <div className="flex items-start gap-4 mb-6">
                    {/* Icon or Number badge */}
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                            background: accentColor
                                ? `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`
                                : 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.04))',
                            border: `1px solid ${accentColor ? `${accentColor}20` : 'rgba(212,175,55,0.12)'}`,
                        }}
                    >
                        {icon ? (
                            <span
                                className="text-lg"
                                style={{ color: accentColor || '#D4AF37' }}
                            >
                                {icon}
                            </span>
                        ) : sectionNumber ? (
                            <span
                                className="text-sm font-black"
                                style={{ color: accentColor || '#D4AF37' }}
                            >
                                {String(sectionNumber).padStart(2, '0')}
                            </span>
                        ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3
                            className="text-xl font-bold leading-tight tracking-tight"
                            style={{ color: 'var(--premium-heading, #E8E0D4)' }}
                        >
                            {title}
                        </h3>
                        {subtitle && (
                            <p
                                className="text-xs mt-1 tracking-wide font-medium uppercase"
                                style={{ color: accentColor || 'rgba(212,175,55,0.5)', letterSpacing: '0.1em' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Content ── */}
                <div
                    className="text-[15px] leading-[1.9] font-normal tracking-[0.01em]"
                    style={{ color: 'var(--premium-text, rgba(232,224,212,0.75))' }}
                >
                    {children}
                </div>

                {/* ── Bottom Separator ── */}
                <div
                    className="mt-6 h-px"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${accentColor || 'rgba(212,175,55,0.1)'}, transparent)`,
                    }}
                />
            </div>

            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm" />
            )}

            <style jsx>{`
                .analysis-card {
                    padding: 1.75rem 1.5rem;
                    border-radius: 1rem;
                    transition: all 0.3s ease;
                    background: var(--premium-card-bg, rgba(255,255,255,0.03));
                    border: 1px solid var(--premium-card-border, rgba(212,175,55,0.06));
                }

                .analysis-card:hover {
                    background: var(--premium-card-bg-hover, rgba(255,255,255,0.05));
                    border-color: var(--premium-card-border-hover, rgba(212,175,55,0.12));
                }

                @media (min-width: 768px) {
                    .analysis-card {
                        padding: 2rem 2rem;
                    }
                }
            `}</style>
        </div>
    );
}
