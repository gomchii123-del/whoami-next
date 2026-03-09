import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const { paymentId, recordId } = await req.json();

        if (!paymentId || !recordId) {
            return NextResponse.json({ error: 'Missing paymentId or recordId' }, { status: 400 });
        }

        // MOCK MODE: Bypass DB update if recordId is mock
        if (recordId.toString().startsWith('mock-rec-')) {
            return NextResponse.json({ success: true, isMock: true });
        }

        // 1. Verify Payment with Portone API
        // In a real scenario, you'd call Portone's GET /payments/{paymentId}
        // and verify that the amount and status are correct.
        // For this example, we'll assume the client-side success is valid 
        // but ideally, you'd use PORTONE_API_SECRET here.

        // const portoneRes = await fetch(`https://api.portone.io/payments/${paymentId}`, {
        //   headers: { Authorization: `Portone ${process.env.PORTONE_API_SECRET}` }
        // });
        // const paymentData = await portoneRes.json();
        // if (paymentData.status !== 'PAID') throw new Error('Payment not verified');

        // 2. Update Supabase Record
        const { data: record, error: updateError } = await supabase
            .from('analysis_records')
            .update({ is_paid: true, payment_id: paymentId })
            .eq('id', recordId)
            .select(`*, user_profiles(*)`)
            .single();

        if (updateError) throw updateError;

        // 3. Trigger External Webhook (Make.com, Zapier, etc.)
        if (process.env.MAKE_WEBHOOK_URL) {
            await fetch(process.env.MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: record.user_profiles.email,
                    name: record.user_profiles.full_name,
                    analysisData: {
                        lp: record.lp_number,
                        de: record.de_number,
                        so: record.so_number,
                        ls: record.life_score,
                        stats: record.kobai_stats
                    },
                    pdfLink: `https://whoami-test.com/report/${recordId}`
                })
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json({ error: error.message || 'Verification Failed' }, { status: 500 });
    }
}
