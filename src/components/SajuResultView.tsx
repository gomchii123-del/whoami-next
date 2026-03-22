'use client';

import React, { useState } from 'react';
import { SajuResult, Daeun } from '@/lib/saju-engine';
import { Sparkles, Calendar, User, Zap, Check } from 'lucide-react';

interface SajuResultViewProps {
    result: SajuResult;
    name: string;
    gender: 'male' | 'female';
}

const ELEMENT_COLORS: Record<string, string> = {
    '목': '#4A7A4A', // Green
    '화': '#C14A4A', // Red
    '토': '#C1A14A', // Yellow/Gold
    '금': '#8A8A8A', // White/Gray
    '수': '#4A4A8A', // Black/Blue
};

const ELEMENT_BG: Record<string, string> = {
    '목': 'rgba(74,122,74,0.1)',
    '화': 'rgba(193,74,74,0.1)',
    '토': 'rgba(193,161,74,0.1)',
    '금': 'rgba(138,138,138,0.1)',
    '수': 'rgba(74,74,138,0.1)',
};

export default function SajuResultView({ result, name, gender }: SajuResultViewProps) {
    if (!result || !result.pillars) {
        return (
            <div className="p-20 text-center space-y-4">
                <div className="animate-spin w-8 h-8 border-4 border-[#B88A6A] border-t-transparent rounded-full mx-auto" />
                <p className="text-gray-400 font-serif">사주 정보를 불러오는 중입니다...</p>
            </div>
        );
    }
    const { pillars, daeun, daeunAge } = result;
    const [copied, setCopied] = useState(false);

    const handleCopyPrompt = () => {
        const prompt = `
[사주 정밀 분석 및 인생 경영 컨설팅 요청]

아래 제공된 사주 명식(팔자)과 정보를 바탕으로 전문적인 간명 알고리즘에 따라 심층 분석을 진행해 주십시오. 당신은 단순한 길흉을 맞추는 점술가가 아니라, 내담자가 타고난 '때(월령)'와 '쓰임(당령)'을 규명하고 맞춤형 인생 전략을 제시하는 냉철하고 예리한 컨설턴트여야 합니다.

---
1. 입력 데이터 (분석 대상)
- 성별: ${gender === 'male' ? '남성 (乾命)' : '여성 (坤命)'}
- 년주: ${pillars.year.stemHanja}${pillars.year.branchHanja} (${pillars.year.stem}${pillars.year.branch})
- 월주: ${pillars.month.stemHanja}${pillars.month.branchHanja} (${pillars.month.stem}${pillars.month.branch})
- 일주: ${pillars.day.stemHanja}${pillars.day.branchHanja} (${pillars.day.stem}${pillars.day.branch})
- 시주: ${pillars.hour.stemHanja}${pillars.hour.branchHanja} (${pillars.hour.stem}${pillars.hour.branch})

2. 시간적 배경 (대운 및 월령 미션)
- 대운수: ${daeunAge}
- 대운 흐름: ${daeun.map(d => `${d.age}세(${d.pillar.stemHanja}${d.pillar.branchHanja})`).join(' → ')}
${result.palPum ? `- 월령 미션(팔품): ${result.palPum.name} (${result.palPum.range}) / 당령: ${result.palPum.dangRyeong}\n  * 임무: ${result.palPum.mission}` : ''}

---
3. 분석 알고리즘 (7단계 프로세스)
[1단계: 조화(造化)와 준비성] 태어난 계절에 맞는 상생이 이루어졌는지 확인하여 평상시의 준비 습관과 기초 자질을 진단하십시오.
[2단계: 조후(調候)와 멘탈] 한난조습의 균형을 통해 내담자의 절박함, 투쟁심, 정신적 쾌적함을 분석하십시오. (조후가 갖춰지면 안정적이나 발전이 느리고, 결핍되면 악착같은 노력을 하는 선수형임)
[3단계: 당령(當令)과 사회적 임무] 월령의 주인인 당령이 투출했는지 보고, 주어진 환경 순응(선 배합)과 개인적 취향(불선 배합) 중 어떤 재능을 사용하는지 판별하십시오.
[4단계: 격국(格局)과 신분] 사회적 지위와 프레임을 결정하는 격국을 설정하고, 이를 돕는 상신(준비/의지)과 위기를 구하는 구신(위기극복)의 유무를 확인하십시오.
[5단계: 용신(用神)의 재정의] 단순 억부용신이 아닌, 사령용신(임무), 유용지신(개척의지), 정격용신(신분유지)을 구분하여 실질적인 해결책을 제시하십시오.
[6단계: 행동 양식(10종 습관)] 육신의 생화극제 관계를 통해 내담자의 10가지 습관(상생식, 제화, 설화합화, 설기 등) 중 핵심을 진단하십시오.
[7단계: 운(運)의 시간표] 10년 대운과 1년 세운을 대입하여, 지금이 전진해야 할 '입춘/입하'의 시기인지 자중해야 할 '입추/입동'의 시기인지 최종 전략을 제시하십시오.

4. 심층 통변 지침
- [흉신의 현대적 무기화]: 겁재(압도적 경쟁력), 상관(천재적 표현력), 편인(독보적 전문성), 편관/양인(위기관리 리더십) 등 흉신들을 현대 자본주의 시대의 강력한 경쟁 도구로 재해석하십시오.
- [성격 및 처세술]: 오행의 특징을 성격 특질(MBTI, Big5 등)과 매칭하고, 일주의 특성을 바탕으로 한 고유한 처세술을 도출하십시오.
- [인정(認定)과 개운]: 타고난 조건을 탓하지 않고 그대로 인정하는 것에서 시작하십시오. 업상대체(직업적 치환)나 물리적 거리두기 등 현실적인 개운법을 제안하십시오.

5. 기본 원칙
- 따뜻하고 공감하는 어조를 유지하되, 논리적 예리함을 잃지 마십시오.
- 사주는 한 사람이 태어날 때 부여받은 '그릇'입니다. 다가올 폭풍을 경고하고 항구를 가리키는 '등대'이며, 최종적인 배의 키를 쥐는 것은 내담자 본인임을 강조하십시오.
- 누구의 기법인지 언급하지 말고 순수하게 명리의 논리와 통변 기법으로만 접근하십시오.
---
`.trim();

        navigator.clipboard.writeText(prompt).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const PillarBox = ({ title, p, isDay = false }: { title: string, p: any, isDay?: boolean }) => (
        <div className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border transition-all ${isDay ? 'border-[#B88A6A] bg-[#B88A6A]/5 shadow-[0_0_20px_rgba(184,138,106,0.1)]' : 'border-gray-100 bg-white shadow-sm'}`}>
            <span className={`text-[11px] font-bold tracking-widest uppercase ${isDay ? 'text-[#B88A6A]' : 'text-gray-400'}`}>{title}</span>
            <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-inner"
                    style={{ backgroundColor: ELEMENT_BG[p.stemElement] }}>
                    <span className="text-2xl font-bold leading-none" style={{ color: ELEMENT_COLORS[p.stemElement] }}>{p.stemHanja}</span>
                    <span className="text-[10px] font-medium opacity-80" style={{ color: ELEMENT_COLORS[p.stemElement] }}>{p.stem}</span>
                </div>
                <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-inner"
                    style={{ backgroundColor: ELEMENT_BG[p.branchElement] }}>
                    <span className="text-2xl font-bold leading-none" style={{ color: ELEMENT_COLORS[p.branchElement] }}>{p.branchHanja}</span>
                    <span className="text-[10px] font-medium opacity-80" style={{ color: ELEMENT_COLORS[p.branchElement] }}>{p.branch}</span>
                </div>
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400">{p.stemElement} / {p.branchElement}</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* 1. Eight Characters Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B88A6A]/10 border border-[#B88A6A]/20">
                    <Zap className="w-4 h-4 text-[#B88A6A]" />
                    <span className="text-xs font-bold text-[#B88A6A] tracking-[0.2em] uppercase">The Eight Characters</span>
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-800">사주 명식 (四柱 命式)</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-sans">
                    <User className="w-4 h-4" />
                    <span>분석 대상자 ({gender === 'male' ? '乾命' : '坤命'})</span>
                </div>
            </div>

            {/* 2. Four Pillars Grid */}
            <div className="relative">
                <div className="absolute top-1/2 left-4 right-4 h-px bg-gray-100 -z-10" />
                <div className="grid grid-cols-4 gap-3 md:gap-6">
                    <PillarBox title="시주 (時)" p={pillars.hour} />
                    <PillarBox title="일주 (日)" p={pillars.day} isDay />
                    <PillarBox title="월주 (月)" p={pillars.month} />
                    <PillarBox title="년주 (年)" p={pillars.year} />
                </div>
            </div>

            {/* 3. Prompt Copy Section */}
            <div className="p-8 rounded-[2rem] bg-[#B88A6A]/5 border border-[#B88A6A]/20 shadow-xl shadow-[#B88A6A]/5 space-y-6 text-center">
                <div className="space-y-2">
                    <h4 className="text-xl font-serif font-bold text-gray-800">심층 AI 분석 프롬프트</h4>
                    <p className="text-sm text-gray-500">당신의 사주 데이터를 복사하여 AI(ChatGPT, Gemini 등)에게 <br />더욱 정밀한 인생 상담을 받아보세요.</p>
                </div>

                <button
                    onClick={handleCopyPrompt}
                    className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all active:scale-95 overflow-hidden ${copied
                        ? 'bg-green-600 text-white shadow-green-200'
                        : 'bg-gradient-to-r from-[#B88A6A] to-[#8C6A50] text-white shadow-lg hover:shadow-2xl hover:-translate-y-1'
                        }`}
                >
                    {!copied && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                    {copied ? <Check className="w-5 h-5" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
                    <span className="relative">{copied ? '복사 완료!' : '분석 프롬프트 복사하기'}</span>
                </button>

                <p className="text-[11px] text-gray-400 font-sans uppercase tracking-widest italic">
                    * 복사된 텍스트에는 성명 정보가 포함되지 않습니다.
                </p>
            </div>

            {/* 4. Daeun (Major Cycles) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#B88A6A]" />
                        <h3 className="text-xl font-serif font-bold text-gray-800">대운 흐름 (大運)</h3>
                    </div>
                    <div className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        대운수: {daeunAge}
                    </div>
                </div>

                <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
                    <div className="flex gap-4 min-w-max">
                        {daeun.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm min-w-[85px] hover:border-[#B88A6A]/30 transition-colors">
                                <span className="text-[13px] font-bold text-[#B88A6A] bg-[#B88A6A]/5 px-2 py-0.5 rounded-lg">{d.age}세</span>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-2xl font-bold font-serif" style={{ color: ELEMENT_COLORS[d.pillar.stemElement] }}>{d.pillar.stemHanja}</span>
                                    <span className="text-2xl font-bold font-serif" style={{ color: ELEMENT_COLORS[d.pillar.branchElement] }}>{d.pillar.branchHanja}</span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 mt-1 opacity-60">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{d.pillar.stem}{d.pillar.branch}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. Minimal Informational Footer */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 italic text-[11px] text-gray-400 leading-relaxed text-center">
                ※ 사주는 한 사람이 태어날 때 부여받은 '그릇'과 같습니다. <br className="hidden md:block" />
                본 서비스는 다가올 삶의 환경을 가리키는 '등대' 역할을 제안하며, 최종적인 배의 키를 쥐는 것은 당신 자신입니다.
            </div>
        </div>
    );
}
