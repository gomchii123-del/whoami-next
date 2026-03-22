'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ZiWeiForm from '@/components/ZiWeiForm';
import { useT } from '@/i18n/LocaleContext';

export default function ZiWeiPage() {
    const t = useT();
    return (
        <main className="relative min-h-screen bg-bg-warm flex flex-col items-center p-5 md:p-16 overflow-hidden">
            {/* Ambient Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[5%] left-[10%] w-[20vw] h-[20vw] bg-[#6A8FAA]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-sage/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-2xl space-y-8 py-8 md:py-14">
                {/* Back Nav */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#6A8FAA] transition-colors font-sans text-sm font-semibold group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {t('common.back')}
                </Link>

                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="inline-block text-[#6A8FAA] font-bold tracking-widest text-xs uppercase bg-[#6A8FAA]/10 px-4 py-2 rounded-full">
                        {t('services.ziwei.title')} · {t('services.ziwei.subtitle')}
                    </span>
                    <h1 className="text-2xl md:text-5xl font-serif text-foreground leading-[1.2]">
                        {t('ziwei.pageTitle1')} <br />
                        <span className="italic text-[#6A8FAA]">{t('ziwei.pageTitle2')}</span>
                    </h1>
                    <p className="text-base text-gray-500 font-sans leading-relaxed max-w-md mx-auto whitespace-pre-line">
                        {t('ziwei.pageDesc')}
                    </p>
                </div>

                {/* Form */}
                <ZiWeiForm />

                {/* Educational Content — collapsible for UX, always in DOM for bots */}
                <details className="mt-16 group">
                    <summary className="flex items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex-1 h-px bg-[#6A8FAA]/20" />
                        <span className="text-xs text-[#6A8FAA] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            {t('ziwei.sectionTitle')}
                            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                        <div className="flex-1 h-px bg-[#6A8FAA]/20" />
                    </summary>
                    <article className="mt-6 space-y-8 text-gray-600 font-sans leading-relaxed">

                        <section className="space-y-3">
                            <h2 className="text-xl font-serif text-foreground">자미두수(紫微斗數)란 무엇인가</h2>
                            <p>자미두수는 북극성(紫微星)을 중심으로 14개의 주성(主星)이 12궁에 배치되는 양상으로 한 사람의 운명을 해석하는 동양 운명학입니다. 중국 오대십국 시대 말기의 도사 진단(陳摶, 혹은 陳希夷)이 창시한 것으로 전해지며, 송나라 때 체계화되어 명나라·청나라를 거쳐 동아시아 전역에 퍼졌습니다. 사주명리학과 함께 중국 이대 명학(二大命學)으로 불리며, 특히 대만과 홍콩에서 높은 인기를 누리고 있습니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">12궁(十二宮) — 인생의 12가지 영역</h3>
                            <p>자미두수의 명반(命盤)은 12개의 궁으로 구성됩니다. 명궁(命宮)은 선천적 성격과 외모를, 재백궁(財帛宮)은 재물운을, 관록궁(官祿宮)은 직업과 사회적 성취를, 부처궁(夫妻宮)은 배우자와 결혼운을, 자녀궁(子女宮)은 자녀와 출산운을 나타냅니다. 그 외에도 형제궁, 전택궁, 복덕궁, 부모궁, 천이궁, 노복궁, 질액궁이 있어 삶의 모든 영역을 포괄합니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">14주성(主星) — 별들의 인격</h3>
                            <p>자미두수의 핵심은 14개의 주성입니다. 자미성(紫微星)은 제왕의 별로 리더십과 존엄을, 천부성(天府星)은 재물 창고로 안정과 축적을, 태양성(太陽星)은 빛과 박애를, 태음성(太陰星)은 감성과 예술성을 상징합니다. 무곡성(武曲星)은 결단력과 재물 능력을, 천동성(天同星)은 온화함과 복록을, 염정성(廉貞星)은 열정과 복잡성을, 탐랑성(貪狼星)은 욕망과 다재다능을 나타냅니다. 각 별의 밝기(묘·왕·득·이·평·불·함)에 따라 해석이 달라집니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">오행국(五行局)과 사화(四化)</h3>
                            <p>오행국은 수이국(水二局), 목삼국(木三局), 금사국(金四局), 토오국(土五局), 화육국(火六局)의 다섯 가지로, 명궁의 천간과 지지 조합으로 결정됩니다. 이는 대운의 시작 시점과 삶의 기본 리듬을 결정하는 중요한 요소입니다. 사화(四化)는 화록(化祿)·화권(化權)·화과(化科)·화기(化忌)로, 해당 해의 천간에 따라 특정 별에 부여되어 길흉을 뚜렷하게 만듭니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">WHOAMI 자미두수 분석의 특징</h3>
                            <p>WHOAMI는 검증된 오픈소스 자미두수 라이브러리(iztro)를 활용하여 정확한 주성 배치와 오행국 계산을 보장합니다. 한국어 출력을 기본 지원하며, 12궁의 배치를 시각적 명반 그리드로 제공하여 직관적으로 자신의 운명 지도를 확인할 수 있습니다.</p>
                        </section>
                    </article>
                </details>
            </div>

            <footer className="mt-8 py-8 text-center space-y-2">
                <p className="opacity-30 text-xs tracking-widest uppercase font-sans text-foreground">
                    {t('common.footer')}
                </p>
                <Link href="/privacy/" className="text-xs text-gray-400 hover:text-[#6A8FAA] transition-colors font-sans">
                    {t('common.privacy')}
                </Link>
            </footer>
        </main>
    );
}
