'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface AnalysisLoadingScreenProps {
    onComplete: () => void;
    reportType: string;
}

const STAGES_MAP: Record<string, { label: string; emoji: string }[]> = {
    numerology: [
        { label: '생년월일 우주 코드 변환', emoji: '🔢' },
        { label: '라이프 패스 넘버 해독', emoji: '✦' },
        { label: '영혼의 본질 에너지 분석', emoji: '💠' },
        { label: '그림자 패턴 탐색', emoji: '🌑' },
        { label: '성장 잠재력 계산', emoji: '🌿' },
        { label: '운명 보고서 생성', emoji: '📜' },
    ],
    saju: [
        { label: '천간·지지 배열 계산', emoji: '☰' },
        { label: '사주 명식 구성', emoji: '☯' },
        { label: '오행 균형 분석', emoji: '🔥' },
        { label: '대운 흐름 해독', emoji: '🌊' },
        { label: '올해 운세 계산', emoji: '📅' },
        { label: '사주 리포트 생성', emoji: '📜' },
    ],
    tarot: [
        { label: '질문 에너지 수신', emoji: '🌙' },
        { label: '카드 배열 해석', emoji: '🃏' },
        { label: '과거 에너지 해독', emoji: '⏳' },
        { label: '현재 상태 분석', emoji: '✨' },
        { label: '미래 흐름 예측', emoji: '🔮' },
        { label: '타로 메시지 생성', emoji: '📜' },
    ],
    ziwei: [
        { label: '자미성 위치 계산', emoji: '⭑' },
        { label: '12궁 배치 해석', emoji: '🏛' },
        { label: '주성 조합 분석', emoji: '💫' },
        { label: '대한·소한 운 계산', emoji: '📊' },
        { label: '명반 완성', emoji: '🗺' },
        { label: '자미두수 리포트 생성', emoji: '📜' },
    ],
    astrology: [
        { label: '천체 좌표 계산', emoji: '🌍' },
        { label: '행성 배치 해석', emoji: '♄' },
        { label: '하우스 시스템 분석', emoji: '🏠' },
        { label: '행성 각도 해독', emoji: '📐' },
        { label: '어센던트 계산', emoji: '↑' },
        { label: '점성술 리포트 생성', emoji: '📜' },
    ],
};

export default function AnalysisLoadingScreen({ onComplete, reportType }: AnalysisLoadingScreenProps) {
    const [currentStage, setCurrentStage] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const baseKey = reportType === 'career' || reportType === 'yearly' || reportType === 'compat' || reportType === 'summary'
        ? 'numerology' : reportType;
    const stages = STAGES_MAP[baseKey] || STAGES_MAP.numerology;

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        stages.forEach((_, idx) => {
            timers.push(setTimeout(() => {
                setCurrentStage(idx + 1);
            }, (idx + 1) * 700));
        });

        // Final complete
        timers.push(setTimeout(() => {
            setIsFinished(true);
        }, (stages.length + 1) * 700));

        return () => timers.forEach(t => clearTimeout(t));
    }, [stages.length]);

    const progress = Math.round((currentStage / stages.length) * 100);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #88A096, transparent)' }} />
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-[80px]"
                    style={{ background: 'radial-gradient(circle, #C4A882, transparent)' }} />
            </div>

            <div className="relative z-10 w-full max-w-sm space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'linear-gradient(135deg, #88A096, #6B8F7E)' }}>
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif text-gray-800">
                        {isFinished ? '분석이 완료되었습니다' : '당신의 운명을 해독하고 있어요'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {isFinished ? '운명의 지도가 준비되었습니다' : '잠시만 기다려주세요...'}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 font-bold">
                        <span>분석 진행</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(136,160,150,0.15)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #88A096, #6B8F7E)',
                            }}
                        />
                    </div>
                </div>

                {/* Stage checklist */}
                <div className="space-y-3">
                    {stages.map((stage, idx) => {
                        const isDone = currentStage > idx;
                        const isCurrent = currentStage === idx + 1 && !isFinished;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-3 transition-all duration-300"
                                style={{
                                    opacity: isDone || isCurrent ? 1 : 0.35,
                                    transform: isDone || isCurrent ? 'translateX(0)' : 'translateX(8px)',
                                }}
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 transition-all duration-300 ${isDone
                                    ? 'bg-sage/20 text-sage'
                                    : isCurrent
                                        ? 'bg-sage/10 text-sage animate-pulse'
                                        : 'bg-gray-100 text-gray-300'
                                    }`}>
                                    {isDone ? '✓' : stage.emoji}
                                </div>
                                <span className={`text-sm font-medium transition-colors duration-300 ${isDone ? 'text-gray-700' : isCurrent ? 'text-gray-600' : 'text-gray-400'
                                    }`}>
                                    {stage.label}
                                </span>
                                {isCurrent && (
                                    <div className="ml-auto w-4 h-4 border-2 border-sage border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Complete button */}
                {isFinished && (
                    <button
                        onClick={onComplete}
                        className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{
                            background: 'linear-gradient(135deg, #88A096, #6B8F7E)',
                            boxShadow: '0 8px 24px rgba(136,160,150,0.35)',
                        }}
                    >
                        ✦ 운명의 지도 확인하기
                    </button>
                )}
            </div>
        </div>
    );
}
