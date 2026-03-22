import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '오늘의 포춘쿠키 – 매일 새로운 행운의 메시지',
    description: '매일 달라지는 포춘쿠키 메시지로 오늘의 행운과 조언을 확인하세요. 수비학 분석과 함께 제공되는 특별한 운세 서비스입니다.',
    keywords: ['포춘쿠키', '오늘의운세', '행운의메시지', '운세', '무료운세', '오늘의행운'],
    alternates: { canonical: '/fortune/' },
    openGraph: {
        title: 'WHOAMI – 오늘의 포춘쿠키',
        description: '매일 달라지는 행운의 메시지를 확인하세요!',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function FortuneLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
