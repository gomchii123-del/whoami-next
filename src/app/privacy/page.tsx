import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'WHOAMI – 개인정보 처리방침',
    description: 'WHOAMI 서비스의 개인정보 처리방침입니다.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-bg-warm flex flex-col items-center p-5 md:p-16">
            <div className="w-full max-w-2xl py-8 md:py-14 space-y-8">
                {/* Back Nav */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-sage transition-colors font-sans text-sm font-semibold"
                >
                    ← 홈으로 돌아가기
                </Link>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-serif text-foreground">개인정보 처리방침</h1>
                    <p className="text-sm text-gray-400 font-sans">최근 수정일: 2026년 3월 10일</p>
                </div>

                <article className="prose prose-gray max-w-none space-y-8 font-sans text-gray-600 leading-relaxed">
                    <section className="space-y-3">
                        <h2 className="text-xl font-serif text-foreground">1. 수집하는 개인정보</h2>
                        <p>
                            본 서비스(WHOAMI)는 최소한의 정보만 수집합니다. 수비학 분석 서비스를 위해 사용자가 자발적으로 입력하는
                            <strong> 이름</strong>과 <strong>생년월일</strong>을 수집하며, 이는 분석 결과 생성 목적으로만 사용됩니다.
                        </p>
                        <p>
                            입력된 정보는 사용자의 브라우저 세션 스토리지에만 임시 저장되며,
                            브라우저를 닫으면 자동으로 삭제됩니다. 서버에 개인정보를 영구 저장하지 않습니다.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-serif text-foreground">2. 쿠키 및 광고</h2>
                        <p>
                            본 사이트는 Google AdSense를 통해 광고를 게재합니다.
                            Google은 사용자의 관심사에 기반한 광고를 표시하기 위해 쿠키를 사용할 수 있습니다.
                        </p>
                        <p>
                            Google의 광고 쿠키 사용에 대한 자세한 내용은{' '}
                            <a
                                href="https://policies.google.com/technologies/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sage underline hover:text-sage/80"
                            >
                                Google 광고 정책
                            </a>
                            을 참조하세요.
                            사용자는 Google의{' '}
                            <a
                                href="https://adssettings.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sage underline hover:text-sage/80"
                            >
                                광고 설정
                            </a>
                            에서 맞춤 광고를 비활성화할 수 있습니다.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-serif text-foreground">3. 제3자 서비스</h2>
                        <p>본 사이트는 다음과 같은 제3자 서비스를 이용합니다:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Google AdSense (광고 게재)</li>
                            <li>Google Analytics (그 외 분석 도구 사용 시 해당)</li>
                            <li>Firebase Hosting (웹 호스팅)</li>
                        </ul>
                        <p>
                            이들 서비스는 각각의 개인정보 처리방침에 따라 데이터를 수집·처리할 수 있습니다.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-serif text-foreground">4. 이용자의 권리</h2>
                        <p>
                            사용자는 언제든지 브라우저의 쿠키를 삭제하거나 쿠키 사용을 거부할 수 있습니다.
                            다만, 쿠키를 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-serif text-foreground">5. 문의</h2>
                        <p>
                            개인정보 처리방침에 대한 문의사항은 서비스 운영자에게 연락해 주시기 바랍니다.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-serif text-foreground">6. 방침 변경</h2>
                        <p>
                            본 개인정보 처리방침은 관련 법률 및 서비스 변경에 따라 수정될 수 있으며,
                            변경 시 본 페이지를 통해 공지합니다.
                        </p>
                    </section>
                </article>
            </div>

            <footer className="py-8 text-center space-y-2">
                <p className="opacity-30 text-xs tracking-widest uppercase font-sans text-foreground">
                    © 2026 WHOAMI PROJECT · ARCHE ENGINE V3
                </p>
            </footer>
        </main>
    );
}
