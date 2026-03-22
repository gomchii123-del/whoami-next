'use client';

import { useMemo, useState } from 'react';
import FortuneCookieModal from '@/components/FortuneCookie';

/**
 * DailyFortune — 오늘의 수비학 운세 + 포츈쿠키 모달 트리거
 * 모바일 퍼스트 · 가독성 최적화
 */

interface DailyFortuneProps {
    birthYear?: number;
    birthMonth?: number;
    birthDay?: number;
}

interface DayEnergy {
    number: number;
    score: number;
    keyword: string;
    message: string;
    color: string;
}

const ENERGY_MAP: Record<number, Omit<DayEnergy, 'number' | 'score'>> = {
    1: { keyword: '시작', message: '새로운 도전이 빛을 발하는 날입니다. 첫 걸음을 내딛어보세요.', color: '#E25757' },
    2: { keyword: '조화', message: '관계와 협력이 열쇠가 되는 날입니다. 주변을 둘러보세요.', color: '#F2994A' },
    3: { keyword: '표현', message: '당신의 창의력이 빛나는 날입니다. 마음을 열어보세요.', color: '#D4A017' },
    4: { keyword: '안정', message: '기초를 다지기 좋은 날입니다. 꾸준함이 답입니다.', color: '#27AE60' },
    5: { keyword: '변화', message: '예상치 못한 기회가 찾아옵니다. 유연하게 대처하세요.', color: '#2D9CDB' },
    6: { keyword: '사랑', message: '가까운 사람에게 마음을 전하기 좋은 날입니다.', color: '#BB6BD9' },
    7: { keyword: '성찰', message: '내면을 들여다보는 시간이 필요한 날입니다.', color: '#6C5CE7' },
    8: { keyword: '성취', message: '목표를 향해 힘차게 나아갈 수 있는 날입니다.', color: '#00B894' },
    9: { keyword: '완성', message: '하나의 순환이 마무리되는 날입니다. 감사하세요.', color: '#88A096' },
};

function reduceToSingle(n: number): number {
    while (n > 9) n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
    return n || 1;
}

function getPersonalDayEnergy(bY: number, bM: number, bD: number, today: Date): DayEnergy {
    const ty = today.getFullYear(), tm = today.getMonth() + 1, td = today.getDate();
    const pY = reduceToSingle(bM + bD + reduceToSingle(ty));
    const pM = reduceToSingle(pY + tm);
    const pD = reduceToSingle(pM + td);
    const hash = ((bY * 13 + bM * 7 + bD * 3 + ty * 11 + tm * 5 + td * 17) % 41) + 55;
    return { number: pD, score: Math.min(99, Math.max(45, hash)), ...ENERGY_MAP[pD] };
}

export default function DailyFortune({ birthYear = 2000, birthMonth = 1, birthDay = 1 }: DailyFortuneProps) {
    const today = useMemo(() => new Date(), []);
    const energy = useMemo(() => getPersonalDayEnergy(birthYear, birthMonth, birthDay, today), [birthYear, birthMonth, birthDay, today]);
    const [cookieOpen, setCookieOpen] = useState(false);

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일 ${days[today.getDay()]}요일`;

    const radius = 40;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (energy.score / 100) * circ;

    return (
        <>
            <div
                className="w-full rounded-[1.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm"
            >
                {/* 컬러 바 */}
                <div className="h-1" style={{ background: energy.color }} />

                <div className="p-4 sm:p-5">
                    {/* 날짜 행 */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[13px] font-semibold text-gray-500">{dateStr}</span>
                        <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                            style={{ background: `${energy.color}15`, color: energy.color }}
                        >
                            오늘의 운세
                        </span>
                    </div>

                    {/* 메인: 게이지 + 텍스트 */}
                    <div className="flex items-center gap-4">
                        {/* 점수 게이지 */}
                        <div className="shrink-0 relative" style={{ width: 88, height: 88 }}>
                            <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
                                <circle cx="44" cy="44" r={radius} fill="none" className="stroke-gray-100" strokeWidth="5" />
                                <circle
                                    cx="44" cy="44" r={radius} fill="none"
                                    stroke={energy.color} strokeWidth="5" strokeLinecap="round"
                                    strokeDasharray={circ} strokeDashoffset={offset}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[26px] font-black leading-none" style={{ color: energy.color }}>
                                    {energy.score}
                                </span>
                                <span className="text-[10px] font-medium text-gray-400">점</span>
                            </div>
                        </div>

                        {/* 텍스트 */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-[18px] font-bold text-foreground font-serif">{energy.keyword}</span>
                                <span className="text-[12px] text-gray-400">에너지 {energy.number}</span>
                            </div>
                            <p className="text-[14px] text-gray-500 leading-[1.6]">{energy.message}</p>
                        </div>
                    </div>

                    {/* 포츈쿠키 트리거 버튼 */}
                    <button
                        onClick={() => setCookieOpen(true)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-[0.97] hover:opacity-80"
                        style={{
                            background: 'linear-gradient(135deg, rgba(26,26,46,0.06), rgba(108,92,231,0.08))',
                            color: '#6C5CE7',
                            border: '1px solid rgba(108,92,231,0.12)',
                        }}
                    >
                        🥠 포츈쿠키 뽑기
                    </button>
                </div>
            </div>

            {/* 포츈쿠키 모달 */}
            <FortuneCookieModal isOpen={cookieOpen} onClose={() => setCookieOpen(false)} />
        </>
    );
}
