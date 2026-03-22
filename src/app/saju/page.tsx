import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '무료 사주풀이 2026 – 생년월일시로 보는 사주팔자 · 대운 · 오행 분석',
    description: '2026년 무료 사주풀이. 생년월일시를 입력하면 사주팔자(천간·지지), 대운, 오행 균형을 즉시 분석합니다. 만세력 기반 정밀 계산으로 타고난 기질과 인생의 변곡점을 해독하세요. 회원가입 없이 무료 이용 가능.',
    keywords: ['무료사주', '사주풀이', '무료사주풀이', '2026사주', '사주팔자', '만세력', '오늘의사주', '사주보기', '생년월일사주', '무료운세', '대운', '오행분석', '천간지지'],
    alternates: { canonical: '/saju/' },
    openGraph: {
        title: '무료 사주풀이 2026 – WHOAMI',
        description: '생년월일시로 보는 무료 사주팔자 · 대운 · 오행 분석',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function SajuLandingPage() {
    return (
        <main className="min-h-screen bg-[#F7F3EE]">
            <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
                {/* Hero */}
                <div className="text-center space-y-5 mb-12">
                    <Link href="/" className="inline-block text-sm text-gray-400 hover:text-[#B88A6A] transition-colors font-bold tracking-widest uppercase">
                        WHOAMI
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight">
                        무료 사주풀이 <span className="text-[#B88A6A]">2026</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
                        생년월일시를 입력하면 <strong>사주팔자</strong>, <strong>대운</strong>, <strong>오행 균형</strong>을
                        만세력 기반으로 정밀 분석합니다. 회원가입 없이 무료로 이용하세요.
                    </p>
                    <a
                        href="/analyze/saju/"
                        className="inline-flex items-center gap-2 bg-[#B88A6A] text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-[#A67A5A] transition-all active:scale-[0.98]"
                    >
                        ☯ 무료 사주 분석 시작하기
                    </a>
                </div>

                {/* SEO Content */}
                <article className="space-y-10 text-gray-600 leading-[1.9]">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">사주팔자란?</h2>
                        <p>사주팔자(四柱八字)는 태어난 <strong>년(年)·월(月)·일(日)·시(時)</strong>의 네 기둥에 천간(天干)과 지지(地支)를 배치하여 총 8글자로 한 사람의 운명 구조를 해석하는 동양 전통 명리학입니다. 2,000년 이상의 역사를 가진 이 학문은 한국에서 가장 널리 사용되는 점술 방법 중 하나입니다.</p>
                        <p>WHOAMI의 사주 분석은 <strong>만세력(萬歲曆)</strong> 기반으로 절기를 정밀 계산하여 정확한 월주(月柱)를 산출합니다. 특히 절입일(節入日) 전후에 태어난 분도 정확한 사주를 확인할 수 있습니다.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">WHOAMI 무료 사주 분석 기능</h2>
                        <ul className="space-y-3 pl-1">
                            <li className="flex gap-3"><span className="text-[#B88A6A] font-bold shrink-0">✓</span><span><strong>사주팔자 산출</strong> — 천간·지지·오행·음양을 한눈에 확인</span></li>
                            <li className="flex gap-3"><span className="text-[#B88A6A] font-bold shrink-0">✓</span><span><strong>대운(大運) 분석</strong> — 10년 단위 인생 흐름과 변곡점 예측</span></li>
                            <li className="flex gap-3"><span className="text-[#B88A6A] font-bold shrink-0">✓</span><span><strong>오행 균형 진단</strong> — 목화토금수 에너지 분포와 보완 방법</span></li>
                            <li className="flex gap-3"><span className="text-[#B88A6A] font-bold shrink-0">✓</span><span><strong>일주(日柱) 분석</strong> — 타고난 성격과 핵심 기질 해석</span></li>
                            <li className="flex gap-3"><span className="text-[#B88A6A] font-bold shrink-0">✓</span><span><strong>양력·음력 모두 지원</strong> — 윤달 여부까지 정밀 반영</span></li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">2026년 사주 운세 특징</h2>
                        <p>2026년은 <strong>병오년(丙午年)</strong>으로 천간 병(丙, 양화)과 지지 오(午, 양화)가 만나는 해입니다. 화(火) 에너지가 강한 해로, 열정과 활력이 넘치지만 과도한 충동이나 갈등에 주의가 필요합니다. 특히 금(金)이 강한 사주를 가진 분은 화극금(火克金)의 영향으로 건강과 재물에 신경 써야 합니다.</p>
                        <p>WHOAMI의 사주 분석으로 2026년 병오년이 본인의 사주와 어떤 상호작용을 하는지 무료로 확인해 보세요.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-gray-900">자주 묻는 질문</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">사주를 보려면 태어난 시간을 꼭 알아야 하나요?</h3>
                                <p className="text-sm">태어난 시간을 모르시면 시주(時柱)를 제외한 3주(年·月·日) 분석이 가능합니다. 다만 정확한 시간을 입력하시면 더 정밀한 분석 결과를 받으실 수 있습니다.</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">음력 생일인데 사주 분석이 가능한가요?</h3>
                                <p className="text-sm">네, WHOAMI는 양력과 음력 모두 지원합니다. 음력을 선택하시면 윤달 여부까지 반영하여 정확한 사주를 산출합니다.</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">대운은 어떻게 계산하나요?</h3>
                                <p className="text-sm">대운은 성별과 태어난 해의 천간(음양)에 따라 순행 또는 역행으로 진행됩니다. 출생일로부터 가장 가까운 절입일까지의 일수를 3으로 나누어 대운수(대운이 시작되는 나이)를 산출합니다.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center pt-8">
                        <a
                            href="/analyze/saju/"
                            className="inline-flex items-center gap-2 bg-[#B88A6A] text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:bg-[#A67A5A] transition-all active:scale-[0.98]"
                        >
                            ☯ 지금 무료로 사주 보기
                        </a>
                        <p className="mt-4 text-sm text-gray-400">회원가입 없이 즉시 이용 가능합니다</p>
                    </div>

                    {/* Cross-links */}
                    <nav className="pt-8 border-t border-gray-200">
                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">WHOAMI의 다른 분석 서비스</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <a href="/analyze/numerology/" className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-serif font-bold text-gray-900">✦ 수비학 분석</p>
                                <p className="text-xs text-gray-400 mt-1">생년월일 숫자로 보는 인생경로수</p>
                            </a>
                            <a href="/tarot/" className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-serif font-bold text-gray-900">🜔 무료 타로</p>
                                <p className="text-xs text-gray-400 mt-1">78장 카드의 AI 해석</p>
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
                    <Link href="/privacy/" className="text-xs text-gray-400 hover:text-[#B88A6A] transition-colors">개인정보 처리방침</Link>
                </footer>
            </div>
        </main>
    );
}
