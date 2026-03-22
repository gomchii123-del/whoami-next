'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, Calendar, User } from 'lucide-react';

import DailyFortune from '@/components/DailyFortune';
import { useT } from '@/i18n/LocaleContext';

/**
 * 수비학 페이지 — 2단계 플로우
 * 
 * STEP 1: 이름 + 생년월일 입력 (로그인처럼)
 * STEP 2: 대시보드 — 오늘의 운세, 포츈쿠키, 카테고리 선택, 다른 운세 보기
 */

interface UserData {
    name: string;
    year: string;
    month: string;
    day: string;
}

const REPORT_CATEGORIES = [
    { key: 'summary', icon: '✦', label: '종합 분석', desc: '삶의 본질과 운명의 청사진', color: '#88A096', bg: 'rgba(136,160,150,0.1)', border: 'rgba(136,160,150,0.35)' },
    { key: 'career', icon: '💼', label: '직업·재물운', desc: '경제적 적성과 성취 패턴', color: '#8896A0', bg: 'rgba(136,150,160,0.1)', border: 'rgba(136,150,160,0.35)' },
    { key: 'yearly', icon: '🌊', label: '올해의 운세', desc: '시기별 전략과 개인 연수', color: '#A0962A', bg: 'rgba(160,150,42,0.08)', border: 'rgba(160,150,42,0.3)' },
    { key: 'compat', icon: '❤️', label: '에너지 궁합', desc: '두 사람의 파동 간섭 분석', color: '#A08898', bg: 'rgba(160,136,152,0.1)', border: 'rgba(160,136,152,0.35)' },
];

const OTHER_SERVICES = [
    { id: 'saju', href: '/analyze/saju/', emoji: '☯', label: '사주', sub: 'FOUR PILLARS', color: '#B88A6A', bg: 'rgba(184,138,106,0.06)', border: 'rgba(184,138,106,0.2)' },
    { id: 'tarot', href: '/analyze/tarot/', emoji: '🜔', label: '타로', sub: 'TAROT', color: '#7B6EA0', bg: 'rgba(123,110,160,0.06)', border: 'rgba(123,110,160,0.2)' },
    { id: 'ziwei', href: '/analyze/ziwei/', emoji: '⭑', label: '자미두수', sub: 'ZI WEI', color: '#6A8FAA', bg: 'rgba(106,143,170,0.06)', border: 'rgba(106,143,170,0.2)' },
    { id: 'astrology', href: '/analyze/astrology/', emoji: '♈', label: '점성술', sub: 'ASTROLOGY', color: '#A07868', bg: 'rgba(160,120,104,0.06)', border: 'rgba(160,120,104,0.2)' },
];

export default function NumerologyPage() {
    const t = useT();
    const [phase, setPhase] = useState<'input' | 'dashboard'>('input');
    const [userData, setUserData] = useState<UserData>({ name: '', year: '', month: '', day: '' });
    const [loading, setLoading] = useState(false);

    // 세션에 저장된 생년월일이 있으면 자동으로 대시보드로
    useEffect(() => {
        const raw = sessionStorage.getItem('arche_analysis');
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed.year && parsed.month && parsed.day) {
                    setUserData({
                        name: parsed.name || '',
                        year: String(parsed.year),
                        month: String(parsed.month),
                        day: String(parsed.day),
                    });
                    setPhase('dashboard');
                }
            } catch { /* ignore */ }
        }
    }, []);

    // 생년월일 저장 → 바로 종합 분석 결과 페이지로 이동
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name: userData.name,
            birth_date: `${userData.year}-${userData.month.padStart(2, '0')}-${userData.day.padStart(2, '0')}`,
            year: userData.year,
            month: userData.month,
            day: userData.day,
        };
        sessionStorage.setItem('arche_analysis', JSON.stringify(data));
        sessionStorage.setItem('arche_report_type', 'summary');
        window.location.href = '/result/';
    };

    // 카테고리 클릭 → 바로 결과 페이지로
    const handleCategoryClick = (key: string) => {
        setLoading(true);
        sessionStorage.setItem('arche_report_type', key);

        if (key === 'compat') {
            // 궁합은 두 번째 사람 입력이 필요 → 별도 처리
            setLoading(false);
            setCompatMode(true);
            return;
        }

        window.location.href = '/result/';
    };

    // 궁합 모드
    const [compatMode, setCompatMode] = useState(false);
    const [person2, setPerson2] = useState({ name: '', year: '', month: '', day: '' });

    const handleCompatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const p2Data = {
            name: person2.name,
            birth_date: `${person2.year}-${person2.month.padStart(2, '0')}-${person2.day.padStart(2, '0')}`,
            year: person2.year, month: person2.month, day: person2.day,
        };
        sessionStorage.setItem('arche_analysis_p2', JSON.stringify(p2Data));
        sessionStorage.setItem('arche_report_type', 'compat');
        window.location.href = '/result/';
    };

    // 다른 사람으로 변경
    const handleLogout = () => {
        sessionStorage.removeItem('arche_analysis');
        setUserData({ name: '', year: '', month: '', day: '' });
        setPhase('input');
        setCompatMode(false);
    };

    const inputBase = [
        'w-full bg-gray-50 border-2 border-gray-100 rounded-xl',
        'py-[14px] outline-none transition-all duration-200',
        'text-[17px] font-sans text-foreground placeholder-gray-400',
        'focus:border-sage focus:bg-white focus:shadow-[0_0_0_3px_rgba(120,150,110,0.15)]',
    ].join(' ');

    return (
        <main className="relative min-h-screen bg-bg-warm flex flex-col items-center p-5 md:p-16 overflow-hidden">
            {/* Ambient Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[5%] left-[10%] w-[20vw] h-[20vw] bg-sage/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-peach/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-2xl space-y-8 py-8 md:py-14">
                {/* Back Nav */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sage transition-colors font-sans text-sm font-semibold group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {t('common.back')}
                </Link>

                {/* ═══════ STEP 1: 생년월일 입력 ═══════ */}
                {phase === 'input' && (
                    <>
                        <div className="text-center space-y-3">
                            <span className="inline-block text-sage font-bold tracking-widest text-xs uppercase bg-sage/10 px-4 py-2 rounded-full">
                                {t('services.numerology.title')} · {t('services.numerology.subtitle')}
                            </span>
                            <h1 className="text-2xl md:text-5xl font-serif text-foreground leading-[1.2]">
                                당신의 정보를 <br />
                                <span className="italic text-sage">입력해주세요</span>
                            </h1>
                            <p className="text-base text-gray-500 font-sans leading-relaxed max-w-md mx-auto">
                                생년월일만 입력하면 오늘의 운세, 포츈쿠키,<br />다양한 수비학 분석을 모두 이용할 수 있어요
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-sage/5 border border-gray-100 w-full">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[15px] font-bold text-gray-700 ml-1 block">{t('common.name')}</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <input type="text" required placeholder={t('common.namePlaceholder')} className={`${inputBase} pl-12 pr-4`}
                                            value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[15px] font-bold text-gray-700 ml-1 block">{t('common.birthDate')}</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="relative col-span-1">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            <input type="number" required placeholder={t('common.year')} min="1900" max="2099" className={`${inputBase} pl-9 pr-2 text-center`}
                                                value={userData.year} onChange={(e) => setUserData({ ...userData, year: e.target.value })} />
                                        </div>
                                        <input type="number" required placeholder="월" min="1" max="12" className={`${inputBase} px-4 text-center`}
                                            value={userData.month} onChange={(e) => setUserData({ ...userData, month: e.target.value })} />
                                        <input type="number" required placeholder="일" min="1" max="31" className={`${inputBase} px-4 text-center`}
                                            value={userData.day} onChange={(e) => setUserData({ ...userData, day: e.target.value })} />
                                    </div>
                                </div>

                                <button type="submit"
                                    className="w-full bg-sage text-white font-bold rounded-2xl shadow-lg shadow-sage/20 hover:bg-sage/90 transition-all flex items-center justify-center gap-3 text-[18px] active:scale-[0.98] min-h-[56px] px-6">
                                    <Sparkles className="w-5 h-5 shrink-0" />
                                    시작하기
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* ═══════ STEP 2: 대시보드 ═══════ */}
                {phase === 'dashboard' && !compatMode && (
                    <>
                        {/* User Badge */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center">
                                    <User className="w-5 h-5 text-sage" />
                                </div>
                                <div>
                                    <p className="font-serif font-bold text-foreground text-lg">{userData.name}</p>
                                    <p className="text-xs text-gray-400">{userData.year}. {userData.month}. {userData.day}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-sage transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-sage/5">
                                변경
                            </button>
                        </div>

                        {/* 오늘의 운세 */}
                        <DailyFortune
                            birthYear={parseInt(userData.year, 10)}
                            birthMonth={parseInt(userData.month, 10)}
                            birthDay={parseInt(userData.day, 10)}
                        />

                        {/* 수비학 카테고리 선택 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-sage/20" />
                                <span className="text-xs text-sage font-bold tracking-[0.15em] uppercase">수비학 분석</span>
                                <div className="flex-1 h-px bg-sage/20" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {REPORT_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => handleCategoryClick(cat.key)}
                                        disabled={loading}
                                        className="text-left rounded-2xl p-4 md:p-5 transition-all duration-200 active:scale-[0.97] hover:shadow-lg hover:scale-[1.01] disabled:opacity-50"
                                        style={{
                                            background: cat.bg,
                                            border: `2px solid ${cat.border}`,
                                        }}
                                    >
                                        <div className="text-2xl mb-2">{cat.icon}</div>
                                        <p className="font-serif font-semibold text-base leading-tight" style={{ color: cat.color }}>
                                            {cat.label}
                                        </p>
                                        <p className="text-xs mt-1 font-sans text-gray-400">
                                            {cat.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── 인스턴트 테스트 배너 ── */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200" />
                                <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">인스턴트 테스트</p>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <a
                                href="/snack/"
                                onClick={(e) => { e.preventDefault(); window.location.href = '/snack/'; }}
                                className="block rounded-2xl overflow-hidden transition-all active:scale-[0.98] group bg-white border border-gray-100 shadow-sm"
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="p-5 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 shadow-sm text-lg">
                                            🔮
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-serif font-semibold text-foreground">나의 적나라한 진실</p>
                                            <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">9종 심리 테스트</p>
                                        </div>
                                        <svg className="w-4 h-4 shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                    <p className="text-[13px] text-gray-500 leading-relaxed">
                                        밤의 페르소나 · 전생의 죄목 · 파멸적 끌림 · 가면 뒤의 나 외 5종
                                    </p>
                                </div>
                            </a>
                        </div>

                        {/* 다른 운세 보기 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200" />
                                <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">다른 운세 보기</p>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {OTHER_SERVICES.map((svc) => (
                                    <a key={svc.id} href={svc.href}
                                        onClick={(e) => { e.preventDefault(); window.location.href = svc.href; }}
                                        className="group flex items-center gap-3 rounded-2xl p-4 border transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                                        style={{ background: svc.bg, borderColor: svc.border, textDecoration: 'none' }}>
                                        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm text-lg" style={{ color: svc.color }}>
                                            {svc.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-serif font-semibold text-foreground truncate">{svc.label}</p>
                                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{svc.sub}</p>
                                        </div>
                                        <svg className="w-4 h-4 shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                    </>
                )}

                {/* ═══════ 궁합 모드: 두 번째 사람 입력 ═══════ */}
                {compatMode && (
                    <>
                        <div className="text-center space-y-3">
                            <span className="inline-block font-bold tracking-widest text-xs uppercase px-4 py-2 rounded-full" style={{ background: 'rgba(160,136,152,0.1)', color: '#A08898' }}>
                                에너지 궁합 분석
                            </span>
                            <h2 className="text-2xl md:text-4xl font-serif text-foreground leading-[1.2]">
                                상대방의 정보를 <br />
                                <span className="italic" style={{ color: '#A08898' }}>입력해주세요</span>
                            </h2>
                            <p className="text-sm text-gray-400">
                                {userData.name}님의 정보는 이미 저장되어 있어요
                            </p>
                        </div>

                        <form onSubmit={handleCompatSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-sage/5 border border-gray-100 w-full">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[15px] font-bold text-gray-700 ml-1 block">상대방 이름</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <input type="text" required placeholder="상대방 이름" className={`${inputBase} pl-12 pr-4`}
                                            value={person2.name} onChange={(e) => setPerson2({ ...person2, name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[15px] font-bold text-gray-700 ml-1 block">상대방 생년월일</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="relative col-span-1">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            <input type="number" required placeholder="년" min="1900" max="2099" className={`${inputBase} pl-9 pr-2 text-center`}
                                                value={person2.year} onChange={(e) => setPerson2({ ...person2, year: e.target.value })} />
                                        </div>
                                        <input type="number" required placeholder="월" min="1" max="12" className={`${inputBase} px-4 text-center`}
                                            value={person2.month} onChange={(e) => setPerson2({ ...person2, month: e.target.value })} />
                                        <input type="number" required placeholder="일" min="1" max="31" className={`${inputBase} px-4 text-center`}
                                            value={person2.day} onChange={(e) => setPerson2({ ...person2, day: e.target.value })} />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 text-[18px] active:scale-[0.98] min-h-[56px] px-6 text-white disabled:opacity-50"
                                    style={{ background: '#A08898', boxShadow: '0 6px 20px rgba(160,136,152,0.3)' }}>
                                    {loading ? <span className="animate-pulse">분석 중...</span> : <><Sparkles className="w-5 h-5 shrink-0" /> 궁합 분석 시작</>}
                                </button>
                                <button type="button" onClick={() => setCompatMode(false)}
                                    className="w-full text-sm text-gray-400 hover:text-sage transition-colors py-2">
                                    ← 대시보드로 돌아가기
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            <footer className="mt-8 py-8 text-center space-y-2">
                <p className="opacity-30 text-xs tracking-widest uppercase font-sans text-foreground">
                    © 2026 WHOAMI PROJECT · ARCHE ENGINE V3
                </p>
                <Link href="/privacy/" className="text-xs text-gray-400 hover:text-sage transition-colors font-sans">
                    개인정보 처리방침
                </Link>
            </footer>
        </main>
    );
}
