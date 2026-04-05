'use client';

import { useEffect, useState, Suspense } from 'react';
import { Share2, ChevronRight, Link2 } from 'lucide-react';
import ResultClient from '@/components/ResultClient';
import { ArcheEngine } from '@/lib/arche-engine';
import AdBanner from '@/components/AdBanner';

interface StoredAnalysis {
    name: string;
    birth_date: string;
    year: string;
    month: string;
    day: string;
}

/* ── 추천 콘텐츠 (이탈 방지) ── */
const RELATED_CONTENT = [
    { href: '/analyze/numerology/', icon: '🔮', title: '수비학 분석', desc: '생년월일로 타고난 본질 해독' },
    { href: '/analyze/saju/', icon: '☯️', title: '사주팔자', desc: '생년월일시로 운명의 흐름 읽기' },
    { href: '/analyze/tarot/', icon: '🃏', title: '타로 카드', desc: '지금 이 순간의 메시지 리딩' },
    { href: '/analyze/ziwei/', icon: '🌌', title: '자미두수', desc: '동양 점성학 기반 명반 분석' },
    { href: '/analyze/astrology/', icon: '♈', title: '서양 점성술', desc: '출생 차트 기반 천체 해석' },
    { href: '/snack/', icon: '🧪', title: '도파민 스낵 테스트', desc: '3초 만에 해부하는 27가지 테스트' },
];



function ResultInner() {
    const [mounted, setMounted] = useState(false);
    const [data, setData] = useState<StoredAnalysis | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [determinedType, setDeterminedType] = useState<string>('numerology');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(window.location.search);
        const urlType = params.get('type');
        const savedType = sessionStorage.getItem('arche_report_type');
        const finalType = urlType || savedType || 'numerology';
        setDeterminedType(finalType);

        if (urlType === 'tarot') {
            const rawTarot = sessionStorage.getItem('lastAnalysis');
            if (rawTarot) {
                try {
                    const parsed = JSON.parse(rawTarot);
                    setData({ name: '나', birth_date: parsed.timestamp || new Date().toISOString(), year: '0', month: '0', day: '0' });
                    setAnalysis({ lifePath: 0, isTarot: true });
                } catch (e) { console.error(e); }
            }
        } else if (urlType === 'ziwei') {
            const raw = sessionStorage.getItem('lastAnalysis');
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    setData({ name: parsed.name || '나', birth_date: `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`, year: Number(parsed.year || 0), month: Number(parsed.month || 0), day: Number(parsed.day || 0) } as any);
                    setAnalysis({ lifePath: 0, isZiWei: true });
                } catch (e) { console.error(e); }
            }
        } else if (urlType === 'astrology') {
            const raw = sessionStorage.getItem('lastAnalysis');
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    setData({ name: parsed.name || '나', birth_date: `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`, year: Number(parsed.year || 0), month: Number(parsed.month || 0), day: Number(parsed.day || 0) } as any);
                    setAnalysis({ lifePath: 0, isAstrology: true });
                } catch (e) { console.error(e); }
            }
        } else if (urlType === 'saju') {
            const rawSaju = sessionStorage.getItem('arche_saju_data');
            if (rawSaju) {
                try {
                    const parsed = JSON.parse(rawSaju);
                    setData({ name: parsed.name, birth_date: `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`, year: Number(parsed.year), month: Number(parsed.month), day: Number(parsed.day) } as any);
                    setAnalysis({ lifePath: 0, isSaju: true, sajuData: parsed });
                } catch (e) { console.error(e); }
            }
        } else {
            const raw = sessionStorage.getItem('arche_analysis');
            if (!raw) return;
            try {
                const parsed: StoredAnalysis = JSON.parse(raw);
                setData(parsed);
                const result = ArcheEngine.performAnalysis(String(parsed.year), String(parsed.month), String(parsed.day));
                setAnalysis(result);
            } catch (e) { console.error(e); }
        }
    }, []);

    const handleShare = async () => {
        const url = window.location.href;
        const title = `WHOAMI · ${data?.name || '나'}의 운세 분석 결과`;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(url);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleKakaoShare = () => {
        const url = window.location.href;
        const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}`;
        window.open(kakaoUrl, '_blank', 'width=500,height=600');
    };

    if (!mounted) {
        return (
            <main className="min-h-screen bg-bg-warm flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto" />
            </main>
        );
    }

    const profile = {
        full_name: data?.name || '사용자',
        email: '',
        birth_date: data?.birth_date || '',
    };

    const recordId = `mock-rec-${data?.year || '0'}-${data?.month || '0'}-${data?.day || '0'}-local`;

    return (
        <main className="min-h-screen bg-bg-warm px-6 py-12 md:py-20 flex flex-col items-center">
            <div className="w-full max-w-4xl">

                {/* ── 광고: 결과 페이지 상단 ── */}
                <AdBanner label="결과 상단" format="horizontal" />

                {/* ── 공유하기 (상단) ── */}
                <div className="flex items-center justify-end gap-2 mb-4">
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-[1.03] active:scale-[0.97]"
                        style={{ background: 'rgba(136,160,150,0.1)', color: '#88A096', border: '1px solid rgba(136,160,150,0.2)' }}
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        {copySuccess ? '링크 복사됨!' : '공유하기'}
                    </button>
                    <button
                        onClick={handleKakaoShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-[1.03] active:scale-[0.97]"
                        style={{ background: 'rgba(254,229,0,0.15)', color: '#3C1E1E', border: '1px solid rgba(254,229,0,0.3)' }}
                    >
                        💬 카카오톡
                    </button>
                </div>

                {/* ── 결과 콘텐츠 (100% 무료) ── */}
                <ResultClient
                    recordId={recordId}
                    profile={profile}
                    lpNumber={analysis?.lifePath || 1}
                    isPaid={true}
                    initialReportType={determinedType}
                />

                {/* ── 광고: 결과 중간 ── */}
                <AdBanner label="결과 중간" format="rectangle" />

                {/* ── 공유 & 바이럴 (하단) ── */}
                <div className="mt-8 rounded-2xl p-6 text-center space-y-4" style={{ background: 'rgba(136,160,150,0.06)', border: '1px solid rgba(136,160,150,0.12)' }}>
                    <h3 className="text-base font-bold text-foreground">
                        친구에게 결과를 공유해 보세요 ✨
                    </h3>
                    <p className="text-xs text-gray-400">
                        내 운세 결과를 친구에게 보내고 같이 비교해 보세요
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.03] active:scale-[0.97]"
                            style={{ background: 'linear-gradient(135deg, #88A096, #6B8A7A)', color: '#fff' }}
                        >
                            <Link2 className="w-4 h-4" />
                            {copySuccess ? '복사 완료!' : 'URL 복사'}
                        </button>
                        <button
                            onClick={handleKakaoShare}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.03] active:scale-[0.97]"
                            style={{ background: '#FEE500', color: '#3C1E1E' }}
                        >
                            💬 카카오톡 공유
                        </button>
                    </div>
                </div>

                {/* ── 추천 콘텐츠: "이런 테스트는 어때요?" ── */}
                <div className="mt-10 space-y-4">
                    <h3 className="text-base font-bold text-foreground">
                        🔮 이런 운세는 어때요?
                    </h3>
                    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.03)' }}>
                        {RELATED_CONTENT
                            .filter(item => !item.href.includes(determinedType === 'numerology' ? '/numerology/' : `/${determinedType}/`))
                            .map((item, i, arr) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={e => { e.preventDefault(); window.location.href = item.href; }}
                                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
                                    style={{
                                        textDecoration: 'none',
                                        borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                                    }}
                                >
                                    <span className="text-xl w-8 text-center">{item.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-semibold text-gray-800">{item.title}</p>
                                        <p className="text-[11px] mt-0.5 text-gray-400">{item.desc}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                                </a>
                            ))
                        }
                    </div>
                </div>

                {/* ── 광고: 결과 하단 ── */}
                <AdBanner label="결과 하단" format="horizontal" />

            </div>
        </main>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-bg-warm flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto" />
            </main>
        }>
            <ResultInner />
        </Suspense>
    );
}
