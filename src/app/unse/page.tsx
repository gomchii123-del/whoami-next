import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '무료 운세 2026 – 오늘의 운세 · 사주 · 타로 · 수비학 · 점성술 통합',
    description: '2026년 무료 운세 종합 플랫폼. 생년월일만 입력하면 오늘의 운세, 사주팔자, 타로, 수비학, 자미두수, 서양 점성술까지 6가지 분석을 한 곳에서 무료로 이용하세요. WHOAMI에서 나를 발견하세요.',
    keywords: ['무료운세', '오늘의운세', '2026운세', '운세보기', '오늘운세', '무료점술', '사주운세', '타로운세', '별자리운세', '생년월일운세', '운세사이트', '무료운세사이트'],
    alternates: { canonical: '/unse/' },
    openGraph: {
        title: '무료 운세 2026 – WHOAMI 통합 분석',
        description: '오늘의 운세부터 사주·타로·점성술까지, 무료 종합 운세 플랫폼',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function UnseLandingPage() {
    return (
        <main className="min-h-screen bg-[#F7F3EE]">
            <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
                {/* Hero */}
                <div className="text-center space-y-5 mb-12">
                    <Link href="/" className="inline-block text-sm text-gray-400 hover:text-sage transition-colors font-bold tracking-widest uppercase">
                        WHOAMI
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
                        무료 운세 <span className="text-sage">2026</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
                        생년월일 하나로 <strong>수비학, 사주, 타로, 자미두수, 점성술</strong> 5가지 분석을 모두 무료로 받아보세요.
                        동서양 점술을 한 곳에서 비교 분석하는 국내 유일 플랫폼입니다.
                    </p>
                    <a
                        href="/analyze/numerology/"
                        className="inline-flex items-center gap-2 bg-sage text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-sage/90 transition-all active:scale-[0.98]"
                    >
                        ✦ 무료 운세 시작하기
                    </a>
                </div>

                {/* Service Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <a href="/analyze/numerology/" className="group p-6 rounded-2xl bg-white border-2 border-sage/20 hover:border-sage/50 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2">✦</div>
                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">수비학 (Numerology)</h2>
                        <p className="text-sm text-gray-500">생년월일 숫자에 숨겨진 인생경로수, 표현수, 영혼충동수를 분석합니다.</p>
                    </a>
                    <a href="/saju/" className="group p-6 rounded-2xl bg-white border-2 border-[#B88A6A]/20 hover:border-[#B88A6A]/50 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2">☯</div>
                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">사주팔자</h2>
                        <p className="text-sm text-gray-500">만세력 기반 천간·지지·오행·대운으로 타고난 기질과 운명을 해독합니다.</p>
                    </a>
                    <a href="/tarot/" className="group p-6 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2">🜔</div>
                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">타로 카드 리딩</h2>
                        <p className="text-sm text-gray-500">78장 타로 카드를 직접 선택하고 AI가 맞춤 해석을 제공합니다.</p>
                    </a>
                    <a href="/analyze/ziwei/" className="group p-6 rounded-2xl bg-white border-2 border-[#6A8FAA]/20 hover:border-[#6A8FAA]/50 hover:shadow-lg transition-all">
                        <div className="text-3xl mb-2">⭑</div>
                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">자미두수</h2>
                        <p className="text-sm text-gray-500">14주성과 12궁으로 보는 동양 운명학. 재물, 관록, 부처궁 분석.</p>
                    </a>
                    <a href="/analyze/astrology/" className="group p-6 rounded-2xl bg-white border-2 border-[#A07868]/20 hover:border-[#A07868]/50 hover:shadow-lg transition-all md:col-span-2">
                        <div className="text-3xl mb-2">♈</div>
                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">서양 점성술 네이탈 차트</h2>
                        <p className="text-sm text-gray-500">천문력 기반으로 태양·달·행성의 정밀 위치를 계산하여 Big Three, 12하우스, 행성 간 각도를 분석합니다.</p>
                    </a>
                </div>

                {/* SEO Content */}
                <article className="space-y-10 text-gray-600 leading-[1.9]">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">왜 WHOAMI인가?</h2>
                        <p>기존 운세 사이트는 하나의 점술만 제공합니다. WHOAMI는 <strong>동서양 5가지 점술</strong>을 하나의 플랫폼에서 비교 분석할 수 있는 국내 유일의 통합 운세 서비스입니다. 같은 생년월일이라도 수비학, 사주, 점성술이 각각 다른 관점에서 해석하기 때문에, 여러 분석을 종합하면 더 깊고 균형 잡힌 자기 이해가 가능합니다.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">2026년 주요 운세 키워드</h2>
                        <p>2026년 병오년(丙午年)은 화(火) 에너지가 지배하는 해입니다. 열정적 도전이 결실을 맺을 수 있으나, 급한 판단은 삼가야 합니다. 서양 점성술에서는 목성이 게자리를 통과하며 가정과 감정의 안정에 좋은 시기입니다. 수비학의 범세계 연수(Universal Year)는 1로, 새로운 시작과 독립적 모험의 해입니다.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">자주 묻는 질문</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">정말 모든 분석이 무료인가요?</h3>
                                <p className="text-sm">네, WHOAMI의 모든 기본 분석은 무료입니다. 수비학, 사주, 타로, 자미두수, 점성술 5가지 모두 회원가입 없이 무료로 이용하실 수 있습니다.</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">어떤 분석부터 시작하면 좋을까요?</h3>
                                <p className="text-sm">처음이시라면 수비학 분석을 추천합니다. 생년월일만 입력하면 즉시 결과를 받으실 수 있고, 오늘의 운세와 포춘쿠키도 함께 확인할 수 있습니다.</p>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <div className="text-center pt-8">
                        <a
                            href="/analyze/numerology/"
                            className="inline-flex items-center gap-2 bg-sage text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-sage/90 transition-all active:scale-[0.98]"
                        >
                            ✦ 지금 무료로 운세 보기
                        </a>
                        <p className="mt-4 text-sm text-gray-400">생년월일만 입력하면 5가지 분석 모두 이용 가능</p>
                    </div>
                </article>

                <footer className="mt-16 text-center space-y-2">
                    <p className="text-xs text-gray-300 tracking-widest uppercase">© 2026 WHOAMI PROJECT</p>
                    <Link href="/privacy/" className="text-xs text-gray-400 hover:text-sage transition-colors">개인정보 처리방침</Link>
                </footer>
            </div>
        </main>
    );
}
