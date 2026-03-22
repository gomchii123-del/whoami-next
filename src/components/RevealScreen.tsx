'use client';

import { useState, useEffect } from 'react';

interface RevealScreenProps {
    lifePath: number;
    title: string;
    name: string;
    onContinue: () => void;
}

export default function RevealScreen({ lifePath, title, name, onContinue }: RevealScreenProps) {
    const [phase, setPhase] = useState<'number' | 'title' | 'ready'>('number');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('title'), 1200);
        const t2 = setTimeout(() => setPhase('ready'), 2400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    // Generate descriptive keywords per LP number
    const keywords: Record<number, string[]> = {
        1: ['리더십', '독립', '개척'],
        2: ['조화', '공감', '평화'],
        3: ['창의성', '표현', '영감'],
        4: ['안정', '성실', '체계'],
        5: ['자유', '모험', '변화'],
        6: ['치유', '사랑', '헌신'],
        7: ['탐구', '직관', '분석'],
        8: ['성취', '권력', '풍요'],
        9: ['지혜', '이상', '봉사'],
        100: ['영성', '직관', '각성'],    // Master 11
        101: ['건축', '비전', '실현'],    // Master 22
        102: ['교사', '치유', '헌신'],    // Master 33
    };

    const displayNumber = lifePath >= 100 ? lifePath - 89 : lifePath; // 100→11, 101→22, 102→33
    const kw = keywords[lifePath] || keywords[lifePath >= 100 ? lifePath : 1] || ['에너지', '잠재력', '흐름'];

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-12 relative">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-30 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, #88A096, transparent)' }} />
            </div>

            <div className="relative z-10 text-center space-y-6 max-w-md">
                {/* Decorative star */}
                <div className={`transition-all duration-1000 ${phase === 'number' ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}>
                    <span className="text-3xl" style={{ color: '#C4A882' }}>✦</span>
                </div>

                {/* Life Path Number — dramatic large reveal */}
                <div className={`transition-all duration-1000 ease-out ${phase === 'number' ? 'opacity-0 scale-50 translate-y-8' : 'opacity-100 scale-100 translate-y-0'}`}>
                    <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#88A096' }}>
                        Life Path Number
                    </p>
                    <div
                        className="text-7xl md:text-8xl font-serif font-bold leading-none"
                        style={{
                            color: '#2D2D2D',
                            textShadow: '0 4px 20px rgba(136,160,150,0.2)',
                        }}
                    >
                        {displayNumber}
                    </div>
                </div>

                {/* Title — fades in after number */}
                <div className={`transition-all duration-1000 delay-200 ${phase === 'title' || phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <h1 className="text-xl md:text-2xl font-serif leading-relaxed" style={{ color: '#2D2D2D' }}>
                        &ldquo;{title}&rdquo;
                    </h1>
                    <p className="text-sm mt-2" style={{ color: '#888' }}>
                        {name}님, 당신의 영혼이 말하고 있어요
                    </p>
                </div>

                {/* Keywords */}
                <div className={`flex items-center justify-center gap-2 flex-wrap transition-all duration-700 delay-500 ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {kw.map((k, i) => (
                        <span
                            key={i}
                            className="text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{
                                background: 'rgba(136,160,150,0.12)',
                                color: '#88A096',
                                border: '1px solid rgba(136,160,150,0.25)',
                            }}
                        >
                            #{k}
                        </span>
                    ))}
                </div>

                {/* CTA button */}
                <div className={`pt-6 transition-all duration-700 delay-700 ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button
                        onClick={onContinue}
                        className="px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: 'linear-gradient(135deg, #88A096, #6B8F7E)',
                            boxShadow: '0 8px 24px rgba(136,160,150,0.35)',
                        }}
                    >
                        내 운명 더 알아보기 →
                    </button>
                </div>
            </div>
        </div>
    );
}
