'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft, Cookie } from 'lucide-react';
import { useT } from '@/i18n/LocaleContext';
import { SNACK_TESTS } from '@/lib/snack-tests';
import FortuneCookieModal from '@/components/FortuneCookie';
import AdBanner from '@/components/AdBanner';

/* ── 시드 해시 함수 (결정적 랜덤) ── */
function seedHash(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function seededRandom(seed: number, idx: number): number {
    const x = Math.sin(seed + idx * 9301 + 49297) * 233280;
    return x - Math.floor(x);
}

/* ── 오늘의 운세 텍스트 풀 (총운/연애/재물 각 20개) ── */
const GENERAL_TEXTS = [
    '새로운 시작의 에너지가 작용합니다. 망설이던 일에 용기를 내세요.',
    '안정과 조화의 기운이 감싸고 있습니다. 차분히 나아가세요.',
    '창의적 에너지가 절정입니다. 떠오르는 영감을 놓치지 마세요.',
    '대인관계에 긍정적 변화가 올 수 있습니다. 먼저 손을 내밀어 보세요.',
    '오늘은 내면과 대화하는 시간이 필요합니다. 고요 속에서 해답을 찾으세요.',
    '도전의 에너지가 충만합니다. 오늘의 용기가 내일의 자양분이 됩니다.',
    '과거에서 교훈을 찾되 미래를 향해 걸어가세요. 뒤돌아보는 건 방향 확인용.',
    '직감이 평소보다 강하게 작동합니다. 논리를 넘어선 감각을 믿어 보세요.',
    '작은 친절이 큰 행운으로 돌아오는 날입니다. 베푸는 것이 받는 것.',
    '변화를 두려워하지 마세요. 오늘의 작은 변화가 내일의 큰 전환점이 됩니다.',
    '지나친 욕심을 내려놓으면 의외의 선물이 찾아옵니다.',
    '오늘은 집중력이 높은 날입니다. 미루던 중요한 일을 처리하세요.',
    '예상치 못한 곳에서 좋은 소식이 올 수 있습니다. 열린 마음을 유지하세요.',
    '주변 사람들에게 감사를 표현하면 관계의 질이 확 달라집니다.',
    '실수를 두려워하지 않는 것이 오늘의 행운 열쇠입니다.',
    '흩어진 에너지를 모아 한 가지에 집중하면 놀라운 결과가 나옵니다.',
    '오늘은 쉬어가는 것도 전략입니다. 과로보다 회복이 중요한 날.',
    '당신의 진심이 통하는 날입니다. 솔직함이 최고의 전략.',
    '준비가 부족하다고 느껴져도 일단 시작하세요. 움직이면 길이 보입니다.',
    '오늘 하루는 미소가 무기입니다. 웃으면 운이 따라옵니다.',
];
const LOVE_TEXTS = [
    '솔직한 감정 표현이 행운의 열쇠입니다.',
    '조용히 마음을 전하면 좋은 반응을 기대할 수 있어요.',
    '과거 연애 패턴에서 벗어나면 새로운 인연이 보입니다.',
    '상대방의 작은 행동에 주목하세요. 숨겨진 마음이 보입니다.',
    '밀당보다 진솔함이 효과적인 날입니다.',
    '연인과의 갈등이 있다면 먼저 한 발 물러서 보세요.',
    '새로운 만남의 기운이 있습니다. 밖에 나가보세요.',
    '오늘은 자기 자신을 사랑하는 것이 연애운의 시작입니다.',
    '적극적으로 다가가면 좋은 결과가 있을 수 있어요.',
    '오래된 관계에 신선한 바람이 불어올 수 있습니다.',
];
const CAREER_TEXTS = [
    '디테일에 신경 쓰면 큰 성과로 이어집니다.',
    '동료와의 협업에서 새로운 아이디어가 탄생할 수 있습니다.',
    '무리한 투자보다는 안정적인 저축이 유리한 날입니다.',
    '예상치 못한 수입이 들어올 수 있는 기운이 있습니다.',
    '기회가 보이면 즉시 잡으세요. 망설이면 사라집니다.',
    '절약이 최고의 재테크인 날입니다.',
    '새로운 프로젝트를 시작하기 좋은 에너지입니다.',
    '인적 네트워크를 활용하면 뜻밖의 기회가 열립니다.',
    '꾸준한 노력이 곧 빛을 발하는 시점이 가까워지고 있습니다.',
    '오늘의 소비를 하루만 미루면 내일 더 좋은 선택을 할 수 있습니다.',
];

const LUCKY_COLORS = ['골드', '네이비', '보라', '핑크', '그린', '화이트', '레드', '오렌지', '스카이블루', '로즈', '민트', '라벤더', '코랄', '아이보리', '실버'];
const LUCKY_NUMBERS_POOL = ['1, 7', '2, 6', '3, 8', '4, 9', '5, 0', '1, 3', '2, 8', '6, 4', '7, 5', '3, 9', '8, 2', '0, 6', '5, 1', '9, 4', '7, 3'];

/* ── 동적 운세 생성 함수 ── */
function generateDailyFortune(dateKey: string, birthSeed: number) {
    const baseSeed = seedHash(dateKey) + birthSeed;
    const general = Math.floor(seededRandom(baseSeed, 1) * 21 + 55); // 55~75
    const love = Math.floor(seededRandom(baseSeed, 2) * 35 + 45);    // 45~79
    const career = Math.floor(seededRandom(baseSeed, 3) * 35 + 45);  // 45~79
    // 하나는 70+ 보장 (유저가 "운세 좋다" 느끼게)
    const boost = Math.floor(seededRandom(baseSeed, 4) * 3); // 0,1,2
    const scores = [general, love, career];
    scores[boost] = Math.max(scores[boost], Math.floor(seededRandom(baseSeed, 5) * 15 + 76)); // 76~90
    return {
        general: scores[0],
        love: scores[1],
        career: scores[2],
        generalText: GENERAL_TEXTS[Math.floor(seededRandom(baseSeed, 6) * GENERAL_TEXTS.length)],
        loveText: LOVE_TEXTS[Math.floor(seededRandom(baseSeed, 7) * LOVE_TEXTS.length)],
        careerText: CAREER_TEXTS[Math.floor(seededRandom(baseSeed, 8) * CAREER_TEXTS.length)],
        color: LUCKY_COLORS[Math.floor(seededRandom(baseSeed, 9) * LUCKY_COLORS.length)],
        number: LUCKY_NUMBERS_POOL[Math.floor(seededRandom(baseSeed, 10) * LUCKY_NUMBERS_POOL.length)],
    };
}

/* ── 점수별 색상 ── */
function scoreColor(score: number, type: 'love' | 'career' | 'general'): string {
    const palette = { love: ['#FF6B6B', '#E17055', '#FF9F43'], career: ['#6C5CE7', '#5B86E5', '#48C6EF'], general: ['#C9A96E', '#E17055', '#6C5CE7'] };
    if (score >= 80) return palette[type][0];
    if (score >= 65) return palette[type][1];
    return palette[type][2];
}

/* ── 오늘의 추천 테스트 풀 ── */
const FEATURED_IDS = ['factbomb', 'attraction', 'bed-persona', 'night-persona', 'empire', 'guillotine-sin', 'weakness', 'drunk-mode'];

const PROMPT_SERVICES = [
    { id: 'ultimate', href: '/analyze/ultimate/', icon: '👑', title: '얼티밋 프롬프트', desc: '5대 시스템(사주/자미/점성/휴디/수비학) 마스터 통합 분석', badge: 'PRO' },
    { id: 'omniverse', href: '/analyze/omniverse/', icon: '♾️', title: '통합 프롬프트 제작', desc: '사주·자미·점성술 종합 AI 프롬프트 분석' },
    { id: 'cosmic-design', href: '/analyze/cosmic-design/', icon: '🧬', title: '코스믹 디자인', desc: '휴먼디자인 × 수비학 프롬프트 제작', badge: 'NEW' },
];

const CLASSIC_SERVICES = [
    { id: 'saju', href: '/analyze/saju/', icon: '☯️', title: '사주팔자', desc: '생년월일시로 읽는 타고난 운명' },
    { id: 'tarot', href: '/analyze/tarot/', icon: '🃏', title: '타로 카드', desc: '지금 이 순간의 메시지 리딩' },
    { id: 'ziwei', href: '/analyze/ziwei/', icon: '🌌', title: '자미두수', desc: '동양 점성학 기반 명반 분석' },
    { id: 'astrology', href: '/analyze/astrology/', icon: '♈', title: '서양 점성술', desc: '출생 차트 기반 천체 해석' },
];

export default function Home() {
    const t = useT();
    const [dark, setDark] = useState(false);
    const [cookieOpen, setCookieOpen] = useState(false);
    const [fortuneTab, setFortuneTab] = useState<'general' | 'love' | 'career'>('general');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [birthData, setBirthData] = useState<{year: number, month: number, day: number} | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const raw = sessionStorage.getItem('arche_analysis');
        if (raw) {
            try { setBirthData(JSON.parse(raw)); } catch {}
        }
        
        const saved = localStorage.getItem('whoami-theme');
        if (saved === 'dark') setDark(true);
        else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true);
        const handler = (e: Event) => setDark((e as CustomEvent).detail === 'dark');
        window.addEventListener('whoami-theme-change', handler);
        return () => window.removeEventListener('whoami-theme-change', handler);
    }, []);

    /* ── 오늘 날짜 키 ── */
    const dateKey = useMemo(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, []);

    const dayIndex = useMemo(() => {
        const n = new Date();
        return (n.getFullYear() * 1000 + n.getMonth() * 31 + n.getDate());
    }, []);

    const todayStr = useMemo(() => {
        const d = new Date();
        const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
        return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekday})`;
    }, []);

    /* ── 🔮 오늘의 운세: 생년월일 + 오늘 날짜 해시 ── */
    const todayFortune = useMemo(() => {
        let birthSeed = 0;
        if (typeof window !== 'undefined') {
            try {
                const stored = sessionStorage.getItem('arche_analysis');
                if (stored) {
                    const { year, month, day } = JSON.parse(stored);
                    birthSeed = seedHash(`${year}-${month}-${day}`);
                }
            } catch {}
            // 생년월일 없으면 브라우저 UID 사용
            if (birthSeed === 0) {
                let uid = localStorage.getItem('whoami-uid');
                if (!uid) { uid = Math.random().toString(36).slice(2); localStorage.setItem('whoami-uid', uid); }
                birthSeed = seedHash(uid);
            }
        }
        return generateDailyFortune(dateKey, birthSeed);
    }, [dateKey]);

    const featuredTests = useMemo(() => {
        const idx1 = dayIndex % FEATURED_IDS.length;
        const idx2 = (dayIndex + 3) % FEATURED_IDS.length;
        return [FEATURED_IDS[idx1], FEATURED_IDS[idx2]]
            .map(id => SNACK_TESTS.find(t => t.id === id))
            .filter(Boolean) as typeof SNACK_TESTS;
    }, [dayIndex]);

    // 스낵 테스트 12개 랜덤 셔플 (매일 다르게)
    const snackTests = useMemo(() => {
        const featuredIds = new Set(featuredTests.map(t => t.id));
        const pool = SNACK_TESTS.filter(t => !featuredIds.has(t.id));
        const seeded = [...pool].sort((a, b) => {
            const ha = ((dayIndex * 2654435761 + a.id.charCodeAt(0)) >>> 0) % 1000;
            const hb = ((dayIndex * 2654435761 + b.id.charCodeAt(0)) >>> 0) % 1000;
            return ha - hb;
        });
        return seeded.slice(0, 12);
    }, [featuredTests, dayIndex]);

    const scrollCards = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    };

    const goTo = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); window.location.href = href; };

    /* ── 테마 (가시성 최적화) ── */
    const c = dark ? {
        bg: '#0F172A',
        heroBg: 'linear-gradient(180deg, #0F172A 0%, #172554 60%, #1e1b4b 100%)',
        surface: 'rgba(30,41,59,0.85)', surfaceBorder: 'rgba(255,255,255,0.1)',
        text: '#F8FAFC', textSec: 'rgba(248,250,252,0.85)', textTer: 'rgba(248,250,252,0.6)',
        accent: '#FBBF24', accentSoft: 'rgba(251,191,36,0.15)',
        ctaBg: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)', ctaText: '#0F172A',
        cookieBg: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))',
        cookieBorder: 'rgba(251,191,36,0.3)', cookieText: '#FBBF24',
        progBg: 'rgba(255,255,255,0.1)',
    } : {
        bg: '#FCFCFC',
        heroBg: 'linear-gradient(180deg, #FCFCFC 0%, #F5F5F4 60%, #EAE8E5 100%)',
        surface: '#FFFFFF', surfaceBorder: 'rgba(0,0,0,0.06)',
        text: '#111827', textSec: '#374151', textTer: '#6B7280',
        accent: '#059669', accentSoft: 'rgba(5,150,105,0.1)',
        ctaBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)', ctaText: '#FFFFFF',
        cookieBg: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.06))',
        cookieBorder: 'rgba(245,158,11,0.25)', cookieText: '#D97706',
        progBg: 'rgba(0,0,0,0.08)',
    };

    if (!mounted) {
        return (
            <main className="min-h-screen flex items-center justify-center" style={{ background: c.bg }}>
                <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </main>
        );
    }

    if (!birthData) {
        return (
            <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: c.heroBg, color: c.text }}>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                    <div className="absolute top-[5%] left-[5%] w-[30vw] h-[30vw] rounded-full blur-[100px]" style={{ background: c.accentSoft }} />
                    <div className="absolute bottom-[5%] right-[5%] w-[40vw] h-[40vw] rounded-full blur-[120px]" style={{ background: dark ? 'rgba(251,191,36,0.1)' : 'rgba(5,150,105,0.1)' }} />
                </div>
                
                <div className="relative z-10 w-full max-w-xl px-5 py-12 flex flex-col items-center">
                    <div className="mb-10 text-center">
                        <span className="font-bold tracking-[0.3em] text-xs uppercase mb-3 block" style={{ color: c.accent }}>WHOAMI</span>
                        <h1 className="text-3xl md:text-4xl font-serif leading-tight">
                            당신의 <span style={{ color: c.accent }}>운명수</span>가<br />모든 것을 말해줍니다.
                        </h1>
                        <p className="mt-4 text-[14px] md:text-base max-w-sm mx-auto leading-relaxed" style={{ color: c.textSec }}>
                            수비학부터 그에 맞춘 스낵 테스트까지,<br className="hidden md:block" />가입 없이 단 한 번의 생년월일 입력으로 즐기세요.
                        </p>
                    </div>

                    <div className="w-full backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-xl" style={{ background: c.surface, border: `1px solid ${c.surfaceBorder}` }}>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: c.accentSoft }}>
                                🔮
                            </div>
                            <h2 className="text-xl font-bold" style={{ color: c.text }}>생년월일 입력</h2>
                            <p className="text-[12px] mt-1" style={{ color: c.textTer }}>이 데이터는 안전하게 브라우저에만 저장되며 전송되지 않습니다.</p>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const year = parseInt((form.elements.namedItem('year') as HTMLInputElement).value);
                            const month = parseInt((form.elements.namedItem('month') as HTMLInputElement).value);
                            const day = parseInt((form.elements.namedItem('day') as HTMLInputElement).value);
                            
                            if (year && month && day) {
                                sessionStorage.setItem('arche_analysis', JSON.stringify({ year, month, day }));
                                setBirthData({ year, month, day });
                            }
                        }} className="w-full space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold mb-2 pl-1" style={{ color: c.textSec }}>태어난 연도</label>
                                    <input name="year" type="number" placeholder="YYYY" required min="1900" max="2026"
                                        className="w-full px-5 py-4 rounded-xl text-center text-lg font-medium outline-none transition-all"
                                        style={{ background: dark ? 'rgba(0,0,0,0.2)' : '#F7F6F3', border: `1px solid ${c.surfaceBorder}`, color: c.text }} 
                                        onFocus={(e) => e.target.style.borderColor = c.accent}
                                        onBlur={(e) => e.target.style.borderColor = c.surfaceBorder} />
                                </div>
                                <div className="flex gap-4 flex-1">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold mb-2 pl-1 text-center" style={{ color: c.textSec }}>월</label>
                                        <input name="month" type="number" placeholder="MM" required min="1" max="12"
                                            className="w-full px-3 py-4 rounded-xl text-center text-lg font-medium outline-none transition-all"
                                            style={{ background: dark ? 'rgba(0,0,0,0.2)' : '#F7F6F3', border: `1px solid ${c.surfaceBorder}`, color: c.text }} 
                                            onFocus={(e) => e.target.style.borderColor = c.accent}
                                            onBlur={(e) => e.target.style.borderColor = c.surfaceBorder} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold mb-2 pl-1 text-center" style={{ color: c.textSec }}>일</label>
                                        <input name="day" type="number" placeholder="DD" required min="1" max="31"
                                            className="w-full px-3 py-4 rounded-xl text-center text-lg font-medium outline-none transition-all"
                                            style={{ background: dark ? 'rgba(0,0,0,0.2)' : '#F7F6F3', border: `1px solid ${c.surfaceBorder}`, color: c.text }} 
                                            onFocus={(e) => e.target.style.borderColor = c.accent}
                                            onBlur={(e) => e.target.style.borderColor = c.surfaceBorder} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button type="submit"
                                    className="block w-full py-5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                    style={{ background: c.ctaBg, color: c.ctaText }}
                                >
                                    내 운명 열어보기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen" style={{ background: c.heroBg, color: c.text }}>
            <div className="max-w-lg mx-auto px-5 pt-12 pb-12 space-y-8">

                {/* ═══════════════════════════════════════════════
                    1. 최상단: 오늘의 운세 & 포춘쿠키
                   ═══════════════════════════════════════════════ */}
                <section>
                    <button
                        onClick={() => setCookieOpen(true)}
                        className="w-full text-left rounded-[20px] overflow-hidden transition-all duration-300 active:scale-[0.99]"
                        style={{ background: c.cookieBg, border: `1px solid ${c.cookieBorder}` }}
                    >
                        <div className="px-5 py-5 flex items-center gap-4">
                            <span className="text-[40px] shrink-0" style={{ filter: cookieOpen ? 'none' : 'grayscale(0.5)' }}>🥠</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-bold" style={{ color: c.cookieText }}>오늘의 포춘쿠키</p>
                                <p className="text-xs mt-1" style={{ color: c.textTer }}>
                                    탭해서 오늘의 별을 뽑아보세요
                                </p>
                            </div>
                            <Cookie className="w-5 h-5 shrink-0 transition-transform duration-300" style={{ color: c.cookieText }} />
                        </div>
                    </button>
                    <FortuneCookieModal isOpen={cookieOpen} onClose={() => setCookieOpen(false)} />
                </section>

                {/* 오늘의 운세 카드 */}
                <section className="rounded-[20px] overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.surfaceBorder}`, boxShadow: dark ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 20px rgba(0,0,0,0.04)' }}>
                    <div className="px-5 pt-5 pb-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🔮</span>
                                <div>
                                    <p className="text-[15px] font-bold" style={{ color: c.text }}>오늘의 운세</p>
                                    <p className="text-[11px] mt-0.5" style={{ color: c.textTer }}>{todayStr}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase" style={{ background: c.accentSoft, color: c.accent }}>무료</span>
                        </div>
                        <div className="flex gap-1.5">
                            {[
                                { key: 'general' as const, label: '총운', icon: '🌟' },
                                { key: 'love' as const, label: '연애', icon: '💕' },
                                { key: 'career' as const, label: '재물', icon: '💰' },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={(e) => { e.stopPropagation(); setFortuneTab(tab.key); }}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                                    style={{
                                        background: fortuneTab === tab.key ? c.accentSoft : 'transparent',
                                        color: fortuneTab === tab.key ? c.accent : c.textSec,
                                        border: `1px solid ${fortuneTab === tab.key ? c.accent + '33' : c.surfaceBorder}`,
                                    }}
                                >
                                    <span className="text-sm">{tab.icon}</span>{tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="px-5 pb-5">
                        {fortuneTab === 'general' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex-1">
                                        <p className="text-xs font-medium mb-1.5" style={{ color: c.textTer }}>총운</p>
                                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: c.progBg }}>
                                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${todayFortune.general}%`, background: scoreColor(todayFortune.general, 'general') }} />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-black" style={{ color: scoreColor(todayFortune.general, 'general') }}>{todayFortune.general}</span>
                                </div>
                                <p className="text-[14px] md:text-[15px] leading-relaxed" style={{ color: c.textSec }}>{todayFortune.generalText}</p>
                                <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px solid ${c.surfaceBorder}` }}>
                                    <span className="text-sm">🍀</span>
                                    <span className="text-xs font-medium" style={{ color: c.accent }}>행운 컬러: {todayFortune.color} · 행운 숫자: {todayFortune.number}</span>
                                </div>
                            </div>
                        )}
                        {fortuneTab === 'love' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs font-medium mb-1.5" style={{ color: c.textTer }}>연애운</p>
                                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: c.progBg }}>
                                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${todayFortune.love}%`, background: scoreColor(todayFortune.love, 'love') }} />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-black" style={{ color: scoreColor(todayFortune.love, 'love') }}>{todayFortune.love}</span>
                                </div>
                                <p className="text-[14px] md:text-[15px] leading-relaxed" style={{ color: c.textSec }}>{todayFortune.loveText}</p>
                            </div>
                        )}
                        {fortuneTab === 'career' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs font-medium mb-1.5" style={{ color: c.textTer }}>재물·직업운</p>
                                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: c.progBg }}>
                                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${todayFortune.career}%`, background: scoreColor(todayFortune.career, 'career') }} />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-black" style={{ color: scoreColor(todayFortune.career, 'career') }}>{todayFortune.career}</span>
                                </div>
                                <p className="text-[14px] md:text-[15px] leading-relaxed" style={{ color: c.textSec }}>{todayFortune.careerText}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    1.5. 메인 수비학 배너
                   ═══════════════════════════════════════════════ */}
                <section>
                    <a
                        href="/analyze/numerology/"
                        onClick={goTo('/analyze/numerology/')}
                        className="block w-full rounded-[24px] overflow-hidden transition-all duration-300 active:scale-[0.98] group relative"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)' }} />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(253,224,71,0.2)_0%,_transparent_50%)]" />
                        <div className="relative p-6 md:p-8 flex items-center justify-between">
                            <div className="space-y-2">
                                <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-black tracking-widest rounded-full uppercase border border-amber-400/30">
                                    NUMEROLOGY MASTER
                                </span>
                                <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight">
                                    WHOAMI 메인 수비학 풀이
                                </h3>
                                <p className="text-sm font-sans text-indigo-200">
                                    생년월일로 타고난 영혼의 진동수 해독
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                                <ChevronRight className="w-6 h-6 text-amber-300" />
                            </div>
                        </div>
                    </a>
                </section>

                {/* ═══════════════════════════════════════════════
                    2. 스낵 테스트 모아보기 (가로 스크롤)
                   ═══════════════════════════════════════════════ */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🧪</span>
                            <h2 className="text-[16px] font-bold" style={{ color: c.text }}>스낵 테스트</h2>
                            <span className="text-xs font-black tracking-wider px-2 py-0.5 rounded-md" style={{ background: dark ? 'rgba(255,107,107,0.12)' : 'rgba(255,107,107,0.08)', color: '#FF6B6B' }}>
                                {SNACK_TESTS.length}개
                            </span>
                        </div>
                        <a
                            href="/snack/"
                            onClick={goTo('/snack/')}
                            className="text-xs font-bold flex items-center gap-0.5"
                            style={{ color: c.accent, textDecoration: 'none' }}
                        >
                            전체보기
                            <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* 가로 스크롤 + 화살표 */}
                    <div className="relative">
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 z-10">
                            <button onClick={() => scrollCards('left')} className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)', border: `1px solid ${c.surfaceBorder}`, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                <ChevronLeft className="w-4 h-4" style={{ color: c.text }} />
                            </button>
                        </div>
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 z-10">
                            <button onClick={() => scrollCards('right')} className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)', border: `1px solid ${c.surfaceBorder}`, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                <ChevronRight className="w-4 h-4" style={{ color: c.text }} />
                            </button>
                        </div>
                        <div
                            ref={scrollRef}
                            className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                        >
                            {snackTests.map((test) => (
                                <a
                                    key={test.id}
                                    href={`/snack/${test.id}/`}
                                    onClick={goTo(`/snack/${test.id}/`)}
                                    className="shrink-0 snap-start w-[160px] rounded-[18px] overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                                    style={{
                                        background: test.darkGradient || test.gradient,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <div className="px-4 pt-4 pb-5">
                                        <span className="text-[36px] block mb-3 drop-shadow-lg">{test.emoji}</span>
                                        <h3 className="text-[14px] font-bold text-white leading-tight line-clamp-2">{test.title}</h3>
                                        <p className="text-[11px] mt-2 leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>{test.subtitle}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    3. 통합 프롬프트 영역
                   ═══════════════════════════════════════════════ */}
                <section className="space-y-3 pt-6">
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <span className="text-lg">🤖</span>
                        <h2 className="text-[16px] font-bold" style={{ color: c.text }}>통합 AI 프롬프트 엔진</h2>
                    </div>
                    <div className="rounded-[16px] overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.surfaceBorder}`, boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 1px 8px rgba(0,0,0,0.03)' }}>
                        {PROMPT_SERVICES.map((svc, i) => (
                            <a
                                key={svc.id}
                                href={svc.href}
                                onClick={goTo(svc.href)}
                                className="flex items-center gap-4 px-5 py-5 transition-colors"
                                style={{ textDecoration: 'none', borderBottom: i < PROMPT_SERVICES.length - 1 ? `1px solid ${c.surfaceBorder}` : 'none' }}
                            >
                                <span className="text-[26px] w-[32px] text-center">{svc.icon}</span>
                                <div className="flex-1 min-w-0 pl-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[15px] font-semibold" style={{ color: c.text }}>{svc.title}</p>
                                        {svc.badge && <span className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-md uppercase" style={{ background: c.accent, color: c.ctaText }}>{svc.badge}</span>}
                                    </div>
                                    <p className="text-[12px] mt-1 line-clamp-1" style={{ color: c.textTer }}>{svc.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: c.surfaceBorder }} />
                            </a>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════
                    4. 일반 단일 운세 서비스
                   ═══════════════════════════════════════════════ */}
                <section className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <span className="text-lg">📜</span>
                        <h2 className="text-[16px] font-bold" style={{ color: c.text }}>정통 단일 운세</h2>
                    </div>
                    <div className="rounded-[16px] overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.surfaceBorder}`, boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 1px 8px rgba(0,0,0,0.03)' }}>
                        {CLASSIC_SERVICES.map((svc, i) => (
                            <a
                                key={svc.id}
                                href={svc.href}
                                onClick={goTo(svc.href)}
                                className="flex items-center gap-4 px-5 py-5 transition-colors"
                                style={{ textDecoration: 'none', borderBottom: i < CLASSIC_SERVICES.length - 1 ? `1px solid ${c.surfaceBorder}` : 'none' }}
                            >
                                <span className="text-[26px] w-[32px] text-center">{svc.icon}</span>
                                <div className="flex-1 min-w-0 pl-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[15px] font-semibold" style={{ color: c.text }}>{svc.title}</p>
                                        {(svc as any).badge && <span className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-md uppercase" style={{ background: c.accent, color: c.ctaText }}>{(svc as any).badge}</span>}
                                    </div>
                                    <p className="text-xs mt-1" style={{ color: c.textTer }}>{svc.desc}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 shrink-0 opacity-50" style={{ color: c.textTer }} />
                            </a>
                        ))}
                    </div>
                </section>

                {/* ── SEO / Educational ── */}
                <details className="group">
                    <summary className="flex items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-1">
                        <div className="flex-1 h-px" style={{ background: c.surfaceBorder }} />
                        <span className="text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: c.textTer }}>
                            {t('home.sectionTitle')}
                            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                        <div className="flex-1 h-px" style={{ background: c.surfaceBorder }} />
                    </summary>
                    <article className="mt-5 space-y-5 text-[14px] md:text-[15px] leading-relaxed px-1" style={{ color: c.textSec }}>
                        <section className="space-y-2">
                            <h2 className="text-[16px] font-serif font-bold" style={{ color: c.text }}>{t('home.eduTitle')}</h2>
                            <p>{t('home.eduDesc')}</p>
                        </section>
                        <section className="space-y-2">
                            <h3 className="text-[15px] font-serif font-bold" style={{ color: c.text }}>{t('home.eduBgTitle')}</h3>
                            <p>{t('home.eduBgDesc')}</p>
                        </section>
                        <section className="space-y-2">
                            <h3 className="text-[15px] font-serif font-bold" style={{ color: c.text }}>{t('home.eduHowTitle')}</h3>
                            <p>{t('home.eduHowDesc')}</p>
                        </section>
                        <section className="space-y-2">
                            <h3 className="text-[15px] font-serif font-bold" style={{ color: c.text }}>{t('home.eduTechTitle')}</h3>
                            <p>{t('home.eduTechDesc')}</p>
                        </section>
                    </article>
                </details>

                {/* ── 운세 칼럼 링크 (SEO) ── */}
                <section className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <span className="text-lg">📖</span>
                        <h2 className="text-[16px] font-bold" style={{ color: c.text }}>운세 칼럼</h2>
                    </div>
                    <div className="rounded-[16px] overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.surfaceBorder}` }}>
                        {[
                            { href: '/columns/life-path-number-meaning/', label: '수비학 생명경로수 계산법과 숨겨진 의미', emoji: '🔢' },
                            { href: '/columns/saju-basics-2026/', label: '사주팔자 입문: 2026년 병오년을 읽는 법', emoji: '☯' },
                            { href: '/columns/psychology-personality-test-science/', label: '성격 테스트의 심리학: MBTI부터 수비학까지', emoji: '🧠' },
                            { href: '/columns/tarot-beginners-guide/', label: '타로 카드 입문 가이드', emoji: '🃏' },
                        ].map((item, i, arr) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={goTo(item.href)}
                                className="flex items-center gap-4 px-5 py-4 transition-colors"
                                style={{ textDecoration: 'none', borderBottom: i < arr.length - 1 ? `1px solid ${c.surfaceBorder}` : 'none' }}
                            >
                                <span className="text-[22px] w-[28px] text-center">{item.emoji}</span>
                                <p className="text-[14px] font-semibold flex-1 min-w-0 truncate" style={{ color: c.textSec }}>{item.label}</p>
                                <ChevronRight className="w-5 h-5 shrink-0 opacity-50" style={{ color: c.textTer }} />
                            </a>
                        ))}
                    </div>
                    <a
                        href="/columns/"
                        onClick={goTo('/columns/')}
                        className="block text-center text-[13px] font-bold pt-2 pb-1 transition-all hover:scale-[1.02]"
                        style={{ color: c.accent, textDecoration: 'none' }}
                    >
                        전체 칼럼 보기 →
                    </a>
                </section>
            </div>

            {/* Footer */}
            <footer className="py-10 text-center space-y-3 px-5 border-t border-black/5 dark:border-white/5 mt-4">
                <p className="text-[11px] tracking-[0.1em] font-medium uppercase" style={{ color: c.textTer }}>{t('common.footer')}</p>
                <div className="flex items-center justify-center gap-4">
                    <a href="/privacy/" className="text-[11px] font-medium" style={{ color: c.textTer, textDecoration: 'none' }}>{t('common.privacy')}</a>
                    <span className="text-[11px]" style={{ color: c.textTer }}>·</span>
                    <a href="/columns/" onClick={goTo('/columns/')} className="text-[11px] font-medium" style={{ color: c.textTer, textDecoration: 'none' }}>운세 칼럼</a>
                </div>
            </footer>

            <style jsx global>{`
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                [style*="scrollbar-width"]::-webkit-scrollbar { display: none; }
            `}</style>
        </main>
    );
}
