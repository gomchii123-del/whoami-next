'use client';

import { useState } from 'react';
import { DopamineNarratives } from '@/lib/dopamine-narratives';

/**
 * DopamineSnacks — 바이럴용 매운맛 미니 카드
 * 
 * LP 번호 기반 개인화. 아코디언 방식으로 터치하면 펼쳐짐.
 * 디자인: 메인 분석 대비 시각적으로 튀고 호기심 자극.
 */

interface Props {
    lifePath: number;
}

interface SnackCard {
    id: string;
    emoji: string;
    title: string;
    gradient: string;
    textColor: string;
    borderColor: string;
}

const CARDS: SnackCard[] = [
    { id: 'attraction', emoji: '🔥', title: '파멸적 끌림', gradient: 'linear-gradient(135deg, #2D1117 0%, #58111A 50%, #1A0A0A 100%)', textColor: '#FF6B6B', borderColor: 'rgba(255,107,107,0.25)' },
    { id: 'empire', emoji: '👑', title: '제국의 건설자', gradient: 'linear-gradient(135deg, #1A1708 0%, #3D2E0A 50%, #1A1400 100%)', textColor: '#F2C94C', borderColor: 'rgba(242,201,76,0.25)' },
    { id: 'survival', emoji: '⚡', title: '생존 본능', gradient: 'linear-gradient(135deg, #0A1A0D 0%, #0D3117 50%, #081A0B 100%)', textColor: '#69F0AE', borderColor: 'rgba(105,240,174,0.25)' },
    { id: 'factBomb', emoji: '💀', title: '팩트 폭행 요약', gradient: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #111111 100%)', textColor: '#E0E0E0', borderColor: 'rgba(255,255,255,0.15)' },
];

export default function DopamineSnacks({ lifePath }: Props) {
    const [openId, setOpenId] = useState<string | null>(null);
    const baseNum = lifePath === 11 ? 2 : lifePath === 22 ? 4 : lifePath === 33 ? 6 : lifePath;
    const data = DopamineNarratives[baseNum] || DopamineNarratives[1];

    const toggle = (id: string) => {
        setOpenId(prev => prev === id ? null : id);
    };

    const getContent = (id: string): string | string[] => {
        switch (id) {
            case 'attraction': return data.attraction;
            case 'empire': return data.empire;
            case 'survival': return data.survival;
            case 'factBomb': return data.factBomb;
            default: return '';
        }
    };

    return (
        <div className="space-y-3">
            {/* 섹션 헤더 */}
            <div className="flex items-center gap-3 px-1 mb-4">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }} />
                <div className="flex items-center gap-2">
                    <span className="text-base">🍿</span>
                    <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: '#FF6B6B' }}>
                        DOPAMINE SNACK
                    </span>
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }} />
            </div>
            <p className="text-center text-[13px] mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                당신의 LP {lifePath}이 말해주는 적나라한 진실
            </p>

            {/* 카드 목록 */}
            {CARDS.map(card => {
                const isOpen = openId === card.id;
                const content = getContent(card.id);

                return (
                    <div key={card.id} style={{ borderRadius: 16, overflow: 'hidden' }}>
                        {/* 카드 헤더 — 터치 영역 */}
                        <button
                            onClick={() => toggle(card.id)}
                            className="w-full flex items-center gap-3 px-4 py-4 text-left transition-all active:scale-[0.98]"
                            style={{
                                background: card.gradient,
                                border: `1px solid ${card.borderColor}`,
                                borderRadius: isOpen ? '16px 16px 0 0' : 16,
                            }}
                        >
                            <span className="text-2xl shrink-0">{card.emoji}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-black" style={{ color: card.textColor }}>
                                    {card.title}
                                </p>
                            </div>
                            <svg
                                className="w-4 h-4 shrink-0 transition-transform duration-300"
                                style={{ color: card.textColor, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* 펼쳐진 내용 */}
                        {isOpen && (
                            <div
                                className="px-5 py-5"
                                style={{
                                    background: card.gradient,
                                    borderLeft: `1px solid ${card.borderColor}`,
                                    borderRight: `1px solid ${card.borderColor}`,
                                    borderBottom: `1px solid ${card.borderColor}`,
                                    borderRadius: '0 0 16px 16px',
                                    animation: 'snackSlideDown 0.3s ease-out',
                                }}
                            >
                                {Array.isArray(content) ? (
                                    <ul className="space-y-3">
                                        {content.map((line, i) => (
                                            <li key={i} className="flex gap-2 text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                                <span className="shrink-0 mt-0.5" style={{ color: card.textColor }}>▸</span>
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[14px] leading-[1.8]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                        {content}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            <style>{`
                @keyframes snackSlideDown {
                    from { opacity: 0; max-height: 0; }
                    to { opacity: 1; max-height: 500px; }
                }
            `}</style>
        </div>
    );
}
