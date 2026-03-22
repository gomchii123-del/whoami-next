"use client";

import React, { useState } from "react";
import { Briefcase, Activity, Users, Sparkles, X, ChevronRight } from "lucide-react";
import { KobaiStats, ArcheEngine } from "../lib/arche-engine";

interface ArcheCapacityAnalysisProps {
    stats: KobaiStats;
    isLocked?: boolean;
}

export default function ArcheCapacityAnalysis({ stats, isLocked = false }: ArcheCapacityAnalysisProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showTotalModal, setShowTotalModal] = useState(false);

    if (!stats) return null;

    // Grouping Definitions
    const categories = {
        Competence: {
            label: "핵심 역량",
            english: "Competence",
            icon: Briefcase,
            keys: ["career", "analytical", "decision", "focus", "responsibility"] as (keyof KobaiStats)[],
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        Stability: {
            label: "내면 안정성",
            english: "Stability",
            icon: Activity,
            keys: ["financial", "health", "patience", "resilience", "adaptability"] as (keyof KobaiStats)[],
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        Sociality: {
            label: "관계와 소통",
            english: "Sociality",
            icon: Users,
            keys: ["leadership", "communication", "social", "empathy", "diplomacy"] as (keyof KobaiStats)[],
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        Growth: {
            label: "잠재력과 창조",
            english: "Growth",
            icon: Sparkles,
            keys: ["creativity", "intuition", "spirituality", "innovation", "artistic"] as (keyof KobaiStats)[],
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    };

    const descriptions: Record<keyof KobaiStats, string> = {
        career: "직업적 성취 / 사회적 경력",
        creativity: "창조적 아이디어 / 예술성",
        leadership: "영향력 / 리더십",
        intuition: "통찰력 / 직관",
        communication: "의사소통 / 전달력",
        financial: "물질적 풍요 / 자원 관리",
        health: "신체 에너지 / 활력",
        spirituality: "보이지 않는 본질 / 영성",
        adaptability: "변화 대응력 / 유연성",
        patience: "기다림 / 인내심",
        analytical: "분석적 사고 / 이치 파악",
        social: "대인 관계 / 친화력",
        innovation: "혁신성 / 개척 정신",
        responsibility: "책임감 / 완수 능력",
        artistic: "미적 감각 / 표현력",
        empathy: "공감 능력 / 이해심",
        decision: "결단력 / 실행력",
        focus: "몰입 / 집중력",
        resilience: "회복 탄력성 / 위기 극복",
        diplomacy: "중재 / 조화 능력"
    };

    const totalScore = Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 20);

    return (
        <section className={`space-y-8 ${isLocked ? 'relative' : ''}`}>
            {/* Header */}
            <div className="flex flex-col gap-2 mb-8">
                <span className="text-xs font-bold tracking-widest text-[#a29b8c] uppercase">Arche Analysis</span>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">4대 영역 정밀 분석</h2>
            </div>

            {/* Total Potential Bar */}
            <div
                className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer
                ${isLocked ? 'border-[#e5e1d8] bg-[#fdfcfb]' : 'border-sage/20 bg-white hover:border-sage/40 hover:shadow-lg hover:-translate-y-1'}`}
                onClick={() => !isLocked && setShowTotalModal(true)}
            >
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#a29b8c] font-bold block mb-1">Total Arche Potential</span>
                        <h3 className="text-lg font-serif text-foreground group-hover:text-sage transition-colors">
                            종합 역량 지수 <span className="text-xs font-sans text-gray-400 ml-1">(Click for Detail)</span>
                        </h3>
                    </div>
                    <div className="text-4xl font-serif text-sage tabular-nums">
                        {totalScore}
                    </div>
                </div>
                <div className="h-2 bg-[#f2efea] rounded-full overflow-hidden w-full">
                    <div
                        className="h-full bg-linear-to-r from-sage/40 via-sage to-sage/80 transition-all duration-1000 ease-out"
                        style={{ width: `${totalScore}%` }}
                    />
                </div>
            </div>

            {/* Grid of Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(categories).map(([catKey, category]) => {
                    const avg = Math.round(
                        category.keys.reduce((sum, key) => sum + stats[key], 0) / category.keys.length
                    );

                    return (
                        <div
                            key={catKey}
                            className={`group p-6 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[160px]
                            ${isLocked ? 'border-[#e5e1d8] bg-[#fdfcfb]' : 'border-sage/10 bg-white hover:border-sage/30 hover:shadow-md hover:-translate-y-1'}`}
                            onClick={() => !isLocked && setSelectedCategory(catKey)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-2 rounded-lg bg-sage/5 text-sage">
                                    <category.icon size={20} />
                                </div>
                                <span className="text-xs font-bold text-[#a29b8c] uppercase tracking-widest">{category.english}</span>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-base font-serif text-foreground group-hover:text-sage transition-colors mb-4">{category.label}</h4>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-3xl font-serif text-sage tabular-nums">{avg}</span>
                                    <span className="text-[10px] text-gray-400 mb-1">/ 100</span>
                                </div>
                                <div className="h-1 bg-[#f2efea] rounded-full overflow-hidden w-full">
                                    <div
                                        className="h-full bg-sage/60 group-hover:bg-sage transition-all duration-500"
                                        style={{ width: `${avg}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Custom Modals */}
            {showTotalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowTotalModal(false); }}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold tracking-[0.2em] text-sage uppercase mb-2">Career & Aptitude</h3>
                                <h2 className="text-2xl md:text-3xl font-serif text-foreground">종합 역량 분석 리포트</h2>
                            </div>

                            {(() => {
                                const analysis = ArcheEngine.getCareerAptitude(stats);
                                return (
                                    <div className="space-y-6">
                                        <div className="bg-sage/5 p-6 rounded-2xl border border-sage/10">
                                            <h4 className="text-lg font-serif text-foreground mb-3">{analysis.title}</h4>
                                            <p className="text-readable text-gray-600 leading-relaxed font-sans">
                                                {analysis.description}
                                            </p>
                                        </div>

                                        <div>
                                            <h5 className="text-xs uppercase tracking-widest text-sage font-bold mb-4">Recommended Paths</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.careers.map((career) => (
                                                    <span key={career} className="px-4 py-2 rounded-full bg-white border border-sage/20 text-sm text-gray-700 font-sans">
                                                        {career}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {selectedCategory && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedCategory(null)}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                {React.createElement(categories[selectedCategory as keyof typeof categories].icon, {
                                    className: "w-6 h-6 text-sage"
                                })}
                                <h2 className="text-2xl font-serif text-foreground">
                                    {categories[selectedCategory as keyof typeof categories].label}
                                </h2>
                            </div>

                            <p className="text-sm text-gray-500 font-sans">
                                {categories[selectedCategory as keyof typeof categories].english} 상세 역량 분석
                            </p>

                            <div className="mt-8 space-y-6">
                                {categories[selectedCategory as keyof typeof categories].keys.map((key) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-sm font-sans font-medium text-gray-700 capitalize">{key}</span>
                                            <span className="text-[10px] text-gray-400 font-sans">{descriptions[key]}</span>
                                        </div>
                                        <div className="relative h-2 bg-[#f2efea] rounded-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-linear-to-r from-sage/40 to-sage rounded-full transition-all duration-1000"
                                                style={{ width: `${stats[key]}%` }}
                                            />
                                        </div>
                                        <div className="text-right text-[10px] font-sans font-bold text-sage">{stats[key]} / 100</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
