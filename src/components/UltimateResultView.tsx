'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, MessageSquare } from 'lucide-react';
import { SajuEngine } from '@/lib/saju-engine';
import { ZiWeiEngine } from '@/lib/ziwei-engine';
import { AstrologyEngine } from '@/lib/astrology-engine';
import { ArcheEngine } from '@/lib/arche-engine';
import { useT } from '@/i18n/LocaleContext';

export default function UltimateResultView() {
    const [copied, setCopied] = useState(false);
    const [data, setData] = useState<any>(null);
    const t = useT();

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('ultimate_data');
            if (stored) setData(JSON.parse(stored));
        } catch (e) {
            console.error(e);
        }
    }, []);

    if (!data || !data.year) return (
        <div className="p-20 text-center text-gray-400 font-serif">
            데이터를 불러오는 중입니다...
        </div>
    );

    let promptStr = '';
    try {
        const saju = SajuEngine.calculate(data.year, data.month, data.day, data.hour, data.minute);
        const ziwei = ZiWeiEngine.calculate(data.year, data.month, data.day, data.hour, data.minute);
        const astro = AstrologyEngine.calculate(data.year, data.month, data.day, data.hour, data.minute);
        const numResult = ArcheEngine.performAnalysis(String(data.year), String(data.month), String(data.day));

        const planetData = astro.planets.map(p => `- ${p.name}: ${p.signKr} (House ${p.house})`).join('\\n');

        promptStr = `[마스터 엔지니어 5대 시스템(사주/자미/점성/휴디/수비학) 통합 분석 요청]

당신은 지구상에 존재하는 모든 운명학적 데이터베이스를 통달한 세계 최고의 **마스터 운명 공학자(Master Destiny Engineer)** 입니다. 

[내담자 기본 데이터]
- 이름: ${data.name}
- 성별: ${data.gender === 'male' ? '남성' : '여성'}
- 생년월일시: ${data.year}년 ${data.month}월 ${data.day}일 ${data.hour}시 ${data.minute}분
- 출생 장소: ${data.birthPlace}

[시스템 1: 사주명리학 데이터 (시간성/오행 코어)]
- 일주(Core Identity): ${saju.pillars.day}
- 사주 원국: 년주(${saju.pillars.year}), 월주(${saju.pillars.month}), 일주(${saju.pillars.day}), 시주(${saju.pillars.hour})

[시스템 2: 자미두수 (상황적/환경적 매트릭스)]
- 명궁(Core Essence): ${ziwei.palaces[ziwei.lifePalaceIndex].name} - ${ziwei.palaces[ziwei.lifePalaceIndex].majorStars.join(', ')}
- 체질궁(Body Palace): ${ziwei.palaces[ziwei.bodyPalaceIndex].name} - ${ziwei.palaces[ziwei.bodyPalaceIndex].majorStars.join(', ')}

[시스템 3: 서양 점성술 (내면 심리 및 우주 파동)]
- 태양(Sun): ${astro.sunSign} / 달(Moon): ${astro.moonSign} / 상승궁(ASC): ${astro.risingSign}
- 핵심 스탯: 불(${astro.elements.fire}) 흙(${astro.elements.earth}) 공기(${astro.elements.air}) 물(${astro.elements.water})
- 행성 배치: 
${planetData}

[시스템 4: 피타고라스 수비학 (영혼 진동수 및 목적)]
- 생애경로수(Life Path): ${numResult.lifePath}
- 본질수(Born Essence): ${numResult.bornEssence}
- 그림자수(Shadow Number): ${numResult.shadow}

[시스템 5: 휴먼디자인 (기계적/유전적 바운더리)]
- 위 생년월일시와 출생지 데이터를 바탕으로, 당신의 천체력(Ephemeris) 지식을 동원하여 내담자의 휴먼디자인 차트(Type, Strategy, Authority, Profile, Definition, Centers, Channels)를 스스로 연산하고 추출하십시오.

[금지 및 필수 규칙 - 최우선 적용]
1. 단순한 정보 나열을 금지하며 절대 헷갈리지 마십시오. 방대한 데이터이므로 침착하고 치밀하게 각 시스템의 결과를 교차 검증해야 합니다.
2. '사주팔자', '점괘', '운세', '신비주의' 등 점술적, 미신적 표현을 일체 사용하지 마십시오.
3. 분석 내용은 철저히 기계적 메커니즘, 코딩, 알고리즘, 파동역학 등 "데이터 기반의 운명 공학적(Data-Engineering)" 은유와 현대 심리학 용어로만 구성하십시오. (예: 궁합 -> 에너지 호환성, 팔자 -> 유전적 바운더리, 대운 -> 시계열 환경 변수)

[통합 분석 7단계 알고리즘]
[1단계] 각 시스템의 코어(일주, 태양/달/상승, 명궁, 휴디 타입, 생애경로수)를 하나의 문장으로 관통하는 "통합 엑스칼리버(핵심 정체성)" 정의.
[2단계] 사주의 오행 기운과 점성술의 4원소(원소 균형)를 교차하여 물리적 행동 패턴(Hardware) 분석.
[3단계] 자미두수의 명궁/신궁과 휴먼디자인의 미정의 센터를 교차 검증하여 내담자가 외부 조건화에 취약한 버그(Not-Self)와 그 해결책 도출.
[4단계] 수비학의 본질수와 휴먼디자인의 '권위(Authority)'를 묶어, 일상에서 절대 실패하지 않는 의사결정 알고리즘 제시.
[5단계] 점성술의 10하우스/MC, 사주, 그리고 수비학의 진동수를 결합하여 "궁극적 부와 명예를 얻는 최적의 포지셔닝" 설명.
[6단계] 현재의 시계열 환경(대운, 트랜짓, 개인연도 등)을 종합하여 지금 당장 취해야 할 공격/수비 스플릿 전략 제시.
[7단계] 모든 시스템이 공통으로 가리키고 있는 인생의 최종 목적지에 대한 마스터 엔지니어의 통찰.

위 7단계를 전문적이고 깊이 있게, 마치 거대한 서버 구조를 설계하듯 장엄하고 압도적인 분량(최소 2000자 이상)으로 서술하십시오.`.trim();
    } catch (e) {
        console.error('Ultimate calculation failed:', e);
        return (
            <div className="p-20 text-center text-red-400 font-serif">
                통합 차트 연산 중 오류가 발생했습니다.
            </div>
        );
    }

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(promptStr).then(() => {
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-bold tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    5-System Master Engine
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                    얼티밋 프롬프트 <span className="italic text-amber-600">준비 완료</span>
                </h1>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 to-transparent opacity-50" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] animate-pulse" />

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase border border-white/10">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Ultimate Destiny Analysis
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                            ChatGPT / Claude에<br />
                            <span className="text-amber-400">통합 분석 프롬프트</span>를 붙여넣으세요
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                            사주, 자미두수, 점성술, 수비학 데이터를 모두 담았습니다.<br />
                            AI가 방대한 데이터를 바탕으로 심층 분석을 진행합니다.
                        </p>

                        <button
                            onClick={handleCopyPrompt}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-amber-50 active:scale-95 transition-all shadow-2xl shadow-white/10 w-full md:w-auto justify-center"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-6 h-6 text-green-500" />
                                    얼티밋 프롬프트 복사 완료!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5 text-gray-400 group-hover:text-amber-500" />
                                    통합 프롬프트 복사하기
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
                    복사된 프롬프트를 AI 모델에 붙여넣으면<br />
                    세상에 없던 엄청난 통찰을 받아보실 수 있습니다.
                </p>
            </div>
        </div>
    );
}
