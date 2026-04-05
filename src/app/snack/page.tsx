'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { SNACK_TESTS, SnackTest } from '@/lib/snack-tests';
import { ArcheEngine } from '@/lib/arche-engine';

/**
 * /snack/ — 도파민 스낵 테스트 게시판
 * 자동 슬라이딩 배너 + 검색 + 12개 카테고리 + 2-column 그리드
 */

interface Category {
    id: string;
    label: string;
    emoji: string;
    tests: string[];
}

const CATEGORIES: Category[] = [
    { id: 'all', label: '전체', emoji: '🔥', tests: [] },
    // ── NEW 마라맛 (Vol.5 40종 모아보기) ──
    {
        id: 'new', label: 'NEW🌶️', emoji: '🆕',
        tests: ['secondhand-jerk', 'talking-stage-expiry', 'tmi-bomber', 'ghost-breakup', 'ex-callback',
            'insta-flex', 'emotion-slave', 'nuisance-radar', 'midnight-food-addict', 'phone-peek-urge',
            'comment-rage', 'mz-vs-latte', 'evil-ceo', 'empathy-zero', 'reality-show-role',
            'sober-psycho', 'confession-timer', 'gaslighter-within', 'crush-curse', 'taxi-fare-rage',
            'roommate-hell', 'moral-gray-zone', 'phone-unlock-urge', 'heaven-rejection', 'dm-slide-success',
            'selfie-narcissism', 'human-blackhole', 'avoidant-escape', 'face-gossip', 'dad-joke-freq',
            'traitor-nation', 'affection-void', 'schadenfreude', 'love-power-rank', 'shadow-boxing',
            'pro-whiner', 'reply-speed-interest', 'digital-footprint', 'office-politics', 'pufferfish-rage'],
    },
    // ── 성격·자아 ──
    {
        id: 'self', label: '성격·자아', emoji: '🎭',
        tests: ['night-persona', 'mask', 'factbomb', 'weakness', 'mara-factbomb', 'mirror-factbomb',
            'battery-personality', 'mbti-reversal', 'mental-age', 'first-impression-color',
            'emoji-summary', 'bright-psycho', 'self-esteem-drill', 'narcissist-mirror',
            'ice-cold-t', 'cool-syndrome', 'stubborn-ranking', 'braindead', 'weird-perfectionist',
            'angel-mask-trash', 'fake-smile', 'brain-no-filter', 'attention-seeker', 'kkondae',
            'empathy-zero', 'moral-gray-zone', 'pufferfish-rage', 'selfie-narcissism', 'tmi-bomber'],
    },
    // ── 연애·썸 ──
    {
        id: 'love', label: '연애·썸', emoji: '💕',
        tests: ['attraction', 'love-pattern', 'fatal-attraction', 'crush-success', 'love-cell',
            'love-expiry', 'first-spark', 'destiny-place', 'flirting-tier', 'fishpond-rank',
            'office-romance', 'breakup-karma', 'transfer-love', 'ex-overreact',
            'ex-wedding', 'possessive-player', 'dark-romance', 'trash-magnet-love',
            'day-night-switch', 'blue-tick-obsess',
            'talking-stage-expiry', 'ghost-breakup', 'ex-callback', 'confession-timer',
            'crush-curse', 'reality-show-role', 'love-power-rank', 'affection-void',
            'dm-slide-success', 'reply-speed-interest', 'phone-unlock-urge'],
    },
    // ── 19금·은밀 ──
    {
        id: 'nsfw', label: '19금', emoji: '🔞',
        tests: ['bed-persona', 'secret-obsession', 'fatal-flirt', 'fatal-target',
            'inner-devil', 'skinship-tension', 'brain-runaway', 'mara-sexual-tension',
            'midnight-hobby', 'hidden-cringe', 'vampire-charm', 'search-history',
            'phone-peek-urge', 'gaslighter-within'],
    },
    // ── 술·파티 ──
    {
        id: 'drink', label: '술·파티', emoji: '🍻',
        tests: ['drunk-mode', 'alcoholic-persona', 'drunk-flirt', 'drunk-disgrace',
            'drunk-skinship', 'midnight-text-defense', 'fox-wolf',
            'sober-psycho', 'midnight-food-addict'],
    },
    // ── 인간관계 ──
    {
        id: 'relation', label: '인간관계', emoji: '💣',
        tests: ['behind-talk', 'sucker-target', 'dark-button', 'revenge-scenario',
            'energy-vampire', 'red-flag', 'gossip-speed', 'social-radar',
            'group-chat-type', 'weirdo-magnet', 'trash-magnet', 'scam-victim',
            'pro-buzzkill', 'selective-rage', 'rage-bottom', 'snake-or-fool',
            'flirt-defense', 'hidden-villain',
            'nuisance-radar', 'emotion-slave', 'human-blackhole', 'avoidant-escape',
            'face-gossip', 'pro-whiner', 'schadenfreude', 'shadow-boxing',
            'roommate-hell', 'comment-rage'],
    },
    // ── 돈·직장 ──
    {
        id: 'money', label: '돈·직장', emoji: '💰',
        tests: ['empire', 'rich-madness', 'spending-pattern', 'scam-talent',
            'benz-probability', 'broke-survival', 'empty-wallet', 'gold-spoon',
            'money-therapy', 'rage-spending', 'credit-card-madness', 'greed-meter',
            'lotto-reaction', 'life-waste',
            'secondhand-jerk', 'taxi-fare-rage', 'evil-ceo'],
    },
    // ── 직장생활 ──
    {
        id: 'office', label: '직장생활', emoji: '🏢',
        tests: ['office-rank', 'office-villain', 'resign-threshold', 'teamwork-parasite',
            'burnout-warning', 'keyboard-warrior', 'bs-artist', 'bed-hermit',
            'shortform-addict', 'office-politics', 'mz-vs-latte', 'dad-joke-freq'],
    },
    // ── 전생·오컬트 ──
    {
        id: 'occult', label: '전생·오컬트', emoji: '👻',
        tests: ['past-life', 'past-sin', 'past-animal', 'past-enemy', 'past-job',
            'guillotine-sin', 'guardian-demon', 'hell-vip', 'fallen-angel',
            'next-life-country', 'traitor-nation', 'heaven-rejection'],
    },
    // ── 서바이벌 ──
    {
        id: 'survival', label: '서바이벌', emoji: '⚡',
        tests: ['survival', 'zombie-survival', 'island-role', 'anger-gauge',
            'stress-cure'],
    },
    // ── SNS·디지털 ──
    {
        id: 'sns', label: 'SNS·디지털', emoji: '📱',
        tests: ['sns-stalker', 'ex-sns-stalking', 'shortform-addict',
            'insta-flex', 'digital-footprint'],
    },
];

const testMap = new Map(SNACK_TESTS.map(t => [t.id, t]));

export default function SnackFeed() {
    const [lp, setLp] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [carouselIdx, setCarouselIdx] = useState(0);

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('arche_analysis');
            if (stored) {
                const parsed = JSON.parse(stored);
                const result = ArcheEngine.performAnalysis(String(parsed.year), String(parsed.month), String(parsed.day));
                const num = result.lifePath;
                setLp(num === 11 ? 2 : num === 22 ? 4 : num === 33 ? 6 : num);
            }
        } catch {}
    }, []);

    // 오늘의 마라맛 추천 (Date seed 기반 5개)
    const dailyPicks = useMemo(() => {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const shuffled = [...SNACK_TESTS].sort((a, b) => {
            const ha = ((seed * 31 + a.id.charCodeAt(0) * 17) % 9973);
            const hb = ((seed * 31 + b.id.charCodeAt(0) * 17) % 9973);
            return ha - hb;
        });
        return shuffled.slice(0, 5);
    }, []);

    const BANNER_COPIES = [
        '🔥 오늘 내 멘탈을 털어버릴 팩폭은?',
        '💀 이 테스트 결과 보면 잠 못 잔다',
        '🌶️ 매운맛 주의! 자존심 보호 불가',
        '⚡ 3초 만에 드러나는 당신의 민낯',
        '🎯 오늘의 추천 심리 테스트',
    ];

    // 자동 슬라이드
    useEffect(() => {
        const timer = setInterval(() => {
            setCarouselIdx(prev => (prev + 1) % dailyPicks.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [dailyPicks.length]);

    const handleTestClick = useCallback((test: SnackTest) => {
        window.location.href = `/snack/${test.id}/`;
    }, []);

    // 카테고리별 + 검색 필터링
    const filteredTests = useMemo(() => {
        let tests: SnackTest[];

        if (activeCategory === 'all') {
            tests = SNACK_TESTS;
        } else {
            const cat = CATEGORIES.find(c => c.id === activeCategory);
            if (!cat || cat.tests.length === 0) {
                tests = SNACK_TESTS;
            } else {
                tests = cat.tests.map(id => testMap.get(id)).filter(Boolean) as SnackTest[];
            }
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            tests = tests.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.subtitle.toLowerCase().includes(q) ||
                t.id.toLowerCase().includes(q)
            );
        }

        return tests;
    }, [activeCategory, searchQuery]);

    // 각 카테고리 테스트 수
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: SNACK_TESTS.length };
        CATEGORIES.forEach(cat => {
            if (cat.id !== 'all') {
                counts[cat.id] = cat.tests.filter(id => testMap.has(id)).length;
            }
        });
        return counts;
    }, []);

    return (
        <div className="min-h-screen" style={{ background: '#08080F' }}>

            {/* ── 헤더 ── */}
            <div className="px-5 pt-12 pb-4 max-w-2xl mx-auto">
                <a
                    href="/"
                    onClick={e => { e.preventDefault(); window.location.href = '/'; }}
                    className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase mb-6"
                    style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    WHOAMI
                </a>

                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-black text-white tracking-tight">🧪 스낵 테스트</h1>
                    <span className="text-[10px] font-black tracking-wider px-2 py-1 rounded-md" style={{ background: 'rgba(255,107,107,0.12)', color: '#FF6B6B' }}>
                        {SNACK_TESTS.length}개
                    </span>
                </div>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    3초 만에 나를 해부하는 인스턴트 성격 테스트
                </p>
            </div>

            {/* ── 오늘의 마라맛 추천 배너 (자동 슬라이드) ── */}
            <div className="max-w-2xl mx-auto px-4 pb-4">
                <div className="relative overflow-hidden rounded-2xl" style={{ height: '160px' }}>
                    {dailyPicks.map((pick, idx) => (
                        <button
                            key={pick.id}
                            onClick={() => handleTestClick(pick)}
                            className="absolute inset-0 w-full h-full text-left transition-all duration-700 ease-in-out"
                            style={{
                                transform: `translateX(${(idx - carouselIdx) * 100}%)`,
                                opacity: idx === carouselIdx ? 1 : 0,
                                background: pick.darkGradient || pick.gradient,
                                border: 'none',
                            }}
                        >
                            {/* 오버레이 */}
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))' }} />
                            {/* 배경 이모지 */}
                            <div className="absolute -right-4 -bottom-4 text-[120px] opacity-[0.08] leading-none select-none">{pick.emoji}</div>
                            {/* 텍스트 */}
                            <div className="relative z-10 h-full flex flex-col justify-between p-5">
                                <div>
                                    <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: pick.accentColor }}>
                                        🌶️ 오늘의 마라맛 추천
                                    </p>
                                    <p className="text-[12px] font-bold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {BANNER_COPIES[idx % BANNER_COPIES.length]}
                                    </p>
                                </div>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl">{pick.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[18px] font-black text-white leading-tight truncate">{pick.title}</h3>
                                        <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{pick.subtitle}</p>
                                    </div>
                                    <div className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{ background: `${pick.accentColor}25`, color: pick.accentColor, border: `1px solid ${pick.accentColor}40` }}>
                                        도전 →
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                    {/* 인디케이터 */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {dailyPicks.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCarouselIdx(idx)}
                                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                                style={{ background: idx === carouselIdx ? '#fff' : 'rgba(255,255,255,0.25)', transform: idx === carouselIdx ? 'scale(1.5)' : 'scale(1)' }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 검색 바 ── */}
            <div className="max-w-2xl mx-auto px-5 pb-2">
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
                    style={{
                        background: searchFocused ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${searchFocused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                >
                    <svg className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="테스트 검색 (예: 전생, 술, 연애...)"
                        className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/30"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                            <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                {!lp && (
                    <a
                        href="/analyze/numerology/"
                        onClick={e => { e.preventDefault(); window.location.href = '/analyze/numerology/'; }}
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, #B388FF, #9C61E8)', color: '#fff', textDecoration: 'none' }}
                    >
                        ✦ 먼저 수비학 분석하기
                    </a>
                )}
            </div>

            {/* ── 카테고리 탭 (가로 스크롤) ── */}
            <div className="sticky top-0 z-20 px-4 py-3 max-w-2xl mx-auto" style={{ background: '#08080F' }}>
                <div
                    className="flex gap-2 overflow-x-auto pb-1"
                    style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat.id;
                        const count = categoryCounts[cat.id] || 0;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all whitespace-nowrap"
                                style={{
                                    background: isActive ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)',
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                                    border: `1px solid ${isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                                }}
                            >
                                <span className="text-sm">{cat.emoji}</span>
                                {cat.label}
                                {cat.id !== 'all' && (
                                    <span className="text-[10px] ml-0.5" style={{ color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)' }}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── 검색 결과 카운트 ── */}
            {searchQuery.trim() && (
                <div className="max-w-2xl mx-auto px-5 pb-3">
                    <p className="text-[12px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        &quot;{searchQuery}&quot; 검색 결과 <span style={{ color: '#FF6B6B' }}>{filteredTests.length}개</span>
                    </p>
                </div>
            )}

            {/* ── 게시판 그리드 (2열) ── */}
            <div className="max-w-2xl mx-auto px-4 pb-20">
                {filteredTests.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <span className="text-5xl block">🔍</span>
                        <p className="text-[15px] font-bold text-white/40">검색 결과가 없습니다</p>
                        <p className="text-[12px] text-white/25">다른 키워드로 검색하거나, 카테고리를 변경해 보세요</p>
                        <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="mt-2 px-4 py-2 rounded-lg text-[12px] font-bold" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                            전체 보기
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                        {filteredTests.map((test) => (
                            <button
                                key={test.id}
                                onClick={() => handleTestClick(test)}
                                className="text-left rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                                style={{
                                    background: test.gradient,
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                            >
                                <div className="pt-5 pb-2 flex justify-center">
                                    <span className="text-[38px] drop-shadow-lg">{test.emoji}</span>
                                </div>
                                <div className="px-3.5 pb-4 space-y-1">
                                    <h3 className="text-[13px] font-black text-white leading-tight line-clamp-2">
                                        {test.title}
                                    </h3>
                                    <p className="text-[10px] leading-snug line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                        {test.subtitle}
                                    </p>
                                </div>
                                <div className="px-3.5 pb-3.5">
                                    <div
                                        className="w-full py-2 rounded-lg text-center text-[10px] font-bold tracking-wide"
                                        style={{
                                            background: 'rgba(255,255,255,0.12)',
                                            color: 'rgba(255,255,255,0.75)',
                                        }}
                                    >
                                        {lp ? '결과 보기 →' : '분석하기 →'}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* ── 하단 링크 ── */}
                <div className="pt-10 text-center space-y-4">
                    <div className="h-px mx-auto max-w-[200px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                    <p className="text-[12px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>더 깊은 분석이 필요하다면</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { href: '/analyze/numerology/', label: '✦ 수비학', bg: 'rgba(136,160,150,0.1)', color: 'rgba(136,160,150,0.7)', border: 'rgba(136,160,150,0.2)' },
                            { href: '/analyze/saju/', label: '☯ 사주', bg: 'rgba(184,138,106,0.1)', color: 'rgba(184,138,106,0.7)', border: 'rgba(184,138,106,0.2)' },
                            { href: '/analyze/tarot/', label: '🃏 타로', bg: 'rgba(123,110,160,0.1)', color: 'rgba(123,110,160,0.7)', border: 'rgba(123,110,160,0.2)' },
                        ].map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={e => { e.preventDefault(); window.location.href = link.href; }}
                                className="px-4 py-2 rounded-lg text-[12px] font-bold transition-all hover:scale-[1.02]"
                                style={{ background: link.bg, color: link.color, border: `1px solid ${link.border}`, textDecoration: 'none' }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="text-center pt-16 pb-8">
                    <p className="text-[10px] tracking-[0.3em] font-bold uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
                        © 2026 WHOAMI PROJECT
                    </p>
                </div>
            </div>

            <style jsx global>{`
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    );
}
