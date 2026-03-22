'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SajuForm from '@/components/SajuForm';
import { useT } from '@/i18n/LocaleContext';

export default function SajuPage() {
    const t = useT();
    return (
        <main className="relative min-h-screen bg-bg-warm flex flex-col items-center p-5 md:p-16 overflow-hidden">
            {/* Ambient Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[5%] left-[10%] w-[20vw] h-[20vw] bg-[#B88A6A]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-sage/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-2xl space-y-8 py-8 md:py-14">
                {/* Back Nav */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#B88A6A] transition-colors font-sans text-sm font-semibold group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {t('common.back')}
                </Link>

                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="inline-block text-[#B88A6A] font-bold tracking-widest text-xs uppercase bg-[#B88A6A]/10 px-4 py-2 rounded-full">
                        {t('services.saju.title')} · {t('services.saju.subtitle')}
                    </span>
                    <h1 className="text-2xl md:text-5xl font-serif text-foreground leading-[1.2]">
                        {t('saju.pageTitle1')} <br />
                        <span className="italic text-[#B88A6A]">{t('saju.pageTitle2')}</span>
                    </h1>
                    <p className="text-base text-gray-500 font-sans leading-relaxed max-w-md mx-auto whitespace-pre-line">
                        {t('saju.pageDesc')}
                    </p>
                </div>

                {/* Form */}
                <SajuForm />


                {/* Educational Content — always visible for SEO crawlers */}
                <div className="mt-16 space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-[#B88A6A]/20" />
                        <span className="text-xs text-[#B88A6A] font-bold tracking-[0.2em] uppercase">
                            사주명리학 안내
                        </span>
                        <div className="flex-1 h-px bg-[#B88A6A]/20" />
                    </div>
                    <article className="mt-6 space-y-8 text-gray-600 font-sans leading-relaxed">

                        <section className="space-y-3">
                            <h2 className="text-xl font-serif text-foreground">사주팔자(四柱八字)란 무엇인가</h2>
                            <p>사주팔자는 태어난 해(年), 달(月), 날(日), 시(時)의 네 기둥(四柱)에 각각 천간(天干)과 지지(地支) 두 글자씩, 총 여덟 글자(八字)로 한 사람의 타고난 운명 구조를 해석하는 동양 전통 명리학입니다. 약 2,000년의 역사를 가진 이 학문은 중국 당나라의 이허중(李虛中)과 송나라의 서자평(徐子平)에 의해 체계화되었으며, 한국에서는 조선시대부터 과거시험과 혼인에 활용될 만큼 깊이 뿌리내린 문화적 전통입니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">천간과 지지 — 우주의 에너지 코드</h3>
                            <p>천간(天干)은 갑(甲)·을(乙)·병(丙)·정(丁)·무(戊)·기(己)·경(庚)·신(辛)·임(壬)·계(癸)의 10가지로, 하늘의 기운이 순환하는 방식을 나타냅니다. 지지(地支)는 자(子)·축(丑)·인(寅)·묘(卯)·진(辰)·사(巳)·오(午)·미(未)·신(申)·유(酉)·술(戌)·해(亥)의 12가지로, 땅의 기운과 시간의 흐름을 상징합니다. 이 두 체계가 결합하여 60갑자(六十甲子)의 순환 주기를 만들어냅니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">오행(五行) — 만물의 상생과 상극</h3>
                            <p>사주의 핵심 원리는 목(木)·화(火)·토(土)·금(金)·수(水) 다섯 가지 원소의 상호작용입니다. 목생화(木生火), 화생토(火生土), 토생금(土生金), 금생수(金生水), 수생목(水生木)의 상생 관계와, 목극토(木克土), 토극수(土克水), 수극화(水克火), 화극금(火克金), 금극목(金克木)의 상극 관계를 통해 한 사람의 심리적 경향성, 대인관계 패턴, 건강 취약점, 적성 분야를 종합적으로 분석할 수 있습니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">대운(大運)과 세운(歲運)</h3>
                            <p>대운은 10년 단위로 바뀌는 인생의 큰 흐름으로, 절입일(節入日)로부터 출생일까지의 일수를 기반으로 산출합니다. 양남음녀(陽男陰女)는 순행, 음남양녀(陰男陽女)는 역행으로 진행됩니다. 세운은 매년 바뀌는 운기를 뜻하며, 대운과 세운의 조합이 특정 시기의 길흉을 좌우합니다. WHOAMI의 사주 분석 엔진은 한국천문연구원 역서와 동일한 정밀도의 절기 데이터를 활용하여 대운수를 계산합니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-foreground">WHOAMI 사주 분석의 특징</h3>
                            <p>본 서비스는 lunar-javascript 천문 라이브러리를 활용하여 절기 기반의 정밀한 사주팔자와 대운을 산출합니다. 시주(時柱) 계산에는 전통 오서둔(五鼠遁) 공식을 적용하며, 대운수는 출생일로부터 가장 가까운 절입일까지의 일수를 3으로 나누는 전통 방식을 따릅니다. 분석 결과는 AI 프롬프트와 결합하여 더욱 깊이 있는 해석을 제공합니다.</p>
                        </section>

                        {/* Cross-links for SEO */}
                        <nav className="pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-3">관련 서비스</h3>
                            <div className="flex flex-wrap gap-2">
                                <a href="/analyze/numerology/" className="text-sm px-3 py-1.5 rounded-full bg-sage/10 text-sage font-medium hover:bg-sage/20 transition-colors">✦ 수비학 분석</a>
                                <a href="/analyze/tarot/" className="text-sm px-3 py-1.5 rounded-full bg-[#7B6EA0]/10 text-[#7B6EA0] font-medium hover:bg-[#7B6EA0]/20 transition-colors">🜔 타로 리딩</a>
                                <a href="/analyze/ziwei/" className="text-sm px-3 py-1.5 rounded-full bg-[#6A8FAA]/10 text-[#6A8FAA] font-medium hover:bg-[#6A8FAA]/20 transition-colors">⭑ 자미두수</a>
                                <a href="/analyze/astrology/" className="text-sm px-3 py-1.5 rounded-full bg-[#A07868]/10 text-[#A07868] font-medium hover:bg-[#A07868]/20 transition-colors">♈ 점성술</a>
                            </div>
                        </nav>
                    </article>
                </div>
            </div>

            <footer className="mt-8 py-8 text-center space-y-2">
                <p className="opacity-30 text-xs tracking-widest uppercase font-sans text-foreground">
                    © 2026 WHOAMI PROJECT · ARCHE ENGINE V3
                </p>
                <Link href="/privacy/" className="text-xs text-gray-400 hover:text-[#B88A6A] transition-colors font-sans">
                    개인정보 처리방침
                </Link>
            </footer>
        </main>
    );
}
