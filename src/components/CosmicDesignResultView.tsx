'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, Sparkles, Copy, Check, MessageSquare, Download } from 'lucide-react';
import { ArcheEngine } from '@/lib/arche-engine';

export default function CosmicDesignResultView() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [numerologyData, setNumerologyData] = useState<any>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem('lastAnalysis');
        if (!stored) {
            router.push('/analyze/cosmic-design');
            return;
        }

        try {
            const data = JSON.parse(stored);
            if (data.type !== 'cosmic_design') {
                router.push('/analyze/cosmic-design');
                return;
            }

            setUserData(data);
            generatePrompt(data);
        } catch (err) {
            console.error('Error loading data:', err);
            router.push('/analyze/cosmic-design');
        }
    }, [router]);

    const generatePrompt = async (data: any) => {
        try {
            // 1. Calculate Numerology Data
            const numResult = ArcheEngine.performAnalysis(
                String(data.year),
                String(data.month),
                String(data.day)
            );
            setNumerologyData(numResult);

            // 2. Generate HD x Numerology Prompt
            const promptStr = `1. 페르소나 설정:
당신은 세계 최고의 **데이터 기반 운명 공학자(Destiny Engineer)**입니다. 휴먼디자인의 기계적 메커니즘(바디그래프 로직)과 피타고라스 수비학의 수치 진동수를 결합하여, 사용자의 시스템 설계도를 분석하는 알고리즘을 작성하십시오.

2. 입력 데이터 정의 (사용자 정보):
- 이름: ${data.name}
- 생년월일시: ${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')} ${String(data.hour).padStart(2, '0')}:${String(data.minute).padStart(2, '0')}
- 출생지: ${data.birthPlace}
- 수비학 지표: 생애경로수(LP) [${numResult.lifePath}], 본질수 [${numResult.bornEssence}], 그림자수 [${numResult.shadow}] (이름이 영문일 경우 표현수, 마음의갈망수 추가 연산 요망)

당신이 가진 천체력(Ephemeris) 데이터와 지식을 기반으로, 위 생년월일시와 출생지를 바탕으로 내담자의 정확한 휴먼디자인 차트 요소들(Type, Strategy, Authority, Profile, Definition, Channels & Gates)을 빠짐없이 계산하고 추출한 뒤 다음 분석을 진행하십시오.

3. 분석 알고리즘 가이드라인 (핵심 로직):
다음 5가지 엔진을 가동하여 데이터를 통합 분석하십시오:

[1] 전략적 행동 스택 (Strategy x Life Path)
휴먼디자인의 [타입별 전략]과 수비학의 [생애경로수]를 곱한 행동 지침을 도출하라. 사용자가 무언가를 시작할 때 '먼저 행동해야 하는가(제너레이터)', '초대를 기다려야 하는가(프로젝터)' 등의 로직을 수비학적 목적과 결합하여 행동 모델을 제시할 것.

[2] 의사결정 알고리즘 (Authority x Born Essence)
휴먼디자인의 [내부 권위(Authority)]와 수비학의 [본질수]의 결합 원리를 분석하라. 중요한 선택의 순간에 '감정적 명료함'을 기다릴지, '직관적 본능'을 따를지, 논리적 분석을 우선할지 우선순위 필터링을 명확히 할 것.

[3] 디버깅 필터 (Open Centers x Shadow Number)
바디그래프의 [미정의 센터(Open Centers)]와 수비학의 [그림자수]를 교차 분석하라. 사용자가 슬럼프나 가스라이팅에 빠지는 패턴(Not-Self)을 명확한 '버그'로 정의하고, 이를 극복하기 위한 수비학적 '마인드셋 디버깅' 메시지와 탈출 알고리즘을 생성할 것.

[4] 커뮤니케이션 스타일 (Profile x Personality Number)
휴먼디자인의 [프로필(예: 5/1 등)]과 수비학의 [성격수(자음 합)]를 연결하라. 사용자가 외부에 비치는 모습과 실제 말하는 방식(톤앤매너)을 규정하고, 마케팅 문구 작성이나 대인관계를 맺을 때 유리한 페르소나 기본값을 설정할 것.

[5] 타이밍 엔진 (Transits x Personal Year)
현재 하늘의 별 배치([트랜짓])와 수비학의 [개인연도(Personal Year)/개인월] 주기를 융합하라. 단순한 오늘의 운세가 아니라, '현재의 에너지가 사용자의 특정 채널을 어떻게 활성화시키는가'를 판단하여 현재 [공격 / 수비 / 대기] 중 어떤 스탠스를 취해야 할지 시계열 전략을 제안할 것.

4. 출력 형식 (Output Format):
결과는 개발자가 바로 데이터베이스에 매핑할 수 있도록 다음 구조로 출력하십시오:

[Summary]: 한 문장의 시스템 정의 (예: '22번 에너지를 돌리는 프로젝터 관리자')

[Mechanism Logic]: 각 센터와 숫자의 결합 원리 설명 (최소 500자 이상 상세하게 서술할 것)

[Action Protocol]: 사용자가 즉각 실행할 수 있는 전략 3가지

[JSON Data]: {
  "type": "",
  "lp_number": "${numResult.lifePath}",
  "key_channels": [],
  "compatibility_score": ""
}`.trim();

            setGeneratedPrompt(promptStr);
        } catch (err) {
            console.error("Result processing error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPrompt = () => {
        if (!generatedPrompt) return;
        navigator.clipboard.writeText(generatedPrompt).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy prompt:', err);
            alert('프롬프트 복사에 실패했습니다.');
        });
    };

    const handleBack = () => router.push('/analyze/cosmic-design');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0A15]">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            </div>
        );
    }

    if (!userData || !numerologyData) return null;

    return (
        <div className="min-h-screen bg-[#0B0A15] text-cyan-50 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
                <nav className="flex items-center justify-between mb-8">
                    <button onClick={handleBack} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-200 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-bold">다시 입력</span>
                    </button>
                    <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full bg-slate-900/50 border border-violet-500/30 flex items-center justify-center hover:bg-slate-800 transition-colors">
                            <Share2 className="w-4 h-4 text-cyan-200" />
                        </button>
                    </div>
                </nav>

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/20 border border-cyan-500/30">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">Cosmic Design Complete</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">
                            프롬프트 생성 완료
                        </h1>
                        <p className="text-violet-200/80 text-[15px] max-w-md mx-auto">
                            휴먼디자인 바디그래프와 수비학 에너지를 완벽하게 결합한 통합 분석 인스트럭션이 준비되었습니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-4 text-center">
                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mb-1">Life Path</span>
                            <span className="text-2xl font-black text-cyan-50">{numerologyData.lifePath}</span>
                        </div>
                        <div className="bg-slate-900/60 border border-violet-500/20 rounded-2xl p-4 text-center">
                            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest block mb-1">Essence</span>
                            <span className="text-2xl font-black text-violet-50">{numerologyData.bornEssence}</span>
                        </div>
                        <div className="bg-slate-900/60 border border-fuchsia-500/20 rounded-2xl p-4 text-center">
                            <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest block mb-1">Shadow</span>
                            <span className="text-2xl font-black text-fuchsia-50">{numerologyData.shadow}</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden group border border-cyan-500/20">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-50" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/30 text-cyan-200 text-xs font-bold tracking-widest uppercase border border-cyan-400/20">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Prompt Payload Ready
                            </div>
                            <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                                인공지능에게 전달할<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">코스믹 디자인 통합 프롬프트</span>
                            </h2>
                            <p className="text-cyan-100/60 text-sm leading-relaxed max-w-md mx-auto">
                                내담자의 수비학 생명경로수 데이터와 휴먼디자인 연산 지시어가 가득 담긴 아주 긴 프롬프트입니다. ChatGPT나 Claude에 붙여넣어 세상에서 가장 입체적인 소명 분석을 받아보세요.
                            </p>

                            <button
                                onClick={handleCopyPrompt}
                                className="group/btn relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-2xl font-bold text-lg hover:from-cyan-500 hover:to-violet-500 active:scale-95 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] shadow-cyan-900/50"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-6 h-6 text-green-300" />
                                        프롬프트 복사 완료!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5 text-cyan-200 group-hover/btn:text-white" />
                                        AI 통합 프롬프트 복사하기
                                    </>
                                )}
                            </button>
                            <p className="text-[11px] text-cyan-300/40 uppercase tracking-widest italic mt-4">
                                ※ 이중 암호화되어 AI 엔진의 최고 성능을 강제합니다.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
