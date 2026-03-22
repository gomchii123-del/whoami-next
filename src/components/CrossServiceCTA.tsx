'use client';

import Link from 'next/link';

interface CrossServiceCTAProps {
    currentService: string; // 'numerology' | 'saju' | 'tarot' | 'ziwei' | 'astrology'
}

const ALL_SERVICES = [
    {
        id: 'numerology',
        href: '/analyze/numerology/',
        emoji: '✦',
        title: '수비학',
        subtitle: '생년월일 숫자에 담긴 운명 해독',
        accentColor: '#88A096',
    },
    {
        id: 'saju',
        href: '/analyze/saju/',
        emoji: '☯',
        title: '사주',
        subtitle: '천간·지지로 읽는 타고난 기질',
        accentColor: '#B88A6A',
    },
    {
        id: 'tarot',
        href: '/analyze/tarot/',
        emoji: '🜔',
        title: '타로',
        subtitle: '지금 이 순간의 메시지',
        accentColor: '#7B6EA0',
    },
    {
        id: 'ziwei',
        href: '/analyze/ziwei/',
        emoji: '⭑',
        title: '자미두수',
        subtitle: '12궁 명반으로 보는 인생 지도',
        accentColor: '#6A8FAA',
    },
    {
        id: 'astrology',
        href: '/analyze/astrology/',
        emoji: '♈',
        title: '서양 점성술',
        subtitle: '천체 배치로 읽는 성격과 운명',
        accentColor: '#A07868',
    },
];

export default function CrossServiceCTA({ currentService }: CrossServiceCTAProps) {
    const others = ALL_SERVICES.filter(s => s.id !== currentService);

    return (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-lg border border-gray-100 space-y-5">
            <div className="text-center space-y-1.5">
                <h3 className="font-serif font-semibold text-gray-800 text-base">
                    🔮 다른 방법으로도 나를 알아보세요
                </h3>
                <p className="text-xs text-gray-400">
                    여러 분석을 비교하면 더 깊은 자기이해가 가능해요
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {others.map((service) => (
                    <Link
                        key={service.id}
                        href={service.href}
                        className="group flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: `${service.accentColor}08`,
                            border: `1px solid ${service.accentColor}20`,
                        }}
                    >
                        <span className="text-2xl">{service.emoji}</span>
                        <div className="text-center">
                            <p className="font-bold text-sm" style={{ color: service.accentColor }}>
                                {service.title}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                                {service.subtitle}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
