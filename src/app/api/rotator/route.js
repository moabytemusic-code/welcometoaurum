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

    // 2. 1-to-3 Spillover Logic (Fill the oldest slots first)
    const funnelId = searchParams.get('funnel') || 'pitch';
    
    // Fetch all active rotator partners ordered by join date
    const { data: allPartners, error: partnersError } = await supabase
      .from('aurum_affiliates')
      .select('id, affiliate_code, full_name, email, phone, rotator_pool, rotator_index, created_at')
      .eq('is_rotator', true)
      .order('created_at', { ascending: true });

    if (partnersError) throw partnersError;

    if (!allPartners || allPartners.length === 0) {
      return fallbackCorporate();
    }

    // Find the first partner who hasn't filled their 3 slots yet
    let selected = null;
    for (const p of allPartners) {
      const { count, error: countError } = await supabase
        .from('aurum_leads')
        .select('*', { count: 'exact', head: true })
        .eq('sponsor_code', p.affiliate_code);
      
      if (!countError && (count || 0) < 3) {
        selected = p;
        break;
      }
    }

    // If everyone is full, fallback to the most recently served person (or Corporate)
    if (!selected) {
      console.log('All partners have 3+ leads, falling back to corporate for now.');
      return fallbackCorporate();
    }

    function fallbackCorporate() {
      return NextResponse.json({
        code: "1W145K",
        name: "Aurum Corporate",
        email: "support@aurum.foundation",
        phone: "N/A",
        url: "https://backoffice.aurum.foundation/auth/sign-up?ref=1W145K"
      });
    }

    // 4. Handle Sub-Rotation (Fair Sequential Cycling within the pool)
    let activeCode = selected.affiliate_code;
    let nextIndex = (selected.rotator_index || 0);

    if (selected.rotator_pool && selected.rotator_pool.trim().length > 0) {
      let poolItems = [];
      
      try {
        // Try parsing as JSON first (for structured pools like Justin's)
        const parsed = JSON.parse(selected.rotator_pool);
        if (Array.isArray(parsed)) {
          poolItems = parsed;
        } else if (parsed.default && Array.isArray(parsed.default)) {
          poolItems = parsed.default;
        }
      } catch (e) {
        // Fallback to plain text splitting if JSON fails
        poolItems = selected.rotator_pool.split(/[,\s\n]+/).filter(c => c.trim().length > 0);
      }

      if (poolItems.length > 0) {
        // Pick the code at the current index
        const currentIndex = nextIndex % poolItems.length;
        activeCode = poolItems[currentIndex].trim();
        
        // Move to the next index for next time
        nextIndex = (currentIndex + 1) % poolItems.length;
      }
    }

    // 5. Update BOTH the global 'last_served_at' and the partner's 'rotator_index'
    await supabase
      .from('aurum_affiliates')
      .update({ 
        last_served_at: new Date().toISOString(),
        rotator_index: nextIndex 
      })
      .eq('id', selected.id);

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
