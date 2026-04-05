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
            const promptStr = `당신은 세계 최고의 휴먼디자인(Human Design) 분석가이자 수비학(Numerology)의 대가입니다.
이름: ${data.name}
생년월일(양력 기준): ${data.year}년 ${data.month}월 ${data.day}일
태어난 시간: ${data.hour}시 ${data.minute}분
태어난 곳: ${data.birthPlace}

그리고 이 사람의 수비학생명경로수(Life Path Number)는 [${numResult.lifePath}] 이며, 본질수(Born Essence)는 [${numResult.bornEssence}] 이고, 무의식적 그림자수(Shadow Number)는 [${numResult.shadow}] 입니다.

[작성 가이드라인 - 매우 중요]
1. 당신이 가진 천체력(Ephemeris) 데이터와 지식을 기반으로, 위 생년월일시와 출생지를 바탕으로 내담자의 정확한 휴먼디자인 차트 요소들을 빠짐없이 계산하고 추출하십시오:
   - Type (타입): 에너지 운영 방식
   - Strategy (전략): 행동 지침
   - Authority (권위): 의사결정 알고리즘
   - Profile (프로필): 사회적 역할 (12가지 조합)
   - Definition (정의): 9개 센터의 활성화(Defined) vs 미정의(Undefined) 여부 파악
   - Channels & Gates (채널과 게이트): 64개 게이트 중 활성화된 번호와 이를 잇는 36개 채널 데이터

2. 수비학(Numerology) 연산은 피타고라스 체계를 따르며 1~9 또는 마스터 넘버(11, 22, 33) 체계로 계산됩니다. 이미 입력된 생애경로수, 본질수, 그림자수 외에도 필요에 따라 다음의 수비학 지표들을 연계하여 통변하십시오. (특히 영문 이름이 있다면 표현수/갈망수/성격수를 파악하십시오)
   - 생애 경로 수 (Life Path): 인생의 메인 엔진
   - 본질 수 (Born Essence): 타고난 기질
   - 표현 수 (Expression): 영문 성명의 알파벳 치환 합산 (재능과 페르소나)
   - 마음의 갈망 수 (Soul Urge): 이름의 '모음'만 합산 (내적 동기)
   - 성격 수 (Personality): 이름의 '자음'만 합산 (외적 인상)
   - 그림자 수 (Shadow): 약점과 취약점 지표

3. 단순한 정보 나열을 절대 금지합니다. 위에서 도출된 '휴먼디자인의 메커니즘'과 '수비학의 영혼적 진동수'가 어떻게 결합되어 고유한 에너지 화학 반응을 일으키는지 유기적인 통합 분석(Synthesis)을 서술하십시오.
4. 각 단계별로 최소 300~500자 이상의 매우 상세한 서술을 유지하여, 읽는 이가 전율을 느낄 정도의 깊이를 보여주어야 합니다.

[프롤로그 - 코스믹 디자인의 정수]
휴먼디자인 바디그래프의 기계적 구조(차량)와 수비학 숫자의 영혼적 목적(승객)이 결합된, 내담자만의 '궁극적 우주 설계도'를 장엄하게 서술하라.

[본론 - 10단계 심층 분석 알고리즘]
[1단계: 우주적 빅 픽처] 내담자의 휴먼디자인 타입(Type)과 수비학 생명경로수가 만났을 때 형성되는 가장 거대하고 압도적인 인생의 메인 테마는 무엇인가?
[2단계: 의사결정의 마스터리] 휴먼디자인의 '권위(Authority) 및 전략(Strategy)'과 수비학의 진동수가 충돌하거나 보완되는 지점을 분석하여, 일상에서 절대 실패하지 않는 최적의 선택 방식을 제안하라.
[3단계: 페르소나와 프로필] 휴먼디자인의 '프로필(Profile)'과 수비학적 '본질수(Born Essence)'가 만들어내는 내담자의 사회적 역할과 무의식적 가면의 이중성을 분석하라.
[4단계: 미정의 센터와 섀도우 극복] 휴먼디자인의 미정의 센터(Open Centers)가 취약점(Not-Self)으로 작용할 때, 수비학의 '그림자수(Shadow Number)'가 이를 어떻게 증폭시키는지, 그리고 이를 지혜로 치환하는 방법은 무엇인가?
[5단계: 부와 물질의 연금술] 정의된 센터와 채널의 동력, 수비학의 재물 진동수를 바탕으로 내담자에게 최적화된 돈을 버는 방식과 에너지 소모를 최소화하는 직업적 전략을 도출하라.
[6단계: 관계의 화학 작용] 휴먼디자인 전자기적 연결 요소와 수비학의 관계수 역학을 활용하여, 내담자에게 가장 이로운 에너지 흐름을 주는 인연과 파괴적인 인연을 구분하는 법을 서술하라.
[7단계: 영혼의 숨겨진 갈망] 디자인의 무의식적 활성화(적색) 라인들과 수비학의 '영혼 갈망수'를 교차 분석하여, 내담자가 진정으로 체험하고 싶어하는 카르마적 열항을 밝혀라.
[8단계: 진정한 나(True-Self)로의 각성] 주변의 조건화(Conditioning)를 벗어던지고 내담자 본연의 독창적인 주파수로 깨어나기 위해 일상에서 반복해야 할 핵심 리추얼(의식)은 무엇인가?
[9단계: 인생의 주기로 보는 시간표] 수비학의 개인연도(Personal Year) 흐름과 휴먼디자인 인카네이션 크로스(Incarnation Cross)의 주기를 융합해, 지금 당장 취해야 할 공격/수비 스탠스를 조언하라.
[10단계: 최종 예언과 영적 나침반] 모든 결론을 갈무리하여, 내담자가 자신의 유전적 디자인과 영혼의 숫자를 온전히 긍정하고 삶의 실험을 주도할 수 있도록 영감이 가득 찬 최종 조언을 남겨라.

전문적인 술어를 깊이 있게 교차 사용하며 논리적으로 전개하되, 마치 우주적 현자(Cosmic Guide)가 내담자의 영혼과 유전자를 꿰뚫어 보듯 장엄하고 따뜻하며 감동적인 구어체로 이 긴 여정을 완성하십시오.`.trim();

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
