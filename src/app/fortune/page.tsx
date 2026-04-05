'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import DailyFortune from '@/components/DailyFortune';

/**
 * /fortune 페이지 — 오늘의 운세 + 포츈쿠키
 * 
 * 수비학에서 입력한 생년월일을 sessionStorage에서 불러와 개인화합니다.
 * 생년월일이 없으면 입력 안내를 보여줍니다.
 */

interface BirthData {
    year: number;
    month: number;
    day: number;
    name: string;
}

const OTHER_SERVICES = [
    { id: 'saju', href: '/analyze/saju/', emoji: '☯', label: '사주', sub: 'FOUR PILLARS', color: '#B88A6A', bg: 'rgba(184,138,106,0.06)', border: 'rgba(184,138,106,0.2)' },
    { id: 'tarot', href: '/analyze/tarot/', emoji: '🜔', label: '타로', sub: 'TAROT', color: '#7B6EA0', bg: 'rgba(123,110,160,0.06)', border: 'rgba(123,110,160,0.2)' },
    { id: 'ziwei', href: '/analyze/ziwei/', emoji: '⭑', label: '자미두수', sub: 'ZI WEI', color: '#6A8FAA', bg: 'rgba(106,143,170,0.06)', border: 'rgba(106,143,170,0.2)' },
    { id: 'astrology', href: '/analyze/astrology/', emoji: '♈', label: '점성술', sub: 'ASTROLOGY', color: '#A07868', bg: 'rgba(160,120,104,0.06)', border: 'rgba(160,120,104,0.2)' },
];

export default function FortunePage() {
    const [birthData, setBirthData] = useState<BirthData | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // sessionStorage에서 생년월일 불러오기
        const raw = sessionStorage.getItem('arche_analysis');
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setBirthData({
                    year: parseInt(parsed.year, 10),
                    month: parseInt(parsed.month, 10),
                    day: parseInt(parsed.day, 10),
                    name: parsed.name || '',
                });
            } catch { /* ignore */ }
        }
    }, []);

    if (!mounted) {
        return (
            <main className="min-h-screen bg-bg-warm flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto" />
            </main>
        );
    }

    // 생년월일 미입력 시 안내
    if (!birthData) {
        return (
            <main className="relative min-h-screen bg-[#FDF9F1] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                    <div className="absolute top-[5%] left-[5%] w-[30vw] h-[30vw] bg-[#E8E1DE]/40 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[5%] right-[5%] w-[40vw] h-[40vw] bg-[#DAD0CB]/30 rounded-full blur-[120px]" />
                </div>
                
                <div className="relative z-10 w-full max-w-xl px-5 py-12 flex flex-col items-center">
                    {/* Header Site Name */}
                    <div className="mb-10 text-center">
                        <span className="text-[#88A096] font-bold tracking-[0.3em] text-xs uppercase mb-3 block">WHOAMI DAILY</span>
                        <h1 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
                            오늘의 운세 <span className="text-[#88A096]">&</span> 포츈쿠키
                        </h1>
                        <p className="text-gray-500 mt-4 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                            당신의 생년월일에 숨겨진 오늘의 운명과<br className="hidden md:block" />행운의 포츈 메시지를 확인해보세요.
                        </p>
                    </div>

                    {/* Entry Card */}
                    <div className="w-full bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-xl border border-white/60">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-[#88A096]/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                                🔮
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">생년월일 입력</h2>
                            <p className="text-gray-400 text-xs mt-1">개인화된 맞춤 분석을 위해 필요합니다</p>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const year = parseInt((form.elements.namedItem('year') as HTMLInputElement).value);
                            const month = parseInt((form.elements.namedItem('month') as HTMLInputElement).value);
                            const day = parseInt((form.elements.namedItem('day') as HTMLInputElement).value);
                            
                            if (year && month && day) {
                                sessionStorage.setItem('arche_analysis', JSON.stringify({ year, month, day }));
                                window.location.reload();
                            }
                        }} className="w-full space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 pl-1">태어난 연도</label>
                                    <input name="year" type="number" placeholder="YYYY" required min="1900" max="2026"
                                        className="w-full px-5 py-4 rounded-xl text-center text-lg font-medium outline-none transition-all"
                                        style={{ background: '#F7F3EE', border: '1px solid transparent', color: '#2D2D2D' }} 
                                        onFocus={(e) => e.target.style.borderColor = '#88A096'}
                                        onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                                </div>
                                <div className="flex gap-4 flex-1">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-2 pl-1 text-center">월</label>
                                        <input name="month" type="number" placeholder="MM" required min="1" max="12"
                                            className="w-full px-3 py-4 rounded-xl text-center text-lg font-medium outline-none transition-all"
                                            style={{ background: '#F7F3EE', border: '1px solid transparent', color: '#2D2D2D' }} 
                                            onFocus={(e) => e.target.style.borderColor = '#88A096'}
                                            onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-2 pl-1 text-center">일</label>
                                        <input name="day" type="number" placeholder="DD" required min="1" max="31"
                                            className="w-full px-3 py-4 rounded-xl text-center text-lg font-medium outline-none transition-all"
                                            style={{ background: '#F7F3EE', border: '1px solid transparent', color: '#2D2D2D' }} 
                                            onFocus={(e) => e.target.style.borderColor = '#88A096'}
                                            onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button type="submit"
                                    className="block w-full py-5 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                    style={{ background: 'linear-gradient(135deg, #88A096, #6B847A)' }}
                                >
                                    내 운세 무료로 열어보기
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-10 text-center">
                        <Link href="/" className="text-gray-400 text-sm font-medium hover:text-[#88A096] transition-colors flex items-center gap-1 justify-center">
                            <ChevronLeft className="w-4 h-4" /> 메인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen bg-bg-warm flex flex-col items-center overflow-hidden">
            {/* Ambient Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[5%] left-[10%] w-[20vw] h-[20vw] bg-sage/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-peach/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-2xl px-5 py-8 md:py-14 space-y-8">
                {/* Back Nav */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-sage transition-colors font-sans text-sm font-semibold group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    홈으로
                </Link>

                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="inline-block text-sage font-bold tracking-widest text-xs uppercase bg-sage/10 px-4 py-2 rounded-full">
                        DAILY FORTUNE
                    </span>
                    <h1 className="text-2xl md:text-4xl font-serif text-foreground leading-[1.2]">
                        {birthData.name ? `${birthData.name}님의 ` : ''}오늘의 운세
                    </h1>
                    <p className="text-sm text-gray-400">
                        {birthData.year}년 {birthData.month}월 {birthData.day}일 기반 개인화 분석
                    </p>
                </div>

                {/* 오늘의 운세 */}
                <DailyFortune
                    birthYear={birthData.year}
                    birthMonth={birthData.month}
                    birthDay={birthData.day}
                />

                {/* 다른 운세 보기 */}
                <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">다른 운세 보기</p>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {OTHER_SERVICES.map((svc) => (
                            <a
                                key={svc.id}
                                href={svc.href}
                                onClick={(e) => { e.preventDefault(); window.location.href = svc.href; }}
                                className="group flex items-center gap-3 rounded-2xl p-4 border transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                                style={{ background: svc.bg, borderColor: svc.border, textDecoration: 'none' }}
                            >
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

                    {/* 종합 분석 다시 보기 */}
                    <a
                        href="/result/"
                        onClick={(e) => { e.preventDefault(); window.location.href = '/result/'; }}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 text-sm font-bold transition-all hover:shadow-md active:scale-[0.98]"
                        style={{ borderColor: 'rgba(136,160,150,0.3)', color: '#88A096' }}
                    >
                        ✦ 수비학 종합 분석 다시 보기
                    </a>
                </div>
            </div>

            <footer className="py-8 text-center space-y-2">
                <p className="opacity-30 text-xs tracking-widest uppercase font-sans text-foreground">
                    © 2026 WHOAMI PROJECT
                </p>
            </footer>
        </main>
    );
}
