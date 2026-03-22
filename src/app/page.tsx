'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useT } from '@/i18n/LocaleContext';

/* ── 부가 서비스 ── */
const secondaryServices = [
    { id: 'saju', href: '/analyze/saju/', emoji: '☯', label: '사주', labelEn: 'Four Pillars' },
    { id: 'tarot', href: '/analyze/tarot/', emoji: '🃏', label: '타로', labelEn: 'Tarot' },
    { id: 'ziwei', href: '/analyze/ziwei/', emoji: '⭑', label: '자미두수', labelEn: 'Zi Wei' },
    { id: 'astrology', href: '/analyze/astrology/', emoji: '♈', label: '점성술', labelEn: 'Astrology' },
];

/* ── 스낵 배너 ── */
const snackBanner = {
    href: '/snack/',
    emoji: '🧪',
    title: '도파민 스낵 테스트',
    titleEn: 'Dopamine Snack Test',
    desc: '3초 만에 나를 해부하는 27가지 성격 테스트',
    descEn: '27 personality tests that dissect you in 3 seconds',
};

export default function Home() {
    const t = useT();
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('whoami-theme');
        if (saved === 'dark') setDark(true);
        else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true);

        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setDark(detail === 'dark');
        };
        window.addEventListener('whoami-theme-change', handler);
        return () => window.removeEventListener('whoami-theme-change', handler);
    }, []);

    const isKo = t('common.projectName') === 'WHOAMI' && t('services.saju.title') === '사주';

    /* ── 테마 변수 ── */
    const theme = dark ? {
        bg: '#0C1018',
        cardBg: 'rgba(255,255,255,0.04)',
        cardBorder: 'rgba(255,255,255,0.08)',
        text: '#F0F0F0',
        textSub: 'rgba(255,255,255,0.5)',
        textMuted: 'rgba(255,255,255,0.3)',
        accent: '#C9A96E',
        accentBg: 'rgba(201,169,110,0.12)',
        accentBorder: 'rgba(201,169,110,0.25)',
        heroBg: 'linear-gradient(180deg, #0C1018 0%, #141C2B 50%, #1A1530 100%)',
        ctaBg: 'linear-gradient(135deg, #C9A96E, #A8854A)',
        ctaText: '#0C1018',
        divider: 'rgba(255,255,255,0.06)',
        glowColor: 'rgba(201,169,110,0.15)',
        snackBg: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))',
        snackBorder: 'rgba(139,92,246,0.2)',
        snackAccent: '#A78BFA',
    } : {
        bg: '#FAFAF7',
        cardBg: '#FFFFFF',
        cardBorder: 'rgba(0,0,0,0.06)',
        text: '#1A1A1A',
        textSub: 'rgba(0,0,0,0.5)',
        textMuted: 'rgba(0,0,0,0.25)',
        accent: '#88A096',
        accentBg: 'rgba(136,160,150,0.08)',
        accentBorder: 'rgba(136,160,150,0.25)',
        heroBg: 'linear-gradient(180deg, #FAFAF7 0%, #F0EDE5 50%, #E8E3DB 100%)',
        ctaBg: 'linear-gradient(135deg, #88A096, #6B8A7A)',
        ctaText: '#FFFFFF',
        divider: 'rgba(0,0,0,0.06)',
        glowColor: 'rgba(136,160,150,0.12)',
        snackBg: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(236,72,153,0.04))',
        snackBorder: 'rgba(139,92,246,0.15)',
        snackAccent: '#7C3AED',
    };

    return (
        <main
            className="relative min-h-screen flex flex-col items-center overflow-hidden transition-colors duration-500"
            style={{ background: theme.heroBg, color: theme.text }}
        >
            {/* ── 글로우 배경 장식 ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] rounded-full blur-[120px] opacity-60" style={{ background: theme.glowColor }} />
                <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full blur-[100px] opacity-40" style={{ background: dark ? 'rgba(139,92,246,0.08)' : 'rgba(242,209,201,0.3)' }} />
            </div>



            <div className="z-10 w-full max-w-lg px-5 py-16 md:py-24 space-y-10">
                {/* ── 히어로 섹션 ── */}
                <div className="text-center space-y-6">
                    {/* 로고 심볼 */}
                    <div className="flex justify-center">
                        <div
                            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl animate-float"
                            style={{
                                background: dark
                                    ? 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))'
                                    : 'linear-gradient(135deg, rgba(136,160,150,0.15), rgba(136,160,150,0.05))',
                                border: `1px solid ${dark ? 'rgba(201,169,110,0.2)' : 'rgba(136,160,150,0.2)'}`,
                                boxShadow: `0 8px 40px ${theme.glowColor}`,
                            }}
                        >
                            ✦
                        </div>
                    </div>

                    {/* 타이틀 */}
                    <div>
                        <p
                            className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4"
                            style={{ color: theme.accent }}
                        >
                            WHOAMI · NUMEROLOGY
                        </p>
                        <h1
                            className="text-3xl md:text-4xl font-serif leading-[1.2] mb-3"
                            style={{ color: theme.text }}
                        >
                            {isKo ? (
                                <>
                                    생년월일 하나로<br />
                                    <span style={{ color: theme.accent }}>당신의 본질</span>을 읽다
                                </>
                            ) : (
                                <>
                                    Decode Your Essence<br />
                                    <span style={{ color: theme.accent }}>Through Numbers</span>
                                </>
                            )}
                        </h1>
                        <p
                            className="text-[15px] leading-[1.7] max-w-sm mx-auto"
                            style={{ color: theme.textSub }}
                        >
                            {isKo
                                ? '탄생의 순간에 새겨진 고유한 숫자 코드를 해독하고,\n당신의 강점과 인생 흐름을 발견하세요.'
                                : 'Decode the unique numerical code from your birth,\nand discover your strengths and life flow.'
                            }
                        </p>
                    </div>

                    {/* 메인 CTA */}
                    <a
                        href="/analyze/numerology/"
                        onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/numerology/'; }}
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[16px] tracking-wide transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
                        style={{
                            background: theme.ctaBg,
                            color: theme.ctaText,
                            boxShadow: `0 4px 20px ${theme.glowColor}`,
                            textDecoration: 'none',
                        }}
                    >
                        <Sparkles className="w-5 h-5" />
                        {isKo ? '무료 분석 시작하기' : 'Start Free Analysis'}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* 서브 뱃지 */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {[
                            { icon: '🔮', text: isKo ? '오늘의 운세' : "Today's Fortune" },
                            { icon: '📊', text: isKo ? '인생 리포트' : 'Life Report' },
                            { icon: '🥠', text: isKo ? '포츈쿠키' : 'Fortune Cookie' },
                        ].map((b) => (
                            <span
                                key={b.text}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
                                style={{
                                    background: theme.accentBg,
                                    border: `1px solid ${theme.accentBorder}`,
                                    color: theme.accent,
                                }}
                            >
                                {b.icon} {b.text}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── 스낵 테스트 배너 ── */}
                <a
                    href={snackBanner.href}
                    onClick={(e) => { e.preventDefault(); window.location.href = snackBanner.href; }}
                    className="group block rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
                    style={{
                        background: theme.snackBg,
                        border: `1px solid ${theme.snackBorder}`,
                        textDecoration: 'none',
                    }}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">{snackBanner.emoji}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold" style={{ color: theme.snackAccent }}>
                                {isKo ? snackBanner.title : snackBanner.titleEn}
                            </p>
                            <p className="text-[12px] mt-1" style={{ color: theme.textSub }}>
                                {isKo ? snackBanner.desc : snackBanner.descEn}
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: theme.snackAccent }} />
                    </div>
                </a>

                {/* ── 부가 서비스 ── */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ background: theme.divider }} />
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: theme.textMuted }}>
                            {isKo ? '더 알아보기' : 'Explore More'}
                        </p>
                        <div className="flex-1 h-px" style={{ background: theme.divider }} />
                    </div>

                    <div className="flex gap-2.5">
                        {secondaryServices.map((svc) => (
                            <a
                                key={svc.id}
                                href={svc.href}
                                onClick={(e) => { e.preventDefault(); window.location.href = svc.href; }}
                                className="flex-1 flex flex-col items-center gap-2 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                                style={{
                                    background: theme.cardBg,
                                    border: `1px solid ${theme.cardBorder}`,
                                    textDecoration: 'none',
                                }}
                            >
                                <span className="text-xl">{svc.emoji}</span>
                                <span className="text-[11px] font-semibold" style={{ color: theme.textSub }}>
                                    {isKo ? svc.label : svc.labelEn}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── SEO / Educational ── */}
                <details className="group">
                    <summary className="flex items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex-1 h-px" style={{ background: theme.divider }} />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: theme.textMuted }}>
                            {t('home.sectionTitle')}
                            <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                        <div className="flex-1 h-px" style={{ background: theme.divider }} />
                    </summary>
                    <article className="mt-6 space-y-6 text-[14px] leading-[1.8]" style={{ color: theme.textSub }}>
                        <section className="space-y-2">
                            <h2 className="text-lg font-serif" style={{ color: theme.text }}>{t('home.eduTitle')}</h2>
                            <p>{t('home.eduDesc')}</p>
                        </section>
                        <section className="space-y-2">
                            <h3 className="text-base font-serif" style={{ color: theme.text }}>{t('home.eduBgTitle')}</h3>
                            <p>{t('home.eduBgDesc')}</p>
                        </section>
                        <section className="space-y-2">
                            <h3 className="text-base font-serif" style={{ color: theme.text }}>{t('home.eduHowTitle')}</h3>
                            <p>{t('home.eduHowDesc')}</p>
                        </section>
                        <section className="space-y-2">
                            <h3 className="text-base font-serif" style={{ color: theme.text }}>{t('home.eduTechTitle')}</h3>
                            <p>{t('home.eduTechDesc')}</p>
                        </section>
                    </article>
                </details>
            </div>

            {/* ── Footer ── */}
            <footer className="w-full py-8 text-center space-y-2">
                <p className="text-[10px] tracking-widest uppercase" style={{ color: theme.textMuted }}>
                    {t('common.footer')}
                </p>
                <a
                    href="/privacy/"
                    className="text-[11px] transition-colors"
                    style={{ color: theme.textMuted, textDecoration: 'none' }}
                >
                    {t('common.privacy')}
                </a>
            </footer>
        </main>
    );
}
