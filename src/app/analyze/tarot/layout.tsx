import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '타로 카드 리딩 – 78장의 지혜로 현재를 읽다',
    description: '메이저 아르카나 22장과 마이너 아르카나 56장으로 구성된 타로 카드의 상징 체계를 통해 현재 당신에게 필요한 메시지와 에너지를 AI로 해석합니다. 무료 타로점.',
    keywords: ['타로', 'tarot', '타로카드', '무료타로', '메이저 아르카나', '마이너 아르카나', '타로 리딩', 'AI 타로', '타로점'],
    alternates: { canonical: '/analyze/tarot/' },
    openGraph: {
        title: 'WHOAMI – 타로 카드 리딩',
        description: '78장 타로 카드의 상징과 AI 해석 무료 서비스.',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WHOAMI 타로 카드 리딩",
    description: "78장 타로 카드의 상징과 AI 해석 서비스",
    provider: { "@type": "Organization", name: "WHOAMI Project" },
    serviceType: "Tarot Reading",
    areaServed: "KR",
    availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://whoami-test.com/analyze/tarot/",
    },
};

export default function TarotLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {children}
        </>
    );
}
