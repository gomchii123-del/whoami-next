'use client';

import { AnalysisResult } from '@/lib/arche-engine';
import { getINDScoreKey, IND_SCORE_MESSAGES, RISK_MESSAGES, LOOP_MESSAGES, BIORHYTHM_LABELS } from '@/lib/ind-narratives';

interface Props {
    analysis: AnalysisResult;
    birthYear: number;
}

/** 운명 에너지 분석 대시보드 — 다크모드 호환 */
export default function INDDashboard({ analysis, birthYear }: Props) {
    const { indScore, biorhythm, riskDynamics, kellyStrategy, energyLoop, gridInterpretation, fractalPrediction } = analysis;
    const scoreKey = getINDScoreKey(indScore.scoreTotal);
    const scoreMsg = IND_SCORE_MESSAGES[scoreKey];
    const riskMsg = RISK_MESSAGES[riskDynamics.riskLevel];
    const loopMsg = LOOP_MESSAGES[energyLoop.loopType];

    const scorePercent = Math.round(indScore.scoreTotal * 100);

    const getGaugeColor = (score: number) => {
        if (score >= 0.85) return '#FFD700';
        if (score >= 0.7) return '#4CAF50';
        if (score >= 0.5) return '#42A5F5';
        if (score >= 0.3) return '#FF9800';
        return '#F44336';
    };
    const gaugeColor = getGaugeColor(indScore.scoreTotal);

    return (
        <div className="space-y-4">
            {/* ── 섹션 헤더 ── */}
            <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🌀</span>
                    <h3 className="text-base font-bold text-foreground">운명 에너지 분석</h3>
                </div>
                <div className="flex-1 h-px bg-sage/20" />
            </div>

            {/* ── 1. 통합 길흉 게이지 ── */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{scoreMsg.emoji}</span>
                    <div>
                        <p className="text-xs font-bold tracking-wider uppercase" style={{ color: gaugeColor }}>{scoreMsg.title}</p>
                        <p className="text-[11px] text-gray-400">종합 운세 지수</p>
                    </div>
                </div>

                {/* 원형 게이지 */}
                <div className="flex items-center gap-6">
                    <div className="relative shrink-0" style={{ width: 100, height: 100 }}>
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="50" fill="none" className="stroke-gray-100" strokeWidth="10" />
                            <circle
                                cx="60" cy="60" r="50" fill="none"
                                stroke={gaugeColor}
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={`${scorePercent * 3.14} ${314 - scorePercent * 3.14}`}
                                style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black" style={{ color: gaugeColor }}>{scorePercent}</span>
                            <span className="text-[9px] font-bold tracking-wider text-gray-300">/ 100</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="text-[13px] leading-relaxed text-gray-600">{scoreMsg.description}</p>
                        <p className="text-[12px] leading-relaxed font-medium" style={{ color: gaugeColor }}>{scoreMsg.advice}</p>
                    </div>
                </div>

                {/* 3-레이어 가중치 바 */}
                <div className="mt-4 pt-3 grid grid-cols-3 gap-2 border-t border-gray-100">
                    {[
                        { label: '선천 그릇', value: indScore.fWeight, weight: '40%', color: '#7E57C2' },
                        { label: '현재 주기', value: indScore.cWeight, weight: '40%', color: '#42A5F5' },
                        { label: '환경 보정', value: indScore.rWeight, weight: '20%', color: '#66BB6A' },
                    ].map((item) => (
                        <div key={item.label} className="text-center">
                            <p className="text-[10px] font-bold tracking-wider text-gray-400">{item.label}</p>
                            <div className="mt-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                                <div className="h-full rounded-full" style={{ width: `${Math.round(item.value * 100)}%`, background: item.color, transition: 'width 1s ease-out' }} />
                            </div>
                            <p className="text-[10px] font-bold mt-0.5" style={{ color: item.color }}>{Math.round(item.value * 100)}% <span className="text-gray-300">({item.weight})</span></p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 2. 바이오리듬 미니 카드 ── */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-base">🔮</span>
                        <p className="text-xs font-bold tracking-wider uppercase text-sage">오늘의 컨디션</p>
                    </div>
                    {biorhythm.isZeroCrossing && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(244,67,54,0.1)', color: '#F44336' }}>
                            ⚡ 에너지 전환
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {(['physical', 'emotional', 'intellectual'] as const).map((key) => {
                        const meta = BIORHYTHM_LABELS[key];
                        const value = biorhythm[key];
                        const percent = Math.round((value + 1) / 2 * 100);
                        return (
                            <div key={key} className="text-center rounded-xl p-3" style={{ background: `${meta.color}08` }}>
                                <p className="text-lg mb-1">{meta.emoji}</p>
                                <p className="text-[10px] font-bold tracking-wider" style={{ color: meta.color }}>{meta.label}</p>
                                <div className="mt-1.5 h-1 rounded-full overflow-hidden bg-gray-100">
                                    <div className="h-full rounded-full" style={{ width: `${percent}%`, background: meta.color, transition: 'width 1s ease-out' }} />
                                </div>
                                <p className="text-xs font-bold mt-1" style={{ color: value >= 0 ? meta.color : undefined }}>
                                    <span className={value < 0 ? 'text-gray-400' : ''}>{value >= 0 ? '+' : ''}{Math.round(value * 100)}%</span>
                                </p>
                                <p className="text-[9px] text-gray-400">{meta.period}일 주기</p>
                            </div>
                        );
                    })}
                </div>
                {biorhythm.isZeroCrossing && (
                    <p className="text-[12px] mt-3 pt-2 leading-relaxed border-t border-gray-100" style={{ color: '#F44336' }}>
                        ⚠️ 지금은 신체·감성·지성 에너지가 전환되는 불안정한 시기입니다. 중요한 계약이나 결정은 피하세요.
                    </p>
                )}
            </div>

            {/* ── 3. 리스크 + 켈리 전략 (2열) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 리스크 패널 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">{riskMsg.emoji}</span>
                        <p className="text-xs font-bold tracking-wider" style={{ color: riskMsg.color }}>{riskMsg.title}</p>
                    </div>
                    <p className="text-[12px] leading-relaxed mb-3 text-gray-600">{riskDynamics.riskMessage}</p>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-[9px] font-bold tracking-wider text-gray-400">외부 충격</p>
                            <p className="text-sm font-black text-gray-600" style={riskDynamics.mEvent > 2.5 ? { color: '#F44336' } : undefined}>{riskDynamics.mEvent}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-bold tracking-wider text-gray-400">정체 깊이</p>
                            <p className="text-sm font-black text-gray-600">{riskDynamics.sDepth}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-bold tracking-wider text-gray-400">돌파력</p>
                            <p className="text-sm font-black text-gray-600">{riskDynamics.vEsc}</p>
                        </div>
                    </div>
                </div>

                {/* 켈리 전략 카드 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">{kellyStrategy.strategyType === 'ATTACK' ? '⚔️' : '🛡️'}</span>
                        <p className="text-xs font-bold tracking-wider" style={{ color: kellyStrategy.strategyType === 'ATTACK' ? '#4CAF50' : '#FF9800' }}>
                            {kellyStrategy.strategyType === 'ATTACK' ? '공격 전략' : '방어 전략'}
                        </p>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-black" style={{ color: kellyStrategy.strategyType === 'ATTACK' ? '#4CAF50' : '#FF9800' }}>
                            {kellyStrategy.allocation}
                        </span>
                        <span className="text-sm font-bold text-gray-400">% 투입</span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-gray-600">{kellyStrategy.message}</p>
                </div>
            </div>

            {/* ── 4. 에너지 루프 + 격자 해석 (2열) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 에너지 루프 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{loopMsg.emoji}</span>
                        <p className="text-xs font-bold tracking-wider" style={{ color: loopMsg.color }}>{loopMsg.title}</p>
                    </div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2" style={{ background: `${loopMsg.color}12`, color: loopMsg.color }}>
                        {energyLoop.loopType === 'SPIRITUAL' ? '내면 에너지 흐름' : '현실 에너지 흐름'}
                    </span>
                    <p className="text-[12px] leading-relaxed text-gray-600">{energyLoop.message}</p>
                </div>

                {/* 격자 해석 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">🔷</span>
                        <p className="text-xs font-bold tracking-wider uppercase text-sage">에너지 해석</p>
                    </div>
                    <div className="space-y-2">
                        {[
                            { label: '근본 테마', text: gridInterpretation.base10.theme, color: '#7E57C2' },
                            { label: '전환점', text: gridInterpretation.base22.theme, color: '#42A5F5' },
                            { label: '대운 흐름', text: gridInterpretation.base60.theme, color: '#66BB6A' },
                        ].map((g) => (
                            <div key={g.label} className="flex gap-2 items-start">
                                <span className="shrink-0 text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded" style={{ background: `${g.color}12`, color: g.color }}>{g.label}</span>
                                <p className="text-[11px] leading-snug text-gray-600">{g.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 5. 프랙탈 공명 예측 ── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🌀</span>
                    <p className="text-xs font-bold tracking-wider uppercase text-sage">미래 에너지 예측</p>
                </div>
                <p className="text-[12px] leading-relaxed text-gray-600">
                    과거 <strong className="text-foreground">{fractalPrediction.seedAge}세</strong> 무렵 겪었던 중요한 사건의 에너지가
                    <strong style={{ color: '#7E57C2' }}> {fractalPrediction.nextResonanceAge}세</strong>({fractalPrediction.nextResonanceYear}년)에
                    비슷한 형태로 다시 찾아올 가능성이 높습니다. 이 시기에 유사한 테마의 사건이 반복되거나 확장될 수 있으니 미리 대비하세요.
                </p>
            </div>
        </div>
    );
}
