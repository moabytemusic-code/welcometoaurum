import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const partnerCode = cookieStore.get('aurum_partner_session')?.value;

    if (!partnerCode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { funnelId } = await request.json();
    if (!funnelId) {
      return NextResponse.json({ error: 'Missing funnel selection' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('aurum_affiliates')
      .update({ unlocked_funnels: funnelId })
      .eq('affiliate_code', partnerCode);

    if (error) {
      console.error('Failed to update active funnel selection:', error);
      return NextResponse.json({ error: error.message || 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Partner Funnel API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
