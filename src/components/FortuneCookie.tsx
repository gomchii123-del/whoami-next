'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * FortuneCookie — 모달형 별 모양 카드 포츈쿠키
 * 
 * DailyFortune 안의 버튼으로 열리는 풀스크린 모달.
 * 5장의 별 카드 중 1장 선택 → 명언 출현.
 */

const FORTUNES = [
    '길을 잃었을 때, 가장 깊은 곳에서 빛이 옵니다.',
    '당신이 두려워하는 곳에 보물이 숨어 있습니다.',
    '물은 부드럽지만 바위를 깎습니다. 인내하세요.',
    '오늘 심은 씨앗이 내일의 숲이 됩니다.',
    '바람의 방향은 바꿀 수 없지만, 돛의 각도는 조절할 수 있습니다.',
    '별을 보려면 어둠을 두려워하지 마세요.',
    '가장 작은 발걸음도 멈추지 않으면 정상에 닿습니다.',
    '고요한 호수가 가장 깊은 법입니다.',
    '나비는 애벌레 시절을 후회하지 않습니다.',
    '당신의 그림자는 빛이 있다는 증거입니다.',
    '강물은 되돌아가지 않습니다. 앞으로 나아가세요.',
    '진짜 여행은 새로운 풍경이 아니라 새로운 눈을 가지는 것입니다.',
    '조용한 마음이 가장 먼 곳을 봅니다.',
    '지금 이 순간이 인생에서 가장 젊은 순간입니다.',
    '실패는 넘어진 것이 아니라 일어나지 않는 것입니다.',
    '당신이 찾는 답은 이미 당신 안에 있습니다.',
    '좋은 나무는 바람에 더 깊이 뿌리를 내립니다.',
    '꽃은 서두르지 않습니다. 그저 피어납니다.',
    '천 리 길도 한 걸음부터 시작됩니다.',
    '가장 어두운 밤도 반드시 새벽을 맞이합니다.',
    '거울은 먼저 웃지 않습니다. 당신이 먼저 웃으세요.',
    '빗방울이 모여 강을 이루듯, 작은 노력이 큰 변화를 만듭니다.',
    '오늘 하루는 누군가가 간절히 바라던 내일입니다.',
    '깊이 숨을 쉬세요. 우주가 당신 편입니다.',
    '모든 만남에는 우연이 없습니다.',
    '지혜로운 사람은 물처럼 낮은 곳으로 흐릅니다.',
    '당신의 존재 자체가 누군가에게 빛입니다.',
    '행복은 목적지가 아니라 여행 그 자체입니다.',
    '당신은 생각보다 훨씬 강합니다.',
    '내면의 목소리에 귀를 기울이세요. 그것이 나침반입니다.',
    '완벽을 기다리면 영원히 시작하지 못합니다.',
    '진정한 힘은 부드러움에서 나옵니다.',
    '당신의 이야기는 아직 쓰이고 있습니다.',
    '파도를 막을 수는 없지만 서핑하는 법은 배울 수 있습니다.',
    '산을 옮기려면 작은 돌을 나르는 것부터 시작하세요.',
    '닫힌 문 앞에서 너무 오래 서있지 마세요. 옆에 열린 창이 있습니다.',
    '비가 온 뒤의 무지개를 기억하세요.',
    '오늘의 고생이 내일의 자산이 됩니다.',
    '다른 사람의 길을 따라 걷지 마세요. 숲에 발자국을 남기세요.',
    '후회는 과거를 바꾸지 못하지만 걱정은 미래를 빼앗습니다.',
];

/* ── 별 SVG (5 pointed star) ── */
function StarCard({ selected, revealed, dimmed, onClick, index }: {
    selected: boolean; revealed: boolean; dimmed: boolean;
    onClick: () => void; index: number;
}) {
    const colors = ['#F2C94C', '#E2B0FF', '#A8E6CF', '#FFB7B2', '#87CEEB'];
    const color = colors[index];

    return (
        <button
            onClick={onClick}
            disabled={dimmed || selected}
            className="relative flex items-center justify-center"
            style={{
                width: selected ? 80 : 64,
                height: selected ? 80 : 64,
                transform: selected ? 'translateY(-10px) scale(1.1)' : dimmed ? 'scale(0.85)' : 'scale(1)',
                opacity: dimmed ? 0.25 : 1,
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: dimmed || selected ? 'default' : 'pointer',
                filter: selected && !revealed ? 'brightness(1.2)' : 'none',
            }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: selected ? `drop-shadow(0 6px 20px ${color}90)` : `drop-shadow(0 2px 6px ${color}40)` }}>
                <polygon
                    points="50,5 63,38 98,38 70,60 80,95 50,75 20,95 30,60 2,38 37,38"
                    fill={revealed ? '#fff' : color}
                    stroke={revealed ? color : 'transparent'}
                    strokeWidth={revealed ? 2 : 0}
                />
            </svg>
            <span className="absolute text-lg" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                {revealed ? '✨' : `${index + 1}`}
            </span>
        </button>
    );
}

interface FortuneCookieModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FortuneCookieModal({ isOpen, onClose }: FortuneCookieModalProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [fortune, setFortune] = useState<string | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [cardFortunes, setCardFortunes] = useState<string[]>([]);

    const shuffleCards = useCallback(() => {
        const shuffled = [...FORTUNES].sort(() => Math.random() - 0.5);
        setCardFortunes(shuffled.slice(0, 5));
        setSelectedIdx(null);
        setFortune(null);
        setIsFlipping(false);
    }, []);

    // 모달 열릴 때마다 리셋
    useEffect(() => {
        if (isOpen) {
            shuffleCards();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, shuffleCards]);

    const selectCard = (idx: number) => {
        if (isFlipping || selectedIdx !== null) return;
        setIsFlipping(true);
        setSelectedIdx(idx);
        setTimeout(() => {
            setFortune(cardFortunes[idx]);
            setIsFlipping(false);
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ animation: 'fcModalBgIn 0.3s ease-out' }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div
                className="relative w-[90vw] max-w-sm rounded-3xl overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                    animation: 'fcModalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 text-white/40 hover:text-white/80 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                    ✕
                </button>

                <div className="px-6 pt-8 pb-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <span className="text-3xl mb-2 block">🥠</span>
                        <h2 className="text-xl font-serif font-bold text-white">포츈쿠키</h2>
                        <p className="text-sm text-white/40 mt-1">
                            {fortune ? '당신의 행운의 메시지' : '별 하나를 선택하세요'}
                        </p>
                    </div>

                    {/* 5 Star Cards */}
                    <div className="flex justify-center items-end gap-2 mb-6" style={{ minHeight: 90 }}>
                        {[0, 1, 2, 3, 4].map((idx) => (
                            <StarCard
                                key={idx}
                                index={idx}
                                selected={selectedIdx === idx}
                                revealed={selectedIdx === idx && fortune !== null}
                                dimmed={selectedIdx !== null && selectedIdx !== idx}
                                onClick={() => selectCard(idx)}
                            />
                        ))}
                    </div>

                    {/* Fortune Result */}
                    {fortune && (
                        <div style={{ animation: 'fcResultIn 0.5s ease-out' }}>
                            <div
                                className="rounded-2xl p-5 mb-5"
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <p className="text-base font-serif text-white/90 leading-[1.8] text-center italic">
                                    &ldquo;{fortune}&rdquo;
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={shuffleCards}
                                    className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    다시 뽑기
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                                    style={{ background: 'rgba(242,201,76,0.2)', color: '#F2C94C', border: '1px solid rgba(242,201,76,0.3)' }}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fcModalBgIn { from{opacity:0} to{opacity:1} }
                @keyframes fcModalIn { from{opacity:0;transform:scale(0.9) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
                @keyframes fcResultIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
            `}</style>
        </div>
    );
}
