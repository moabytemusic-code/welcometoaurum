import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidAdminSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all leads to calculate stats locally (Simple for 10k leads)
    const { data: leads, error } = await supabase
      .from('aurum_leads')
      .select('landing_variant');

    if (error) throw error;

    // Aggregate stats by variant
    const stats = (leads || []).reduce((acc, lead) => {
      const variant = lead.landing_variant || 'pitch';
      acc[variant] = (acc[variant] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json(stats);
  } catch (err) {
    console.error('Funnel Stats Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
