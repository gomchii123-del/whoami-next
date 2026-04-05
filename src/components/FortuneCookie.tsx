'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * FortuneCookie — 모달형 별 모양 카드 포츈쿠키
 * 
 * DailyFortune 안의 버튼으로 열리는 풀스크린 모달.
 * 5장의 별 카드 중 1장 선택 → 명언 출현.
 */

export const FORTUNES = [
    '오늘 해야 할 통화를 내일로 미루지 마세요. 중요한 기회가 날아갈 수 있습니다.',
    '자신을 탓하는 시간을 줄이고, 해결책을 찾는 데 에너지를 쓰세요.',
    '타인의 평가에 휘둘리지 마세요. 그들은 당신의 삶을 책임지지 않습니다.',
    '가까운 사람일수록 감사합니다, 미안합니다를 명확히 표현하세요.',
    '당장 책상 위를 정리하세요. 머릿속의 복잡함도 함께 사라집니다.',
    '거절해야 할 때 미안해하지 마세요. 당신의 시간을 갈아먹는 가장 큰 원인입니다.',
    '수면 시간을 줄이지 마세요. 내일의 생산성을 당겨 쓰는 빚일 뿐입니다.',
    '기록하지 않는 아이디어는 사라집니다. 지금 당장 메모장에 적어두세요.',
    '인간관계의 유통기한을 인정하세요. 자연스럽게 멀어진 사람을 억지로 잡지 마세요.',
    '불평만 하는 사람은 곁에 두지 마세요. 우울도 전염됩니다.',
    '잘 모르는 일에는 "모르겠습니다"라고 말하세요. 아는 척하다가 더 큰 위기가 옵니다.',
    '감당할 수 없는 약속은 처음부터 하지 않는 것이 신뢰를 지키는 법입니다.',
    '다른 사람의 험담에 맞장구치지 마세요. 결국 당신 파멸의 부메랑이 됩니다.',
    '당신의 가치를 흥정하는 사람과는 비즈니스를 하지 마세요.',
    '결정 장애가 온다면, 동전을 던지세요. 결국 마음이 기우는 쪽이 정답입니다.',
    '휴식은 죄악이 아닙니다. 달리기 위해선 반드시 멈춰서 정비해야 합니다.',
    '이유 없이 친절한 사람은 없습니다. 그 이면의 의도를 늘 점검하세요.',
    '당신의 비밀은 누구에게도 말하지 마세요. 입 밖을 나간 순간 더 이상 비밀이 아닙니다.',
    '사소한 약속을 어기는 사람과는 큰 일을 도모하지 마세요.',
    '아무리 화가 나도 이메일이나 메시지 전송 버튼은 10분 뒤에 누르세요.',
    '과거의 실패를 오늘까지 끌고 오지 마세요. 이미 지불된 비용입니다.',
    '몸의 신호를 무시하지 마세요. 건강을 잃으면 모든 것을 다 잃습니다.',
    '자신만의 독서 시간을 하루 30분이라도 반드시 사수하세요.',
    '기대가 크면 실망도 큽니다. 타인에 대한 기대를 현실적으로 낮추세요.',
    '가장 하기 싫은 일부터 먼저 처리하세요. 남은 하루가 가벼워집니다.',
    '비교는 불행의 시작입니다. 어제의 나와만 비교하세요.',
    '변명하지 마세요. 잘못했다면 깔끔하게 인정하고 사과하는 것이 이기는 길입니다.',
    '운동을 미루지 마세요. 체력이 있어야 멘탈도 버틸 수 있습니다.',
    '돈을 빌려줄 때는 받을 생각을 아예 버리거나, 애초에 빌려주지 마세요.',
    '한 번에 한 가지 일에만 집중하세요. 멀티태스킹은 환상입니다.',
    '이유 없는 짜증이 늘었다면 즉시 혼자만의 시간을 가지세요.',
    '인맥을 넓히기보다 있는 인맥의 깊이를 다지는 데 집중하세요.',
    '어떤 결정을 내리든 비판하는 사람은 있습니다. 당신의 직관을 따르세요.',
    '세상에 당연한 것은 없습니다. 작은 호의에도 반드시 감사를 표하세요.',
    '가장 좋은 복수는 보란 듯이 당신의 삶을 잘 살아내는 것입니다.',
    '부정적인 감정이 들 때는 일단 산책을 하세요. 뇌에 산소를 공급하면 시야가 달라집니다.',
    '지금 직장이 전부라고 생각하지 마세요. 플랜 B는 언제나 준비되어 있어야 합니다.',
    '당신의 생각보다 남들은 당신에게 큰 관심이 없습니다. 자유롭게 행동하세요.',
    '투자할 때는 자신이 완벽하게 이해한 것에만 돈을 넣으세요.',
    '모든 사람에게 착한 사람이 되려고 하지 마세요. 만만한 사람이 될 뿐입니다.',
    '말수를 줄이세요. 많이 들을수록 더 많이 배울 수 있습니다.',
    '지나친 완벽주의는 시작조차 못하게 만듭니다. 일단 시작하고 수정하세요.',
    '당신의 한계를 스스로 규정하지 마세요. 해보기 전까지는 모릅니다.',
    '아플 때 주변에 아무도 없다면 당신의 삶을 돌아볼 때입니다.',
    '질투가 난다면 인정하고, 그것을 성장의 원동력으로 삼으세요.',
    '어려운 일일수록 잘게 쪼개서 가장 쉬운 첫 단계부터 시작하세요.',
    'SNS를 보는 시간을 절반으로 줄이고 현실의 삶에 집중하세요.',
    '무의미한 논쟁은 피하세요. 이겨도 감정만 상할 뿐 얻는 것이 없습니다.',
    '규칙적인 식사가 기분을 결정합니다. 끼니를 거르지 마세요.',
    '물건을 살 때는 가격이 아니라 가치를 보세요.',
    '무언가에 너무 집착하고 있다면, 의도적으로 시선을 돌려보세요.',
    '말은 한 번 뱉으면 주워 담을 수 없으니 항상 신중하게 입을 떼세요.',
    '모든 일에는 타이밍이 있습니다. 서두르지도, 너무 늦지도 않게 행동하세요.',
    '자신에게 너무 엄격하지 마세요. 가끔은 실수해도 괜찮습니다.',
    '새로운 것을 배우는 데 나이는 전혀 중요하지 않습니다.',
    '인생의 큰 결정은 절대 늦은 밤에 내리지 말고 다음날 아침으로 미루세요.',
    '가족이라도 지켜야 할 선은 있습니다. 상처가 된다면 거리를 두세요.',
    '지금 하고 있는 걱정의 90%는 결코 일어나지 않습니다.',
    '자신의 장점을 깎아내리지 마세요. 겸손과 자기 비하는 다릅니다.',
    '하루에 한 번은 온전히 폰을 끄고 당신 자신과 머무는 시간을 가지세요.',
    '실패를 두려워하지 마세요. 실패하지 않는 유일한 방법은 아무것도 하지 않는 것입니다.',
    '당신의 목표를 함부로 남에게 말하고 다니지 마세요. 묵묵히 실천으로 보여주세요.',
    '관계에서 불편함을 느낀다면 직감은 대체로 맞습니다. 경계를 세우세요.',
    '무엇을 해야 할지 모를 때는 기분 전환을 위한 정리 정돈부터 시작하세요.',
    '모두가 예스라고 할 때, 당신만 아니라고 생각한다면 입을 닫거나 자리를 떠나세요.',
    '화가 풀릴 때까지 기다려줄 사람은 없습니다. 스스로 감정을 다스리세요.',
    '과거의 영광에 취해 있지 마세요. 중요한 것은 지금 여기서 무엇을 하고 있는가입니다.',
    '지루함은 창의성의 원천입니다. 멍 때리는 시간을 두려워하지 마세요.',
    '거창한 목표보다 소소한 성취감을 자주 맛보는 것이 지속성에 좋습니다.',
    '약점을 고치려 애쓰기보다 당신의 강점을 극대화하는 데 시간을 쏟으세요.',
    '주변 환경이 당신을 만듭니다. 성장하고 싶다면 만나는 사람부터 바꾸세요.',
    '아무리 좋은 조언도 맹신하지 마세요. 당신의 상황에 맞게 적용하세요.',
    '시간은 누구에게나 공평하지만, 어떻게 쓰느냐에 따라 질은 천지차이가 됩니다.',
    '타인의 약점을 함부로 건드리지 마세요. 그 원한은 평생 갈 수 있습니다.',
    '주식을 사놓고 매일 쳐다본다면 그것은 투자가 아니라 도박입니다.',
    '혼자 일하는 것이 편하더라도, 중요한 정보는 항상 남들과의 대화에서 나옵니다.',
    '매일 밤 다음 날 해야 할 가장 중요한 일 한 가지를 미리 적어두세요.',
    '감정적으로 무너질 때 절대 중요한 것을 결정하지 마세요.',
    '성공은 뛰어난 능력보다 꾸준한 반복의 결과일 때가 훨씬 많습니다.',
    '정말 하기 싫다면 이유가 있는 것입니다. 내키지 않는 일은 억지로 떠맡지 마세요.',
    '이별 후에는 혼자 있는 시간을 충분히 견뎌내야 합니다. 누군가로 채우려 하지 마세요.',
    '작은 거짓말은 더 큰 거짓말을 낳습니다. 솔직함이 가장 쉬운 방어책입니다.',
    '마음에 들지 않는 환경이라면 불평만 하지 말고 떠나거나, 환경을 바꾸기 위해 움직이세요.',
    '자랑은 시기심을 부릅니다. 가진 것이 많을수록 고개를 숙이세요.',
    '문제가 생기면 누구의 탓인지 따지기보다 즉각적인 해결에 집중하세요.',
    '인내심이란 가만히 참는 것이 아니라, 과정을 즐기며 견디는 태도를 말합니다.',
    '너무 먼 미래의 일로 지금의 일상을 희생하지 마세요.',
    '다른 사람이 당신을 어떻게 생각하는지 걱정할 시간에 당신이 좋아하는 것을 하세요.',
    '아무리 작아도 당신만의 성취를 스스로 칭찬해 주세요.',
    '가끔씩 익숙한 길 대신 새로운 길로 집에 가보세요. 뇌를 깨우는 방법입니다.',
    '한 번 깨진 신뢰는 회복하기 힘듭니다. 신용은 목숨처럼 생각하세요.',
    '어차피 일어날 일이라면 피하지 말고 정면으로 부딪히는 것이 가장 빠릅니다.',
    '타인에게 기대기보다 스스로 일어나는 법을 배우세요. 결국 혼자 남습니다.',
    '무리해서 어울리는 자리는 당신의 피로만 가중시킵니다. 적당히 빠지세요.',
    '의욕이 나지 않을 때는 일단 5분만 해보세요. 시작하면 뇌가 따라옵니다.',
    '남과 비교하는 습관은 지옥으로 가는 지름길입니다.',
    '자신이 한 말을 행동으로 지킬 때 비로소 타인의 존중을 받을 수 있습니다.',
    '어려움을 겪고 있다면 먼저 손을 내미세요. 도움을 요청하는 것도 용기입니다.',
    '항상 당신이 가장 중요합니다. 자신을 사랑하는 법을 제일 먼저 배우세요.',
    '모든 사람의 기대를 만족시킬 수는 없습니다. 당신이 먼저입니다.',
    '너무 편안한 환경에 있다면, 그것이 성장을 막는 감옥일 수 있습니다. 경계하세요.',
    '남 험담을 당신에게 하는 사람은 다른 곳에서 당신 험담을 합니다. 깊게 어울리지 마세요.',
    '물건 다이어트를 하세요. 주변이 깨끗해야 좋은 생각과 에너지가 들어옵니다.',
    '직장에서의 성과는 조용히 쌓고 확실히 어필해야 인정받습니다.',
    '돈을 벌고 싶다면 먼저 돈에 대한 죄책감부터 버리세요.',
    '정기적으로 연락처를 정리하세요. 인적 네트워크도 가지치기가 필요합니다.',
    '슬픔은 나눈다고 반이 되지 않습니다. 오직 혼자 온전히 소화해야 할 몫이 있습니다.',
    '남에게 조언을 구하더라도 최종 선택의 책임은 온전히 당신에게 있습니다.',
    '너무 많은 정보는 직관을 방해합니다. 가끔은 검색창을 닫고 혼자 생각하세요.',
    '타인의 성공을 시기하기보다 그 과정에서 배울 점을 한 가지라도 훔쳐오세요.',
    '상처받았다는 사실을 인정하세요. 거기서부터 진짜 상처의 회복이 시작됩니다.',
    '매일 아침 눈을 떴을 때, 오늘 할 일 중 가장 기대되는 한 가지를 떠올려보세요.',
    '이해관계가 없는 사람에게 당신이 베푸는 태도가 당신의 진짜 인성입니다.',
    '마음에 없는 말로 사람을 위로하지 마세요. 때로는 가만히 있어주는 것이 큰 힘이 됩니다.',
    '시간 관리를 못하는 사람은 다른 어떤 것도 관리할 수 없습니다.',
    '작은 돈을 아끼려다 큰 사람을 잃지 마세요. 사람에게는 아낌없이 쓰세요.',
    '위기는 기회라는 말은 준비된 사람에게만 해당됩니다. 평소에 무기를 다듬어두세요.',
    '화려하게 시작하는 것보다 초라하게 시작해도 끝을 보는 것이 천 배 낫습니다.',
    '자신감이 없다면 그런 척이라도 하세요. 뇌는 어느 순간 그것을 진짜로 믿습니다.',
    '운명은 정해져 있지 않습니다. 어제의 선택들이 모여 오늘의 운명을 만들었을 뿐입니다.'
];

/* ── 쿠키 카드 (Cookie Card) ── */
function CookieCard({ selected, revealed, dimmed, onClick, index }: {
    selected: boolean; revealed: boolean; dimmed: boolean;
    onClick: () => void; index: number;
}) {
    const colors = ['#F2C94C', '#E2B0FF', '#A8E6CF', '#FFB7B2', '#87CEEB'];
    const color = colors[index];

    return (
        <button
            onClick={onClick}
            disabled={dimmed || selected}
            className="relative flex items-center justify-center transition-all duration-500 ease-out"
            style={{
                width: selected ? 80 : 64,
                height: selected ? 80 : 64,
                transform: selected ? 'translateY(-10px) scale(1.1)' : dimmed ? 'scale(0.85)' : 'scale(1)',
                opacity: dimmed ? 0.3 : 1,
                cursor: dimmed || selected ? 'default' : 'pointer',
                filter: selected && !revealed ? 'brightness(1.2)' : 'none',
            }}
        >
            <div 
               className="w-full h-full rounded-2xl flex flex-col items-center justify-center"
               style={{ 
                   background: revealed ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${color}20, ${color}05)`,
                   border: `1px solid ${revealed ? '#fff' : color}40`,
                   boxShadow: selected ? `0 8px 25px ${color}50` : `0 4px 12px ${color}15`,
                   transition: 'all 0.5s'
               }}
            >
                <span style={{ 
                    fontSize: selected ? 38 : 30, 
                    filter: revealed ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))',
                    transform: revealed ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s'
                }}>
                    {revealed ? '📜' : '🥠'}
                </span>
                {!revealed && (
                    <span className="absolute text-[10px] font-bold text-white/50 bottom-1.5 font-sans">
                        {index + 1}
                    </span>
                )}
            </div>
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
                            {fortune ? '당신의 메세지가 도착했습니다' : '쿠키 하나를 선택하세요'}
                        </p>
                    </div>

                    {/* 5 Cookie Cards */}
                    <div className="flex justify-center items-end gap-2 mb-6" style={{ minHeight: 90 }}>
                        {[0, 1, 2, 3, 4].map((idx) => (
                            <CookieCard
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
