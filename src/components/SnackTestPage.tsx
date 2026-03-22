'use client';

import { useEffect, useState } from 'react';
import { SNACK_TESTS, SnackContentLibrary, SnackTest, SnackContent } from '@/lib/snack-tests';
import { TEST_THEMES, GENERIC_THEMES } from '@/lib/snack-deep-analysis';
import { getBeLens } from '@/lib/snack-be-lens';
import { AnalysisResult } from '@/lib/arche-engine';
import { getINDScoreKey, IND_SCORE_MESSAGES, RISK_MESSAGES, LOOP_MESSAGES, BIORHYTHM_LABELS } from '@/lib/ind-narratives';

/**
 * 개별 스낵 테스트 결과 페이지 — 풀 리포트 몰입형 디자인
 *
 * Phase 1: 인트로 (테스트 제목 + 기대감 빌드)
 * Phase 2: 풀 리포트 (본문 + 심층분석 + LP 패턴 + 조언 + 경고)
 */

interface Props {
    testId: string;
}

// ── LP별 (운명수) 성향 키워드 ──
const LP_TRAITS: Record<number, { archetype: string; strength: string; weakness: string; element: string; color: string }> = {
    1: { archetype: '개척자', strength: '독립심과 리더십', weakness: '고집과 통제욕', element: '🔥 불', color: '#FF6B6B' },
    2: { archetype: '조율자', strength: '공감력과 협력', weakness: '우유부단과 의존', element: '💧 물', color: '#64B5F6' },
    3: { archetype: '표현자', strength: '창의력과 소통', weakness: '산만함과 과시', element: '🌤️ 바람', color: '#FFD54F' },
    4: { archetype: '건설자', strength: '체계성과 인내', weakness: '경직성과 불안', element: '🪨 땅', color: '#A1887F' },
    5: { archetype: '탐험가', strength: '자유와 적응력', weakness: '충동과 불안정', element: '⚡ 번개', color: '#69F0AE' },
    6: { archetype: '보호자', strength: '헌신과 책임감', weakness: '과보호와 자기희생', element: '🌿 나무', color: '#81C784' },
    7: { archetype: '사색가', strength: '분석력과 직관', weakness: '고립과 냉소', element: '🌙 달', color: '#B388FF' },
    8: { archetype: '지배자', strength: '실행력과 야망', weakness: '권력욕과 소진', element: '🏔️ 산', color: '#FFB74D' },
    9: { archetype: '현자', strength: '이상주의와 박애', weakness: '초연과 회피', element: '🌊 바다', color: '#80CBC4' },
};

// ── BE별 (본질수) 성향 키워드 ──
const BE_TRAITS: Record<number, { core: string; innerDrive: string; blindSpot: string; keyword: string }> = {
    1: { core: '독립적 자아', innerDrive: '스스로 길을 개척하려는 본능', blindSpot: '도움 요청을 약함으로 인식', keyword: '자기결정' },
    2: { core: '관계적 자아', innerDrive: '조화와 연결을 통해 존재를 확인', blindSpot: '자기 감정을 타인 뒤에 숨김', keyword: '공감' },
    3: { core: '표현적 자아', innerDrive: '내면을 외부로 투사하려는 충동', blindSpot: '깊이보다 넓이를 추구', keyword: '창조' },
    4: { core: '구조적 자아', innerDrive: '혼돈 속에서 질서를 만들려는 본능', blindSpot: '유연성 부족으로 기회를 놓침', keyword: '안정' },
    5: { core: '자유로운 자아', innerDrive: '변화와 체험을 통한 성장', blindSpot: '깊이 대신 넓이만 추구', keyword: '모험' },
    6: { core: '돌봄의 자아', innerDrive: '타인의 안녕이 곧 자기 안녕', blindSpot: '자기 필요를 끝까지 무시', keyword: '헌신' },
    7: { core: '탐구적 자아', innerDrive: '진실과 본질을 향한 끝없는 질문', blindSpot: '지적 우월감으로 감정 차단', keyword: '분석' },
    8: { core: '성취적 자아', innerDrive: '현실에서 눈에 보이는 결과를 만들려는 집념', blindSpot: '멈추면 무가치해진다는 공포', keyword: '권력' },
    9: { core: '초월적 자아', innerDrive: '개인을 넘어선 큰 그림을 보려는 시야', blindSpot: '현실과의 거리두기로 가까운 관계 소홀', keyword: '이상' },
};

// ── LP×BE 교차 분석 ──
const CROSS_ANALYSIS: Record<string, string> = {};
// 동적 생성: LP와 BE의 조합에 따른 내면 갈등/시너지 분석
function getCrossAnalysis(lp: number, be: number): { tension: string; synergy: string; advice: string } {
    if (lp === be) return {
        tension: `당신의 외면과 내면이 같은 방향을 가리키고 있다. 이것은 성향이 극도로 집중되어 있다는 의미다. ${LP_TRAITS[lp].strength}이 강력하게 발현되지만, ${LP_TRAITS[lp].weakness} 역시 두 배로 증폭된다. 균형을 잡기 어려운 대신 한 분야에서 독보적 경지에 오를 수 있다.`,
        synergy: `내면과 외면이 완벽하게 정렬되어 있어 자기 확신이 강하다. 방향이 맞을 때 폭발적 에너지를 낸다.`,
        advice: `약점도 두 배이므로 의식적으로 반대 성향을 개발해야 한다. ${LP_TRAITS[lp].archetype}의 극단에서 벗어나 유연성을 키워라.`,
    };
    const lpT = LP_TRAITS[lp];
    const beT = BE_TRAITS[be];
    const isComplementary = Math.abs(lp - be) >= 4;
    return {
        tension: `당신의 운명적 방향(${lpT.archetype})은 ${lpT.strength}을 요구하지만, 내면의 본질(${beT.core})은 ${beT.innerDrive}. 이 두 힘이 충돌할 때 당신은 겉과 속이 다른 자신을 발견하고 혼란에 빠진다. ${isComplementary ? '극과 극의 조합이라 갈등이 크지만 통합되면 가장 강력한 시너지를 낸다.' : '비슷하면서도 미묘하게 다른 방향이라 자기 안에서 끊임없는 미세 조정이 필요하다.'}`,
        synergy: `${lpT.archetype}의 외적 추진력과 ${beT.core}의 내적 동기가 합쳐지면 독특한 강점이 된다. 세상은 당신의 ${lpT.strength}을 보지만, 그 아래에서 작동하는 엔진은 ${beT.keyword}에 대한 갈망이다.`,
        advice: `갈등의 순간에는 내면의 ${beT.keyword}를 우선시하되, 표현 방식은 ${lpT.archetype}의 에너지를 활용하라. 내면의 동기와 외적 방향이 정렬될 때 최고의 결과가 나온다.`,
    };
}

// ── LP 기반 자동 생성 분석 섹션 ──
const LP_PATTERNS: Record<number, { trigger: string; defense: string; healing: string; shadow: string }> = {
    1: {
        trigger: '통제력을 잃거나 무시당할 때 가장 크게 동요한다. 누군가가 당신의 결정권을 빼앗으려 하면 본능적 반발이 올라온다.',
        defense: '강한 척, 괜찮은 척이 1번의 기본 방어기제다. 약함을 보이면 주도권을 잃는다는 무의식이 모든 관계에서 갑옷을 입히고 있다.',
        healing: '완벽하지 않아도 존중받을 수 있다는 경험이 치유의 시작이다. 통제를 내려놓은 순간 역설적으로 더 큰 영향력이 생긴다.',
        shadow: '혼자 해결하려다 모든 것을 그르치는 패턴. 도움을 구하는 것이 패배가 아님을 배워야 한다.',
    },
    2: {
        trigger: '갈등 상황에 노출되거나 선택을 강요받을 때 극심한 스트레스를 받는다. 조화가 깨지면 본인이 깨진 것처럼 느낀다.',
        defense: '타인의 기대에 맞추는 것이 2번의 생존 전략이다. 거절하면 관계가 끝난다는 공포가 모든 예스의 뒤에 숨어 있다.',
        healing: '자기 감정에도 타인의 감정과 같은 무게를 부여하는 연습이 필요하다. 아니라고 말해도 사랑받을 수 있다.',
        shadow: '자기 필요를 무시하다가 결국 관계 전체가 무너지는 패턴. 자기 돌봄이 이기심이 아님을 체득해야 한다.',
    },
    3: {
        trigger: '관심과 인정이 줄어들 때 존재 자체가 희미해지는 느낌이 든다. 무대가 없으면 자아가 흔들린다.',
        defense: '유머와 밝음으로 현실을 회피한다. 웃는 얼굴 뒤에 직면하지 못한 진짜 감정이 쌓이고 있다.',
        healing: '관객 없이도 가치 있는 존재라는 자각이 필요하다. 깊이에 대한 두려움을 넘어설 때 표면 아래의 보물을 발견한다.',
        shadow: '시작은 화려하지만 마무리가 없다. 끝까지 가면 평가받는다는 두려움이 모든 프로젝트를 미완성으로 남긴다.',
    },
    4: {
        trigger: '예측 불가능한 상황이나 계획의 변경이 극심한 불안을 유발한다. 통제할 수 없는 변수가 공포의 대상이다.',
        defense: '반복적이고 체계적인 루틴으로 불확실성을 차단한다. 규칙 뒤에 숨어 감정의 혼란을 피하고 있다.',
        healing: '의도적으로 작은 변화를 만들어보는 것이 유연성의 근육을 키운다. 불완전한 계획이 완벽한 계획보다 나을 때가 있다.',
        shadow: '변화를 거부하다가 정체되는 패턴. 쉬는 것에 죄책감을 느끼며 생산성에 자아를 묶어두고 있다.',
    },
    5: {
        trigger: '자유가 제한되거나 한 곳에 머물도록 강요받을 때 숨이 막힌다. 일상의 반복이 감옥처럼 느껴진다.',
        defense: '새로운 자극을 끊임없이 찾아 현재의 공허를 메운다. 떠나는 것이 쉬운 척하지만 사실은 머무르는 것이 두렵다.',
        healing: '한 곳에 뿌리를 내리는 실험이 필요하다. 깊이 있는 경험 하나가 넓고 얕은 경험 열 개를 압도한다.',
        shadow: '어떤 것도 끝까지 파고들지 못하고 다음으로 넘어가는 패턴. 자유가 목적이 아니라 수단임을 깨달아야 한다.',
    },
    6: {
        trigger: '가까운 사람이 고통받을 때 그 고통을 자신의 것으로 흡수한다. 도움의 손길이 닿지 않는 곳에서 무력감을 느낀다.',
        defense: '돌봄이 정체성이 되어 자기를 돌보는 시간을 죄악시한다. 필요한 사람이 되는 것으로 존재 가치를 증명한다.',
        healing: '빈 그릇으로는 다른 그릇을 채울 수 없다. 자기 돌봄을 이기심이 아닌 지속 가능성으로 재정의해야 한다.',
        shadow: '자기를 완전히 잃어버리는 패턴. 남의 행복에 자아를 녹여버려 자신이 누구인지 잊는다.',
    },
    7: {
        trigger: '감정적 친밀감을 요구받을 때 본능적으로 벽을 세운다. 깊은 유대 속에서 취약해지는 것이 공포다.',
        defense: '지적 우월감과 냉철한 분석으로 감정을 차단한다. 거리두기를 자존심이라 포장하며 고립을 선택이라 부른다.',
        healing: '감정의 문을 닫으면 상처도 막히지만 사랑도 막힌다. 한 사람에게라도 가면을 벗는 연습이 필요하다.',
        shadow: '지적 우월감 뒤에 숨어 인간적 연결을 차단하는 패턴. 외로움을 고독의 미학으로 합리화한다.',
    },
    8: {
        trigger: '약한 모습을 보이면 모든 것을 잃을 것이라는 공포. 경쟁에서 밀리거나 통제권을 상실할 때 극도의 불안이 발동한다.',
        defense: '끊임없이 더 높은 목표를 세우고 쉬지 않는 것으로 불안을 관리한다. 멈추면 추락한다는 강박이 엔진이다.',
        healing: '이기지 않아도 가치 있는 존재라는 것을 체득할 때 비로소 승리를 즐길 수 있게 된다. 결과가 아닌 과정에서 보람을.',
        shadow: '승리 중독으로 모든 것을 경쟁으로 환원하는 패턴. 사람의 가치를 이용 가치로 환산하고 나서 죄책감.',
    },
    9: {
        trigger: '세상의 불의와 고통에 과도하게 감정이입한다. 모든 것을 짊어진 듯한 무거움이 초연함의 이면에 존재한다.',
        defense: '철학적 초연함으로 현실 참여를 회피한다. 포기를 깨달음으로 포장하며 싸워야 할 때에도 손을 놓는다.',
        healing: '인류를 사랑하는 것은 쉽지만 한 사람을 깊이 사랑하는 것은 어렵다. 먼저 곁에 있는 한 사람부터 시작하라.',
        shadow: '거대한 사랑 뒤에 친밀한 관계 회피가 숨어 있다. 모든 사람에게 열려 있지만 아무에게도 특별하지 않다.',
    },
};

export default function SnackTestPage({ testId }: Props) {
    const [lp, setLp] = useState<number | null>(null);
    const [be, setBe] = useState<number | null>(null);
    const [lpDisplay, setLpDisplay] = useState<number | null>(null);
    const [beDisplay, setBeDisplay] = useState<number | null>(null);
    const [content, setContent] = useState<SnackContent | null>(null);
    const [phase, setPhase] = useState<'intro' | 'reveal'>('intro');
    const [indData, setIndData] = useState<AnalysisResult | null>(null);
    const test = SNACK_TESTS.find(t => t.id === testId);

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('arche_analysis');
            if (stored) {
                const parsed = JSON.parse(stored);
                const { ArcheEngine } = require('@/lib/arche-engine');
                const result = ArcheEngine.performAnalysis(parsed.year, parsed.month, parsed.day);
                setIndData(result);
                // 운명수 (alpha)
                const lpNum = result.lifePath;
                const lpBase = lpNum === 11 ? 2 : lpNum === 22 ? 4 : lpNum === 33 ? 6 : lpNum;
                setLp(lpBase);
                setLpDisplay(lpNum);
                // 본질수 (P_core)
                const beNum = result.bornEssence;
                const beBase = beNum === 11 ? 2 : beNum === 22 ? 4 : beNum === 33 ? 6 : beNum;
                setBe(beBase);
                setBeDisplay(beNum);
                const lib = SnackContentLibrary[testId];
                if (lib && lib[lpBase]) setContent(lib[lpBase]);
            }
        } catch {}
    }, [testId]);

    if (!test) return null;

    const traits = lp ? LP_TRAITS[lp] : null;
    const beTraits = be ? BE_TRAITS[be] : null;
    const patterns = lp ? LP_PATTERNS[lp] : null;
    const crossAnalysis = lp && be ? getCrossAnalysis(lp, be) : null;
    const beLens = lp && be ? getBeLens(be, testId) : null;

    // Deep analysis — USE BE for variation (LP for test-specific, BE for generic)
    const testTheme = TEST_THEMES[testId];
    const generic = be ? GENERIC_THEMES[be] : null;  // BE로 변경!
    const deepScenario = lp && testTheme ? testTheme.scenario[lp - 1] : generic?.scenario || '';
    const deepSelfCheck = lp && testTheme ? testTheme.selfCheck[lp - 1] : generic?.selfCheck || [];
    const deepRelationship = lp && testTheme ? testTheme.relationship[lp - 1] : generic?.relationship || '';
    const deepGrowth = lp && testTheme ? testTheme.growth[lp - 1] : generic?.growth || [];
    const deepWarning = lp && testTheme ? testTheme.warning[lp - 1] : generic?.warning || '';

    const handleShare = async () => {
        const url = window.location.href;
        const text = `${test.emoji} ${test.title} — 나의 결과 확인하기`;
        if (navigator.share) {
            try { await navigator.share({ title: test.title, text, url }); return; } catch {}
        }
        window.open(`https://story.kakao.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('링크가 복사되었습니다');
        } catch {}
    };

    const otherTests = SNACK_TESTS.filter(t => t.id !== testId).slice(0, 3);

    return (
        <div className="min-h-screen relative" style={{ background: '#08080F' }}>
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none" style={{ background: test.darkGradient, opacity: 0.6 }} />
            <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 20%, transparent 40%, #08080F 80%)' }} />

            {/* Nav */}
            <div className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(8,8,15,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <a href="/snack/" onClick={(e) => { e.preventDefault(); window.location.href = '/snack/'; }}
                   className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    전체 테스트
                </a>
                {content && (
                    <div className="flex items-center gap-2">
                        <button onClick={handleShare} className="px-3 py-1.5 rounded-full text-[11px] font-bold active:scale-95 transition-transform" style={{ background: '#FEE500', color: '#3C1E1E' }}>💬 공유</button>
                        <button onClick={handleCopy} className="px-3 py-1.5 rounded-full text-[11px] font-bold active:scale-95 transition-transform" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>🔗</button>
                    </div>
                )}
            </div>

            <div className="relative z-10 max-w-lg mx-auto px-5">
                {/* ═══ NO DATA ═══ */}
                {!content && lp === null && (
                    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
                        <span className="text-6xl block">{test.emoji}</span>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-white">{test.title}</h1>
                            <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{test.subtitle}</p>
                        </div>
                        <div className="space-y-3 w-full max-w-xs">
                            <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                이 테스트를 보려면 먼저<br />생년월일 분석이 필요합니다
                            </p>
                            <a href="/analyze/numerology/" onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/numerology/'; }}
                               className="block w-full py-4 rounded-2xl text-[15px] font-bold text-center transition-all active:scale-[0.97]"
                               style={{ background: `linear-gradient(135deg, ${test.accentColor}, ${test.accentColor}CC)`, color: '#fff', boxShadow: `0 8px 24px ${test.accentColor}30` }}>
                                ✦ 생년월일 입력하기
                            </a>
                        </div>
                    </div>
                )}

                {/* ═══ RESULT ═══ */}
                {content && (
                    <>
                        {/* ── Phase 1: Intro ── */}
                        {phase === 'intro' && (
                            <div className="min-h-[85vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
                                <div className="relative">
                                    <div className="absolute inset-0 blur-[60px] opacity-30" style={{ background: test.accentColor }} />
                                    <span className="relative text-7xl block">{test.emoji}</span>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: test.accentColor }}>{test.title}</p>
                                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight px-4">{content.title}</h1>
                                    {traits && <p className="text-[12px] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>나만의 결과가 준비되었습니다</p>}
                                </div>
                                <button
                                    onClick={() => setPhase('reveal')}
                                    className="mt-4 px-10 py-4 rounded-2xl text-[16px] font-black transition-all active:scale-[0.95]"
                                    style={{
                                        background: `linear-gradient(135deg, ${test.accentColor}30, ${test.accentColor}15)`,
                                        color: test.accentColor,
                                        border: `2px solid ${test.accentColor}40`,
                                        boxShadow: `0 0 40px ${test.accentColor}15`,
                                    }}>
                                    결과 확인하기
                                </button>
                                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.15)' }}>탭하여 풀 리포트를 확인하세요</p>
                            </div>
                        )}

                        {/* ── Phase 2: Full Report ── */}
                        {phase === 'reveal' && traits && patterns && (
                            <div className="pt-12 pb-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* ▸ Section 0: Report Header */}
                                <div className="text-center space-y-3 pb-4">
                                    <span className="text-4xl block">{test.emoji}</span>
                                    <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: test.accentColor }}>{test.title}</p>
                                    <h1 className="text-2xl font-black text-white">{content.title}</h1>
                                    {lpDisplay && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${test.accentColor}10`, border: `1px solid ${test.accentColor}20` }}>
                                            <span className="text-[11px] font-bold" style={{ color: test.accentColor }}>LP {lpDisplay} · {traits.archetype}</span>
                                        </div>
                                    )}
                                </div>

                                {/* ▸ Section 1: 핵심 분석 (Main Body) */}
                                <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${test.accentColor}15` }}>
                                    <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${test.accentColor}, transparent)` }} />
                                    <div className="p-5 md:p-7">
                                        <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: test.accentColor }}>핵심 분석</p>
                                        {Array.isArray(content.body) ? (
                                            <ul className="space-y-5">
                                                {content.body.map((line, i) => (
                                                    <li key={i} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 200}ms`, animationFillMode: 'backwards' }}>
                                                        <div className="shrink-0 mt-1">
                                                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black" style={{ background: `${test.accentColor}15`, color: test.accentColor }}>
                                                                {i + 1}
                                                            </div>
                                                        </div>
                                                        <p className="text-[15px] leading-[1.9] flex-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{line}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-[15px] leading-[2] font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{content.body}</p>
                                        )}
                                        {/* BE 렌즈 — LP 결과를 BE 관점으로 재해석 */}
                                        {beLens && beLens.bodyLens && (
                                            <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                                <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>당신의 내면이 이 결과를 변형시킨다</p>
                                                <p className="text-[14px] leading-[2]" style={{ color: 'rgba(255,255,255,0.6)' }}>{beLens.bodyLens}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ▸ Section 2: 심층 해석 (Insight) */}
                                {content.insight && (
                                    <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms', animationFillMode: 'backwards', background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${test.accentColor}50` }}>
                                        <div className="p-5 md:p-7">
                                            <div className="flex items-center gap-2 mb-4">
                                                <svg className="w-4 h-4" style={{ color: test.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: test.accentColor }}>심층 해석</span>
                                            </div>
                                            <p className="text-[14px] leading-[2]" style={{ color: 'rgba(255,255,255,0.65)' }}>{content.insight}</p>
                                            {/* BE 렌즈 — 인사이트 재해석 */}
                                            {beLens && beLens.insightLens && (
                                                <p className="text-[14px] leading-[2] mt-4 pt-4" style={{ color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>{beLens.insightLens}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ▸ Section 3: LP × BE 듀얼 프로필 카드 */}
                                <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '500ms', animationFillMode: 'backwards', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div className="p-5 md:p-7">
                                        <div className="flex items-center gap-2 mb-5">
                                            <span className="text-lg">🧬</span>
                                            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: test.accentColor }}>두 개의 숫자가 만드는 당신</span>
                                        </div>
                                        {/* 듀얼 넘버 비주얼 */}
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: `${traits.color}10`, border: `1px solid ${traits.color}25` }}>
                                                <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: traits.color }}>운명의 방향</p>
                                                <p className="text-2xl font-black" style={{ color: traits.color }}>{traits.archetype}</p>
                                                <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{traits.element}</p>
                                            </div>
                                            <div className="text-[18px] font-black" style={{ color: 'rgba(255,255,255,0.1)' }}>×</div>
                                            {beTraits && (
                                                <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                    <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: '#E0E0E0' }}>내면의 본질</p>
                                                    <p className="text-2xl font-black" style={{ color: '#E0E0E0' }}>{beTraits.core}</p>
                                                    <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{beTraits.keyword}</p>
                                                </div>
                                            )}
                                        </div>
                                        {/* 4칸 그리드 */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <p className="text-[9px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>외적 강점</p>
                                                <p className="text-[13px] font-bold text-white leading-snug">{traits.strength}</p>
                                            </div>
                                            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <p className="text-[9px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>외적 그림자</p>
                                                <p className="text-[13px] font-bold text-white leading-snug">{traits.weakness}</p>
                                            </div>
                                            {beTraits && (
                                                <>
                                                    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                        <p className="text-[9px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>본질 내면 동력</p>
                                                        <p className="text-[13px] font-bold text-white leading-snug">{beTraits.innerDrive}</p>
                                                    </div>
                                                    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                        <p className="text-[9px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>본질 사각지대</p>
                                                        <p className="text-[13px] font-bold text-white leading-snug">{beTraits.blindSpot}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ▸ Section 3.5: LP × BE 교차 분석 */}
                                {crossAnalysis && (
                                    <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '600ms', animationFillMode: 'backwards', background: 'rgba(255,255,255,0.02)', border: `1px solid ${test.accentColor}12` }}>
                                        <div className="p-5 md:p-7 space-y-5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">⚡</span>
                                                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: test.accentColor }}>겉과 속의 교차 분석</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF6B6B' }} />
                                                        <p className="text-[11px] font-black tracking-wider uppercase" style={{ color: '#FF6B6B' }}>내면 갈등</p>
                                                    </div>
                                                    <p className="text-[14px] leading-[1.9] pl-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{crossAnalysis.tension}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#69F0AE' }} />
                                                        <p className="text-[11px] font-black tracking-wider uppercase" style={{ color: '#69F0AE' }}>시너지</p>
                                                    </div>
                                                    <p className="text-[14px] leading-[1.9] pl-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{crossAnalysis.synergy}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FFD54F' }} />
                                                        <p className="text-[11px] font-black tracking-wider uppercase" style={{ color: '#FFD54F' }}>활용 조언</p>
                                                    </div>
                                                    <p className="text-[14px] leading-[1.9] pl-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{crossAnalysis.advice}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ▸ Section 4: 무의식 패턴 분석 */}
                                <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '700ms', animationFillMode: 'backwards', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="p-5 md:p-7 space-y-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">🔮</span>
                                            <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: test.accentColor }}>무의식 패턴 분석</span>
                                        </div>

                                        {/* 트리거 */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF6B6B' }} />
                                                <p className="text-[11px] font-black tracking-wider uppercase" style={{ color: '#FF6B6B' }}>트리거 — 이것이 당신을 흔든다</p>
                                            </div>
                                            <p className="text-[14px] leading-[1.9] pl-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{patterns.trigger}</p>
                                        </div>

                                        {/* 방어기제 */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FFD54F' }} />
                                                <p className="text-[11px] font-black tracking-wider uppercase" style={{ color: '#FFD54F' }}>방어기제 — 당신이 자신을 보호하는 법</p>
                                            </div>
                                            <p className="text-[14px] leading-[1.9] pl-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{patterns.defense}</p>
                                        </div>

                                        {/* 그림자 패턴 */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#B388FF' }} />
                                                <p className="text-[11px] font-black tracking-wider uppercase" style={{ color: '#B388FF' }}>반복되는 그림자 패턴</p>
                                            </div>
                                            <p className="text-[14px] leading-[1.9] pl-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{patterns.shadow}</p>
                                        </div>

                                        {/* 치유 */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#69F0AE' }} />
                                                <p className="text-[11px] font-black tracking-wider uppercase" style={{ color: '#69F0AE' }}>치유의 열쇠</p>
                                            </div>
                                            <p className="text-[14px] leading-[1.9] pl-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{patterns.healing}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ▸ Section 5: 실전 시나리오 */}
                                {deepScenario && (
                                    <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '900ms', animationFillMode: 'backwards', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="p-5 md:p-7">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-lg">🎬</span>
                                                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: test.accentColor }}>실전 시나리오 — 이런 순간이 있었을 것이다</span>
                                            </div>
                                            <p className="text-[14px] leading-[2]" style={{ color: 'rgba(255,255,255,0.7)' }}>{deepScenario}</p>
                                        </div>
                                    </div>
                                )}

                                {/* ▸ Section 6: 자기 점검 체크리스트 */}
                                {deepSelfCheck.length > 0 && (
                                    <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '1100ms', animationFillMode: 'backwards', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="p-5 md:p-7">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-lg">📋</span>
                                                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: test.accentColor }}>자기 점검 — 해당되는 항목을 세어보세요</span>
                                            </div>
                                            <div className="space-y-3">
                                                {deepSelfCheck.map((q, i) => (
                                                    <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                        <div className="shrink-0 mt-0.5 w-5 h-5 rounded border flex items-center justify-center text-[10px] font-bold" style={{ borderColor: `${test.accentColor}30`, color: test.accentColor }}>{i + 1}</div>
                                                        <p className="text-[13px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.65)' }}>{q}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[12px] mt-4 pt-3" style={{ color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>3개 이상 해당된다면 이 패턴이 당신의 삶에 깊이 뿌리내린 상태입니다</p>
                                        </div>
                                    </div>
                                )}

                                {/* ▸ Section 7: 관계 영향 분석 */}
                                {deepRelationship && (
                                    <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '1300ms', animationFillMode: 'backwards', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="p-5 md:p-7">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-lg">💞</span>
                                                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: test.accentColor }}>대인관계 영향 분석</span>
                                            </div>
                                            <p className="text-[14px] leading-[2]" style={{ color: 'rgba(255,255,255,0.7)' }}>{deepRelationship}</p>
                                        </div>
                                    </div>
                                )}

                                {/* ▸ Section 8: 성장 로드맵 + 위험 신호 */}
                                {deepGrowth.length > 0 && (
                                    <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '1500ms', animationFillMode: 'backwards', background: 'rgba(255,255,255,0.03)', border: `1px solid ${test.accentColor}10` }}>
                                        <div className="p-5 md:p-7 space-y-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">🌱</span>
                                                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: '#69F0AE' }}>성장 로드맵</span>
                                            </div>
                                            <div className="space-y-4">
                                                {deepGrowth.map((step, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className="shrink-0">
                                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black" style={{ background: i === 0 ? '#69F0AE20' : i === 1 ? '#FFD54F20' : '#B388FF20', color: i === 0 ? '#69F0AE' : i === 1 ? '#FFD54F' : '#B388FF' }}>{i + 1}</div>
                                                        </div>
                                                        <p className="text-[13px] leading-[1.9] flex-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* 위험 신호 */}
                                            {deepWarning && (
                                                <div className="mt-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.12)' }}>
                                                        <span className="shrink-0 text-base mt-0.5">⚠️</span>
                                                        <div>
                                                            <p className="text-[10px] font-black tracking-wider uppercase mb-1" style={{ color: '#FF6B6B' }}>위험 신호</p>
                                                            <p className="text-[13px] leading-[1.8]" style={{ color: 'rgba(255,107,107,0.8)' }}>{deepWarning}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ▸ Section 9: 한 줄 메시지 */}
                                <div className="text-center py-6 animate-in fade-in duration-500" style={{ animationDelay: '1700ms', animationFillMode: 'backwards' }}>
                                    <div className="h-px mx-auto w-16 mb-6" style={{ background: `${test.accentColor}40` }} />
                                    <p className="text-[18px] font-serif italic leading-relaxed px-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                        &ldquo;{traits.archetype}의 진짜 힘은 자기 그림자를 직면할 때 깨어난다&rdquo;
                                    </p>
                                    <p className="text-[11px] mt-3 font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.15)' }}>— WHOAMI DEEP ANALYSIS</p>
                                </div>

                                {/* ▸ Section IND: 통합수리 동역학 미니 리포트 */}
                                {indData && indData.indScore && (() => {
                                    const scoreKey = getINDScoreKey(indData.indScore.scoreTotal);
                                    const scoreMsg = IND_SCORE_MESSAGES[scoreKey];
                                    const riskMsg = RISK_MESSAGES[indData.riskDynamics.riskLevel];
                                    const loopMsg = LOOP_MESSAGES[indData.energyLoop.loopType];
                                    const scorePercent = Math.round(indData.indScore.scoreTotal * 100);
                                    const gaugeColor = indData.indScore.scoreTotal >= 0.85 ? '#FFD700' : indData.indScore.scoreTotal >= 0.7 ? '#69F0AE' : indData.indScore.scoreTotal >= 0.5 ? '#64B5F6' : indData.indScore.scoreTotal >= 0.3 ? '#FFB74D' : '#FF6B6B';
                                    return (
                                        <div className="rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4" style={{ animationDelay: '1900ms', animationFillMode: 'backwards' }}>
                                            {/* 헤더 */}
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-lg">🌀</span>
                                                <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: test.accentColor }}>운명 에너지 분석</span>
                                                <div className="flex-1 h-px" style={{ background: `${test.accentColor}25` }} />
                                            </div>

                                            {/* 길흉 게이지 */}
                                            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${test.accentColor}15` }}>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
                                                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                                                            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                                                            <circle cx="60" cy="60" r="50" fill="none" stroke={gaugeColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${scorePercent * 3.14} ${314 - scorePercent * 3.14}`} />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <span className="text-lg font-black" style={{ color: gaugeColor }}>{scorePercent}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[11px] font-bold" style={{ color: gaugeColor }}>{scoreMsg.emoji} {scoreMsg.title}</p>
                                                        <p className="text-[12px] leading-relaxed mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{scoreMsg.advice}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 바이오리듬 + 리스크 + 전략 미니 그리드 */}
                                            <div className="grid grid-cols-3 gap-2">
                                                {/* 바이오리듬 */}
                                                <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                    <p className="text-[9px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>컨디션</p>
                                                    <div className="flex justify-center gap-1 mt-1">
                                                        {(['physical', 'emotional', 'intellectual'] as const).map((k) => {
                                                            const meta = BIORHYTHM_LABELS[k];
                                                            const v = indData.biorhythm[k];
                                                            return <span key={k} className="text-[10px] font-bold" style={{ color: v >= 0 ? meta.color : 'rgba(255,255,255,0.2)' }}>{meta.emoji}</span>;
                                                        })}
                                                    </div>
                                                    {indData.biorhythm.isZeroCrossing && <p className="text-[8px] mt-0.5" style={{ color: '#FF6B6B' }}>⚡ 에너지 전환</p>}
                                                </div>
                                                {/* 리스크 */}
                                                <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                    <p className="text-[9px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>리스크</p>
                                                    <p className="text-base mt-0.5">{riskMsg.emoji}</p>
                                                    <p className="text-[9px] font-bold mt-0.5" style={{ color: riskMsg.color }}>{riskMsg.title}</p>
                                                </div>
                                                {/* 전략 */}
                                                <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                    <p className="text-[9px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>투입 전략</p>
                                                    <p className="text-lg font-black mt-0.5" style={{ color: indData.kellyStrategy.strategyType === 'ATTACK' ? '#69F0AE' : '#FFB74D' }}>{indData.kellyStrategy.allocation}%</p>
                                                    <p className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>{indData.kellyStrategy.strategyType === 'ATTACK' ? '공격' : '방어'}</p>
                                                </div>
                                            </div>

                                            {/* 에너지 루프 */}
                                            <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <span className="text-base">{loopMsg.emoji}</span>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold" style={{ color: loopMsg.color }}>{loopMsg.title} · {indData.energyLoop.loopType === 'SPIRITUAL' ? '내면 에너지' : '현실 에너지'}</p>
                                                    <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{indData.energyLoop.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* ▸ CTA */}
                                <div className="space-y-3 animate-in fade-in duration-300" style={{ animationDelay: '1100ms', animationFillMode: 'backwards' }}>
                                    <button onClick={handleShare}
                                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-black transition-all active:scale-[0.97]"
                                        style={{ background: '#FEE500', color: '#3C1E1E' }}>
                                        💬 카카오톡으로 공유하기
                                    </button>
                                    <button onClick={handleCopy}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold transition-all active:scale-[0.97]"
                                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        🔗 링크 복사
                                    </button>
                                </div>

                                {/* ▸ 다음 테스트 */}
                                <div className="pt-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>다음 테스트</span>
                                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                    </div>
                                    <div className="space-y-2">
                                        {otherTests.map(t => (
                                            <a key={t.id} href={`/snack/${t.id}/`} onClick={(e) => { e.preventDefault(); window.location.href = `/snack/${t.id}/`; }}
                                               className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                                               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                                                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: t.gradient }}>
                                                    {t.emoji}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] font-bold text-white truncate">{t.title}</p>
                                                    <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.subtitle}</p>
                                                </div>
                                                <svg className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.15)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center pt-4 pb-8">
                                    <a href="/snack/" onClick={(e) => { e.preventDefault(); window.location.href = '/snack/'; }}
                                       className="text-[12px] font-bold" style={{ color: 'rgba(255,255,255,0.12)' }}>
                                        ← 전체 테스트 보기
                                    </a>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
