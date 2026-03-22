import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '무료 타로 2026 – AI 타로 카드 리딩 · 오늘의 타로 · 연애운',
    description: '2026년 무료 타로 카드 리딩. 78장 타로 카드에서 직접 선택하고 AI가 즉시 해석해드립니다. 오늘의 타로, 연애운, 직업운, 재물운 리딩을 회원가입 없이 무료로 이용하세요.',
    keywords: ['무료타로', '타로점', '오늘의타로', '타로카드', 'AI타로', '연애타로', '무료타로점', '타로운세', '타로리딩', '무료운세'],
    alternates: { canonical: '/tarot/' },
    openGraph: {
        title: '무료 타로 카드 리딩 2026 – WHOAMI',
        description: 'AI가 해석하는 무료 타로 카드 리딩. 오늘의 타로를 확인하세요.',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function TarotLandingPage() {
    return (
        <main className="min-h-screen bg-[#F7F3EE]">
            <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
                {/* Hero */}
                <div className="text-center space-y-5 mb-12">
                    <Link href="/" className="inline-block text-sm text-gray-400 hover:text-purple-500 transition-colors font-bold tracking-widest uppercase">
                        WHOAMI
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
                        무료 타로 카드 리딩 <span className="text-purple-600">2026</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
                        78장의 <strong>타로 카드</strong>에서 직접 선택하고, AI가 당신만을 위한 맞춤 해석을 제공합니다.
                        <strong>연애운, 직업운, 재물운</strong> 리딩을 무료로 받아보세요.
                    </p>
                    <a
                        href="/analyze/tarot/"
                        className="inline-flex items-center gap-2 bg-purple-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-purple-700 transition-all active:scale-[0.98]"
                    >
                        🜔 무료 타로 리딩 시작하기
                    </a>
                </div>

                {/* SEO Content */}
                <article className="space-y-10 text-gray-600 leading-[1.9]">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">타로 카드란?</h2>
                        <p>타로(Tarot)는 <strong>78장의 카드</strong>로 구성된 상징 체계입니다. 15세기 이탈리아 르네상스에서 기원하여 현대까지 전 세계적으로 사용되는 직관적 분석 도구입니다. 메이저 아르카나 22장은 인생의 큰 테마를, 마이너 아르카나 56장은 일상의 구체적인 상황을 반영합니다.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">WHOAMI 타로의 특별한 점</h2>
                        <ul className="space-y-3 pl-1">
                            <li className="flex gap-3"><span className="text-purple-500 font-bold shrink-0">✓</span><span><strong>78장 완전체 카드덱</strong> — 메이저·마이너 아르카나 전체 수록</span></li>
                            <li className="flex gap-3"><span className="text-purple-500 font-bold shrink-0">✓</span><span><strong>AI 맞춤 해석</strong> — 선택한 카드와 질문을 결합한 개인화 리딩</span></li>
                            <li className="flex gap-3"><span className="text-purple-500 font-bold shrink-0">✓</span><span><strong>정방향·역방향</strong> — 카드 방향에 따른 양면적 해석 제공</span></li>
                            <li className="flex gap-3"><span className="text-purple-500 font-bold shrink-0">✓</span><span><strong>다양한 주제</strong> — 연애, 직업, 재물, 건강, 인간관계 등</span></li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">자주 묻는 질문</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">타로는 어떤 질문에 적합한가요?</h3>
                                <p className="text-sm">연애운, 직업 고민, 중요한 결정, 인간관계, 자기 이해 등 다양한 주제에 활용할 수 있습니다. 구체적인 질문일수록 더 명확한 카드 메시지를 받으실 수 있습니다.</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">타로 카드 리딩은 정말 무료인가요?</h3>
                                <p className="text-sm">네, WHOAMI의 타로 리딩은 완전히 무료입니다. 회원가입도 필요 없으며, 원하는 만큼 여러 번 리딩을 받으실 수 있습니다.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center pt-8">
                        <a
                            href="/analyze/tarot/"
                            className="inline-flex items-center gap-2 bg-purple-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-purple-700 transition-all active:scale-[0.98]"
                        >
                            🜔 지금 무료로 타로 보기
                        </a>
                        <p className="mt-4 text-sm text-gray-400">회원가입 없이 즉시 이용 가능합니다</p>
                    </div>

                    {/* Cross-links */}
                    <nav className="pt-8 border-t border-gray-200">
                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">WHOAMI의 다른 분석 서비스</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <a href="/analyze/numerology/" className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-serif font-bold text-gray-900">✦ 수비학 분석</p>
                                <p className="text-xs text-gray-400 mt-1">생년월일 숫자의 비밀</p>
                            </a>
                            <a href="/saju/" className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-serif font-bold text-gray-900">☯ 무료 사주</p>
                                <p className="text-xs text-gray-400 mt-1">만세력 기반 사주팔자</p>
                            </a>
                            <a href="/analyze/ziwei/" className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-serif font-bold text-gray-900">⭑ 자미두수</p>
                                <p className="text-xs text-gray-400 mt-1">14주성 동양 운명학</p>
                            </a>
                            <a href="/analyze/astrology/" className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-serif font-bold text-gray-900">♈ 서양 점성술</p>
                                <p className="text-xs text-gray-400 mt-1">네이탈 차트 분석</p>
                            </a>
                        </div>
                    </nav>
                </article>

                <footer className="mt-16 text-center space-y-2">
                    <p className="text-xs text-gray-300 tracking-widest uppercase">© 2026 WHOAMI PROJECT</p>
                    <Link href="/privacy/" className="text-xs text-gray-400 hover:text-purple-500 transition-colors">개인정보 처리방침</Link>
                </footer>
            </div>
        </main>
    );
}
