'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import AstrologyForm from '@/components/AstrologyForm';
import { useT } from '@/i18n/LocaleContext';

export default function AstrologyPage() {
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
                        {t('services.astrology.title')} · {t('services.astrology.subtitle')}
                    </span>
                    <h1 className="text-2xl md:text-5xl font-serif text-foreground leading-[1.2]">
                        {t('astrology.pageTitle1')} <br />
                        <span className="italic text-[#A07868]">{t('astrology.pageTitle2')}</span>
                    </h1>
                    <p className="text-base text-gray-500 font-sans leading-relaxed max-w-md mx-auto whitespace-pre-line">
                        {t('astrology.pageDesc')}
                    </p>
                </div>

                {/* Form */}
                <AstrologyForm />

                {/* Educational Content — collapsible for UX, always in DOM for bots */}
                <details className="mt-16 group">
                    <summary className="flex items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex-1 h-px bg-[#A07868]/20" />
                        <span className="text-xs text-[#A07868] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            {t('astrology.sectionTitle')}
                            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                        <div className="flex-1 h-px bg-[#A07868]/20" />
                    </summary>
                    <article className="mt-6 space-y-8 text-gray-600 font-sans leading-relaxed">

                        <section className="space-y-3">
                            <h2 className="text-xl font-serif text-foreground">서양 점성술(Astrology)이란 무엇인가</h2>
                            <p>서양 점성술은 출생 순간 하늘에 배치된 태양, 달, 행성들의 위치를 바탕으로 개인의 성격, 재능, 인생 경향을 분석하는 학문입니다. 기원전 2000년 바빌로니아에서 시작되어 고대 그리스와 로마를 거치며 체계화되었습니다. 클라우디오스 프톨레마이오스(Claudius Ptolemaeus)의 저서 테트라비블로스(Tetrabiblos)는 서양 점성술의 교과서로 여겨지며, 르네상스 시대에는 천문학과 분리되기 전까지 대학에서 정규 학문으로 가르쳐졌습니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">Big Three — 핵심 세 요소</h3>
                            <p>네이탈 차트에서 가장 중요한 세 가지 요소는 태양궁(Sun Sign), 달궁(Moon Sign), 상승궁(Rising Sign/Ascendant)입니다. 태양궁은 핵심 정체성과 의식적 자아를 나타내며, 일반적으로 별자리 운세에서 사용되는 것이 바로 이 태양궁입니다. 달궁은 감정 패턴, 무의식적 반응, 안정감을 느끼는 방식을 보여줍니다. 상승궁은 외부에 투영되는 첫인상과 사회적 페르소나를 결정합니다. 이 세 가지의 조합만으로도 한 사람의 심리적 구조를 상당 부분 파악할 수 있습니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">12하우스 — 삶의 12가지 무대</h3>
                            <p>네이탈 차트는 12개의 하우스(House)로 나뉘며, 각 하우스는 삶의 특정 영역을 관장합니다. 제1하우스는 자아와 외모를, 제2하우스는 재물과 가치관을, 제7하우스는 파트너십과 결혼을, 제10하우스는 직업과 사회적 명성을 나타냅니다. 행성이 어떤 하우스에 위치하느냐에 따라 그 삶의 영역에 특별한 에너지가 집중됩니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">원소와 모달리티</h3>
                            <p>12별자리는 불(양자리·사자자리·사수자리), 흙(황소자리·처녀자리·염소자리), 공기(쌍둥이자리·천칭자리·물병자리), 물(게자리·전갈자리·물고기자리)의 네 원소로 분류됩니다. 또한 활동궁(Cardinal), 고정궁(Fixed), 변동궁(Mutable)의 세 모달리티로도 나뉩니다. 차트에서 특정 원소나 모달리티가 강하면 그에 해당하는 기질이 두드러집니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">WHOAMI 점성술 분석의 특징</h3>
                            <p>WHOAMI는 Moshier 천문력(Steve Moshier's analytical ephemeris)을 활용하여 0.001도 이내의 정밀도로 행성 위치를 계산합니다. NASA JPL의 DE431 수치적분 천문력에 근접하는 정확도를 가지며, 수천 년 범위의 출생일에 대해 안정적인 계산을 제공합니다. Big Three, 원소 균형, 12하우스 배치를 한눈에 확인할 수 있는 시각적 차트를 제공합니다.</p>
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
