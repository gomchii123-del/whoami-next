import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '인스턴트 성격 테스트 – 재미있는 심리 테스트 모음',
    description: '끌림 유형, 전생, 약점, 야밤 인격, 사랑 패턴 등 다양한 인스턴트 심리 테스트를 무료로 즐겨보세요. 카카오톡으로 결과를 친구와 공유하세요.',
    keywords: ['심리테스트', '성격테스트', '무료테스트', '연애테스트', '전생테스트', 'MBTI', '재미있는테스트', '카카오공유'],
    alternates: { canonical: '/snack/' },
    openGraph: {
        title: 'WHOAMI – 인스턴트 성격 테스트',
        description: '재미있는 심리·성격 테스트 모음. 결과를 카카오톡으로 공유하세요!',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function SnackLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
