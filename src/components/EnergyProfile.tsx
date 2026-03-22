'use client';

import { useEffect, useState } from 'react';

interface EnergyProfileProps {
    lifePath: number;
}

// Energy profile values per Life Path number (0-100 scale)
const PROFILES: Record<number, { leadership: number; empathy: number; independence: number; creativity: number; stability: number; intuition: number }> = {
    1: { leadership: 92, empathy: 45, independence: 95, creativity: 70, stability: 60, intuition: 55 },
    2: { leadership: 35, empathy: 95, independence: 30, creativity: 60, stability: 65, intuition: 85 },
    3: { leadership: 55, empathy: 65, independence: 50, creativity: 98, stability: 30, intuition: 60 },
    4: { leadership: 60, empathy: 50, independence: 70, creativity: 35, stability: 98, intuition: 40 },
    5: { leadership: 65, empathy: 55, independence: 90, creativity: 85, stability: 20, intuition: 65 },
    6: { leadership: 50, empathy: 98, independence: 35, creativity: 65, stability: 75, intuition: 70 },
    7: { leadership: 40, empathy: 40, independence: 88, creativity: 75, stability: 55, intuition: 98 },
    8: { leadership: 95, empathy: 45, independence: 85, creativity: 55, stability: 80, intuition: 50 },
    9: { leadership: 70, empathy: 90, independence: 60, creativity: 80, stability: 45, intuition: 88 },
    100: { leadership: 55, empathy: 70, independence: 80, creativity: 88, stability: 35, intuition: 99 }, // 11
    101: { leadership: 90, empathy: 55, independence: 85, creativity: 92, stability: 70, intuition: 85 }, // 22
    102: { leadership: 75, empathy: 99, independence: 50, creativity: 80, stability: 55, intuition: 95 }, // 33
};

const LABELS: { key: string; label: string; color: string }[] = [
    { key: 'leadership', label: '리더십', color: '#E74C3C' },
    { key: 'empathy', label: '공감력', color: '#3498DB' },
    { key: 'independence', label: '독립성', color: '#2ECC71' },
    { key: 'creativity', label: '창의성', color: '#F39C12' },
    { key: 'stability', label: '안정감', color: '#9B59B6' },
    { key: 'intuition', label: '직관력', color: '#1ABC9C' },
];

// Highlight text for top stat
function getHighlightText(key: string, value: number): string {
    if (value >= 95) return `상위 3%에 해당하는 수준입니다`;
    if (value >= 88) return `상위 10% 안에 드는 강점입니다`;
    if (value >= 75) return `평균 이상의 뚜렷한 특성입니다`;
    return '';
}

export default function EnergyProfile({ lifePath }: EnergyProfileProps) {
    const [animated, setAnimated] = useState(false);
    const profile = PROFILES[lifePath] || PROFILES[1];

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Find top stat
    const sorted = [...LABELS].sort((a, b) => (profile as any)[b.key] - (profile as any)[a.key]);
    const topStat = sorted[0];
    const topValue = (profile as any)[topStat.key];

    return (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-lg border border-gray-100 space-y-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'rgba(136,160,150,0.12)' }}>
                    📊
                </div>
                <div>
                    <h3 className="font-serif font-semibold text-gray-800 text-base">에너지 프로필</h3>
                    <p className="text-xs text-gray-400">당신의 내면 에너지 구성</p>
                </div>
            </div>

            <div className="space-y-3.5">
                {LABELS.map(({ key, label, color }) => {
                    const value = (profile as any)[key];
                    return (
                        <div key={key} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">{label}</span>
                                <span className="text-sm font-bold" style={{ color }}>{animated ? value : 0}%</span>
                            </div>
                            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${color}15` }}>
                                <div
                                    className="h-full rounded-full transition-all ease-out"
                                    style={{
                                        width: animated ? `${value}%` : '0%',
                                        backgroundColor: color,
                                        transitionDuration: '1.2s',
                                        transitionDelay: '0.1s',
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Highlight */}
            {topValue >= 75 && (
                <div className="rounded-xl p-3.5 flex items-start gap-3"
                    style={{ background: `${topStat.color}10`, border: `1px solid ${topStat.color}25` }}>
                    <span className="text-lg mt-0.5">💡</span>
                    <div>
                        <p className="text-sm font-bold" style={{ color: topStat.color }}>
                            {topStat.label}이 가장 두드러집니다
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {getHighlightText(topStat.key, topValue)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
