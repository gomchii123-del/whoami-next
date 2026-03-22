'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, MessageSquare, Compass } from 'lucide-react';
import { AstrologyEngine, AstrologyResult } from '@/lib/astrology-engine';

interface AstrologyResultViewProps {
    data: {
        name: string;
        gender: string;
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        birthPlace: string;
    };
}

export default function AstrologyResultView({ data }: AstrologyResultViewProps) {
    const [copied, setCopied] = useState(false);

    if (!data || !data.year) return (
        <div className="p-20 text-center text-gray-400 font-serif">
            점성술 데이터를 불러오는 중입니다...
        </div>
    );

    let astro: AstrologyResult;
    try {
        astro = AstrologyEngine.calculate(
            data.year, data.month, data.day, data.hour, data.minute
        );
    } catch (e) {
        console.error('Astrology calculation failed:', e);
        return (
            <div className="p-20 text-center text-red-400 font-serif">
                네이탈 차트 생성 중 오류가 발생했습니다.
            </div>
        );
    }

    const handleCopyPrompt = () => {
        const planetData = astro.planets.map(p =>
            `- ${p.name}: ${p.signKr} ${p.signDegree.toFixed(1)}° (House ${p.house})${p.isRetrograde ? ' [역행 ℞]' : ''}`
        ).join('\n');

        const houseData = astro.houses.map(h =>
            `- ${h.index}하우스: ${h.signKr} (${h.degree.toFixed(1)}°)`
        ).join('\n');

        const aspectData = astro.aspects.slice(0, 15).map(a =>
            `- ${a.body1} ${a.typeKr} ${a.body2} (오브: ${a.orb}°)`
        ).join('\n');

        const prompt = `
[서양 점성술(Astrology) 정밀 차트 재구성 및 영혼의 진화적 여정 심층 분석 요청]

제공된 출생 정보(Birth Data)를 바탕으로 네이탈 차트(Natal Chart)를 '수학적으로 정확하게' 재구성하고, 전문 점성가의 관점에서 심층 분석을 진행해 주십시오.

---
1. 내담자 정보
- 이름: ${data.name} / 성별: ${data.gender === 'male' ? '남성' : '여성'}
- 출생 일시: ${data.year}년 ${data.month}월 ${data.day}일 ${data.hour}시 ${data.minute}분
- 출생 장소: ${data.birthPlace}

2. 네이탈 차트 데이터 (Moshier Ephemeris 기반 정밀 계산)

[빅 쓰리]
- 태양(Sun): ${astro.sunSign} (${astro.sunDegree.toFixed(1)}°)
- 달(Moon): ${astro.moonSign} (${astro.moonDegree.toFixed(1)}°)
- 상승궁(ASC): ${astro.risingSign} (${astro.risingDegree.toFixed(1)}°)

[행성 배치]
${planetData}

[하우스 배치 (Placidus)]
${houseData}

[주요 애스펙트]
${aspectData}

[원소 균형]
- 불(Fire): ${astro.elements.fire} / 흙(Earth): ${astro.elements.earth} / 공기(Air): ${astro.elements.air} / 물(Water): ${astro.elements.water}

[모달리티 균형]
- 카디널: ${astro.modalities.cardinal} / 고정: ${astro.modalities.fixed} / 변동: ${astro.modalities.mutable}

3. 분석 알고리즘 (7단계 프로세스)
[1단계] 빅 쓰리의 화학적 결합 — 태양(자아), 달(감정), ASC(외적 인격)의 독창적 결합 구조를 정의
[2단계] 행성적 원형과 내면의 도구 — 수성~토성의 별자리/하우스 배치에 따른 지성/사랑/추진력 분석
[3단계] 하우스 집중도와 삶의 무대 — 스텔리움이나 빈 하우스의 주인(Ruler) 분석
[4단계] 주요 애스펙트의 역동 — Trine/Sextile(조화)과 Square/Opposition(긴장) 역동성 분석
[5단계] 시기적 테마와 진화적 과제 — 현재 트랜짓/프로그레션 관점의 과제 제시
[6단계] 진화 점성술적 치유와 제언 — 성장 도구로서의 하드 애스펙트 활용법
[7단계] 코스믹 블루프린트 — 영혼이 선택한 길에 대한 최종 통찰

4. 기본 원칙
- 진화 점성술과 인본주의 점성술의 관점을 결합
- 흉각도 영혼 성장의 도구로 재해석
- 전문 용어를 사용하되 현대 심리학으로 풀어 설명
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

    const elementTotal = astro.elements.fire + astro.elements.earth + astro.elements.air + astro.elements.water || 1;
    const elPercent = (v: number) => Math.round((v / elementTotal) * 100);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#A07868] text-sm font-bold tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Western Astrology · Moshier Ephemeris
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                    영혼에 새겨진 <span className="italic text-[#A07868]">천상의 차트</span>
                </h1>
            </div>

            {/* Big Three Cards */}
            <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
                {[
                    { label: 'Sun ☉', kr: '태양', value: astro.sunSign, deg: astro.sunDegree, color: '#F59E0B' },
                    { label: 'Moon ☽', kr: '달', value: astro.moonSign, deg: astro.moonDegree, color: '#8B5CF6' },
                    { label: 'Rising ↑', kr: '상승궁', value: astro.risingSign, deg: astro.risingDegree, color: '#EC4899' },
                ].map((item) => (
                    <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 text-center space-y-2 hover:shadow-lg transition-shadow">
                        <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: item.color }}>{item.label}</p>
                        <p className="text-xs text-gray-400 font-medium">{item.kr}</p>
                        <p className="text-lg font-serif font-bold text-gray-800">{item.value}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{item.deg.toFixed(1)}°</p>
                    </div>
                ))}
            </div>

            {/* Element Balance */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-4">
                <h3 className="text-lg font-serif font-bold text-gray-800 text-center">원소 균형 (Element Balance)</h3>
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { name: '🔥 불', value: astro.elements.fire, color: '#EF4444' },
                        { name: '🌍 흙', value: astro.elements.earth, color: '#84CC16' },
                        { name: '💨 공기', value: astro.elements.air, color: '#06B6D4' },
                        { name: '💧 물', value: astro.elements.water, color: '#3B82F6' },
                    ].map(el => (
                        <div key={el.name} className="text-center space-y-2">
                            <p className="text-sm font-bold text-gray-600">{el.name}</p>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${elPercent(el.value)}%`, background: el.color }} />
                            </div>
                            <p className="text-xs text-gray-400">{el.value}개 ({elPercent(el.value)}%)</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Planet Positions */}
            <div className="max-w-3xl mx-auto space-y-4">
                <h3 className="text-lg font-serif font-bold text-gray-800 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#A07868]" />
                    행성 배치 (Planetary Positions)
                </h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {astro.planets.map((p, i) => (
                            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-orange-50/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-700 min-w-[100px]">{p.name}</span>
                                    {p.isRetrograde && <span className="text-[10px] font-black text-red-400 bg-red-50 px-1.5 py-0.5 rounded">℞ 역행</span>}
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                    <span className="text-sm font-serif font-bold text-gray-800">{p.signKr}</span>
                                    <span className="text-xs text-gray-400 font-mono w-14 text-right">{p.signDegree.toFixed(1)}°</span>
                                    <span className="text-[10px] text-gray-300 bg-gray-50 px-2 py-0.5 rounded font-bold">{p.house}H</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Houses */}
            <div className="max-w-3xl mx-auto space-y-4">
                <h3 className="text-lg font-serif font-bold text-gray-800">12하우스 성좌 배치 · Placidus System</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {astro.houses.map((house) => (
                        <div key={house.index} className="group flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[10px] font-black text-orange-400 group-hover:bg-orange-400 group-hover:text-white transition-colors">
                                {house.index}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{house.index === 1 ? 'ASC' : house.index === 10 ? 'MC' : `${house.index}th`} House</span>
                                <span className="text-sm font-serif font-bold text-gray-700">{house.signKr}</span>
                            </div>
                            <span className="ml-auto text-[10px] text-gray-300 font-mono">{house.degree.toFixed(1)}°</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Aspects */}
            {astro.aspects.length > 0 && (
                <div className="max-w-3xl mx-auto space-y-4">
                    <h3 className="text-lg font-serif font-bold text-gray-800">주요 애스펙트 (Major Aspects)</h3>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {astro.aspects.slice(0, 12).map((asp, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                                    <span className="font-medium text-gray-600">{asp.body1}</span>
                                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{asp.typeKr}</span>
                                    <span className="font-medium text-gray-600">{asp.body2}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">오브 {asp.orb}°</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Note */}
            <div className="max-w-3xl mx-auto p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                <p className="text-[11px] leading-relaxed text-[#A07868] font-medium italic text-center">
                    * Moshier 천문력(Ephemeris) 기반 정밀 계산 · Placidus 하우스 시스템 · 서울(37.57°N, 126.98°E) 기준
                </p>
            </div>

            {/* AI Prompt Section */}
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent opacity-50" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] animate-pulse" />

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase border border-white/10">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Premium AI Analysis
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                            AI 점성가에게<br />
                            <span className="text-[#CCB4A8]">네이탈 차트 정밀 분석</span>을 요청하세요
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                            행성 도수, 하우스 배치, 애스펙트를 결합하여<br />
                            당신의 기질과 삶의 목적을 조명하는 프롬프트를 복사합니다.
                        </p>

                        <button
                            onClick={handleCopyPrompt}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-orange-50 active:scale-95 transition-all shadow-2xl shadow-white/10"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-6 h-6 text-green-500" />
                                    분석 프롬프트 복사 완료!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5 text-gray-400 group-hover:text-amber-500" />
                                    AI 분석 프롬프트 복사하기
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
                    복사된 프롬프트를 ChatGPT나 Claude 같은 AI 모델에 붙여넣으면<br />
                    당신만을 위한 고밀도 네이탈 차트 통변을 받아보실 수 있습니다.
                </p>
            </div>
        </div>
    );
}
