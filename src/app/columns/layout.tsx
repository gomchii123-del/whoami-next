import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '운세 칼럼 · 수비학·사주·타로 심층 읽을거리 | WHOAMI',
    description: '수비학 생명경로수, 사주팔자, 타로 카드, 바이오리듬 등 운명학 전반에 걸친 심층 칼럼과 가이드를 무료로 읽어보세요.',
    keywords: ['운세칼럼', '수비학', '사주', '타로', '바이오리듬', '성격테스트', '심리학', '명리학', '운명'],
    alternates: { canonical: '/columns/' },
    openGraph: {
        title: 'WHOAMI 운세 칼럼 — 수비학·사주·타로 심층 읽을거리',
        description: '운명학 전반에 걸친 고품질 칼럼과 가이드를 무료로 읽어보세요.',
        type: 'website',
        locale: 'ko_KR',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export default function ColumnsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
