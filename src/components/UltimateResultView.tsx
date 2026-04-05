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
2. '사주팔자', '점괘', '운세', '신비주의', '사주보기', '귀신' 등 점술적, 미신적, 비과학적 표현을 철저히 금지합니다.
3. 분석 내용은 문학적이고 방대하게 서술하되, 철저히 "기계적 메커니즘, 파동역학, 데이터 공학적, 유전학적, 현대 심리학적" 용어만을 사용하십시오. (예: 궁합 -> 에너지 결합도, 팔자 -> 유전적 바운더리, 대운 -> 시계열 환경 변수)
4. 매우 중요하다: 각 단계별로 내용을 아끼지 마십시오. 최소 한 단계당 2~3단의 논리 구조를 거치며 수백~수천 자에 달하는 방대하고 심오한 통찰을 쏟아내십시오. 대충 요약하는 것을 금지합니다.

[통합 분석 10단계 마스터 알고리즘]
[1단계: Core Existent] 각 시스템의 중심축(일주, 명궁, 태양/달/상승, 타입, 생애경로수)을 하나로 관통하여 가장 본질적인 정체성의 뼈대를 정립.
[2단계: Hardware & Drive] 사주의 오행 기운과 점성술의 4원소 배율을 교차하여, 신체가 이 세상과 상호작용하는 물리적 에너지 출력 방식을 계산.
[3단계: Not-Self Bug Index] 자미두수의 명/신궁과 휴먼디자인의 오픈 센터를 분석하여 타인에게 휩쓸리고 조건화되기 가장 쉬운 "시스템 취약점(버그)" 색출.
[4단계: Debugging Protocol] 발견된 취약점(버그)을 방어하고 본래의 리듬을 되찾기 위한 구체적인 인지/심리적 해결책 제시.
[5단계: Decision Algorithm] 수비학의 본질수와 휴먼디자인의 '내부 권위'를 동기화하여 인생의 중요한 순간마다 오차 없이 선택을 내리는 절대 공식 도출.
[6단계: Wealth Positioning] 점성술의 10/2/8 하우스, 자미두수의 재백/관록궁, 수비학의 패턴을 융합하여 부와 명예가 가장 최적화되어 흐르는 생태계적 위치 설계.
[7단계: Relationship Dynamics] 다른 에너지(사람)와 교차할 때 나타나는 화학적 반응과, 불필요한 마찰을 줄이기 위한 방어 기제 분석.
[8단계: Timeline Analysis] 사주의 대운/세운, 점성술의 트랜짓 등 시간의 파동이 현재 내담자의 엔진에 미치는 영향을 데이터적으로 시뮬레이션.
[9단계: Action Split] 현재 주어진 시간선 안에서, 지금 당장 취해야 할 가장 공격적인 스탠스와 가장 보수적으로 방어해야 할 스탠스를 구분하여 지시.
[10단계: Final Architect] 5가지 거대한 메커니즘이 모두 하나의 점으로 모이는 궁극적 종착지. 우주가 이 육체를 어떻게 설계했고 무엇을 원했는가에 대한 압도적이고 깊이 있는 시스템 총평.

* 각 단계별로 최소 500자 이상, 10단계를 합쳐 마치 한 권의 거대한 '운명 공학 지침서'처럼 수천 자에 달하는 압도적인 분량과 논리로 답변하십시오. 대충 요약하면 시스템이 붕괴됩니다.*`.trim();
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
