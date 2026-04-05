'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, Download, Sparkles, RefreshCw, Moon, Sun, Star } from 'lucide-react';
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
        return `년주: ${saju.pillars.year.stemHanja}${saju.pillars.year.branchHanja}, 월주: ${saju.pillars.month.stemHanja}${saju.pillars.month.branchHanja}, 일주: ${saju.pillars.day.stemHanja}${saju.pillars.day.branchHanja}, 시주: ${saju.pillars.hour.stemHanja}${saju.pillars.hour.branchHanja}
팔품: ${saju.palPum?.name} (${saju.palPum?.mission})
대운: ${saju.daeunAge}세 주기로 변동.`;
    };

    const formatZiweiPrompt = (ziwei: any) => {
        const lifePalace = ziwei.palaces.find((p: any) => p.isLifePalace);
        const bodyPalace = ziwei.palaces.find((p: any) => p.isBodyPalace);
        return `자미 국수: ${ziwei.fiveElementBureau}
명궁(능력/성격): ${lifePalace?.name} - 주성: ${lifePalace?.majorStars.join(', ') || '무곡'}
신궁(후반기/몸): ${bodyPalace?.name} - 주성: ${bodyPalace?.majorStars.join(', ') || '무곡'}
주요 내장 성향: ${ziwei.mainStars.slice(0, 5).join(', ')}`;
    };

    const formatAstroPrompt = (astro: any) => {
        return `상승궁(Ascendant): ${astro.risingSign}
태양(Sun): ${astro.sunSign}
달(Moon): ${astro.moonSign}
원소 비율: 불 ${astro.elements.fire}, 땅 ${astro.elements.earth}, 바람 ${astro.elements.air}, 물 ${astro.elements.water}`;
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

            // 2. Call backend
            const payload = {
                name: data.name,
                saju_data: formatSajuPrompt(saju),
                ziwei_data: formatZiweiPrompt(ziwei),
                astrology_data: formatAstroPrompt(astro),
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
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
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
