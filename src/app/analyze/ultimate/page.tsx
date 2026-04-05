'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import UltimateForm from '@/components/UltimateForm';
import { useT } from '@/i18n/LocaleContext';

export default function UltimatePage() {
    const t = useT();
    return (
        <main className="relative min-h-screen bg-bg-warm flex flex-col items-center p-5 md:p-16 overflow-hidden">
            {/* Ambient Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[5%] left-[10%] w-[20vw] h-[20vw] bg-[#A07868]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-sage/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-2xl space-y-8 py-8 md:py-14">
                {/* Back Nav */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#A07868] transition-colors font-sans text-sm font-semibold group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {t('common.back')}
                </Link>

                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="inline-block text-[#A07868] font-bold tracking-widest text-xs uppercase bg-[#A07868]/10 px-4 py-2 rounded-full">
                        SYNTHESIS · 5-IN-1 MASTER ENGINE
                    </span>
                    <h1 className="text-2xl md:text-5xl font-serif text-foreground leading-[1.2]">
                        얼티밋 프롬프트 <br />
                        <span className="italic text-[#A07868]">Ultimate Prompt</span>
                    </h1>
                    <p className="text-base text-gray-500 font-sans leading-relaxed max-w-md mx-auto whitespace-pre-line">
                        사주, 자미두수, 점성술, 휴먼디자인, 수비학.<br />5대 명리티컬 시스템을 한 번에 가동합니다.
                    </p>
                </div>

                {/* Form */}
                <UltimateForm />

                {/* Educational Content */}
                <details className="mt-16 group">
                    <summary className="flex items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex-1 h-px bg-[#A07868]/20" />
                        <span className="text-xs text-[#A07868] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            마스터 엔진 소개
                            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                        <div className="flex-1 h-px bg-[#A07868]/20" />
                    </summary>
                    <article className="mt-6 space-y-8 text-gray-600 font-sans leading-relaxed">
                        <section className="space-y-3">
                            <h2 className="text-xl font-serif text-foreground">5대 시스템의 완벽한 융합</h2>
                            <p>사주명리학(시간의 인과율), 자미두수(동양 점성 시스템), 서양 점성술(우주적 파동), 휴먼디자인(유전자 로직), 피타고라스 수비학(수치 진동)을 모두 하나의 프롬프트 안에서 교차 검증하여 내담자만의 궁극적인 '얼티밋 결과'를 도출하도록 LLM을 세팅합니다.</p>
                        </section>
                    </article>
                </details>
            </div>

            <footer className="mt-8 py-8 text-center space-y-2">
                <p className="opacity-30 text-xs tracking-widest uppercase font-sans text-foreground">
                    {t('common.footer')}
                </p>
                <Link href="/privacy/" className="text-xs text-gray-400 hover:text-[#A07868] transition-colors font-sans">
                    {t('common.privacy')}
                </Link>
            </footer>
        </main>
    );
}
