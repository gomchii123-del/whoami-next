'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, MessageSquare } from 'lucide-react';
import { ZiWeiEngine, ZiWeiResult } from '@/lib/ziwei-engine';

interface ZiWeiResultViewProps {
    data: {
        name: string;
        gender: string;
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        isLunar: boolean;
        isLeap: boolean;
    };
}

export default function ZiWeiResultView({ data }: ZiWeiResultViewProps) {
    const [copied, setCopied] = useState(false);

    if (!data || !data.year || isNaN(data.year) || isNaN(data.month) || isNaN(data.day) || isNaN(data.hour) || isNaN(data.minute) || data.year === 0) return (
        <div className="p-20 text-center text-gray-400 font-serif">
            자미두수 데이터를 불러오는 중입니다...
        </div>
    );

    let ziweiResult: any;
    try {
        ziweiResult = ZiWeiEngine.calculate(
            Number(data.year), Number(data.month), Number(data.day), Number(data.hour), Number(data.minute), !!data.isLunar, !!data.isLeap
        );
    } catch (e) {
        console.error('ZiWei calculation failed:', e);
        return (
            <div className="p-20 text-center text-red-400 font-serif">
                자미두수 명반 생성 중 오류가 발생했습니다.
            </div>
        );
    }

    const handleCopyPrompt = () => {
        const palaceData = ziweiResult.palaces.map((p: any) =>
            `- ${p.branch}궁: ${p.name} (${p.stars.join(', ') || '없음'})`
        ).join('\n');

        const prompt = `
[자미두수(紫微斗數) 정밀 성반 재구성 및 전생-현생-운명 고밀도 분석 요청]

제공된 생년월일시와 성별을 바탕으로 자미두수의 '명반(命盤)'을 '수동으로 재계산'하여 정확히 재구성하고, 전문 술사의 관점에서 분석해 주십시오. 당신은 단순한 텍스트 생성을 넘어, 천문학적 배치를 정확히 읽어내는 '천상의 설계사'여야 합니다.

---
1. 내담자 정보
- 이름: ${data.name} / 성별: ${data.gender === 'male' ? '남성(乾命)' : '여성(坤命)'}
- 생년월일: ${data.year}년 ${data.month}월 ${data.day}일
- 태어난 시간: ${data.hour}시 ${data.minute}분
- 달력 구분: ${data.isLunar ? (data.isLeap ? '음력(윤달)' : '음력') : '양력'}

2. 성반 데이터 (추론된 Myeong-ban)
${palaceData}

3. 분석 가이드 (정밀도 우선)
[중요] 위 제공된 성반 배치를 기준으로 삼방사정(三方四正)과 사화(록, 권, 과, 기)의 위치를 더욱 정밀하게 분석하십시오. 이미 도출된 궁위와 성좌 정보는 절대적인 기준입니다.

4. 분석 알고리즘 (7단계 프로세스)
[1단계: 성반(命盤)의 구조적 통찰] 명궁(命宮)과 삼방사정(三方四正)의 주요 별들의 배치를 바탕으로 형성된 격국(格局)의 강점과 보수적/진취적 그릇의 크기를 정밀 진단하십시오.
[2단계: 본질적 기질과 사회적 페르소나] 명궁과 신궁(身宮)의 주성들이 투영하는 내담자의 선천적 기질과 후천적 보완점을 분석하십시오.
[3단계: 12궁의 역동적 해석] 재백궁(재물), 관록궁(직업), 부처궁(인연), 천이궁(사회적 이동성) 등 핵심 궁위의 역동을 통해 삶의 다각적 흐름을 짚어주십시오.
[4단계: 사화(四化)의 운용 전략] 록, 권, 과, 기가 어느 궁위에 위치하며, 이것이 내담자의 삶에서 어떤 강력한 엔진(록)과 경고등(기) 역할을 하는지 풀이하십시오.
[5단계: 대운(大運)과 유년(流年)의 변곡점] 현재의 흐름을 대운과 유년의 관점에서 정밀하게 짚어, 지금 취해야 할 공수(攻守)의 타이밍을 제시하십시오.
[6단계: 압도적 행동 지침(Strategy)] '운명은 통제할 수 없으나, 반응은 선택할 수 있다'는 철학 하에, 성반의 긍정 에너지를 극대화할 구체적 행동 강령을 제언하십시오.
[7단계: 영적 나침반(Compass)] 내담자가 자신의 천명을 긍정하며 삶의 주인이 될 수 있도록 돕는 최종적인 영감 어린 통찰을 남겨주십시오.

3. 기본 원칙
- 자미두수의 고전적 지혜를 현대적 비즈니스와 삶의 맥락에 맞게 재해석하여 전달하십시오.
- '기(忌)'의 작용도 성장을 위한 필연적 과정으로 해석하며, 이를 극복하고 활용할 수 있는 지혜를 제시하십시오.
- 냉철한 논리와 따뜻한 인문학적 통찰을 조화시켜, 내담자가 스스로의 삶을 설계할 수 있는 용기를 주십시오.
- 전문 용어(천부, 천기, 탐랑, 칠살 등)를 적절히 사용하되, 그 의미를 현대적으로 쉽게 풀어 설명하십시오.
---
`.trim();

        navigator.clipboard.writeText(prompt).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy prompt:', err);
            alert('프롬프트 복사에 실패했습니다.');
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#6A8FAA] text-sm font-bold tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Zi Wei Dou Shu
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                    별들이 알려주는 <span className="italic text-[#6A8FAA]">운명의 성반</span>
                </h1>
            </div>

            {/* Premium Myeong-ban Visual */}
            <div className="max-w-3xl mx-auto px-2 md:px-4">
                <div className="relative grid grid-cols-4 gap-1.5 md:gap-3 bg-[#f8fafc] p-2 md:p-4 rounded-[2rem] border-2 border-blue-100/50 shadow-xl overflow-hidden">
                    {/* Background decoration in grid */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#6A8FAA 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    {[
                        ziweiResult.palaces[3], ziweiResult.palaces[4], ziweiResult.palaces[5], ziweiResult.palaces[6],
                        ziweiResult.palaces[2], null, null, ziweiResult.palaces[7],
                        ziweiResult.palaces[1], null, null, ziweiResult.palaces[8],
                        ziweiResult.palaces[0], ziweiResult.palaces[11], ziweiResult.palaces[10], ziweiResult.palaces[9]
                    ].map((palace, i) => {
                        if (palace === null) {
                            // Render the center big info box only once (at the first null slot)
                            if (i === 5) {
                                return (
                                    <div key="center" className="col-span-2 row-span-2 bg-white rounded-3xl border border-blue-100 shadow-inner p-4 md:p-8 flex flex-col items-center justify-center text-center space-y-4 z-10">
                                        <div className="space-y-1">
                                            <p className="text-[10px] md:text-xs text-blue-400 font-bold uppercase tracking-[0.2em]">Personal Blueprint</p>
                                            <h4 className="text-xl md:text-2xl font-serif font-bold text-gray-800">{data.name}</h4>
                                            <p className="text-[10px] md:text-[11px] text-gray-400 font-medium">
                                                {data.gender === 'male' ? '남성(乾命)' : '여성(坤命)'} · {data.isLunar ? '음력' : '양력'}
                                            </p>
                                        </div>
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] md:text-[12px] font-serif text-gray-600">
                                                {data.year}年 {data.month}月 {data.day}日
                                            </p>
                                            <p className="text-[10px] md:text-[12px] font-serif text-gray-600">
                                                {data.hour}時 {data.minute}分
                                            </p>
                                        </div>
                                        <div className="pt-2 space-y-1">
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[10px] font-bold text-[#6A8FAA] border border-blue-100">
                                                {ziweiResult.fiveElementBureau || '命盤 構成 完了'}
                                            </span>
                                        </div>
                                    </div>

                                );
                            }
                            return null;
                        }

                        const isMyeong = palace.name.includes('명궁');
                        const isSin = palace.name.includes('신궁');

                        return (
                            <div key={i} className={`
                                aspect-square md:aspect-auto md:min-h-[120px] flex flex-col p-2 md:p-3 rounded-2xl border transition-all relative overflow-hidden
                                ${isMyeong ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-200 ring-offset-2' :
                                    isSin ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-gray-100 shadow-sm'}
                            `}>
                                {/* Palace Index/Branch */}
                                <div className="absolute top-1 right-2 text-[8px] md:text-[10px] text-gray-300 font-serif font-bold italic">
                                    {palace.branch}
                                </div>

                                {/* Palace Name */}
                                <div className="mb-2">
                                    <span className={`text-[11px] md:text-sm font-bold ${isMyeong ? 'text-blue-600' : isSin ? 'text-amber-600' : 'text-gray-800'}`}>
                                        {palace.name.split('(')[0]}
                                    </span>
                                    {(isMyeong || isSin) && (
                                        <span className={`ml-1 text-[8px] uppercase font-black ${isMyeong ? 'text-blue-400' : 'text-amber-400'}`}>
                                            {isMyeong ? 'Main' : 'Body'}
                                        </span>
                                    )}
                                </div>

                                {/* Stars */}
                                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                    {palace.stars.length > 0 ? (
                                        palace.stars.map((s: string, si: number) => {
                                            const isPrimary = si < 2; // First two are usually main stars
                                            return (
                                                <div key={si} className="flex items-center gap-1">
                                                    <span className={`
                                                        ${isPrimary ? 'text-[9px] md:text-[11px] font-bold text-blue-500' : 'text-[7px] md:text-[9px] text-gray-500'}
                                                        leading-tight truncate
                                                    `}>
                                                        {s}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <span className="text-[7px] md:text-[9px] text-gray-300 italic">공궁(空宮)</span>
                                    )}
                                </div>

                                {/* Bottom decoration */}
                                <div className={`h-1 w-full mt-auto rounded-full ${isMyeong ? 'bg-blue-400' : isSin ? 'bg-amber-400' : 'bg-gray-50'}`} />
                            </div>
                        );
                    })}
                </div>

                {/* Legend/Info */}
                <div className="mt-6 flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm shadow-blue-200" />
                        <span className="text-xs font-bold text-gray-500">명궁 (Life Palace)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-200" />
                        <span className="text-xs font-bold text-gray-500">신궁 (Body Palace)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-100" />
                        <span className="text-xs text-gray-400">주요 14정성 및 보좌성</span>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent opacity-50" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase border border-white/10">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Premium AI Analysis
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                            AI 자미 마스터에게<br />
                            <span className="text-[#8FB3CC]">성반 심층 분석</span>을 요청하세요
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                            명궁과 14주성, 그리고 사화의 흐름을 결합하여<br />
                            인생의 거대한 흐름과 세부적인 기회를 분석하는 프롬프트를 복사합니다.
                        </p>

                        <button
                            onClick={handleCopyPrompt}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-blue-50 active:scale-95 transition-all shadow-2xl shadow-white/10"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-6 h-6 text-green-500" />
                                    분석 프롬프트 복사 완료!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                    AI 분석 프롬프트 복사하기
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
                    복사된 프롬프트를 ChatGPT나 Claude 같은 AI 모델에 붙여넣으면<br />
                    당신만을 위한 고밀도 자미두수 통변을 받아보실 수 있습니다.
                </p>
            </div>
        </div>
    );
}
