'use client';

import { useEffect, useState, Suspense } from 'react';
import ResultClient from '@/components/ResultClient';
import { ArcheEngine } from '@/lib/arche-engine';

import Link from 'next/link';

interface StoredAnalysis {
    name: string;
    birth_date: string;
    year: string;
    month: string;
    day: string;
}

function ResultInner() {
    const [mounted, setMounted] = useState(false);
    const [data, setData] = useState<StoredAnalysis | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [determinedType, setDeterminedType] = useState<string>('numerology');

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
                    setData({
                        name: '나',
                        birth_date: parsed.timestamp || new Date().toISOString(),
                        year: '0', month: '0', day: '0'
                    });
                    setAnalysis({ lifePath: 0, isTarot: true });
                } catch (e) { console.error(e); }
            }
        } else if (urlType === 'ziwei') {
            const rawZiWei = sessionStorage.getItem('lastAnalysis');
            if (rawZiWei) {
                try {
                    const parsed = JSON.parse(rawZiWei);
                    setData({
                        name: parsed.name || '나',
                        birth_date: `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`,
                        year: Number(parsed.year || 0),
                        month: Number(parsed.month || 0),
                        day: Number(parsed.day || 0)
                    } as any);
                    setAnalysis({ lifePath: 0, isZiWei: true });
                } catch (e) { console.error(e); }
            }
        } else if (urlType === 'astrology') {
            const rawAstrology = sessionStorage.getItem('lastAnalysis');
            if (rawAstrology) {
                try {
                    const parsed = JSON.parse(rawAstrology);
                    setData({
                        name: parsed.name || '나',
                        birth_date: `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`,
                        year: Number(parsed.year || 0),
                        month: Number(parsed.month || 0),
                        day: Number(parsed.day || 0)
                    } as any);
                    setAnalysis({ lifePath: 0, isAstrology: true });
                } catch (e) { console.error(e); }
            }
        } else if (urlType === 'saju') {
            const rawSaju = sessionStorage.getItem('arche_saju_data');
            if (rawSaju) {
                try {
                    const parsed = JSON.parse(rawSaju);
                    setData({
                        name: parsed.name,
                        birth_date: `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`,
                        year: Number(parsed.year),
                        month: Number(parsed.month),
                        day: Number(parsed.day)
                    } as any);
                    setAnalysis({ lifePath: 0, isSaju: true, sajuData: parsed });
                } catch (e) { console.error(e); }
            }
        } else {
            const raw = sessionStorage.getItem('arche_analysis');
            if (!raw) return;
            try {
                const parsed: StoredAnalysis = JSON.parse(raw);
                setData(parsed);
                const result = ArcheEngine.performAnalysis(parsed.year, parsed.month, parsed.day);
                setAnalysis(result);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Always allow mounting even if data/analysis is not yet in sessionStorage
    // ResultClient has its own recovery logic.
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

    return (
        <main className="min-h-screen bg-bg-warm px-6 py-12 md:py-20 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <ResultClient
                    recordId={`mock-rec-${data?.year || '0'}-${data?.month || '0'}-${data?.day || '0'}-local`}
                    profile={profile}
                    lpNumber={analysis?.lifePath || 1}
                    isPaid={true}
                    initialReportType={determinedType}
                />

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
