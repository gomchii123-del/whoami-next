import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '사주팔자(四柱八字) 분석 – 만세력 기반 대운·세운 해독',
    description: '만세력 기반으로 태어난 연월일시의 사주팔자(천간·지지)를 정밀 분석합니다. 대운과 세운의 흐름을 통해 인생의 큰 변곡점과 타고난 기질을 무료로 해독하세요.',
    keywords: ['사주', '사주팔자', '만세력', '대운', '천간', '지지', '오행', '명리학', '무료사주', '사주분석', '사주풀이'],
    alternates: { canonical: '/analyze/saju/' },
    openGraph: {
        title: 'WHOAMI – 사주팔자 분석',
        description: '만세력 기반 사주팔자와 대운·세운 무료 분석 서비스.',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WHOAMI 사주팔자 분석",
    description: "만세력 기반 사주팔자(천간·지지)와 대운·세운 정밀 분석 서비스",
    provider: { "@type": "Organization", name: "WHOAMI Project" },
    serviceType: "Saju Analysis",
    areaServed: "KR",
    availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://whoami-test.com/analyze/saju/",
    },
};

export default function SajuLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {children}
        </>
    );
}
