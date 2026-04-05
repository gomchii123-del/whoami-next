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
- 수비학 지표: 생애경로수(LP) [${numResult.lifePath}], 본질수 [${numResult.bornEssence}], 그림자수 [${numResult.shadow}] (이름이 영문일 경우 표현수, 마음의갈망수, 성격수 추가 연산 요망)

당신이 가진 천체력(Ephemeris) 데이터와 지식을 기반으로, 위 생년월일시와 출생지를 바탕으로 내담자의 정확한 휴먼디자인 차트 요소들(Type, Strategy, Authority, Profile, Definition, Channels & Gates)을 빠짐없이 계산하고 추출한 뒤 다음 분석을 진행하십시오.

3. 분석 알고리즘 가이드라인 (5대 핵심 평가 엔진):
다음 5가지 공학 엔진을 기저에 두고 10단계 분석을 수행하십시오:
[1] 전략적 행동 스택: 휴먼디자인의 [타입별 전략]과 수비학의 [생애경로수]를 결합하여 먼저 행동할지 초대를 기다릴지 목적에 맞게 결정 로직 제공.
[2] 의사결정 알고리즘: [내부 권위(Authority)]와 수비학의 [본질수]를 매칭하여 감정, 직관, 논리 중 무엇을 우선해야 하는지 충돌 필터링 가이드.
[3] 디버깅 필터: [미정의 센터(Open Centers)]와 [그림자수]가 만들 Not-Self 버그(가스라이팅, 슬럼프 등)를 진단하고 마인드셋 디버깅 메시지 생성.
[4] 커뮤니케이션 스타일: [프로필]과 수비학의 [성격수(또는 본질수)]를 조합하여 외부에 비쳐지는 페르소나와 톤앤매너 설정.
[5] 타이밍 엔진: 현재 [트랜짓(Transits)]과 수비학 [개인연도(Personal Year)]를 통해 특정 채널의 활성화를 파악하고 공격/수비/대기 스탠스 결정.

4. 본론 - 10단계 심층 분석 통합 알고리즘 (매우 길고 장엄하게 서술할 것):
[1단계: 우주적 빅 픽처] 내담자의 휴먼디자인 타입(Type)과 수비학 생명경로수가 만났을 때 형성되는 가장 거대하고 압도적인 인생의 메인 테마는 무엇인가?
[2단계: 의사결정의 마스터리] (의사결정 알고리즘 엔진 적용) 휴먼디자인의 '권위(Authority)'와 수비학의 진동수가 충돌하거나 보완되는 지점을 분석하여 최적의 선택 방식을 제안하라.
[3단계: 페르소나와 프로필] (커뮤니케이션 스타일 엔진 적용) 휴먼디자인의 '프로필(Profile)'과 수비학적 수치가 만들어내는 내담자의 사회적 역할과 무의식적 가면의 이중성을 분석하라.
[4단계: 미정의 센터와 섀도우 극복] (디버깅 필터 엔진 적용) 미정의 센터가 취약점(Not-Self)으로 작용할 때, 수비학의 '그림자수'가 이를 어떻게 증폭시키는지, 그리고 이를 지혜로 치환하는 디버깅 방법은?
[5단계: 부와 물질의 연금술] (전략적 행동 스택 적용) 정의된 센터와 채널의 동력, 수비학의 재물 진동수를 바탕으로 내담자에게 최적화된 돈을 버는 방식과 에너지 소모를 최소화하는 전략.
[6단계: 관계의 화학 작용] 휴먼디자인 전자기적 연결 요소와 수비학의 관계수 역학을 활용하여 이로운 인연과 파괴적인 인연을 구분하는 법.
[7단계: 영혼의 숨겨진 갈망] 디자인의 무의식적 활성화(적색) 라인들과 수비학의 '영혼 갈망수(또는 본질수)'를 교차 분석하여 카르마적 열망을 밝혀라.
[8단계: 진정한 나(True-Self)로의 각성] 주변의 조건화를 벗어던지고 내담자 본연의 주파수로 깨어나기 위해 일상에서 반복해야 할 핵심 리추얼은?
[9단계: 인생의 주기로 보는 시간표] (타이밍 엔진 적용) 수비학의 개인연도 흐름과 현재 우주 트랜짓, 인카네이션 크로스의 주기를 융합해 지금 당장 취해야 할 공격/수비 스탠스.
[10단계: 최종 예언과 영적 나침반] 종합 결론. 

5. 출력 형식 (Output Format):
결과는 개발자가 바로 데이터베이스에 매핑할 수 있도록 다음 구조를 반드시 엄수하십시오. (10단계 서술은 [Mechanism Logic] 안에 종합하여 장문으로 서술합니다.)

[Summary]: 한 문장의 시스템 정의 (예: '22번 에너지를 돌리는 프로젝터 관리자')

[Mechanism Logic]: 
(이곳에 위의 '10단계 심층 분석 알고리즘'에 따라 각 단계별로 최소 300자 이상, 심도 있고 장엄하게 모든 내용을 빠짐없이 각각 목차를 나누어 서술할 것)

[Action Protocol]: 사용자가 즉각 실행할 수 있는 행동 전략 3가지

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
