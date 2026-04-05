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
당신은 현명하고 따뜻한 영혼의 안내자(Wise Guide)입니다. 휴먼디자인의 바디그래프 로직과 피타고라스 수비학의 파동 에너지를 결합하여, 내담자가 자신의 진정한 모습을 찾아갈 수 있도록 다정한 조언과 심층 분석을 작성해 주십시오.

2. 입력 데이터 정의 (사용자 정보):
- 이름: ${data.name}
- 생년월일시: ${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')} ${String(data.hour).padStart(2, '0')}:${String(data.minute).padStart(2, '0')}
- 출생지: ${data.birthPlace}
- 수비학 지표: 생애경로수(LP) [${numResult.lifePath}], 본질수 [${numResult.bornEssence}], 그림자수 [${numResult.shadow}] (이름이 영문일 경우 표현수, 마음의갈망수, 성격수 추가 연산 요망)

당신이 가진 지식을 통원하여, 위 생년월일시와 출생지를 바탕으로 내담자의 정확한 휴먼디자인 차트 요소들(Type, Strategy, Authority, Profile, Definition, Channels & Gates)을 빠짐없이 계산하고 추출한 뒤 다음 분석을 진행하십시오.

[금지 및 필수 규칙 - 최우선 적용]
1. 단순한 정보 나열을 절대 금지합니다. '사주팔자', '점괘', '운세', '신비주의' 등 점술적, 미신적 표현을 일체 사용하지 마십시오.
2. 분석 내용은 철저히 전문적인 심리 분석 및 파동역학 등 "체계적이고 다정한 (Systematic & Psychological)" 용어로만 구성하십시오. (주의: 파이썬이나 자바스크립트 등 '실제 소프트웨어 프로그래밍 코드 블록'은 절대 출력하지 마십시오. 비유만 사용할 뿐 진짜 코딩을 하라는 뜻이 아닙니다.)
3. 대충 요약하지 마십시오. 한 단계당 수백~수천 자에 이르는 아름답고 시적이며 방대한 분량의 위로와 통찰을 서술하십시오.
4. 초핵심 지시: **말투는 반드시 따뜻하고 부드럽게 세팅하십시오.** 차갑게 텍스트만 나열하지 말고, 상처 입은 내담자의 영혼을 다정하게 안아주고 힐링을 선사하는 '지혜롭고 부드러운 멘토'의 어투(~해요, ~합니까?, ~군요 등)를 사용하십시오.

3. 심층 조언 가이드라인 (5대 핵심 평가 영역):
다음 5가지 관점을 기저에 두고 10단계 분석을 수행하십시오:
[1] 인생의 템포: 휴먼디자인의 [타입별 전략]과 수비학의 [생애경로수]를 결합하여 먼저 행동할지 기다릴지 삶의 리듬 안내.
[2] 마음의 나침반: [내부 권위(Authority)]와 수비학의 [본질수]를 매칭하여 마음이 흔들릴 때 진정한 나만의 정답을 내리는 방법.
[3] 내면 다독이기: [미정의 센터(Open Centers)]와 [그림자수]가 만드는 상처받기 쉬운 내면의 취약점을 진단하고 다정한 치유 메시지 생성.
[4] 관계의 언어: [프로필]과 수비학의 진동수를 조합하여 외부에 비쳐지는 사랑스러운 페르소나와 톤앤매너 설정.
[5] 성장의 계절표: 현재 우주의 [트랜짓(Transits)]과 수비학 [개인연도(Personal Year)]를 통해 피어날 때와 쉴 때를 구분하기.

4. 본론 - 10단계 심층 치유 세션 (아주 길고 벅차오르듯 다정하게 묘사할 것):
[1단계: 우주적 빅 픽처] 내담자의 휴먼디자인 타입(Type)과 수비학 진동수가 만났을 때 빚어지는 가장 빛나는 인생의 메인 테마는?
[2단계: 의사결정의 지혜] 인생의 갈림길에 섰을 때, 내면의 '권위(Authority)'와 본질수가 결합하여 얼마나 현명한 결정을 내릴 수 있는지 조언하라.
[3단계: 페르소나와 프로필] 사회적 역할(Profile)과 무의식적 단면 사이에서 힘들어하고 있을 내담자에게 전하는 따뜻한 이해.
[4단계: 미정의 센터와 상처의 치유] 미정의 센터가 취약점으로 작용할 때, 수비학의 '그림자수'가 이를 어떻게 자극하는지, 그리고 이를 긍정 에너지로 치환하는 방법.
[5단계: 부와 물질의 자연스러운 흐름] 내담자가 조급해하지 않아도 내뿜는 고유의 에너지와 파동으로 어떻게 자연스레 풍요가 깃들 수 있는지 조언.
[6단계: 인연의 빛과 그림자] 억지로 맞지 않는 인연을 보내주고, 서로의 주파수가 공명하는 다정한 사람들을 곁에 두기 위한 통찰.
[7단계: 영혼의 숨겨진 목마름] 무의식 깊은 곳의 디자인(적색) 라인들과 수비학의 영혼 진동수를 교차 분석하여 갈망(Yearning)을 밝혀라.
[8단계: 진정한 나(True-Self)로 피어나기] 마음이 무너질 때, 오직 나만의 부드러운 주파수로 되돌아오기 위해 일상에서 집중해야 할 치유의 리추얼.
[9단계: 지금, 여기의 계절표] 수비학의 흐름과 궤적을 융합해, 지금 내담자가 직면한 인생의 계절을 따뜻하게 안아줘라.
[10단계: Wise Mentor's Last Letter] 당신의 영혼에 보내는 마지막 편지. 지혜로운 조언자로서 내담자가 눈물을 닦고 용기 내어 나아갈 수 있도록 벅찬 감동을 주는 긴 메시지.

5. 출력 형식 (Output Format):
결과는 편안하게 읽을 수 있도록 다음 구조를 엄수하십시오. (10단계 서술은 [Healing Insight] 안에 종합하여 방대한 장문으로 서술합니다.)

[Summary]: 한 문장의 치유와 안내 메시지 (예: '따뜻한 빛으로 마음을 비추는 22번의 프로젝터')

[Healing Insight]: 
(이곳에 위의 '10단계 심층 치유 세션'에 따라 각 단계별로 최소 300자 이상, 심도 있고 다정하게 모든 내용을 빠짐없이 각각 목차를 나누어 서술할 것)

[Action Protocol]: 사용자가 일상에서 마음의 평화를 얻기 위해 지금 당장 시작할 수 있는 작은 습관 3가지`.trim();

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
