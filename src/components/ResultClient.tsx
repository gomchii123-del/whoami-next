'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Lock, Sparkles, Compass, ShieldAlert, Zap, Briefcase, Heart, Moon, Sun, Home, ChevronRight, Download, User, Activity } from 'lucide-react';
import { useT, useLocale } from '@/i18n/LocaleContext';
import AdSense from '@/components/AdSense';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import AnalysisCard from '@/components/AnalysisCard';

import { NarrativeLibrary, CategoryNarratives } from '@/lib/narrative-library';
import { PremiumNarrativeLibrary } from '@/lib/premium-narratives';
import { ArcheEngine } from '@/lib/arche-engine';
import { CareerNarrativeLibrary } from '@/lib/career-narratives';
import { getLocalizedNarratives, getLocalizedCategoryNarratives } from '@/lib/narrative-resolver';
import { getCompatNarrative } from '@/lib/compat-narratives';
import { calculateAAOD } from '@/lib/yearly-narratives';
import ArcheCapacityAnalysis from '@/components/ArcheCapacityAnalysis';
import { SajuEngine } from '@/lib/saju-engine';
import SajuResultView from './SajuResultView';
import TarotResultView from './TarotResultView';
import ZiWeiResultView from './ZiWeiResultView';
import AstrologyResultView from './AstrologyResultView';
import AnalysisLoadingScreen from './AnalysisLoadingScreen';
import RevealScreen from './RevealScreen';
import EnergyProfile from './EnergyProfile';
import CelebrityMatch from './CelebrityMatch';
import ShareCard from './ShareCard';
import CrossServiceCTA from './CrossServiceCTA';
import INDDashboard from './INDDashboard';
import { generateINDInsight } from '@/lib/ind-narratives';
interface ResultClientProps {
    recordId: string;
    profile: any;
    lpNumber: number;
    isPaid?: boolean;
    initialReportType?: string;
}

export default function ResultClient({ recordId, profile, lpNumber, isPaid, initialReportType }: ResultClientProps) {
    const t = useT();
    const { locale } = useLocale();
    const LocalNarrative = getLocalizedNarratives(locale);
    const LocalCategoryNarratives = getLocalizedCategoryNarratives(locale);
    const unlocked = true;
    const [justUnlocked] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [analysisP2, setAnalysisP2] = useState<any>(null);
    const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [isDownloading, setIsDownloading] = useState(false);
    const [reportType, setReportType] = useState<string>(initialReportType || 'numerology');
    const [activeTab, setActiveTab] = useState<'summary' | 'career' | 'yearly' | 'compat'>('summary');
    const [sajuResult, setSajuResult] = useState<any>(null);
    const [tarotResult, setTarotResult] = useState<any>(null);
    const [ziweiResult, setZiweiResult] = useState<any>(null);
    const [astrologyResult, setAstrologyResult] = useState<any>(null);
    const [engineError, setEngineError] = useState<string | null>(null);
    const [uiPhase, setUiPhase] = useState<'loading' | 'reveal' | 'content'>('loading');
    const reportRef = useRef<HTMLDivElement>(null);
    const paywallRef = useRef<HTMLDivElement>(null);
    const isMockMode = recordId.startsWith('mock-rec-');

    const [sajuUser, setSajuUser] = useState<{ name: string, gender: 'male' | 'female' }>({ name: '사용자', gender: 'male' });

    useEffect(() => {
        // 1. Determine final report type
        const params = new URLSearchParams(window.location.search);
        const urlType = params.get('type');
        const savedType = sessionStorage.getItem('arche_report_type');
        const finalType = urlType || initialReportType || savedType || 'numerology';
        setReportType(finalType);
        // Set initial active tab from report type
        if (finalType === 'career') setActiveTab('career');
        else if (finalType === 'yearly') setActiveTab('yearly');
        else if (finalType === 'compat') setActiveTab('compat');
        else setActiveTab('summary');

        // SYNC: Ensure and save if needed
        if (urlType) sessionStorage.setItem('arche_report_type', urlType);

        // 2. Robust date/time parsing from profile (Primary Fallback Data)
        let y = 0, m = 0, d = 0;
        const bdate = profile.birth_date || '';
        if (bdate.includes('T')) {
            const dt = new Date(bdate);
            y = dt.getFullYear();
            m = dt.getMonth() + 1;
            d = dt.getDate();
        } else {
            const parts = bdate.split('-').map(Number);
            if (parts.length >= 3) {
                [y, m, d] = parts;
            }
        }
        const timeParts = (profile.birth_time || '00:00').split(':');
        const h = parseInt(timeParts[0] || '0', 10) || 0;
        const min = parseInt(timeParts[1] || '0', 10) || 0;
        const gender = profile.gender || 'male';
        const name = profile.full_name || '사용자';

        // 3. Load/Reconstruct Analysis results (Independent try-catch for each)
        // —— Numerology (Arche) ——
        try {
            const p1Str = sessionStorage.getItem('arche_analysis');
            if (p1Str) {
                const parsed1 = JSON.parse(p1Str);
                setAnalysis(ArcheEngine.performAnalysis(String(parsed1.year), String(parsed1.month), String(parsed1.day)));
            } else if (y > 0 && m > 0 && d > 0) {
                setAnalysis(ArcheEngine.performAnalysis(String(y), String(m), String(d)));
            }
        } catch (e) { console.error('Numerology Init Fail:', e); }

        // —— Saju ——
        try {
            const rawSaju = sessionStorage.getItem('arche_saju_data');
            if (rawSaju) {
                const sd = JSON.parse(rawSaju);
                if (sd.year && sd.month) {
                    setSajuResult(SajuEngine.calculate(Number(sd.year), Number(sd.month), Number(sd.day), Number(sd.branchIndex ?? 0), sd.gender || 'male', !!sd.isLunar, !!sd.isLeap));
                    setSajuUser({ name: sd.name || name, gender: sd.gender || gender });
                }
            } else if (y > 0 && m > 0 && d > 0) {
                setSajuResult(SajuEngine.calculate(y, m, d, 0, gender, false, false));
                setSajuUser({ name, gender });
            }
        } catch (e) { console.error('Saju Init Fail:', reportType === 'saju' ? e : 'Silent fail'); }

        // —— Tarot, ZiWei, Astrology ——
        let ziweiLoaded = false;
        let astrologyLoaded = false;
        try {
            const rawLast = sessionStorage.getItem('lastAnalysis');
            if (rawLast) {
                const ld = JSON.parse(rawLast);
                if (ld.type === 'tarot') setTarotResult(ld);
                else if (ld.type === 'ziwei') { setZiweiResult(ld); ziweiLoaded = true; }
                else if (ld.type === 'astrology') { setAstrologyResult(ld); astrologyLoaded = true; }
            }

            // Auto-fallback from profile for these types ONLY if not loaded from sessionStorage
            if (y > 0 && m > 0 && d > 0) {
                if (!ziweiLoaded && finalType === 'ziwei') {
                    setZiweiResult({ type: 'ziwei', name, gender, year: y, month: m, day: d, hour: h, minute: min, isLunar: false, isLeap: false });
                }
                if (!astrologyLoaded && finalType === 'astrology') {
                    setAstrologyResult({ type: 'astrology', name, gender, year: y, month: m, day: d, hour: h, minute: min, birthPlace: profile.birth_place || 'Seoul, Korea' });
                }
            }
        } catch (e) { console.error('Secondary Init Fail:', e); }

        if (isMockMode) {
            // Mock mode: no auto-unlock, still requires payment
        }
    }, [recordId, profile, isMockMode, initialReportType]);

    // Type-specific config
    const TYPE_META: Record<string, { label: string; icon: string; color: string; link?: string }> = {
        summary: { label: '종합 분석', icon: '✦', color: '#88A096', link: '/analyze/numerology/' },
        career: { label: '직업·재물운', icon: '💼', color: '#8896A0', link: '/analyze/numerology/' },
        yearly: { label: '올해의 운세', icon: '🌊', color: '#A0962A', link: '/analyze/numerology/' },
        compat: { label: '에너지 궁합', icon: '❤️', color: '#A08898', link: '/analyze/numerology/' },
        numerology: { label: '종합 분석', icon: '✦', color: '#88A096', link: '/analyze/numerology/' },
        saju: { label: '명리학 사주', icon: '☯', color: '#B88A6A', link: '/analyze/saju/' },
        tarot: { label: '메타 타로', icon: '🜔', color: '#7B6EA0', link: '/analyze/tarot/' },
        ziwei: { label: '자미두수 명반', icon: '⭑', color: '#6A8FAA', link: '/analyze/ziwei/' },
        astrology: { label: '네이탈 차트', icon: '♈', color: '#A07868', link: '/analyze/astrology/' },
    };
    const typeMeta = TYPE_META[reportType] || TYPE_META['summary'];



    // PDF Download Handler
    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;
        setIsDownloading(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const userName = profile.full_name || '나의';
            const typeLabel = typeMeta.label.replace(' ', '_');
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `${userName}_${typeLabel}_리포트.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#F7F3EE',
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            };
            await (html2pdf() as any).set(opt).from(reportRef.current!).save();
        } catch (e) {
            console.error('PDF 생성 오류:', e);
        } finally {
            setIsDownloading(false);
        }
    };

    const CORE_KEYS = ['lifePath', 'shadow', 'career', 'relationship', 'soulUrge', 'yearlyCycle'];
    const DETAIL_KEYS = ['destinyDetail', 'personalityDetail', 'outerDetail', 'maturityDetail'];

    const renderArcheCard = (key: string, content: any) => {
        const icons: any = {
            lifePath: <Compass className="w-5 h-5" />,
            shadow: <ShieldAlert className="w-5 h-5" />,
            career: <Briefcase className="w-5 h-5" />,
            relationship: <Heart className="w-5 h-5" />,
            soulUrge: <Moon className="w-5 h-5" />,
            yearlyCycle: <Sun className="w-5 h-5" />
        };

        const colors: any = {
            lifePath: '#88A096',
            shadow: '#A09088',
            career: '#8896A0',
            relationship: '#A08898',
            soulUrge: '#9088A0',
            yearlyCycle: '#A0962A'
        };

        const titles: any = {
            lifePath: '타고난 기질',
            shadow: '내면의 그림자',
            career: '일과 재물',
            relationship: '사랑과 관계',
            soulUrge: '영혼의 갈망',
            yearlyCycle: '올해의 흐름'
        };

        const isOpen = key === 'lifePath' || unlocked;

        return (
            <AnalysisCard
                key={key}
                title={content.title || titles[key] || '심층 분석'}
                subtitle={key === 'lifePath' ? '이 삶에서 당신이 걸어갈 길의 본질' : '당신만을 위한 특별한 리포트'}
                icon={icons[key] || <Sparkles className="w-5 h-5" />}
                isLocked={!isOpen}
            >
                {isOpen ? (
                    <div className={`space-y-6 ${justUnlocked && key !== 'lifePath' ? 'premium-unlock-enter' : ''}`}>
                        {content.paragraphs.map((p: string, i: number) => (
                            <p key={i} className="leading-relaxed text-[17px] font-sans" style={{ color: 'var(--foreground)', opacity: 0.75, lineHeight: 1.85 }}>{p}</p>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400 space-y-2">
                        <Lock className="w-5 h-5 opacity-40" />
                        <p className="text-sm font-medium">분석이 준비되어 있습니다</p>
                    </div>
                )}
            </AnalysisCard>
        );
    };

    // —— Make Webhook Test ——
    const handleWebhookTest = async () => {
        if (!analysis) { alert('분석 데이터가 아직 없습니다.'); return; }
        const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL;
        if (!webhookUrl || webhookUrl.includes('your-unique')) {
            alert('.env.local의 NEXT_PUBLIC_MAKE_WEBHOOK_URL을 실제 Make 웹훅 URL로 교체하세요.');
            return;
        }

        const premium = PremiumNarrativeLibrary[analysis.lifePath] as any;
        const getTexts = (cat: string): string => {
            if (premium?.[cat]) return (premium[cat] as string[]).join('\n\n');
            const fallback = LocalNarrative[analysis.lifePath];
            return (fallback as any)?.[cat] || '';
        };

        const payload = {
            name: profile.full_name || '이름 없음',
            birth_date: profile.birth_date || '알 수 없음',
            life_path: analysis.lifePath,
            born_essence: analysis.bornEssence,
            shadow_number: analysis.shadow,
            career_type: analysis.career,
            soul_urge: analysis.soulUrge,
            yearly_cycle: analysis.yearlyCycle,
            text_lifepath: getTexts('lifePath'),
            text_shadow: getTexts('shadow'),
            text_career: getTexts('career'),
            text_relationship: getTexts('relationship'),
            text_soulurge: getTexts('soulUrge'),
            text_yearlycycle: getTexts('yearlyCycle'),
            sent_at: new Date().toISOString(),
            record_id: recordId,
        };

        setWebhookStatus('sending');
        try {
            const res = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setWebhookStatus('success');
            } else {
                setWebhookStatus('error');
            }
        } catch (err) {
            setWebhookStatus('error');
        }
    };

    // Card Content Mapping
    const getCardContent = (cat: string) => {
        const fallback = { title: '심층 분석', paragraphs: ['분석 내용을 준비 중입니다.'] };
        if (!analysis) return fallback;

        const num = analysis.lifePath;
        const currentYear = new Date().getFullYear();
        const indParagraphs = generateINDInsight(analysis, cat);

        // Handle career-specific categories
        if (activeTab === 'career') {
            const baseNum = num === 11 ? 2 : num === 22 ? 4 : num === 33 ? 6 : num;
            const narrative = CareerNarrativeLibrary[baseNum] || CareerNarrativeLibrary[1];
            switch (cat) {
                case 'career_vessel': return { title: '그릇의 규격', paragraphs: [...narrative.vessel, ...indParagraphs] };
                case 'career_flow': return { title: '재물의 흐름', paragraphs: [...narrative.wealthFlow, ...indParagraphs] };
                case 'career_phase': return { title: '직업의 위상', paragraphs: [...narrative.career, ...indParagraphs] };
                case 'career_risk': return { title: '리스크 제어', paragraphs: [...narrative.caution, ...indParagraphs] };
                default: return fallback;
            }
        }

        // Handle compat-specific categories
        if (activeTab === 'compat') {
            const p1Num = analysis.lifePath;
            const p2Num = analysisP2 ? analysisP2.lifePath : 1;
            const n1 = LocalNarrative[p1Num] || LocalNarrative[1];
            const n2 = LocalNarrative[p2Num] || LocalNarrative[1];
            const compat = getCompatNarrative(p1Num, p2Num);
            const p2Name = analysisP2?.name || '상대방';

            switch (cat) {
                case 'compat_p1': return { title: '나의 기질', paragraphs: [n1.essence, n1.shadow, ...indParagraphs] };
                case 'compat_p2': return { title: `${p2Name}의 기질`, paragraphs: [n2.essence, n2.shadow] };
                case 'compat_dynamics': return { title: '에너지 시너지', paragraphs: [...compat.interferenceProps.description.concat(compat.relationshipDynamics), ...indParagraphs] };
                case 'compat_solution': return { title: '관계 솔루션', paragraphs: [...compat.businessDynamics.concat(compat.solution), ...indParagraphs] };
                default: return fallback;
            }
        }

        // Handle yearly-specific categories (AAOD)
        if (activeTab === 'yearly') {
            const aaod = calculateAAOD(analysis.bornEssence, analysis.lifePath, currentYear);

            switch (cat) {
                case 'yearly_synergy': return { title: '보강 간섭', paragraphs: [...(aaod.synergy.length > 0 ? aaod.synergy.flatMap(s => s.story) : ["특별한 보강 에너지가 없습니다."]), ...indParagraphs] };
                case 'yearly_conflict': return { title: '상쇄 간섭', paragraphs: [...(aaod.conflict.length > 0 ? aaod.conflict.flatMap(c => c.story) : ["특별한 상쇄 에너지가 없습니다."]), ...indParagraphs] };
                case 'yearly_guide': return { title: '올해의 지침', paragraphs: [...aaod.actionStrategy.guide, ...indParagraphs] };
                case 'yearly_caution': return { title: '올해의 경고', paragraphs: [...aaod.actionStrategy.caution, ...indParagraphs] };
                default: return fallback;
            }
        }

        // Default categories (summary tab)
        const premium = PremiumNarrativeLibrary[num] as any;
        const basic = LocalNarrative[num];

        if (unlocked && premium && premium[cat]) {
            return { title: premium[`${cat}Title`] || (LocalCategoryNarratives as any)[cat] || 'Analysis', paragraphs: [...premium[cat], ...indParagraphs] };
        }

        // Fallback to basic essence for lifePath if not unlocked or premium missing
        if (cat === 'lifePath' && basic) {
            return { title: (LocalCategoryNarratives as any)[cat] || 'Analysis', paragraphs: [basic.essence, ...indParagraphs] };
        }

        return { ...fallback, paragraphs: [...fallback.paragraphs, ...indParagraphs] };
    };

    // Keyword chips per category
    const categoryKeywords: Record<string, string[]> = {
        lifePath: ['타고난 본질', '삶의 방향', '핵심 기질', '천명'],
        shadow: ['내면의 두려움', '숨겨진 상처', '성장 과제', '통합'],
        career: ['최적 직업 에너지', '재물 흐름', '성취 방식', '강점 영역'],
        relationship: ['사랑 패턴', '관계 리듬', '인연의 언어', '갈등 해소'],
        soulUrge: ['영혼의 갈망', '진정한 소원', '내면의 불꽃', '존재 이유'],
        yearlyCycle: ['올해의 테마', '운명 흐름', '타이밍', '집중 방향'],
        career_vessel: ['그릇의 크기', '에너지 형태', '잠재력', '수용력'],
        career_flow: ['재물 운', '돈의 흐름', '수익 구조', '경제적 패턴'],
        career_phase: ['직업적 위상', '성취 단계', '사회적 역할', '성공 전략'],
        career_risk: ['재물 손실', '위험 관리', '주의 사항', '방어 기제'],
        compat_p1: ['나의 기질', '에너지 1', '타고난 본질'],
        compat_p2: ['상대의 기질', '에너지 2', '상대의 본질'],
        compat_dynamics: ['파동 간섭', '작용 반작용', '관계의 물리적 특징'],
        compat_solution: ['조율점', '마찰 제어', '솔루션', '시너지'],
        yearly_synergy: ['보강 간섭', '귀인', '시너지', '결실'],
        yearly_conflict: ['상쇄 간섭', '마찰', '충돌', '손실'],
        yearly_guide: ['행동 지침', '전략', '올해의 테마', '가이드'],
        yearly_caution: ['주의 사항', '리스크 제어', '함정', '경고'],
    };

    const getHeaderTitle = () => {
        if (!analysis) return t('result.reportTitle');
        if (reportType === 'compat' && analysisP2) {
            const compat = getCompatNarrative(analysis.lifePath, analysisP2.lifePath);
            return `${profile.full_name || ''} × ${analysisP2.name || ''} · ${compat.interferenceProps.title}`;
        }
        if (reportType === 'saju' && sajuResult) {
            return `${profile.full_name || ''} · ${t('services.saju.title')} ${t('result.reportTitle')}`;
        }
        if (reportType === 'tarot' && tarotResult) {
            return `${profile.full_name || ''} · ${t('services.tarot.title')} ${t('result.reportTitle')}`;
        }
        if (reportType === 'ziwei' && ziweiResult) {
            return `${profile.full_name || ''} · ${t('services.ziwei.title')} ${t('result.reportTitle')}`;
        }
        if (reportType === 'astrology' && astrologyResult) {
            return `${profile.full_name || ''} · ${t('services.astrology.title')} ${t('result.reportTitle')}`;
        }
        const num = analysis.lifePath;
        const baseTitle = LocalNarrative[num]?.title || (
            num === 11 ? 'Master Intuition' :
                num === 22 ? 'Master Builder' :
                    num === 33 ? 'Master Teacher' : 'Soul Vibration'
        );
        return baseTitle;
    };

    const getBlueprintLabel = () => {
        switch (reportType) {
            case 'saju': return 'WHOAMI · Saju Report';
            case 'tarot': return 'WHOAMI · Tarot Reading';
            case 'ziwei': return 'WHOAMI · Zi Wei Chart';
            case 'astrology': return 'WHOAMI · Natal Chart';
            case 'compat': return 'WHOAMI · Synergy Blueprint';
            case 'yearly': return 'WHOAMI · Yearly Guide';
            default: return 'WHOAMI · Soul Blueprint';
        }
    };

    // Phase 1: Loading screen
    if (uiPhase === 'loading') {
        return (
            <div className="w-full max-w-4xl mx-auto relative z-0">
                <AnalysisLoadingScreen
                    reportType={reportType}
                    onComplete={() => setUiPhase('content')}
                />
            </div>
        );
    }

    // Phase 2: Skip reveal — go directly to content
    if (uiPhase === 'reveal') setUiPhase('content');

    return (
        <div className="w-full max-w-4xl mx-auto space-y-0 pb-24 relative z-0">
            {/* Report printable container */}
            <div ref={reportRef} style={{ backgroundColor: 'var(--bg-color)' }} className="rounded-3xl overflow-hidden">

                {/* ── Mystical Header ── */}
                <header className="relative text-center pt-10 md:pt-14 pb-8 md:pb-10 px-4 md:px-8 overflow-hidden">
                    {/* Decorative background blobs */}
                    <div className="absolute inset-0 pointer-events-none" aria-hidden>
                        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20"
                            style={{ background: 'radial-gradient(circle, #88A096 0%, transparent 70%)', filter: 'blur(40px)' }} />
                        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full opacity-15"
                            style={{ background: 'radial-gradient(circle, #C4A882 0%, transparent 70%)', filter: 'blur(40px)' }} />
                    </div>

                    <div className="relative z-10 space-y-4">
                        {/* Mystical badge */}
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, #88A096)' }} />
                            <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: '#88A096' }}>
                                {getBlueprintLabel()}
                            </span>
                            <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, #88A096)' }} />
                        </div>

                        <h1 className="text-2xl md:text-5xl font-serif leading-tight px-2 md:px-4 text-foreground">
                            {unlocked ? getHeaderTitle() : `${profile.full_name}님의 영혼 설계도`}
                        </h1>

                        <div className="flex flex-col items-center gap-1.5">
                            <p className="font-sans text-base md:text-lg text-gray-500">
                                당신의 삶에 새겨진 고유한 우주 코드를 해독했어요
                            </p>
                        </div>

                        {/* Decorative divider */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, #C4A882)' }} />
                            <span style={{ color: '#C4A882', fontSize: '18px' }}>✦</span>
                            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, #C4A882)' }} />
                        </div>
                    </div>
                </header>

                {/* ── Unlock Success Banner ── */}
                {unlocked && (
                    <div className="mx-6 mb-8 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700"
                        style={{ background: 'linear-gradient(135deg, rgba(136,160,150,0.15) 0%, rgba(196,168,130,0.12) 100%)', border: '1px solid rgba(136,160,150,0.35)' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(136,160,150,0.2)' }}>
                            <Sparkles className="w-5 h-5" style={{ color: '#88A096' }} />
                        </div>
                        <div>
                            <p className="font-serif font-semibold text-foreground">
                                당신만을 위한 분석이 열렸어요
                            </p>
                            <p className="text-sm mt-0.5 text-gray-500">
                                당신만의 특별한 이야기를 천천히 읽어보세요
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Report Type Badge ── */}
                {unlocked && (
                    <div className="px-6 pb-2 pt-1">
                        <span
                            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                            style={{ background: `${typeMeta.color}15`, color: typeMeta.color, border: `1px solid ${typeMeta.color}30` }}
                        >
                            <span>{typeMeta.icon}</span>
                            <span>{typeMeta.label} 리포트</span>
                        </span>
                    </div>
                )}

                {/* ── Analysis Content ── */}
                <div className="px-6 space-y-6 pb-8 pt-2">
                    {engineError && (
                        <div className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-center font-medium">
                            {engineError}
                        </div>
                    )}

                    {/* Specialized Views Priority */}
                    {reportType === 'saju' ? (
                        sajuResult ? <SajuResultView result={sajuResult} name={sajuUser.name} gender={sajuUser.gender} /> :
                            <div className="p-20 text-center space-y-4"><div className="animate-spin w-8 h-8 border-4 border-[#B88A6A] border-t-transparent rounded-full mx-auto" /><p className="text-gray-400 font-serif">사주 명식을 불러오는 중입니다...</p></div>
                    ) : reportType === 'tarot' ? (
                        tarotResult ? <TarotResultView data={tarotResult} /> :
                            <div className="p-20 text-center space-y-4"><div className="animate-spin w-8 h-8 border-4 border-[#7B6EA0] border-t-transparent rounded-full mx-auto" /><p className="text-gray-400 font-serif">타로 결과를 분석 중입니다...</p></div>
                    ) : reportType === 'ziwei' ? (
                        ziweiResult ? <ZiWeiResultView data={ziweiResult} /> :
                            <div className="p-20 text-center space-y-4"><div className="animate-spin w-8 h-8 border-4 border-[#6A8FAA] border-t-transparent rounded-full mx-auto" /><p className="text-gray-400 font-serif">자미두수 명반을 생성 중입니다...</p></div>
                    ) : reportType === 'astrology' ? (
                        astrologyResult ? <AstrologyResultView data={astrologyResult} /> :
                            <div className="p-20 text-center space-y-4"><div className="animate-spin w-8 h-8 border-4 border-[#A07868] border-t-transparent rounded-full mx-auto" /><p className="text-gray-400 font-serif">천체 지도를 계산 중입니다...</p></div>
                    ) : (
                        /* Numerology Flow — 투트랙: 메인 탭 + 도파민 스낵 */
                        (reportType === 'summary' || reportType === 'career' || reportType === 'yearly' || reportType === 'compat' || reportType === 'numerology') && (
                            <div className="space-y-8">
                                {/* ── 4-TAB NAVIGATION ── */}
                                <div className="sticky top-0 z-20 pt-2 pb-1" style={{ background: 'var(--bg-color)' }}>
                                    <div className="flex rounded-2xl overflow-hidden border border-gray-200" style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow-card)' }}>
                                        {([
                                            { key: 'summary' as const, label: '종합분석', icon: '✦' },
                                            { key: 'career' as const, label: '직업·재물', icon: '💼' },
                                            { key: 'yearly' as const, label: '올해운', icon: '🌊' },
                                            { key: 'compat' as const, label: '궁합', icon: '❤️', disabled: !analysisP2 },
                                        ]).map((tab) => {
                                            const isActive = activeTab === tab.key;
                                            const isDisabled = tab.disabled;
                                            return (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => !isDisabled && setActiveTab(tab.key)}
                                                    className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-all relative text-center ${isDisabled ? 'text-gray-300 cursor-not-allowed opacity-40' : isActive ? 'text-foreground' : 'text-gray-400'}`}
                                                >
                                                    <span className="text-sm">{tab.icon}</span>
                                                    <span className="text-[11px] font-bold tracking-tight">{tab.label}</span>
                                                    {isActive && (
                                                        <div className="absolute bottom-0 left-[20%] right-[20%] h-[2.5px] rounded-full" style={{ background: 'var(--primary-sage)' }} />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── INTRO SECTION ── */}
                                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-12 shadow-xl shadow-sage/5 border border-gray-100 text-center space-y-5 md:space-y-6">
                                    <h2 className="text-xl md:text-3xl font-serif text-gray-800">
                                        {profile?.full_name}님의 <span className="text-sage italic">
                                            {activeTab === 'summary' ? '본질적인 에너지' :
                                             activeTab === 'career' ? '직업과 재물의 흐름' :
                                             activeTab === 'yearly' ? '올해의 운명 궤적' : '에너지 궁합 분석'}
                                        </span>
                                    </h2>
                                    <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
                                        {activeTab === 'summary' ? '우주가 당신에게 부여한 고유한 진동은 삶의 모든 영역에서 나침반 역할을 합니다.' :
                                         activeTab === 'career' ? '당신의 에너지 구조가 결정하는 부의 흐름과 직업적 잠재력을 해독합니다.' :
                                         activeTab === 'yearly' ? '올 한 해 당신에게 작용하는 우주적 파동의 방향과 강도를 분석합니다.' :
                                         '두 에너지체의 간섭 패턴이 만들어내는 시너지와 마찰을 정밀 분석합니다.'}
                                    </p>
                                </div>

                                {/* ── TAB CONTENT ── */}
                                <div className="flex flex-col gap-6 md:gap-10">
                                    {(activeTab === 'career' ? ['career_vessel', 'career_flow', 'career_phase', 'career_risk'] :
                                      activeTab === 'yearly' ? ['yearly_synergy', 'yearly_conflict', 'yearly_guide', 'yearly_caution'] :
                                      activeTab === 'compat' ? ['compat_p1', 'compat_p2', 'compat_dynamics', 'compat_solution'] :
                                      CORE_KEYS).map((key, idx) => (
                                        <div key={`${activeTab}-${key}`} style={{ animationDelay: `${idx * 80}ms` }} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
                                            {renderArcheCard(key, getCardContent(key))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* ── In-Content Ad (화면 가림 방지: max 280px) ── */}
                <div className="px-6 my-6" style={{ maxHeight: 280, overflow: 'hidden' }}>
                    <AdSense format="auto" responsive={true} style={{ maxHeight: 250 }} />
                </div>

                {/* ── Premium Sections (무료 공개) ── */}
                <div>

                {/* ── Arche Capacity Analysis (4 Domains) ── */}
                {analysis && (reportType === 'summary' || reportType === 'numerology') && activeTab === 'summary' && (
                    <div className="px-6 mb-12">
                        <ArcheCapacityAnalysis stats={analysis.kobaiStats} isLocked={!unlocked} />
                    </div>
                )}

                {/* ── 운명 에너지 분석(IND) 대시보드 ── */}
                {analysis && analysis.indScore && (reportType === 'summary' || reportType === 'numerology') && (
                    <div className="px-6 mb-8">
                        <INDDashboard analysis={analysis} birthYear={profile?.birth_date ? parseInt(profile.birth_date.split('-')[0], 10) : new Date().getFullYear() - 30} />
                    </div>
                )}

                {/* ── Phase 2: Energy Profile & Celebrity Match ── */}
                {analysis && (reportType === 'summary' || reportType === 'numerology') && activeTab === 'summary' && (
                    <div className="px-6 mb-8 space-y-6">
                        <EnergyProfile lifePath={analysis.lifePath} />
                        <CelebrityMatch lifePath={analysis.lifePath} />
                    </div>
                )}

                {/* ── Life Graph (Summary only) ── */}
                {analysis && (reportType === 'summary' || reportType === 'numerology') && activeTab === 'summary' && (
                    <div className="px-6 mb-8 mt-4">
                        <MysticCard
                            number="WG"
                            title={"인생 총운 그래프"}
                            subtitle={"태어난 순간부터 80세까지의 운명 에너지 궤적"}
                            icon={<Activity className="w-5 h-5" />}
                            accentColor="#C4A882"
                            isLocked={!unlocked}
                            onClick={() => {
                                if (!unlocked && paywallRef.current) {
                                    paywallRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }}
                        >
                            {unlocked ? (
                                <div className="mt-4 -ml-4 -mr-2">
                                    <WealthLifeGraph
                                        destinyNum={analysis.lifePath}
                                        coreNum={analysis.bornEssence}
                                        currentAge={new Date().getFullYear() - (profile?.birth_date ? parseInt(profile.birth_date.split('-')[0], 10) : new Date().getFullYear() - 30)}
                                        type={'life'}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2" style={{ color: '#999' }}>
                                    <Lock className="w-4 h-4" />
                                    <p>분석이 준비되어 있어요. 탭하여 잠금 해제하세요.</p>
                                </div>
                            )}
                        </MysticCard>
                    </div>
                )}

                </div>{/* End premium-blur wrapper */}

                {/* ── Report Footer (in PDF) ── */}
                {unlocked && (
                    <div className="mx-6 mb-8 pt-6" style={{ borderTop: '1px solid rgba(136,160,150,0.25)' }}>
                        <p className="text-center text-xs tracking-widest uppercase" style={{ color: '#BBAA99' }}>
                            ✦ WHOAMI Soul Blueprint · 당신만을 위한 수비학 분석 리포트 ✦
                        </p>
                    </div>
                )}
            </div>
            {/* ── End of printable container ── */}

            {/* ── 보너스 컨텐츠: 수비학 대시보드 링크 ── */}
            {unlocked && (
                <div className="px-4 md:px-6 mt-8">
                    <a
                        href="/analyze/numerology/"
                        onClick={(e) => { e.preventDefault(); window.location.href = '/analyze/numerology/'; }}
                        className="group flex items-center justify-between w-full rounded-2xl px-6 py-5 transition-all active:scale-[0.98] cursor-pointer hover:shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, rgba(108,92,231,0.06), rgba(187,107,217,0.1))',
                            border: '2px solid rgba(108,92,231,0.2)',
                            textDecoration: 'none',
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(108,92,231,0.1)' }}>
                                <span className="text-2xl">🔮</span>
                            </div>
                            <div>
                                <p className="font-serif font-semibold text-lg leading-tight" style={{ color: '#2D2D2D' }}>오늘의 운세 · 포츈쿠키</p>
                                <p className="text-sm mt-0.5" style={{ color: '#999' }}>수비학 대시보드에서 더 많은 콘텐츠를 즐겨보세요</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-300 group-hover:translate-x-1 transition-transform" style={{ color: '#6C5CE7' }} />
                    </a>
                </div>
            )}

            {/* ── PDF Download (무료) ── */}
            <div className="px-6 py-8 text-center">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
                    style={{
                        background: 'rgba(136,160,150,0.08)',
                        border: '1px solid rgba(136,160,150,0.2)',
                        color: '#88A096',
                    }}
                >
                    <Download className="w-5 h-5" />
                    {isDownloading ? '리포트 생성 중...' : '리포트 PDF 저장'}
                </button>
            </div>

            {/* ── Circular Navigation ── */}
            <div className="mt-8 space-y-3 pb-10 px-2 relative z-[100] animate-in fade-in slide-in-from-bottom-4 duration-700" id="bottom-nav">
                <p className="text-center text-xs font-bold tracking-widest uppercase mb-4 text-gray-400">
                    다음 탐색
                </p>

                <a
                    href={TYPE_META[reportType]?.link || '/analyze/numerology/'}
                    onClick={(e) => { e.preventDefault(); window.location.href = TYPE_META[reportType]?.link || '/analyze/numerology/'; }}
                    className="flex items-center justify-between w-full rounded-2xl px-6 py-5 transition-all group active:scale-[0.98] cursor-pointer bg-white border-2"
                    style={{ borderColor: 'rgba(136,160,150,0.3)' }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(136,160,150,0.1)' }}>
                            <Compass className="w-6 h-6" style={{ color: '#88A096' }} />
                        </div>
                        <div>
                            <p className="font-serif font-semibold text-lg leading-tight text-foreground">{typeMeta.label} 다시 분석</p>
                            <p className="text-sm mt-0.5 text-gray-400">다른 정보를 입력하여 새롭게 탐색해 보세요</p>
                        </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#88A096] group-hover:translate-x-1 transition-all" />
                </a>

                {/* ── Share Card (numerology only) ── */}
                {analysis && (reportType === 'summary' || reportType === 'numerology' || reportType === 'career' || reportType === 'yearly') && (
                    <ShareCard
                        lifePath={analysis.lifePath}
                        title={LocalNarrative[analysis.lifePath]?.title || ''}
                        name={profile.full_name || ''}
                        keywords={(() => {
                            const kw: Record<number, string[]> = {
                                1: ['리더십', '독립', '개척'], 2: ['조화', '공감', '평화'],
                                3: ['창의성', '표현', '영감'], 4: ['안정', '성실', '체계'],
                                5: ['자유', '모험', '변화'], 6: ['치유', '사랑', '헌신'],
                                7: ['탐구', '직관', '분석'], 8: ['성취', '권력', '풍요'],
                                9: ['지혜', '이상', '봉사'],
                                100: ['영성', '직관', '각성'], 101: ['건축', '비전', '실현'], 102: ['교사', '치유', '헌신'],
                            };
                            return kw[analysis.lifePath] || ['에너지', '잠재력', '흐름'];
                        })()}
                    />
                )}

                {/* ── Cross Service CTA ── */}
                <CrossServiceCTA currentService={reportType === 'summary' || reportType === 'career' || reportType === 'yearly' || reportType === 'compat' ? 'numerology' : reportType} />
            </div>

            {/* ── Footer ── */}
            <footer className="px-6 pb-20 pt-10 text-center space-y-4">
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-black opacity-30">
                    Who Am I? Spiritual Blueprint v3.1-STABLE
                </p>
                <p className="text-xs text-center text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                    본 분석은 통계적 데이터와 인공지능 알고리즘을 결합한 창의적 해석이며, 삶의 참고 자료로 활용하시기 바랍니다.
                </p>
            </footer>


        </div>
    );
}

// ── MysticCard Component ──
interface MysticCardProps {
    number: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    accentColor: string;
    isLocked: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

function MysticCard({ number, title, subtitle, icon, accentColor, isLocked, onClick, children }: MysticCardProps) {
    return (
        <div
            className={`rounded-2xl overflow-hidden transition-all ${isLocked ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
            onClick={onClick}
            style={{
                background: isLocked
                    ? 'rgba(255,255,255,0.5)'
                    : '#ffffff',
                border: `1px solid ${isLocked ? 'rgba(180,170,160,0.2)' : 'rgba(180,170,160,0.35)'}`,
                boxShadow: isLocked ? 'none' : '0 4px 24px rgba(0,0,0,0.04)',
                opacity: isLocked ? 0.65 : 1,
            }}>
            {/* Card top accent bar */}
            <div className="h-1 w-full" style={{ background: isLocked ? '#DDD5CC' : accentColor, opacity: isLocked ? 0.5 : 1 }} />

            <div className="p-5 md:p-8">
                {/* Card header */}
                <div className="flex items-start gap-4 mb-5">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ background: isLocked ? 'rgba(200,190,180,0.2)' : `${accentColor}20`, color: isLocked ? '#BBAA99' : accentColor }}>
                            {isLocked ? <Lock className="w-5 h-5" /> : icon}
                        </div>
                        <span className="text-[10px] font-bold tracking-widest" style={{ color: isLocked ? '#CCBBAA' : accentColor }}>
                            {number}
                        </span>
                    </div>
                    <div className="flex-1 pt-1">
                        <h3 className="font-serif text-xl font-bold" style={{ color: isLocked ? '#BBB' : '#2D2D2D' }}>
                            {title}
                        </h3>
                        <p className="text-sm mt-0.5" style={{ color: isLocked ? '#CCC' : '#999' }}>
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="mb-5 h-px" style={{ background: isLocked ? 'rgba(200,190,180,0.15)' : `${accentColor}25` }} />

                {/* Content */}
                <div className="font-sans" style={{ fontSize: '1rem', lineHeight: '1.85' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ── Wealth & Life Graph Component ──
function WealthLifeGraph({ destinyNum, coreNum, currentAge, type }: { destinyNum: number; coreNum: number; currentAge: number; type: 'wealth' | 'life' }) {
    if (isNaN(destinyNum) || isNaN(coreNum)) return null;

    const rawData: { age: number; value: number }[] = [];
    for (let age = 0; age <= 101; age++) {
        const h2 = age;
        const c2 = destinyNum;
        const a2 = coreNum;
        let value: number;

        if (type === 'wealth') {
            // Wealth formula: Financial cycles with Jupiter (12yr) and Saturn (29yr) overlaps
            // Peaks around 35-55 (prime earning years), with cyclical ups and downs
            const jupiterCycle = Math.sin((h2 + c2) * (Math.PI / 12)) * (15 + a2) * 0.8;
            const saturnCycle = Math.cos((h2 + c2 * 0.7) * (Math.PI / 29)) * (10 + a2) * 0.6;
            const careerCurve = 30 * Math.exp(-Math.pow(h2 - 42 - c2 * 0.5, 2) / 300);
            const earlyStruggle = -20 * Math.exp(-Math.pow(h2 - 5, 2) / 50);
            const lateDecline = -15 * Math.exp(-Math.pow(h2 - 80, 2) / 100);
            value = 45 + jupiterCycle + saturnCycle + careerCurve + earlyStruggle + lateDecline;
        } else {
            // Life formula: Emotional maturity curve with destiny-specific fluctuations
            // Dip in youth (identity crisis), peak in midlife, wisdom plateau in late life
            const destinyWave = Math.sin((h2 + c2) * (Math.PI / 30)) * (20 + a2) * 1.3;
            const youthCrisis = -45 * Math.exp(-Math.pow(h2 + c2 - 22, 2) / 4);
            const wisdomCurve = 20 * (1 / (1 + Math.exp(-(h2 - 50) / 8)));
            const lifeRhythm = Math.sin(h2 * a2 * 0.3) * 8;
            value = 40 + destinyWave - youthCrisis + wisdomCurve + lifeRhythm;
        }
        rawData.push({ age, value });
    }

    // Normalization: min-max to 0-100, then clamp [10, 100]
    const rawValuesOnly = rawData.map(d => d.value);
    const minVal = Math.min(...rawValuesOnly);
    const maxVal = Math.max(...rawValuesOnly);
    const range = maxVal - minVal;

    const data = rawData.map(d => {
        let normalized = range === 0 ? 50 : ((d.value - minVal) / range) * 100;
        normalized = Math.max(10, Math.min(100, normalized));
        return { age: d.age, energy: Math.round(normalized) };
    }).slice(0, 86);

    const displayRange = 85;
    const displayAge = Math.min(displayRange, Math.max(0, currentAge));
    const accentColor = type === 'wealth' ? '#A0962A' : '#C4A882';
    const gradientId = `color${type}`;

    return (
        <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="age"
                        tickFormatter={(v) => `${v}세`}
                        stroke="#BBAA99"
                        fontSize={11}
                        tickMargin={8}
                        minTickGap={20}
                        axisLine={{ stroke: 'rgba(200,190,180,0.3)' }}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[0, 100]}
                        stroke="#BBAA99"
                        fontSize={11}
                        tickCount={5}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        position={{ y: 260 }}
                        contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid rgba(136,160,150,0.2)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                            backgroundColor: 'rgba(255,255,255,0.97)',
                            padding: '8px 14px',
                            fontSize: '13px',
                        }}
                        itemStyle={{ color: '#2D2D2D', fontWeight: 'bold' }}
                        formatter={(value: any) => [`${value} 파워`, type === 'wealth' ? '재물 에너지' : '운명 에너지']}
                        labelFormatter={(label) => `${label}세`}
                        cursor={{ stroke: accentColor, strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <ReferenceLine
                        x={displayAge}
                        stroke="#88A096"
                        strokeDasharray="4 4"
                        label={{
                            position: 'top',
                            value: '현재',
                            fill: '#88A096',
                            fontSize: 12,
                            fontWeight: 'bold'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="energy"
                        stroke={accentColor}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill={`url(#${gradientId})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
