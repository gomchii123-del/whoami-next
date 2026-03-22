import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '서양 점성술 네이탈 차트 – Moshier 천문력 정밀 분석',
    description: 'Moshier 천문력 기반으로 출생 시각의 태양, 달, 행성 배치를 정밀 계산합니다. Big Three(태양·달·상승궁), 12하우스, 행성 간 각도 관계를 통해 심리 구조와 인생 가능성을 무료로 분석합니다.',
    keywords: ['점성술', 'astrology', '네이탈 차트', 'natal chart', 'Big Three', '태양궁', '상승궁', '12하우스', '무료점성술', '별자리운세'],
    alternates: { canonical: '/analyze/astrology/' },
    openGraph: {
        title: 'WHOAMI – 서양 점성술 네이탈 차트',
        description: '천문력 기반 네이탈 차트 무료 분석 서비스.',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WHOAMI 서양 점성술 네이탈 차트",
    description: "Moshier 천문력 기반 네이탈 차트 분석 서비스",
    provider: { "@type": "Organization", name: "WHOAMI Project" },
    serviceType: "Astrology Natal Chart",
    areaServed: "KR",
    availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://whoami-test.com/analyze/astrology/",
    },
};

export default function AstrologyLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {children}
        </>
    );
}
