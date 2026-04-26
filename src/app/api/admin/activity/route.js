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

    // Fetch latest leads
    const { data: leads, error: leadError } = await supabase
      .from('aurum_leads')
      .select('id, email, first_name, landing_variant, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (leadError) throw leadError;

    // Fetch partners with recent activity
    const { data: partners, error } = await supabase
      .from('aurum_affiliates')
      .select('id, full_name, created_at, last_served_at')
      .order('last_served_at', { ascending: false, nullsFirst: false })
      .limit(10);

    if (error) throw error;

    const partnerEvents = partners.map(p => {
      const created = new Date(p.created_at);
      const served = p.last_served_at ? new Date(p.last_served_at) : null;
      
      if (!served) {
        return {
          id: `${p.id}-joined`,
          text: `Partner '${p.full_name}' joined the network.`,
          timestamp: created.toISOString()
        };
      }

      const diff = Math.abs(served.getTime() - created.getTime());
      if (diff < 5000) {
        return {
          id: `${p.id}-sync`,
          text: `Partner data for '${p.full_name}' synchronized.`,
          timestamp: served.toISOString()
        };
      }

      return {
        id: `${p.id}-rotation`,
        text: `Traffic redirected to '${p.full_name}' via Rotator.`,
        timestamp: served.toISOString()
      };
    });

    const leadEvents = (leads || []).map(l => ({
      id: `${l.id}-lead`,
      text: `New Lead: ${l.first_name || 'Prospect'} (via /${l.landing_variant || 'pitch'})`,
      timestamp: l.created_at
    }));

    const allEvents = [...partnerEvents, ...leadEvents]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15);

    return NextResponse.json(allEvents);
  } catch (err) {
    console.error('Activity feed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
