'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COLUMN_ARTICLES } from '@/lib/columns-data';

export default function ColumnsPage() {
    return (
        <main className="min-h-screen" style={{ background: '#F7F6F3' }}>
            <div className="max-w-3xl mx-auto px-5 pt-12 pb-16">
                {/* Nav */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-semibold mb-8">
                    <ChevronLeft className="w-4 h-4" /> 홈으로
                </Link>

                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full" style={{ background: 'rgba(93,110,100,0.1)', color: '#5D6E64' }}>
                        COLUMNS · 읽을거리
                    </span>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                        운세 칼럼 & 가이드
                    </h1>
                    <p className="text-gray-500 text-[15px] leading-relaxed max-w-lg mx-auto">
                        수비학, 사주팔자, 타로 카드, 바이오리듬 등 동서양 운명학의 핵심 원리와 실생활 활용법을 심층적으로 다루는 전문 칼럼입니다.
                    </p>
                </div>

                {/* Article List */}
                <div className="space-y-4">
                    {COLUMN_ARTICLES.map((article) => (
                        <a
                            key={article.slug}
                            href={`/columns/${article.slug}/`}
                            onClick={(e) => { e.preventDefault(); window.location.href = `/columns/${article.slug}/`; }}
                            className="block rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.005] active:scale-[0.99]"
                            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', textDecoration: 'none' }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(93,110,100,0.08)' }}>
                                    {article.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded" style={{ background: 'rgba(93,110,100,0.08)', color: '#5D6E64' }}>
                                            {article.category}
                                        </span>
                                        <span className="text-[11px] text-gray-400">{article.date} · {article.readTime} 읽기</span>
                                    </div>
                                    <h2 className="text-[16px] font-bold text-gray-900 leading-snug mb-1">{article.title}</h2>
                                    <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{article.subtitle}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 shrink-0 text-gray-300 mt-3" />
                            </div>
                        </a>
                    ))}
                </div>

                {/* SEO Footer Text */}
                <div className="mt-16 space-y-6 text-[14px] leading-[2] text-gray-600">
                    <h2 className="text-xl font-serif font-bold text-gray-800">WHOAMI 운세 칼럼 소개</h2>
                    <p>
                        WHOAMI 운세 칼럼은 수비학(Numerology), 사주팔자, 타로 카드, 바이오리듬, 점성술 등
                        동서양의 운명 해석 체계를 심층적으로 다루는 전문 콘텐츠 허브입니다.
                        각 칼럼은 해당 분야의 역사적 배경, 핵심 원리, 실생활 활용법을 1,500자 이상의
                        상세한 텍스트로 제공하며, 전문 지식이 없는 분도 쉽게 이해할 수 있도록 구성되어 있습니다.
                    </p>
                    <p>
                        생명경로수(Life Path Number) 계산법, 개인 연수(Personal Year) 전략,
                        메이저 아르카나 해석, 바이오리듬 일일 에너지 관리, 동양 명리학과 서양 수비학의 비교 분석 등
                        풍부한 주제를 다루고 있습니다. 정기적으로 새로운 칼럼이 추가되며,
                        WHOAMI 플랫폼의 분석 도구와 연계하여 읽은 내용을 직접 체험해 볼 수 있습니다.
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-10 text-center space-y-3">
                    <a
                        href="/analyze/numerology/"
                        onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/numerology/'; }}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-[15px] transition-all hover:opacity-90 active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, #5D6E64, #4A5B51)', boxShadow: '0 6px 20px rgba(93,110,100,0.25)', textDecoration: 'none' }}
                    >
                        ✦ 무료 수비학 분석 받아보기
                    </a>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center">
                    <p className="text-[10px] tracking-widest uppercase text-gray-400">© 2026 WHOAMI PROJECT</p>
                </footer>
            </div>

            <style jsx global>{`
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </main>
    );
}
