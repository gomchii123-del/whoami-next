'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, Download, Sparkles, RefreshCw, Moon, Sun, Star, Copy, Check, MessageSquare } from 'lucide-react';
import { toPng } from 'html-to-image';
import { SajuEngine, lunarToSolar } from '@/lib/saju-engine';
import { ZiWeiEngine } from '@/lib/ziwei-engine';
import { AstrologyEngine } from '@/lib/astrology-engine';

export default function OmniverseResultView() {
    const router = useRouter();
    const resultRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const [sajuOverview, setSajuOverview] = useState<any>(null);
    const [ziweiOverview, setZiweiOverview] = useState<any>(null);
    const [astroOverview, setAstroOverview] = useState<any>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('arche_analysis');
        if (!stored) {
            router.replace('/analyze/omniverse/');
            return;
        }

        const data = JSON.parse(stored);
        setUserData(data);
        generateOmniverseResult(data);
    }, [router]);

    const formatSajuPrompt = (saju: any) => {
        const daeunFlow = saju.daeun?.slice(0, 5).map((d: any) => `${d.age}세: ${d.pillar.stemHanja}${d.pillar.branchHanja}`).join(' → ');
        return `[명식(命式)]
년주: ${saju.pillars?.year?.stemHanja}${saju.pillars?.year?.branchHanja} (${saju.pillars?.year?.stemElement}/${saju.pillars?.year?.branchElement})
월주: ${saju.pillars?.month?.stemHanja}${saju.pillars?.month?.branchHanja} (${saju.pillars?.month?.stemElement}/${saju.pillars?.month?.branchElement})
일주: ${saju.pillars?.day?.stemHanja}${saju.pillars?.day?.branchHanja} (${saju.pillars?.day?.stemElement}/${saju.pillars?.day?.branchElement})
시주: ${saju.pillars?.hour?.stemHanja}${saju.pillars?.hour?.branchHanja} (${saju.pillars?.hour?.stemElement}/${saju.pillars?.hour?.branchElement})
[운의 흐름]
대운수: ${saju.daeunAge} / 주요 대운: ${daeunFlow}
팔품(임무): ${saju.palPum?.name} (${saju.palPum?.mission})`;
    };

    const formatZiweiPrompt = (ziwei: any) => {
        const palacesStr = ziwei.palaces?.map((p: any) => 
            `- ${p.branch}궁 [${p.name}]: ${p.stars.join(', ') || '공궁(빈 궁)'}`
        ).join('\n') || '';

        return `[자미두수 명반(命盤)]
자미 국수: ${ziwei.fiveElementBureau}
명궁(선천/기질): ${ziwei.palaces?.[ziwei.lifePalaceIndex]?.branch}궁
신궁(후천/육체): ${ziwei.palaces?.[ziwei.bodyPalaceIndex]?.branch}궁
[12궁 성계 배치]
${palacesStr}`;
    };

    const formatAstroPrompt = (astro: any) => {
        const planetsStr = astro.planets?.map((p: any) => 
            `${p.name} in ${p.signKr} (${p.house}하우스, ${p.isRetrograde ? '역행' : '순행'})`
        ).join('\n') || '';

        const housesStr = astro.houses?.map((h: any) => 
            `${h.index}하우스: ${h.signKr}`
        ).join(', ') || '';

        const aspectsStr = astro.aspects?.slice(0, 5).map((a: any) => 
            `${a.body1} - ${a.body2} (${a.typeKr})`
        ).join('\n') || '';

        return `[점성술(Astrology) 10행성 및 하우스 배치]
상승궁(Ascendant): ${astro.risingSign} / 태양(Sun): ${astro.sunSign} / 달(Moon): ${astro.moonSign}
원소 비율: 불 ${astro.elements?.fire}, 땅 ${astro.elements?.earth}, 바람 ${astro.elements?.air}, 물 ${astro.elements?.water}
[핵심 행성 위치]
${planetsStr}
[하우스 커스프(House Cusps)]
${housesStr}
[주요 각도(Aspects)]
${aspectsStr}`;
    };

    const generateOmniverseResult = async (data: any) => {
        try {
            const yr_in = parseInt(data.year);
            const mo_in = parseInt(data.month);
            const dy_in = parseInt(data.day);
            const hr = parseInt(data.hour);
            const mn = parseInt(data.minute);
            const isLunar = data.isLunar;
            
            // 시진 Index (사주용 - KST 기준)
            let branchIndex = Math.floor((hr + 1) / 2) % 12;

            // 1) 양력 날짜 변환
            let solarYr = yr_in, solarMo = mo_in, solarDy = dy_in;
            if (isLunar) {
                const cvt = lunarToSolar(yr_in, mo_in, dy_in, false);
                solarYr = cvt.solar.year;
                solarMo = cvt.solar.month;
                solarDy = cvt.solar.day;
            }

            // 2) 자미두수용 진태양시 보정 (한국 KST - 30분)
            let d = new Date(solarYr, solarMo - 1, solarDy, hr, mn);
            d.setMinutes(d.getMinutes() - 30);
            let zYr = d.getFullYear();
            let zMo = d.getMonth() + 1;
            let zDy = d.getDate();
            let zHr = d.getHours();
            let zMn = d.getMinutes();

            // 3) 점성술용 UTC 강제 조정 (KST 기준)
            const offset = (new Date()).getTimezoneOffset(); // KST=-540
            const astroHr = hr + Math.floor((offset + 540) / 60);

            // 엔진 연산
            let saju, ziwei, astro;
            
            try { saju = SajuEngine.calculate(yr_in, mo_in, dy_in, branchIndex, data.gender, isLunar, false); } 
            catch(e) { saju = { pillars: { year: { stemHanja: '甲', branchHanja: '子' }, month: { stemHanja: '甲', branchHanja: '子' }, day: { stemHanja: '甲', branchHanja: '子' }, hour: { stemHanja: '甲', branchHanja: '子' } } }; }
            
            try { ziwei = ZiWeiEngine.calculate(zYr, zMo, zDy, zHr, zMn, false, false); } 
            catch (e) { ziwei = { palaces: [], fiveElementBureau: '불명', mainStars: [] }; }
            
            try { astro = AstrologyEngine.calculate(solarYr, solarMo, solarDy, astroHr, mn, 37.5665, 126.9780); } 
            catch (e) { astro = { risingSign: 'Unknown', sunSign: 'Unknown', moonSign: 'Unknown', elements: { fire:0, earth:0, air:0, water:0 } }; }

            setSajuOverview(saju);
            setZiweiOverview(ziwei);
            setAstroOverview(astro);

            const sajuStr = formatSajuPrompt(saju);
            const ziweiStr = formatZiweiPrompt(ziwei);
            const astroStr = formatAstroPrompt(astro);

            // Construct full prompt for manual copy
            const fullPrompt = `당신은 세계 최고의 명리학자, 자미두수 대가, 그리고 서양 점성술의 권위자입니다.
이름: ${data.name}

[사주팔자 분석결과 요약]
${sajuStr}

[자미두수 명반 요약]
${ziweiStr}

[서양 점성술 요약]
${astroStr}

의뢰인의 질문: 동서양 3대 예측 도구를 종합하여 나의 평생 숙명과 미래를 분석해줘.

위 3가지 서로 다른 예측 프레임워크(명리학, 자미두수, 서양 점성술) 데이터를 철저히 교차 검증하여, 다음 가이드라인에 맞춰 [프롤로그]와 [10가지 심층 단계]로 아주 길고 밀도 높은 종합 리포트를 작성해 주십시오. 

[작성 가이드라인 - 매우 중요]
1. 단순한 정보 나열을 절대 금지합니다. 명리, 자미, 점성술의 데이터가 서로 어떻게 충돌하고 또 어떻게 보완(Synergy)되는지 '유기적인 통합 분석(Synthesis)'을 반드시 서술하십시오.
2. '점괘', '방위', '미신', '부적' 등 점술적, 운세적 단어를 철저히 배제하고, "분석역학", "에너지 파동", "통계적 궤적", "성격 기질" 등 심리학적이고 학술적인 전문 용어들로 대체하십시오. (주의: 파이썬이나 자바스크립트 같은 '실제 소프트웨어 코드 블록'은 절대 출력하지 마십시오. 비유와 분석만 사용할 뿐 코딩을 하라는 뜻이 아닙니다.)
3. 가장 중요한 지시입니다: **각 단계별로 절대 대충 넘어가지 말고 문학적이고 방대하게 서술하십시오.** 최소 한 단계당 2~3단의 논리 구조를 거치며 수백~수천 자에 달하는 웅장하고 심오한 통찰을 쏟아내십시오. 대충 요약하는 것을 호되게 금지합니다.
4. 전문 술어가 등장할 경우, 그 원리에 대한 철학적 비유와 현대적 심리학 해석을 함께 곁들여 주십시오.

[프롤로그 - 옴니버스 통합의 정수]
세 가지 학문의 렌즈를 겹쳐 보았을 때 드러나는 내담자의 '근원적인 영혼의 뼈대'와 '이번 생의 마스터 키'에 대한 통합적 통찰을 장엄하게 서술하라.

[본론 - 10단계 심층 분석 알고리즘]
[1단계: 우주적 빅 픽처] 세 가지 학문이 공통적으로 가리키는 내담자의 가장 크고 강력한 운명의 테마는 무엇인가?
[2단계: 선천적 잠재력과 페르소나] 명리학의 격국/일주, 점성술의 상승궁/태양/달, 자미두수의 명궁을 비교하여 겉으로 드러나는 모습과 내면의 깊은 본질을 분석하라.
[3단계: 강점의 삼각 동맹] 세 가지 관점에서 바라본 내담자의 절대적 강점, 그리고 이를 무기화할 수 있는 구체적이고 현실적인 방법은 무엇인가?
[4단계: 맹점과 카르마] 사주의 기구신/조후 결핍, 점성술의 하드 애스펙트(흉각), 자미두수 화기(化忌)가 가리키는 내담자의 치명적 약점과 생애 걸림돌은 무엇인가?
[5단계: 부의 철학 (재물운)] 재백궁, 점성술의 2/8하우스, 명리학적 재성/식상 구조를 결합하여, 한 치의 오차 없이 어느 시점에 어떤 방식으로 부를 축적해야 하는지 투자/직업 전략을 제시하라.
[6단계: 인간관계와 인연의 법칙] 부처궁, 7하우스, 배우자성(관/재성)을 통해 어떤 기운의 인연이 이로울지, 갈등을 피하고 관계를 유지하기 위한 처세술을 서술하라.
[7단계: 커리어와 소명] 관록궁, 10하우스(MC), 당령과 팔품 임무를 바탕으로 내담자에게 최적화된 직업적 소명과 사회적 위치를 제시하라.
[8단계: 대운과 유년의 시간표] 명리학의 대운 흐름을 기반으로, 현재 내담자가 위치한 인생의 계절은 어느 때인지, 역동적인 공수(공격과 수비) 전략을 분석하라.
[9단계: 개운법과 에너지 마스터리] 조후 조절용 행운의 원소, 수호 별자리 행성의 활용 등 운명의 파도를 압도적으로 극복할 수 있는 현실적인 개운법을 제안하라.
[10단계: 최종 예언과 영적 나침반] 모든 결론을 갈무리하여, 내담자가 자신의 천명을 온전히 긍정하고 주도적으로 삶을 개척할 수 있도록 영감이 가득 찬 최종 조언을 남겨라.

전문적인 술수를 깊이 있게 교차 사용하며 데이터 공학적으로 전개하되, 장엄하고 압도적인 분량(총 수천 자 이상)으로 이 긴 분석 리포트의 뼈대를 완성하십시오. 
단, 내용은 깊이 있되 **말투는 절대 무겁거나 기계적이지 않게 하십시오**. 마치 내담자의 영혼 속을 관통하듯, 그들의 아픔을 깊이 이해하고 따뜻하게 안아주는 '지혜롭고 다정한 멘토(상담가)'의 어투(~해요, ~합니까?, ~군요 등)를 사용하여 부드럽게 글을 이끌어가십시오.`.trim();

            setGeneratedPrompt(fullPrompt);

            // 2. Call backend
            const payload = {
                name: data.name,
                saju_data: sajuStr,
                ziwei_data: ziweiStr,
                astrology_data: astroStr,
                question: '동서양 3대 예측 도구를 종합하여 나의 평생 숙명과 미래를 분석해줘.'
            };

            const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v1/omniverse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('API server error');
            const resultData = await res.json();
            
            setResult(resultData);
        } catch (err) {
            console.warn("AI Engine is offline or failed, falling back to manual prompt mode:", err);
            setResult({
                summary: "통합 분석 인프라 지연 중 (수동 모드 활성화)",
                deep_analysis: "현재 AI 자동 분석 서버와의 통신이 지연되고 있습니다.<br/><br/>하지만 걱정하지 마세요. 이미 당신의 명리학, 자미두수, 점성술 데이터는 완벽하게 동기화되어 통합 프롬프트로 생성되었습니다.<br/><br/>아래의 <strong>[AI 통합 프롬프트 복사하기]</strong> 버튼을 눌러 복사한 뒤, ChatGPT 혹은 Claude에 붙여넣어 직접 우주의 통찰을 확인해 보세요!",
                lucky_elements: ["AI 프롬프트 마스터", "스스로 개척하는 자", "우주의 파편"]
            });
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

    const handleSaveImage = () => {
        if (!resultRef.current) return;
        toPng(resultRef.current, { cacheBust: true })
            .then((dataUrl: string) => {
                const link = document.createElement('a');
                link.download = `omniverse_reading_${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err: Error | unknown) => {
                console.error('Failed to save image', err);
            });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: '초월적 종합 분석 - WhoAmI',
                text: '명리학, 자미두수, 점성술을 통합한 나의 우주적 숙명 분석을 확인해보세요.',
                url: window.location.href,
            }).catch(err => {
                console.log('공유 취소 또는 에러:', err);
            });
        } else {
            alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f0c29]" style={{ backgroundImage: 'linear-gradient(to right, #24243e, #302b63, #0f0c29)' }}>
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-4 border-t-amber-400 border-r-purple-400 border-b-cyan-400 border-l-rose-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-dashed border-white/30 rounded-full animate-spin-reverse"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🌌</div>
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2 tracking-widest text-center">우주의 지혜를 모으는 중</h3>
                <p className="text-white/60 font-sans text-center max-w-sm">사주, 자미두수별, 점성술의 별자리를 동기화하고 있습니다.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f0c29]">
                <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
                    <p className="font-semibold text-gray-800 mb-6">{error}</p>
                    <button onClick={() => router.push('/')} className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold w-full">홈으로 가기</button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#02010a] text-white">
            <div className="sticky top-0 w-full z-50 bg-[#02010a]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-white/70" />
                </button>
                <span className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-400">
                    MASTER PROMPT ENGINE
                </span>
                <div className="w-10" />
            </div>

            <div className="w-full max-w-3xl mx-auto p-4 md:p-8 space-y-6 pb-32">
                <div ref={resultRef} className="space-y-6 bg-[#02010a] p-4 rounded-3xl" style={{ backgroundImage: 'linear-gradient(to bottom right, #02010a, #110d26, #02010a)' }}>
                    
                    {/* Header Card */}
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 md:p-10 text-center" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))' }}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600" />
                        <h1 className="text-3xl md:text-5xl font-serif font-bold mt-2 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                            {userData?.name}님의 <br/>통합 프롬프트 마스터
                        </h1>
                        <p className="mt-4 text-white/50 text-sm">{userData?.year}년 {userData?.month}월 {userData?.day}일 ({userData?.isLunar ? '음' : '양'})</p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {result?.lucky_elements?.map((el: string, idx: number) => (
                                <span key={idx} className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-amber-300">
                                    {el}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Chart Specs Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Saju */}
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Sun className="w-5 h-5 text-amber-500" />
                                <span className="font-serif font-bold text-lg text-amber-100">명리학</span>
                            </div>
                            <div className="space-y-1 text-sm text-white/70">
                                <p>일주: <strong className="text-white">{sajuOverview?.pillars?.day?.stem}{sajuOverview?.pillars?.day?.branch}</strong></p>
                                <p>운의 기준: <strong className="text-white">{sajuOverview?.daeunAge}세 대운</strong></p>
                                <p>수행 과제: <strong className="text-white">{sajuOverview?.palPum?.name?.split('(')[0]}</strong></p>
                            </div>
                        </div>

                        {/* Ziwei */}
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Star className="w-5 h-5 text-cyan-400" />
                                <span className="font-serif font-bold text-lg text-cyan-100">자미두수</span>
                            </div>
                            <div className="space-y-1 text-sm text-white/70">
                                <p>당신의 국수: <strong className="text-white">{ziweiOverview?.fiveElementBureau?.split('(')[0]}</strong></p>
                                <p>명궁 주성: <strong className="text-white">{ziweiOverview?.palaces?.find((p:any)=>p.isLifePalace)?.majorStars?.[0] || '무곡'}</strong></p>
                                <p>신궁: <strong className="text-white">{ziweiOverview?.palaces?.find((p:any)=>p.isBodyPalace)?.name?.split(' ')[0]}</strong></p>
                            </div>
                        </div>

                        {/* Astro */}
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Moon className="w-5 h-5 text-purple-400" />
                                <span className="font-serif font-bold text-lg text-purple-100">점성술</span>
                            </div>
                            <div className="space-y-1 text-sm text-white/70">
                                <p>상승궁: <strong className="text-white">{astroOverview?.risingSign}</strong></p>
                                <p>태양: <strong className="text-white">{astroOverview?.sunSign}</strong></p>
                                <p>달: <strong className="text-white">{astroOverview?.moonSign}</strong></p>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Content */}
                    <div className="bg-white/5 rounded-[2rem] p-6 text-base font-sans font-medium border border-white/10" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                        <h2 className="text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-indigo-300 mb-4 inline-flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-300" /> 종합 우주 에너지 패턴
                        </h2>
                        
                        <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-white/80 max-w-none text-[15px]" 
                             dangerouslySetInnerHTML={{ __html: result?.deep_analysis?.replace(/\n/g, '<br />') }} 
                        />
                    </div>
                    
                    {/* Prompt Builder Box (Always available) */}
                    <div className="mt-8 bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden group border border-amber-400/20">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 to-transparent opacity-50" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase border border-white/10">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Prompt Master
                            </div>
                            <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                                인공지능에게 전달할<br/>
                                <span className="text-amber-400">옴니버스 통합 프롬프트</span>
                            </h2>
                            <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                                당신의 명리학, 자미두수, 점성술 데이터가 모두 집약된 프롬프트입니다. ChatGPT나 Claude에 붙여넣어 세상에서 가장 입체적인 분석을 받아보세요.
                            </p>

                            <button
                                onClick={handleCopyPrompt}
                                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-amber-50 active:scale-95 transition-all shadow-2xl shadow-white/10"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-6 h-6 text-green-500" />
                                        통합 프롬프트 복사 완료!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5 text-gray-400 group-hover:text-amber-500" />
                                        AI 통합 프롬프트 복사하기
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#02010a] via-[#02010a]/90 to-transparent z-40">
                <div className="max-w-md mx-auto flex gap-3">
                    <button onClick={handleSaveImage} className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-4 rounded-xl font-bold backdrop-blur-md border border-white/20 active:scale-95 transition-transform shadow-lg">
                        <Download className="w-5 h-5" /> 이미지 저장
                    </button>
                    <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 text-[#02010a] py-4 rounded-xl font-bold active:scale-95 transition-transform shadow-[0_0_20px_rgba(251,191,36,0.3)] border border-amber-300" style={{ background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)' }}>
                        <Share2 className="w-5 h-5" /> 결과 공유
                    </button>
                </div>
            </div>
        </main>
    );
}
