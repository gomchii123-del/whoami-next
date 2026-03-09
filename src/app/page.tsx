'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg-warm flex flex-col items-center overflow-hidden">
      {/* Ambient Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
        <div className="absolute top-[5%] left-[10%] w-[25vw] h-[25vw] bg-sage/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[15%] right-[5%] w-[35vw] h-[35vw] bg-peach/8 rounded-full blur-[150px]" />
      </div>

      <div className="z-10 w-full max-w-2xl px-5 py-14 md:py-24 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-5">
          <span className="inline-block text-sage font-bold tracking-widest text-xs uppercase bg-sage/10 px-4 py-2 rounded-full">
            Arche · 당신의 우주 설계도
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-foreground leading-[1.15]">
            삶의 의미를 찾는<br />
            <span className="italic text-sage">당신을 위한 탐색</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-sans leading-relaxed max-w-lg mx-auto">
            탄생의 순간에 새겨진 고유한 파동을 해독하여<br className="hidden md:block" />
            당신의 강점과 타고난 천명을 발견하세요.
          </p>
        </div>

        {/* Numerology Service Card */}
        <div className="space-y-4">
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase ml-1">지금 시작하기</p>

          <Link
            href="/analyze/numerology"
            className="group flex items-center gap-5 w-full rounded-2xl p-6 border-2 transition-all duration-200 bg-sage/10 border-sage/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer hover:border-sage/60"
          >
            {/* Icon */}
            <div className="shrink-0 w-[68px] h-[68px] rounded-xl flex items-center justify-center bg-white shadow-md text-sage group-hover:shadow-lg transition-shadow">
              <Sparkles className="w-8 h-8" />
            </div>

            {/* Text */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-xl font-serif font-semibold text-foreground leading-snug">
                  통합수리 수비학
                </h2>
              </div>
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Arche Numerology</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                생년월일에 숨겨진 당신의 운명 코드를 해독합니다. 운명수부터 연간 흐름까지 6가지 카테고리로 삶을 조망합니다.
              </p>
            </div>

            {/* Arrow */}
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm text-sage group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            { label: '통합수리 동역학', sub: '독자 알고리즘' },
            { label: '6가지 카테고리', sub: '심층 분석' },
            { label: '프리미엄 리포트', sub: '고밀도 콘텐츠' },
          ].map((item, i) => (
            <div key={i} className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm font-serif text-foreground font-semibold leading-tight">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="py-8 opacity-30 text-xs tracking-widest uppercase font-sans text-foreground text-center">
        © 2026 WHOAMI PROJECT · ARCHE ENGINE V3
      </footer>
    </main>
  );
}
