import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const partnerCode = cookieStore.get('neo_partner_session')?.value;

    if (!partnerCode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { coinType, runsRequested, txid } = await request.json();
    if (!coinType || !runsRequested || !txid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the partner's internal UUID
    const { data: partner, error: partnerErr } = await supabase
      .from('neo_affiliates')
      .select('id')
      .eq('affiliate_code', partnerCode)
      .maybeSingle();

    if (partnerErr || !partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Insert the payment transaction request
    const { error: insertErr } = await supabase
      .from('neo_crypto_payments')
      .insert([{
        affiliate_id: partner.id,
        coin_type: coinType,
        runs_requested: parseInt(runsRequested),
        txid: txid.trim(),
        status: 'pending'
      }]);

    if (insertErr) {
      console.error('Failed to save crypto payment request:', insertErr);
      if (insertErr.code === '23505') {
        return NextResponse.json({ error: 'This transaction hash (TXID) has already been submitted' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Partner Payment API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
