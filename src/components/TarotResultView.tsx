'use client';

import React, { useState } from 'react';
import { TarotCard } from '@/lib/tarot-engine';
import { Copy, Check, Sparkles, MessageSquare } from 'lucide-react';

interface TarotResultViewProps {
    data: {
        question: string;
        cards: TarotCard[];
        timestamp: string;
    };
}

export default function TarotResultView({ data }: TarotResultViewProps) {
    const { question, cards } = data;
    const [copied, setCopied] = useState(false);

    const handleCopyPrompt = () => {
        const prompt = `
[타로 카드 7단계 정밀 분석 및 인생 컨설팅 요청]

아래 제공된 질문과 선택된 3장의 타로 카드 정보를 바탕으로 전문적인 마스터의 관점에서 분석해 주십시오. 당신은 단순한 예측을 넘어, 카드의 상징을 통해 현재의 흐름을 짚어주고 지혜로운 대안을 제시하는 '인생의 등대' 역할을 해야 합니다.

---
1. 내담자의 질문
- 질문 내용: "${question}"

2. 선택된 카드 (3카드 스프레드)
- 카드 1: ${cards[0].name} (${cards[0].meaning})
- 카드 2: ${cards[1].name} (${cards[1].meaning})
- 카드 3: ${cards[2].name} (${cards[2].meaning})

---
3. 분석 알고리즘 (7단계 프로세스)
[1단계: 상징의 깊은 통찰] 각 카드의 핵심 상징물이 현재 질문의 맥락에서 어떤 의미를 갖는지 풀이하십시오.
[2단계: 심리적 거울] 카드가 투영하는 내담자의 현재 무의식 상태와 감정적 역동을 분석하십시오.
[3단계: 서사의 흐름] 과거-현재-미래(또는 상황-장애물-조언)로 이어지는 에너지의 인과관계를 스토리텔링으로 구성하십시오.
[4단계: 현실적 발현] 이 기운이 실제 연애, 직업, 금전 등의 현실 영역에서 어떻게 나타날지 구체적으로 짚어주십시오.
[5단계: 등대(Lighthouse)의 경고와 조망] 자칫 놓칠 수 있는 위험 요소나, 반드시 주목해야 할 기회의 지점을 제시하십시오.
[6단계: 구체적 행동 대안(Action Plan)] 지금 바로 실천할 수 있는 현실적인 해결책과 태도의 변화를 제안하십시오.
[7단계: 행운의 동시성(Synchronicity)] 내담자의 기운을 긍정적으로 전환할 수 있는 소소한 팁(행운의 색, 행동 등)을 제언하십시오.

4. 기본 원칙
- 따뜻하고 공감하는 어조를 유지하되, 냉철하고 명확한 통찰을 제공하십시오.
- 운명은 고정된 것이 아니라 바다와 같습니다. 타로는 폭풍을 경고하고 항구를 가리키는 '등대'일 뿐, 키를 쥔 것은 내담자 본인임을 강조하십시오.
- 부정적인 카드라도 '성장을 위한 열쇠'로 재해석하여 희망적인 대안을 제시하십시오.
- 누구의 기법인지 언급하지 말고 순수하게 카드의 상징과 전문적인 해석 논리만으로 접근하십시오.
---
`.trim();

        navigator.clipboard.writeText(prompt).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy prompt:', err);
            alert('프롬프트 복사에 실패했습니다. 브라우저의 클립보드 권한이나 보안 설정을 확인해 주세요.');
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-bold tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Tarot Reading
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                    당신을 위한 <span className="italic text-purple-500">신비로운 계시</span>
                </h1>
                <div className="max-w-md mx-auto p-4 bg-white/50 border border-purple-50 rounded-2xl">
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">내담자의 질문</p>
                    <p className="text-gray-700 font-serif italic">"{question}"</p>
                </div>
            </div>

            {/* Cards Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="group bg-white rounded-3xl p-6 shadow-xl border border-white transition-all hover:shadow-2xl hover:-translate-y-2">
                        <div className="aspect-[2/3] w-full bg-purple-50 rounded-2xl mb-5 flex flex-col items-center justify-center border-2 border-purple-100 group-hover:border-purple-300 transition-colors overflow-hidden">
                            <div className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-500">🜔</div>
                            <div className="mt-4 text-[10px] font-bold tracking-[0.2em] text-purple-300 uppercase">Spread {idx + 1}</div>
                        </div>
                        <div className="space-y-3 text-center">
                            <h3 className="text-xl font-serif font-bold text-gray-800">{card.name}</h3>
                            <div className="bg-purple-50/50 py-2 px-4 rounded-xl text-xs font-bold text-purple-500 tracking-wider">
                                {card.type === 'major' ? 'MAJOR ARCANA' : `${card.suit?.toUpperCase()} ${card.rank?.toUpperCase()}`}
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed font-sans">{card.meaning}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Prompt Section */}
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden group">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-50" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase border border-white/10">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Premium AI Analysis
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                            AI 타로 마스터에게<br />
                            <span className="text-purple-300">심층 분석</span>을 요청하세요
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                            선택된 3장의 카드 상징과 당신의 질문을 결합하여<br />
                            전문적이고 따뜻한 인생 조언을 생성하는 프롬프트를 복사합니다.
                        </p>

                        <button
                            onClick={handleCopyPrompt}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-purple-50 active:scale-95 transition-all shadow-2xl shadow-white/10"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-6 h-6 text-green-500" />
                                    분석 프롬프트 복사 완료!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                                    AI 분석 프롬프트 복사하기
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
                    복사된 프롬프트를 ChatGPT나 Claude 같은 AI 모델에 붙여넣으면<br />
                    당신만을 위한 고밀도 타로 통변을 받아보실 수 있습니다.
                </p>
            </div>
        </div>
    );
}
