'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Lock, Sparkles, Compass, ShieldAlert, Zap, Briefcase, Heart, Moon, Sun, Home, ChevronRight, Download } from 'lucide-react';
import AnalysisCard from '@/components/AnalysisCard';
import PaymentButton from '@/components/PaymentButton';
import { NarrativeLibrary, CategoryNarratives } from '@/lib/narrative-library';
import { PremiumNarrativeLibrary } from '@/lib/premium-narratives';
import { ArcheEngine } from '@/lib/arche-engine';

interface ResultClientProps {
    recordId: string;
    profile: any;
    lpNumber: number;
    isPaid: boolean;
}

export default function ResultClient({ recordId, profile, lpNumber, isPaid }: ResultClientProps) {
    const [unlocked, setUnlocked] = useState(isPaid);
    const [analysis, setAnalysis] = useState<any>(null);
    const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [isDownloading, setIsDownloading] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);
    const isMockMode = recordId.startsWith('mock-rec-');

    useEffect(() => {
        if (isMockMode) {
            const birthDateStr = profile.birth_date || '1982-10-19';
            const parts = birthDateStr.split('-');
            const year = parts[0];
            const month = parts[1];
            const day = parts[2];

            const results = ArcheEngine.performAnalysis(year, month, day);
            setAnalysis(results);
            setUnlocked(true);
        }
    }, [recordId, profile, isMockMode]);

    const handleUnlock = () => {
        setUnlocked(true);
    };

    // PDF Download Handler
    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;
        setIsDownloading(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const userName = profile.full_name || '나의';
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `${userName}_수비학_분석_리포트.pdf`,
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
            const fallback = NarrativeLibrary[analysis.lifePath];
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
    const getCardContent = (category: string) => {
        if (!analysis) return { title: 'Calculating...', essence: '...' };

        const premium = PremiumNarrativeLibrary[analysis.lifePath];
        if (unlocked && premium && (premium as any)[category]) {
            return {
                title: CategoryNarratives[category] || '분석 결과',
                essence: (premium as any)[category].join('\n\n')
            };
        }

        switch (category) {
            case 'lifePath':
                return NarrativeLibrary[analysis.lifePath] || { ...NarrativeLibrary[1], title: `운명수 ${analysis.lifePath}: 본질의 서막` };
            case 'shadow':
                return {
                    title: `내면의 그림자`,
                    essence: "당신 안에 숨겨진 또 다른 당신이 기다리고 있어요."
                };
            case 'career':
                return NarrativeLibrary[100 + analysis.career] || NarrativeLibrary[100];
            case 'relationship':
                return {
                    title: `관계의 화음`,
                    essence: "당신이 맺는 모든 인연에는 깊은 이유가 있어요."
                };
            case 'soulUrge':
                return NarrativeLibrary[analysis.soulUrge] || { ...NarrativeLibrary[1], title: `영혼의 갈망` };
            case 'yearlyCycle':
                return {
                    title: `올해의 흐름`,
                    essence: "지금 이 시간, 당신의 삶은 조용히 새로운 방향으로 흐르고 있어요."
                };
            default:
                return NarrativeLibrary[1];
        }
    };

    const getHeaderTitle = () => {
        if (!analysis) return '영혼 설계도';
        const num = analysis.lifePath;
        const baseTitle = NarrativeLibrary[num]?.title || (
            num === 11 ? '빛나는 영감을 전하는 신성한 통로' :
                num === 22 ? '세상의 초석을 다지는 위대한 건축가' :
                    num === 33 ? '보편적 인류애를 실천하는 지고한 스승' : '신비로운 영혼의 파동'
        );
        return `운명수 ${num} · ${baseTitle}`;
    };

    return (
        <div className="w-full max-w-3xl space-y-0 pb-24">
            {/* Report printable container */}
            <div ref={reportRef} style={{ backgroundColor: '#F7F3EE' }} className="rounded-3xl overflow-hidden">

                {/* ── Mystical Header ── */}
                <header className="relative text-center pt-14 pb-10 px-8 overflow-hidden">
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
                                Arche · Soul Blueprint
                            </span>
                            <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, #88A096)' }} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif leading-tight px-4" style={{ color: '#2D2D2D' }}>
                            {unlocked ? getHeaderTitle() : `${profile.full_name}님의 영혼 설계도`}
                        </h1>

                        <div className="flex flex-col items-center gap-1.5">
                            <p className="font-sans text-lg" style={{ color: '#666' }}>
                                당신의 삶은{' '}
                                <span className="font-bold font-serif text-xl" style={{ color: '#88A096' }}>
                                    운명수 {analysis?.lifePath || lpNumber}
                                </span>
                                에 새겨져 있어요
                            </p>
                            {analysis?.bornEssence && (
                                <p className="font-sans text-sm" style={{ color: '#999' }}>
                                    태어난 기질의 뿌리 ·{' '}
                                    <span className="font-semibold" style={{ color: '#777' }}>
                                        본질수 {analysis.bornEssence}
                                    </span>
                                </p>
                            )}
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
                            <p className="font-serif font-semibold" style={{ color: '#2D2D2D' }}>
                                당신만을 위한 분석이 열렸어요
                            </p>
                            <p className="text-sm mt-0.5" style={{ color: '#888' }}>
                                6가지 영역에 걸친 깊은 이야기를 천천히 읽어보세요
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Analysis Cards ── */}
                <div className="px-6 space-y-6 pb-8">

                    {/* 1. LifePath */}
                    <MysticCard
                        number="01"
                        title="타고난 기질"
                        subtitle="이 삶에서 당신이 걸어갈 길의 본질"
                        icon={<Compass className="w-5 h-5" />}
                        accentColor="#88A096"
                        isLocked={false}
                    >
                        <p className="whitespace-pre-wrap leading-relaxed text-readable" style={{ color: '#444' }}>
                            {getCardContent('lifePath').essence}
                        </p>
                    </MysticCard>

                    {/* 2. Shadow */}
                    <MysticCard
                        number="02"
                        title="내면의 그림자"
                        subtitle="당신 안에 숨겨진 아픔과 두려움"
                        icon={<ShieldAlert className="w-5 h-5" />}
                        accentColor="#A09088"
                        isLocked={!unlocked}
                    >
                        {unlocked ? (
                            <p className="whitespace-pre-wrap leading-relaxed text-readable" style={{ color: '#444' }}>
                                {getCardContent('shadow').essence}
                            </p>
                        ) : (
                            <p style={{ color: '#999' }}>
                                결제 후 잠금이 해제되면 당신 안에 숨겨진 아픔과 두려움을 들여다볼 수 있어요.
                            </p>
                        )}
                    </MysticCard>

                    {/* 3. Career */}
                    <MysticCard
                        number="03"
                        title="일과 재물"
                        subtitle="당신이 빛나는 영역과 경제적 흐름"
                        icon={<Briefcase className="w-5 h-5" />}
                        accentColor="#8896A0"
                        isLocked={!unlocked}
                    >
                        {unlocked ? (
                            <div className="space-y-3">
                                <p className="whitespace-pre-wrap leading-relaxed text-readable" style={{ color: '#444' }}>
                                    {getCardContent('career').essence}
                                </p>
                            </div>
                        ) : (
                            <p style={{ color: '#999' }}>
                                잠금 해제 후 당신이 가장 빛나는 직업 영역과 재물의 흐름을 알 수 있어요.
                            </p>
                        )}
                    </MysticCard>

                    {/* 4. Relationship */}
                    <MysticCard
                        number="04"
                        title="사랑과 관계"
                        subtitle="당신이 사랑하는 방식, 상처받는 방식"
                        icon={<Heart className="w-5 h-5" />}
                        accentColor="#A08898"
                        isLocked={!unlocked}
                    >
                        {unlocked ? (
                            <p className="whitespace-pre-wrap leading-relaxed text-readable" style={{ color: '#444' }}>
                                {getCardContent('relationship').essence}
                            </p>
                        ) : (
                            <p style={{ color: '#999' }}>
                                잠금 해제 후 당신의 사랑 패턴과 관계의 숨겨진 리듬을 알 수 있어요.
                            </p>
                        )}
                    </MysticCard>

                    {/* 5. SoulUrge */}
                    <MysticCard
                        number="05"
                        title="영혼의 갈망"
                        subtitle="말하지 못했던 진짜 소원"
                        icon={<Moon className="w-5 h-5" />}
                        accentColor="#9088A0"
                        isLocked={!unlocked}
                    >
                        {unlocked ? (
                            <p className="whitespace-pre-wrap leading-relaxed text-readable" style={{ color: '#444' }}>
                                {getCardContent('soulUrge').essence}
                            </p>
                        ) : (
                            <p style={{ color: '#999' }}>
                                잠금 해제 후 당신의 영혼이 진짜 원하는 것을 들을 수 있어요.
                            </p>
                        )}
                    </MysticCard>

                    {/* 6. YearlyCycle */}
                    <MysticCard
                        number="06"
                        title="올해의 흐름"
                        subtitle="지금 이 시기, 당신의 운명이 향하는 곳"
                        icon={<Sun className="w-5 h-5" />}
                        accentColor="#A0962A"
                        isLocked={!unlocked}
                    >
                        {unlocked ? (
                            <p className="whitespace-pre-wrap leading-relaxed text-readable" style={{ color: '#444' }}>
                                {getCardContent('yearlyCycle').essence}
                            </p>
                        ) : (
                            <p style={{ color: '#999' }}>
                                잠금 해제 후 올해 당신에게 찾아오는 운명의 흐름을 알 수 있어요.
                            </p>
                        )}
                    </MysticCard>
                </div>

                {/* ── Report Footer (in PDF) ── */}
                {unlocked && (
                    <div className="mx-6 mb-8 pt-6" style={{ borderTop: '1px solid rgba(136,160,150,0.25)' }}>
                        <p className="text-center text-xs tracking-widest uppercase" style={{ color: '#BBAA99' }}>
                            ✦ Arche Soul Blueprint · 당신만을 위한 수비학 분석 리포트 ✦
                        </p>
                    </div>
                )}
            </div>
            {/* ── End of printable container ── */}

            {/* ── Paywall ── */}
            {!unlocked && (
                <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-2">
                    <div className="rounded-3xl text-center space-y-8 p-10 md:p-16"
                        style={{
                            background: 'linear-gradient(160deg, #F7F3EE 0%, #EDE8E1 100%)',
                            border: '2px dashed rgba(136,160,150,0.4)'
                        }}>
                        <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center animate-float"
                            style={{ background: 'rgba(136,160,150,0.15)' }}>
                            <Lock className="w-10 h-10" style={{ color: '#88A096' }} />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-serif" style={{ color: '#2D2D2D' }}>
                                당신의 이야기가 기다리고 있어요
                            </h2>
                            <p className="text-lg max-w-md mx-auto" style={{ color: '#888', lineHeight: '1.7' }}>
                                그림자, 사랑, 일, 영혼의 갈망, 올해의 운명—<br />
                                5가지 이야기가 아직 잠겨 있어요.
                            </p>
                        </div>
                        <div className="max-w-md mx-auto">
                            <PaymentButton recordId={recordId} userName={profile.full_name} onUnlock={handleUnlock} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── PDF Download Button ── */}
            {unlocked && (
                <div className="mt-8 px-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="w-full flex items-center justify-center gap-3 rounded-2xl py-5 font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-60"
                        style={{
                            background: isDownloading
                                ? 'rgba(136,160,150,0.5)'
                                : 'linear-gradient(135deg, #88A096 0%, #6d8a7a 100%)',
                            color: '#fff',
                            boxShadow: '0 8px 30px rgba(136,160,150,0.35)',
                        }}
                    >
                        <Download className="w-5 h-5" />
                        {isDownloading ? (
                            <span className="animate-pulse">PDF 생성 중...</span>
                        ) : (
                            'PDF로 다운로드'
                        )}
                    </button>
                    <p className="text-center text-xs mt-2" style={{ color: '#BBAA99' }}>
                        리포트 전체가 A4 PDF 파일로 저장됩니다
                    </p>
                </div>
            )}

            {/* ── Circular Navigation ── */}
            <div className="mt-8 space-y-3 pb-10 px-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-center text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#BBAA99' }}>
                    다음 탐색
                </p>

                <Link
                    href="/analyze/numerology"
                    className="flex items-center justify-between w-full rounded-2xl px-6 py-5 transition-all group active:scale-[0.98]"
                    style={{ background: '#fff', border: '2px solid rgba(136,160,150,0.3)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(136,160,150,0.7)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(136,160,150,0.3)')}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(136,160,150,0.1)' }}>
                            <Compass className="w-6 h-6" style={{ color: '#88A096' }} />
                        </div>
                        <div>
                            <p className="font-serif font-semibold text-lg leading-tight" style={{ color: '#2D2D2D' }}>새 생년월일로 다시 분석</p>
                            <p className="text-sm mt-0.5" style={{ color: '#BBAA99' }}>다른 사람의 운명 코드를 탐색해 보세요</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 shrink-0" style={{ color: '#88A096' }} />
                </Link>

                <Link
                    href="/"
                    className="flex items-center justify-between w-full rounded-2xl px-6 py-5 transition-all group active:scale-[0.98]"
                    style={{
                        background: 'linear-gradient(135deg, #88A096 0%, #6d8a7a 100%)',
                        color: '#fff',
                        boxShadow: '0 6px 20px rgba(136,160,150,0.3)'
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                            <Home className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-serif font-semibold text-xl leading-tight">다른 점술 서비스 둘러보기</p>
                            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>타로, 사주 등 Arche의 모든 서비스</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                </Link>
            </div>

            {/* ⚠️ DEV ONLY — Make Webhook Test */}
            {isMockMode && (
                <div className="mt-6 border-2 border-dashed border-orange-300 rounded-2xl p-6 bg-orange-50/50 space-y-4 mx-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-orange-500 tracking-widest uppercase bg-orange-100 px-2 py-0.5 rounded">DEV ONLY</span>
                        <p className="text-sm font-bold text-orange-700">Make 웹훅 수동 전송 테스트</p>
                    </div>
                    <button
                        onClick={handleWebhookTest}
                        disabled={webhookStatus === 'sending'}
                        className={`w-full rounded-xl py-4 font-bold text-[16px] transition-all flex items-center justify-center gap-2 ${webhookStatus === 'success'
                            ? 'bg-green-500 text-white cursor-default'
                            : webhookStatus === 'error'
                                ? 'bg-red-500 text-white'
                                : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-[0.98]'
                            } disabled:opacity-60`}
                    >
                        {webhookStatus === 'idle' && '📡 Make 웹훅으로 데이터 전송하기'}
                        {webhookStatus === 'sending' && <span className="animate-pulse">전송 중...</span>}
                        {webhookStatus === 'success' && '✅ 전송 성공! Make에서 수신 여부를 확인하세요.'}
                        {webhookStatus === 'error' && '❌ 전송 실패 — Console에서 오류 확인'}
                    </button>
                    {webhookStatus !== 'idle' && (
                        <button onClick={() => setWebhookStatus('idle')} className="text-xs text-orange-500 underline w-full text-center">초기화</button>
                    )}
                </div>
            )}
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
    children: React.ReactNode;
}

function MysticCard({ number, title, subtitle, icon, accentColor, isLocked, children }: MysticCardProps) {
    return (
        <div className="rounded-2xl overflow-hidden transition-all"
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

            <div className="p-6 md:p-8">
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
