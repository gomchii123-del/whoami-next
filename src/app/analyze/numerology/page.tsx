'use client';

import Link from 'next/link';
import MysticForm from '@/components/MysticForm';
import { ChevronLeft } from 'lucide-react';

export default function NumerologyPage() {
    return (
        <main className="relative min-h-screen bg-bg-warm flex flex-col items-center p-5 md:p-16 overflow-hidden">
            {/* Ambient Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[5%] left-[10%] w-[20vw] h-[20vw] bg-sage/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-peach/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-2xl space-y-10 py-8 md:py-14">
                {/* Back Nav */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-sage transition-colors font-sans text-sm font-semibold group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    모든 서비스 보기
                </Link>

                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-block text-sage font-bold tracking-widest text-xs uppercase bg-sage/10 px-4 py-2 rounded-full">
                        통합수리 동역학 · Arche Numerology
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.2]">
                        당신의 운명 코드를 <br />
                        <span className="italic text-sage">해독합니다</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-sans leading-relaxed max-w-lg mx-auto">
                        생년월일에 새겨진 고유한 수리 파동을 분석하여 운명수, 내면의 그림자, 재물운, 연애운, 올해의 흐름까지 6가지 관점으로 삶을 조망합니다.
                    </p>
                </div>

                {/* Form */}
                <MysticForm />

                {/* Feature List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {[
                        { title: '운명수 분석', desc: '타고난 기질과 삶의 궤적', icon: '🧭' },
                        { title: '재물 & 직업운', desc: '가장 큰 성취를 이루는 분야', icon: '💼' },
                        { title: '올해의 주기', desc: '2026년 당신의 핵심 테마', icon: '🌊' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow text-center space-y-2">
                            <div className="text-3xl">{item.icon}</div>
                            <h4 className="text-foreground font-serif text-lg">{item.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="mt-8 py-8 opacity-30 text-xs tracking-widest uppercase font-sans text-foreground text-center">
                © 2026 WHOAMI PROJECT · ARCHED ENGINE V3
            </footer>
        </main>
    );
}
