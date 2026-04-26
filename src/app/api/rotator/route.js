import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  // CREATE MASTER CLIENT DYNAMICALLY FOR ROTATION
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  try {
    // 1. Individual Code Resolution (Specific Sponsor)
    if (code) {
      const { data: partner, error } = await supabase
        .from('aurum_affiliates')
        .select('id, affiliate_code, full_name, email, phone, rotator_pool')
        .eq('affiliate_code', code)
        .maybeSingle();

      if (partner) {
        return NextResponse.json({
          code: partner.affiliate_code,
          name: partner.full_name,
          email: partner.email,
          phone: partner.phone || "N/A",
          url: `https://backoffice.aurum.foundation/auth/sign-up?ref=${partner.affiliate_code}`
        });
      }
    }

    // 2. Sequential Rotator Logic (Fair Round-Robin)
    // We look for partners who:
    // - Are promoted (LIVE)
    // - Have permission for the SPECIFIC funnel requested (defaults to 'pitch')
    // - Order by 'last_served_at' ASC to pick the person who hasn't had a lead in the longest time.
    const funnelId = searchParams.get('funnel') || 'pitch';
    
    let { data: partners, error } = await supabase
      .from('aurum_affiliates')
      .select('id, affiliate_code, full_name, email, phone, rotator_pool')
      .eq('is_rotator', true)
      .ilike('unlocked_funnels', `%${funnelId}%`)
      .order('last_served_at', { ascending: true })
      .limit(1);

    // TIERED SEARCH: If no one found for specific funnel, fallback to ANY promoted partner
    if (!partners || partners.length === 0) {
      const fallbackSearch = await supabase
        .from('aurum_affiliates')
        .select('id, affiliate_code, full_name, email, phone, rotator_pool')
        .eq('is_rotator', true)
        .order('last_served_at', { ascending: true })
        .limit(1);
      
      partners = fallbackSearch.data;
      if (fallbackSearch.error) error = fallbackSearch.error;
    }

    if (error) throw error;

    if (!partners || partners.length === 0) {
      console.log('No promoted partners found even with fallback, using Corporate.');
      return NextResponse.json({
        code: "1W145K",
        name: "Aurum Corporate",
        email: "support@aurum.foundation",
        phone: "N/A",
        url: "https://backoffice.aurum.foundation/auth/sign-up?ref=1W145K"
      });
    }

    const selected = partners[0];

    // 3. Update the 'last_served_at' timestamp to move them to the back of the line
    await supabase
      .from('aurum_affiliates')
      .update({ last_served_at: new Date().toISOString() })
      .eq('id', selected.id);

    // 4. Handle Sub-Rotation (within the partner's own pool if they have one)
    let activeCode = selected.affiliate_code;
    if (selected.rotator_pool && selected.rotator_pool.trim().length > 0) {
      const poolItems = selected.rotator_pool.split(/[,\s\n]+/).filter(c => c.trim().length > 0);
      if (poolItems.length > 0) {
        // Deterministic pool rotation? No, random within pool is fine since the partner entry itself is sequential.
        const poolIndex = Math.floor(Math.random() * poolItems.length);
        activeCode = poolItems[poolIndex].trim();
      }
    }

    return NextResponse.json({
      code: activeCode,
      name: selected.full_name,
      email: selected.email,
      phone: selected.phone || "N/A",
      url: `https://backoffice.aurum.foundation/auth/sign-up?ref=${activeCode}`
    });

  } catch (error) {
    console.error('Sequential Rotator CRITICAL Error:', error);
    return NextResponse.json({
      code: "1W145K",
      name: "Aurum Corporate",
      email: "support@aurum.foundation",
      phone: "N/A",
      url: "https://backoffice.aurum.foundation/auth/sign-up?ref=1W145K"
    });
  }
}
