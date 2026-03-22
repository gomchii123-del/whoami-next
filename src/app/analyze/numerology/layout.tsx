import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '수비학(Numerology) 정밀 분석 – 인생경로수·표현수·영혼충동수',
    description: '피타고라스 수비학을 기반으로 생년월일에 숨겨진 인생경로수, 표현수, 영혼충동수 등 6가지 핵심 숫자를 정밀 분석합니다. 당신의 타고난 재능과 삶의 목적을 무료로 발견하세요.',
    keywords: ['수비학', 'numerology', '인생경로수', 'life path number', '표현수', '영혼충동수', '생년월일 분석', '무료 수비학', '숫자점'],
    alternates: { canonical: '/analyze/numerology/' },
    openGraph: {
        title: 'WHOAMI – 수비학 정밀 분석',
        description: '생년월일로 인생경로수·표현수·영혼충동수를 무료 분석하세요.',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WHOAMI 수비학 분석",
    description: "피타고라스 수비학 기반 인생경로수·표현수·영혼충동수 정밀 분석 서비스",
    provider: { "@type": "Organization", name: "WHOAMI Project" },
    serviceType: "Numerology Analysis",
    areaServed: "KR",
    availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://whoami-test.com/analyze/numerology/",
    },
};

export default function NumerologyLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {children}
        </>
    );
}
