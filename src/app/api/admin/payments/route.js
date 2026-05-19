import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('aurum_admin_session')?.value;

    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch payments and join affiliate details
    const { data: payments, error } = await supabase
      .from('aurum_crypto_payments')
      .select(`
        *,
        partner:aurum_affiliates(full_name, email, affiliate_code)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch crypto payments for admin:', error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, payments });
  } catch (err) {
    console.error('Admin Payments GET Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('aurum_admin_session')?.value;

    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, action } = await request.json(); // action = 'approve' or 'decline'
    if (!paymentId || !['approve', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the payment details first
    const { data: payment, error: fetchErr } = await supabase
      .from('aurum_crypto_payments')
      .select('*')
      .eq('id', paymentId)
      .maybeSingle();

    if (fetchErr || !payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    if (payment.status !== 'pending') {
      return NextResponse.json({ error: 'This payment transaction has already been processed' }, { status: 400 });
    }

    if (action === 'approve') {
      // 1. Fetch current affiliate rotator runs
      const { data: partner, error: partnerErr } = await supabase
        .from('aurum_affiliates')
        .select('id, rotator_runs')
        .eq('id', payment.affiliate_id)
        .maybeSingle();

      if (partnerErr || !partner) {
        return NextResponse.json({ error: 'Associated partner not found' }, { status: 404 });
      }

      // 2. Update runs and payment status in a transaction or sequential updates
      const newRunsCount = (partner.rotator_runs || 0) + payment.runs_requested;
      
      const { error: updatePartnerErr } = await supabase
        .from('aurum_affiliates')
        .update({ rotator_runs: newRunsCount, is_rotator: true })
        .eq('id', partner.id);

      if (updatePartnerErr) {
        console.error('Failed to update partner rotator runs:', updatePartnerErr);
        return NextResponse.json({ error: 'Failed to update partner balance' }, { status: 500 });
      }

      const { error: updatePaymentErr } = await supabase
        .from('aurum_crypto_payments')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', payment.id);

      if (updatePaymentErr) {
        console.error('Failed to update payment status:', updatePaymentErr);
        // Attempt to rollback partner runs if payment status update failed
        await supabase
          .from('aurum_affiliates')
          .update({ rotator_runs: partner.rotator_runs })
          .eq('id', partner.id);
        return NextResponse.json({ error: 'Failed to update payment record status' }, { status: 500 });
      }

      console.log(`Payment approved: Added ${payment.runs_requested} runs to partner ${partner.id}. New runs: ${newRunsCount}`);

    } else {
      // Decline action
      const { error: updatePaymentErr } = await supabase
        .from('aurum_crypto_payments')
        .update({ status: 'declined' })
        .eq('id', payment.id);

      if (updatePaymentErr) {
        console.error('Failed to decline payment:', updatePaymentErr);
        return NextResponse.json({ error: 'Failed to decline payment record' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin Payments PATCH Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
