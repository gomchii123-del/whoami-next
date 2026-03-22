'use client';

import TarotForm from '@/components/TarotForm';
import { Compass } from 'lucide-react';
import Link from 'next/link';
import { useT } from '@/i18n/LocaleContext';

export default function TarotPage() {
    const t = useT();
    return (
        <main className="min-h-screen bg-[#F7F3EE] flex flex-col items-center">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-purple-200/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] bg-indigo-100/40 rounded-full blur-[100px]" />
            </div>

            <div className="z-10 w-full max-w-2xl px-5 py-12 md:py-20 space-y-10">
                {/* Header */}
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-sage font-bold tracking-widest text-xs uppercase hover:opacity-70 transition-opacity">
                        <Compass className="w-4 h-4" />
                        WHOAMI PROJECT
                    </Link>
                    <h1 className="text-2xl md:text-5xl font-serif text-gray-900 leading-tight">
                        {t('tarot.pageTitle1')}<br />
                        <span className="italic text-purple-600">{t('tarot.pageTitle2')}</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md mx-auto whitespace-pre-line">
                        {t('tarot.pageDesc')}
                    </p>
                </div>

                {/* Form Component */}
                <TarotForm />

                {/* Educational Content — always visible for SEO */}
                <div className="mt-16 space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-purple-200" />
                        <span className="text-xs text-purple-500 font-bold tracking-[0.2em] uppercase">
                            타로 안내
                        </span>
                        <div className="flex-1 h-px bg-purple-200" />
                    </div>
                    <article className="mt-6 space-y-8 text-gray-600 font-sans leading-relaxed">

                        <section className="space-y-3">
                            <h2 className="text-xl font-serif text-gray-900">타로 카드란 무엇인가</h2>
                            <p>타로(Tarot)는 78장의 카드로 구성된 상징 체계로, 15세기 이탈리아 르네상스 시대에 기원합니다. 원래 귀족 사회의 카드 게임으로 시작되었으나, 18세기 프랑스의 앙투안 쿠르 드 제블랭(Antoine Court de Gébelin)이 이집트 신비주의와 연결하면서 점술 도구로서의 역할이 부각되었습니다. 이후 영국의 황금여명회(Golden Dawn)가 카발라와 점성술 체계를 타로에 접목하면서 현대 타로의 기초가 확립되었습니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-gray-900">메이저 아르카나 — 영혼의 여정</h3>
                            <p>메이저 아르카나(Major Arcana) 22장은 바보(The Fool)에서 세계(The World)까지, 한 영혼이 겪는 성장과 깨달음의 여정을 상징합니다. 마법사(The Magician)는 의지와 창조력을, 여사제(The High Priestess)는 직관과 내면의 지혜를 나타냅니다. 운명의 수레바퀴(Wheel of Fortune)는 삶의 순환을, 탑(The Tower)은 근본적 변화와 해방을 의미합니다. 각 카드는 융(Carl Jung)의 원형(Archetype) 이론과도 맥을 같이하며, 무의식에 잠재된 심리적 패턴을 드러내는 거울 역할을 합니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-gray-900">마이너 아르카나 — 일상의 에너지</h3>
                            <p>마이너 아르카나(Minor Arcana) 56장은 완드(불/행동), 컵(물/감정), 소드(공기/사고), 펜타클(흙/물질) 네 가지 수트(Suit)로 구성됩니다. 각 수트는 에이스부터 10까지의 숫자 카드와 페이지, 나이트, 퀸, 킹의 궁정 카드를 포함합니다. 완드 수트는 열정과 창의성을, 컵 수트는 사랑과 관계를, 소드 수트는 지성과 갈등을, 펜타클 수트는 재물과 현실적 성취를 다룹니다.</p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-lg font-serif text-gray-900">타로 리딩의 원리</h3>
                            <p>타로 리딩은 동시성(Synchronicity)의 원리에 기반합니다. 이는 융이 제시한 개념으로, 인과적 연결은 없지만 의미 있는 우연의 일치를 통해 무의식의 메시지를 읽어내는 방법론입니다. 카드의 배치(스프레드)에 따라 과거·현재·미래의 에너지 흐름을 파악하며, 정방향과 역방향에 따라 해석이 달라집니다. WHOAMI는 카드 선택과 질문을 AI 분석과 결합하여 보다 개인화된 타로 해석을 제공합니다.</p>
                        </section>

                        {/* Cross-links for SEO */}
                        <nav className="pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-3">관련 서비스</h3>
                            <div className="flex flex-wrap gap-2">
                                <a href="/analyze/numerology/" className="text-sm px-3 py-1.5 rounded-full bg-sage/10 text-sage font-medium hover:bg-sage/20 transition-colors">✦ 수비학 분석</a>
                                <a href="/analyze/saju/" className="text-sm px-3 py-1.5 rounded-full bg-[#B88A6A]/10 text-[#B88A6A] font-medium hover:bg-[#B88A6A]/20 transition-colors">☯ 사주팔자</a>
                                <a href="/analyze/ziwei/" className="text-sm px-3 py-1.5 rounded-full bg-[#6A8FAA]/10 text-[#6A8FAA] font-medium hover:bg-[#6A8FAA]/20 transition-colors">⭑ 자미두수</a>
                                <a href="/analyze/astrology/" className="text-sm px-3 py-1.5 rounded-full bg-[#A07868]/10 text-[#A07868] font-medium hover:bg-[#A07868]/20 transition-colors">♈ 점성술</a>
                            </div>
                        </nav>
                    </article>
                </div>
                <div className="text-center space-y-2 opacity-40 py-10">
                    <p className="text-[10px] tracking-[0.3em] font-bold text-gray-400 uppercase">Tarot Engine V1.0 · WHOAMI</p>
                </div>
            </div>
        </main>
    );
}
