import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('aurum_admin_session')?.value;

    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch freemium payments and join prospect details
    const { data: payments, error } = await supabase
      .from('freemium_payments')
      .select(`
        *,
        prospect:freemium_prospects(email, first_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch freemium payments for admin:', error);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, payments });
  } catch (err) {
    console.error('Admin Freemium Payments GET Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
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
      .from('freemium_payments')
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
      // Approve action
      const { error: updatePaymentErr } = await supabase
        .from('freemium_payments')
        .update({ status: 'approved' })
        .eq('id', payment.id);

      if (updatePaymentErr) {
        console.error('Failed to update payment status:', updatePaymentErr);
        return NextResponse.json({ error: 'Failed to update payment record status' }, { status: 500 });
      }

    } else {
      // Decline action
      const { error: updatePaymentErr } = await supabase
        .from('freemium_payments')
        .update({ status: 'declined' })
        .eq('id', payment.id);

      if (updatePaymentErr) {
        console.error('Failed to decline payment:', updatePaymentErr);
        return NextResponse.json({ error: 'Failed to decline payment record' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin Freemium Payments PATCH Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
