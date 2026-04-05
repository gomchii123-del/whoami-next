'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { COLUMN_ARTICLES, ColumnArticle } from '@/lib/columns-data';
import AdBanner from '@/components/AdBanner';

export default function ColumnArticlePage({ slug }: { slug: string }) {
    const article = COLUMN_ARTICLES.find(a => a.slug === slug);
    if (!article) return <div className="min-h-screen flex items-center justify-center text-lg text-gray-400">칼럼을 찾을 수 없습니다.</div>;

    const otherArticles = COLUMN_ARTICLES.filter(a => a.slug !== slug).slice(0, 3);

    return (
        <main className="min-h-screen" style={{ background: '#F7F6F3' }}>
            <article className="max-w-2xl mx-auto px-5 pt-10 pb-16">
                {/* Nav */}
                <Link href="/columns/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-semibold mb-8">
                    <ChevronLeft className="w-4 h-4" /> 칼럼 목록
                </Link>

                {/* Article Header */}
                <header className="mb-8 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md" style={{ background: 'rgba(93,110,100,0.1)', color: '#5D6E64' }}>
                            {article.category}
                        </span>
                        <span className="text-[12px] text-gray-400">{article.date} · {article.readTime} 읽기</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">
                        {article.emoji} {article.title}
                    </h1>
                    <p className="text-[15px] text-gray-500 leading-relaxed">{article.subtitle}</p>
                    <div className="h-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
                </header>

                {/* Article Body */}
                <div className="space-y-6">
                    {article.paragraphs.map((para, idx) => (
                        <div key={idx}>
                            <p className="text-[15px] md:text-[16px] leading-[2] text-gray-700" style={{ textAlign: 'justify' }}>
                                {para}
                            </p>
                            {/* 3문단마다 광고 삽입 */}
                            {idx === 2 && <div className="my-6"><AdBanner label={`칼럼-${article.slug}-중간`} format="horizontal" /></div>}
                        </div>
                    ))}
                </div>

                {/* Article Footer */}
                <div className="mt-12 pt-8 space-y-6" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    {/* CTA */}
                    <div className="rounded-2xl p-6 text-center space-y-3" style={{ background: 'rgba(93,110,100,0.06)', border: '1px solid rgba(93,110,100,0.15)' }}>
                        <p className="text-[14px] text-gray-600">이 내용이 흥미로우셨다면, 직접 분석을 받아보세요</p>
                        <a
                            href="/analyze/numerology/"
                            onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/numerology/'; }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-[14px] transition-all hover:opacity-90 active:scale-[0.97]"
                            style={{ background: 'linear-gradient(135deg, #5D6E64, #4A5B51)', textDecoration: 'none' }}
                        >
                            ✦ 무료 수비학 분석 시작
                        </a>
                    </div>

                    <AdBanner label={`칼럼-${article.slug}-하단`} format="rectangle" />

                    {/* Related Articles */}
                    <div className="space-y-3">
                        <h3 className="text-[14px] font-bold text-gray-800">다른 칼럼 읽기</h3>
                        {otherArticles.map(other => (
                            <a
                                key={other.slug}
                                href={`/columns/${other.slug}/`}
                                onClick={(e) => { e.preventDefault(); window.location.href = `/columns/${other.slug}/`; }}
                                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white hover:shadow-sm"
                                style={{ textDecoration: 'none' }}
                            >
                                <span className="text-xl shrink-0">{other.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-gray-800 truncate">{other.title}</p>
                                    <p className="text-[11px] text-gray-400">{other.category} · {other.readTime}</p>
                                </div>
                            </a>
                        ))}
                        <a
                            href="/columns/"
                            onClick={(e) => { e.preventDefault(); window.location.href = '/columns/'; }}
                            className="block text-center text-[13px] font-bold py-2 transition-colors hover:text-gray-600"
                            style={{ color: '#5D6E64', textDecoration: 'none' }}
                        >
                            전체 칼럼 보기 →
                        </a>
                    </div>
                </div>

                <footer className="mt-16 text-center">
                    <p className="text-[10px] tracking-widest uppercase text-gray-400">© 2026 WHOAMI PROJECT</p>
                </footer>
            </article>
        </main>
    );
}
