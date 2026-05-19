import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const partnerCode = cookieStore.get('aurum_partner_session')?.value;

    if (!partnerCode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch partner info
    const { data: partner, error: partnerErr } = await supabase
      .from('aurum_affiliates')
      .select('id, affiliate_code, full_name, email, phone, is_rotator, rotator_runs, unlocked_funnels, plan')
      .eq('affiliate_code', partnerCode)
      .maybeSingle();

    if (partnerErr || !partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // 2. Fetch total lead count
    const { count: leadCount, error: leadErr } = await supabase
      .from('aurum_leads')
      .select('id', { count: 'exact', head: true })
      .eq('sponsor_code', partner.affiliate_code);

    // 3. Fetch payment submission history
    const { data: payments, error: payErr } = await supabase
      .from('aurum_crypto_payments')
      .select('*')
      .eq('affiliate_id', partner.id)
      .order('created_at', { ascending: false });

    // 4. Fetch all active projects (funnels)
    const { data: activeFunnels, error: funnelErr } = await supabase
      .from('aurum_projects')
      .select('id, name, slug, angle')
      .eq('is_active', true)
      .order('name', { ascending: true });

    return NextResponse.json({
      success: true,
      partner: {
        ...partner,
        totalLeads: leadCount || 0,
        payments: payments || []
      },
      activeFunnels: activeFunnels || []
    });

  } catch (err) {
    console.error('Partner Me API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
