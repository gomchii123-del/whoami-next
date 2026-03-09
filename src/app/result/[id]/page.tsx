import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ResultClient from '@/components/ResultClient';
import { ArcheEngine } from '@/lib/arche-engine';

async function getAnalysisRecord(id: string) {
    if (id.startsWith('mock-rec-')) {
        const parts = id.split('-');
        // mock-rec-YYYY-MM-DD-random
        const year = parts[2];
        const month = parts[3];
        const day = parts[4];

        if (year && month && day) {
            const analysis = ArcheEngine.performAnalysis(year, month, day);
            return {
                id,
                lp_number: analysis.lifePath,
                life_score: analysis.lifeScore,
                is_paid: false,
                user_profiles: {
                    full_name: 'Test Voyager',
                    email: 'test@example.com',
                    birth_date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                }
            };
        }

        // Fallback for old mock IDs
        return {
            id,
            lp_number: 7,
            life_score: 85,
            is_paid: false,
            user_profiles: { full_name: 'Test Voyager', email: 'test@example.com', birth_date: '1982-10-19' }
        };
    }
    const { data, error } = await supabase
        .from('analysis_records')
        .select(`*, user_profiles(*)`)
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const record = await getAnalysisRecord(id);

    if (!record) {
        notFound();
    }

    const { lp_number, life_score, user_profiles: profile, is_paid } = record;

    return (
        <main className="min-h-screen bg-bg-warm px-6 py-12 md:py-20 flex justify-center">
            <ResultClient
                recordId={id}
                profile={profile}
                lpNumber={lp_number}
                isPaid={is_paid}
            />
        </main>
    );
}
