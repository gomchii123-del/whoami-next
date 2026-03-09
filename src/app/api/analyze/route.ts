import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ArcheEngine } from '@/lib/arche-engine';

export async function POST(req: NextRequest) {
    try {
        const { name, year, month, day, hour } = await req.json();

        if (!name || !year || !month || !day) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Calculate Numerology Data
        const analysis = ArcheEngine.performAnalysis(year, month, day, hour);

        // MOCK MODE: Bypass Supabase if keys are placeholders
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
            return NextResponse.json({
                success: true,
                data: analysis,
                recordId: `mock-rec-${year}-${month}-${day}-${Math.random().toString(36).substring(7)}`,
                isMock: true
            });
        }

        // 2. Save User Profile to Supabase
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
                full_name: name,
                birth_date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
                birth_time: hour ? `${hour}:00:00` : null
            }, { onConflict: 'full_name,birth_date' })
            .select()
            .single();

        if (profileError) throw profileError;

        // 3. Save Analysis Record
        const { data: record, error: recordError } = await supabase
            .from('analysis_records')
            .insert({
                user_profile_id: profile.id,
                lp_number: analysis.lifePath,
                shadow_number: analysis.shadow,
                career_number: analysis.career,
                rel_number: analysis.relationship,
                so_number: analysis.soulUrge,
                py_number: analysis.yearlyCycle,
                life_score: analysis.lifeScore,
                kobai_stats: analysis.kobaiStats,
                physics_data: analysis.physics
            })
            .select()
            .single();

        if (recordError) throw recordError;

        return NextResponse.json({
            success: true,
            data: analysis,
            recordId: record.id
        });

    } catch (error: any) {
        console.error('Analysis Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
