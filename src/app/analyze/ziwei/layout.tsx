import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '자미두수(紫微斗數) 명반 분석 – 14주성 운명학',
    description: '송나라 진단(陳摶)으로부터 전해진 자미두수의 14주성과 12궁 체계를 통해 당신의 선천적 기질, 재물운, 관록, 부처궁 등 삶의 12가지 영역을 무료로 분석합니다.',
    keywords: ['자미두수', '紫微斗數', '명반', '14주성', '12궁', '자미성', '천부성', '동양점성술', '무료 자미두수'],
    alternates: { canonical: '/analyze/ziwei/' },
    openGraph: {
        title: 'WHOAMI – 자미두수 명반 분석',
        description: '14주성 배치로 보는 동양 운명학 무료 서비스.',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WHOAMI 자미두수 명반 분석",
    description: "14주성과 12궁 체계로 보는 동양 운명학 분석 서비스",
    provider: { "@type": "Organization", name: "WHOAMI Project" },
    serviceType: "Zi Wei Dou Shu Analysis",
    areaServed: "KR",
    availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://whoami-test.com/analyze/ziwei/",
    },
};

export default function ZiWeiLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {children}
        </>
    );
}
