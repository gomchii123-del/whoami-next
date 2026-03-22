'use client';

import { useEffect, useState } from 'react';
import { SNACK_TESTS, SnackTest } from '@/lib/snack-tests';

/**
 * /snack/ — 프리미엄 인스턴트 테스트 피드
 *
 * 카테고리별 그룹 + 풀 카드 디자인 + 클릭 시 전용 페이지로 이동
 * 모달 X → 전용 페이지에서 결과 표시
 */

// 카테고리 정의
const CATEGORIES = [
    {
        id: 'original',
        title: '나를 해체하는 9가지 질문',
        subtitle: 'THE ORIGINAL NINE',
        description: '당신 안에 잠든 진짜 자아를 깨우는 오리지널 테스트',
        emoji: '🔮',
        color: '#B388FF',
        tests: ['night-persona', 'past-life', 'factbomb', 'attraction', 'empire', 'survival', 'mask', 'love-pattern', 'weakness'],
    },
    {
        id: 'nsfw',
        title: '19금 본능과 은밀한 사생활',
        subtitle: 'AFTER DARK',
        description: '해가 지면 깨어나는 본능의 세계',
        emoji: '🔞',
        color: '#FF80AB',
        tests: ['bed-persona', 'secret-obsession', 'drunk-mode', 'fatal-flirt', 'fatal-target'],
    },
    {
        id: 'relation',
        title: '인간관계 팩트폭행',
        subtitle: 'SOCIAL AUTOPSY',
        description: '관계 속에서 나도 모르게 반복하는 패턴의 해부',
        emoji: '💣',
        color: '#FFF176',
        tests: ['behind-talk', 'sucker-target', 'dark-button', 'revenge-scenario', 'energy-vampire'],
    },
    {
        id: 'money',
        title: '돈과 타락한 자본주의',
        subtitle: 'GREED INDEX',
        description: '당신의 재물 본능과 소비 심리의 적나라한 민낯',
        emoji: '💰',
        color: '#FFD740',
        tests: ['rich-madness', 'spending-pattern', 'scam-talent', 'benz-probability', 'broke-survival'],
    },
    {
        id: 'occult',
        title: '오컬트와 세계관 과몰입',
        subtitle: 'DARK LORE',
        description: '전생의 기억, 수호 악마, 지옥의 형벌 구역까지',
        emoji: '🪓',
        color: '#EF9A9A',
        tests: ['guillotine-sin', 'guardian-demon', 'hell-vip'],
    },
];

// 테스트 ID로 데이터 찾기
const testMap = new Map(SNACK_TESTS.map(t => [t.id, t]));

// 티저 문구 — 결과를 보고 싶게 만드는 한 줄
const TEASERS: Record<string, string> = {
    'night-persona': '낮의 당신과 밤의 당신은 완전히 다른 사람입니다',
    'past-life': '당신의 전생이 이번 생에 미치는 영향',
    'factbomb': '아무도 안 해주던 3줄 팩트가 기다리고 있습니다',
    'attraction': '끌리면 안 되는데 끌리는 유형의 정체',
    'empire': '당신이 부를 쌓는 유일한 공식',
    'survival': '위기 상황, 당신의 뇌가 선택하는 첫 번째 반응',
    'mask': '당신이 숨겨온 진짜 얼굴이 드러납니다',
    'love-pattern': '반복되는 연애 실패, 근본 원인을 해부합니다',
    'weakness': '누구도 말해주지 않았던 치명적 약점 1가지',
    'bed-persona': '침대 위에서만 나타나는 숨겨진 성향',
    'secret-obsession': '드러나면 끝장인 위험한 집착의 정체',
    'drunk-mode': '술기운에 봉인 해제되는 당신의 쓰레기력',
    'fatal-flirt': '당신을 완전히 무장해제시키는 플러팅 한 마디',
    'fatal-target': '한 번 얽히면 절대 못 빠져나오는 번호',
    'behind-talk': '단톡방에서 당신을 부르는 비밀 키워드',
    'sucker-target': '평생 호구 잡히기 딱 좋은 상대의 번호',
    'dark-button': '겉으로 웃지만 속으로 칼을 가는 순간',
    'revenge-scenario': '나를 건드리면 겪게 될 시나리오',
    'energy-vampire': '당장 인생에서 쳐내야 할 기질',
    'rich-madness': '억대 통장이 생기면 가장 먼저 저지를 짓',
    'spending-pattern': '지갑을 거덜내는 어이없는 소비 패턴',
    'scam-talent': '합법적으로 돈 긁어모으는 타고난 기질',
    'benz-probability': '이번 생에 벤츠 확률은 몇 퍼센트?',
    'broke-survival': '잔고 바닥 → 본능적 생존 전략 활성화',
    'guillotine-sin': '전생, 단두대 위에서 처형당한 이유',
    'guardian-demon': '당신을 은밀하게 돕는 악마의 이름',
    'hell-vip': '지옥에서 배정받을 VIP 형벌 구역',
};

export default function SnackFeed() {
    const [lp, setLp] = useState<number | null>(null);
    const [lpDisplay, setLpDisplay] = useState<number | null>(null);
    const [revealed, setRevealed] = useState<Set<string>>(new Set());

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('arche_analysis');
            if (stored) {
                const parsed = JSON.parse(stored);
                const { ArcheEngine } = require('@/lib/arche-engine');
                const result = ArcheEngine.performAnalysis(parsed.year, parsed.month, parsed.day);
                const num = result.lifePath;
                const baseNum = num === 11 ? 2 : num === 22 ? 4 : num === 33 ? 6 : num;
                setLp(baseNum);
                setLpDisplay(num);
            }
        } catch {}
    }, []);

    const handleTestClick = (test: SnackTest) => {
        if (!lp) {
            window.location.href = '/analyze/numerology/';
            return;
        }
        window.location.href = `/snack/${test.id}/`;
    };

    // Reveal teaser animation
    const revealTest = (id: string) => {
        setRevealed(prev => new Set(prev).add(id));
    };

    return (
        <div className="min-h-screen" style={{ background: '#08080F' }}>
            {/* ── HERO HEADER ── */}
            <div className="relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(179,136,255,0.12), transparent 70%)' }} />
                    <div className="absolute bottom-[-30%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(255,128,171,0.08), transparent 70%)' }} />
                </div>

                <div className="relative z-10 px-5 pt-14 pb-10 max-w-2xl mx-auto">
                    {/* Nav */}
                    <a
                        href="/"
                        onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
                        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase mb-8"
                        style={{ color: 'rgba(255,255,255,0.25)' }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        WHOAMI
                    </a>

                    <div className="space-y-4 mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider" style={{ background: 'rgba(255,107,107,0.12)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)' }}>
                            🔥 {SNACK_TESTS.length}개 테스트
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.15] tracking-tight">
                            적나라한 진실,<br />
                            <span style={{ background: 'linear-gradient(135deg, #B388FF, #FF80AB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                마주할 준비 됐나요?
                            </span>
                        </h1>
                        <p className="text-[15px] leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            수비학 인생경로수 기반 · 읽는 순간 소름 돋는 정밀 분석
                        </p>
                    </div>

                    {!lp && (
                        <a
                            href="/analyze/numerology/"
                            onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/numerology/'; }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[15px] transition-all active:scale-[0.97]"
                            style={{ background: 'linear-gradient(135deg, #B388FF, #9C61E8)', color: '#fff', boxShadow: '0 4px 20px rgba(179,136,255,0.3)' }}
                        >
                            ✦ 먼저 수비학 분석하기
                        </a>
                    )}
                    {lp && (
                        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(179,136,255,0.08)', border: '1px solid rgba(179,136,255,0.2)' }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ background: 'linear-gradient(135deg, #B388FF, #9C61E8)', color: '#fff' }}>
                                ✦
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-white">분석 완료</p>
                                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>나만의 결과가 준비되어 있습니다</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── CATEGORY SECTIONS ── */}
            <div className="max-w-2xl mx-auto px-4 pb-20 space-y-14">
                {CATEGORIES.map((cat, catIdx) => (
                    <section key={cat.id} className="space-y-5">
                        {/* Category Header */}
                        <div className="px-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{cat.emoji}</span>
                                <div>
                                    <p className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: cat.color }}>{cat.subtitle}</p>
                                    <h2 className="text-xl font-black text-white tracking-tight">{cat.title}</h2>
                                </div>
                            </div>
                            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>{cat.description}</p>
                        </div>

                        {/* Test Cards — full-width stacked */}
                        <div className="space-y-3">
                            {cat.tests.map((testId, idx) => {
                                const test = testMap.get(testId);
                                if (!test) return null;
                                const isRevealed = revealed.has(testId);
                                const teaser = TEASERS[testId] || test.subtitle;
                                const testNumber = String(idx + 1).padStart(2, '0');

                                return (
                                    <div
                                        key={testId}
                                        className="group relative rounded-2xl overflow-hidden transition-all duration-300"
                                        style={{
                                            background: test.gradient,
                                            border: '1px solid rgba(255,255,255,0.06)',
                                        }}
                                    >
                                        {/* Number badge */}
                                        <div className="absolute top-4 right-4 text-[11px] font-black tracking-wider" style={{ color: 'rgba(255,255,255,0.12)' }}>
                                            {testNumber}
                                        </div>

                                        <div className="p-5 md:p-6">
                                            {/* Top row */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                                    {test.emoji}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-[17px] font-black text-white leading-tight mb-1">{test.title}</h3>
                                                    <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{test.subtitle}</p>
                                                </div>
                                            </div>

                                            {/* Teaser — builds anticipation */}
                                            <div className="mb-4">
                                                {!isRevealed ? (
                                                    <button
                                                        onClick={() => revealTest(testId)}
                                                        className="w-full text-left py-3 px-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${test.accentColor}20` }}>
                                                                    <svg className="w-3 h-3" style={{ color: test.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-6a10 10 0 11-20 0 10 10 0 0120 0z" /></svg>
                                                                </div>
                                                                <span className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>미리보기 열기</span>
                                                            </div>
                                                            <svg className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <div
                                                        className="py-3 px-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
                                                        style={{ background: `${test.accentColor}08`, borderLeft: `3px solid ${test.accentColor}40` }}
                                                    >
                                                        <p className="text-[14px] leading-[1.7] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                                            &ldquo;{teaser}&rdquo;
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CTA Button */}
                                            <button
                                                onClick={() => handleTestClick(test)}
                                                className="w-full py-3.5 rounded-xl font-bold text-[14px] tracking-wide transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                                                style={{
                                                    background: `linear-gradient(135deg, ${test.accentColor}20, ${test.accentColor}10)`,
                                                    color: test.accentColor,
                                                    border: `1px solid ${test.accentColor}30`,
                                                }}
                                            >
                                                {lp ? '내 결과 확인하기' : '분석 시작하기'}
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {/* ── BOTTOM CTA ── */}
                <div className="pt-8 text-center space-y-6">
                    <div className="h-px mx-auto max-w-[200px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                    <div>
                        <p className="text-[13px] font-bold mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>더 깊은 분석이 필요하다면</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <a href="/analyze/numerology/" onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/numerology/'; }}
                                className="px-4 py-2 rounded-lg text-[13px] font-bold transition-all hover:scale-[1.02]"
                                style={{ background: 'rgba(136,160,150,0.1)', color: 'rgba(136,160,150,0.7)', border: '1px solid rgba(136,160,150,0.2)' }}>
                                ✦ 수비학
                            </a>
                            <a href="/analyze/saju/" onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/saju/'; }}
                                className="px-4 py-2 rounded-lg text-[13px] font-bold transition-all hover:scale-[1.02]"
                                style={{ background: 'rgba(184,138,106,0.1)', color: 'rgba(184,138,106,0.7)', border: '1px solid rgba(184,138,106,0.2)' }}>
                                ☯ 사주
                            </a>
                            <a href="/analyze/tarot/" onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/tarot/'; }}
                                className="px-4 py-2 rounded-lg text-[13px] font-bold transition-all hover:scale-[1.02]"
                                style={{ background: 'rgba(123,110,160,0.1)', color: 'rgba(123,110,160,0.7)', border: '1px solid rgba(123,110,160,0.2)' }}>
                                🜔 타로
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <div className="text-center pt-16 pb-8">
                    <p className="text-[10px] tracking-[0.3em] font-bold uppercase" style={{ color: 'rgba(255,255,255,0.08)' }}>
                        © 2026 WHOAMI PROJECT
                    </p>
                </div>
            </div>
        </div>
    );
}
