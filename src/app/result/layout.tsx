import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'WHOAMI – 분석 결과 리포트 | 당신만의 운명 해독',
    description: '수비학, 사주팔자, 타로, 자미두수, 서양 점성술 분석 결과를 확인하세요. 생년월일에 숨겨진 운명 코드를 해독한 상세 리포트를 제공합니다.',
    openGraph: {
        title: 'WHOAMI – 분석 결과 리포트',
        description: '당신만의 운명 해독 결과를 확인하세요',
        type: 'website',
        locale: 'ko_KR',
    },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
