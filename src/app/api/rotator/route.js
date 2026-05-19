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

    const funnelId = searchParams.get('funnel') || 'pitch';

    function fallbackCorporate() {
      return NextResponse.json({
        code: "1W145K",
        name: "Aurum Corporate",
        email: "support@aurum.foundation",
        phone: "N/A",
        url: "https://backoffice.aurum.foundation/auth/sign-up?ref=1W145K"
      });
    }

    // Fetch all active rotator partners ordered by join date
    const { data: allPartners, error: partnersError } = await supabase
      .from('aurum_affiliates')
      .select('id, affiliate_code, full_name, email, phone, rotator_pool, rotator_index, created_at, unlocked_funnels')
      .eq('is_rotator', true)
      .order('created_at', { ascending: true });

    if (partnersError) throw partnersError;

    if (!allPartners || allPartners.length === 0) {
      return fallbackCorporate();
    }

    // Fetch the most recent 100 leads to determine rotation sequence
    const { data: recentLeads } = await supabase
      .from('aurum_leads')
      .select('id, sponsor_code, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    // Map of affiliate_code -> partner (including downline pools)
    const codeToPartnerMap = {};
    for (const p of allPartners) {
      codeToPartnerMap[p.affiliate_code.trim()] = p;
      if (p.rotator_pool && p.rotator_pool.trim().length > 0) {
        let poolItems = [];
        try {
          const parsed = JSON.parse(p.rotator_pool);
          if (Array.isArray(parsed)) {
            poolItems = parsed;
          } else if (parsed.default && Array.isArray(parsed.default)) {
            poolItems = parsed.default;
          }
        } catch (e) {
          poolItems = p.rotator_pool.split(/[,\s\n]+/).filter(c => c.trim().length > 0);
        }
        for (const item of poolItems) {
          codeToPartnerMap[item.trim()] = p;
        }
      }
    }

    // Filter and map recent leads to active rotator partners or Corporate
    const recentRotatorLeads = [];
    if (recentLeads) {
      for (const lead of recentLeads) {
        const cleanSponsor = (lead.sponsor_code || '').trim();
        const parentPartner = codeToPartnerMap[cleanSponsor];
        if (parentPartner) {
          recentRotatorLeads.push({
            sponsor_code: cleanSponsor,
            partner: parentPartner,
            is_corporate: false
          });
        } else if (cleanSponsor === '1W145K') {
          recentRotatorLeads.push({
            sponsor_code: '1W145K',
            partner: null,
            is_corporate: true
          });
        }
      }
    }

    let selected = null;

    if (recentRotatorLeads.length === 0) {
      // Find the first partner who has the funnel unlocked
      for (const p of allPartners) {
        const unlocked = (p.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
        if (unlocked.includes(funnelId)) {
          selected = p;
          break;
        }
      }
      if (!selected) {
        return fallbackCorporate();
      }
    } else {
      const latest = recentRotatorLeads[0];
      if (latest.is_corporate) {
        // Find last served partner before corporate
        let lastServedPartner = null;
        for (let i = 1; i < recentRotatorLeads.length; i++) {
          if (!recentRotatorLeads[i].is_corporate) {
            lastServedPartner = recentRotatorLeads[i].partner;
            break;
          }
        }

        if (!lastServedPartner) {
          // Select first partner who has the funnel unlocked
          for (const p of allPartners) {
            const unlocked = (p.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
            if (unlocked.includes(funnelId)) {
              selected = p;
              break;
            }
          }
          if (!selected) return fallbackCorporate();
        } else {
          let startIndex = allPartners.findIndex(p => p.affiliate_code === lastServedPartner.affiliate_code);
          if (startIndex === -1) startIndex = 0;

          for (let i = 1; i <= allPartners.length; i++) {
            const idx = (startIndex + i) % allPartners.length;
            const candidate = allPartners[idx];
            const unlocked = (candidate.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
            if (unlocked.includes(funnelId)) {
              selected = candidate;
              break;
            }
          }
          if (!selected) return fallbackCorporate();
        }
      } else {
        // Count consecutive assignments for this partner
        const P = latest.partner;
        
        // Safety check: verify P is still active and has this funnel unlocked
        const unlocked = (P.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
        if (!unlocked.includes(funnelId)) {
          // If the partner who was active no longer has access, choose the next one
          let startIndex = allPartners.findIndex(p => p.affiliate_code === P.affiliate_code);
          if (startIndex === -1) startIndex = 0;

          for (let i = 1; i <= allPartners.length; i++) {
            const idx = (startIndex + i) % allPartners.length;
            const candidate = allPartners[idx];
            const candUnlocked = (candidate.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
            if (candUnlocked.includes(funnelId)) {
              selected = candidate;
              break;
            }
          }
          if (!selected) return fallbackCorporate();
        } else {
          let count = 0;
          for (const item of recentRotatorLeads) {
            if (!item.is_corporate && item.partner.affiliate_code === P.affiliate_code) {
              count++;
            } else {
              break;
            }
          }

          if (count >= 3) {
            return fallbackCorporate(); // 4th lead goes to Corporate
          } else {
            selected = P;
          }
        }
      }
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
        let foundValidDownline = false;
        let attempts = 0;
        let currentIndex = nextIndex % poolItems.length;

        // Fetch all pool members at once to enforce permissions
        const { data: poolMembersData } = await supabase
          .from('aurum_affiliates')
          .select('affiliate_code, unlocked_funnels')
          .in('affiliate_code', poolItems);

        const poolMembersMap = {};
        if (poolMembersData) {
          poolMembersData.forEach(m => {
            poolMembersMap[m.affiliate_code] = m;
          });
        }

        while (attempts < poolItems.length && !foundValidDownline) {
          const candidateCode = poolItems[currentIndex].trim();
          const memberData = poolMembersMap[candidateCode];
          
          if (memberData) {
            const unlocked = (memberData.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
            // Strict Pool Enforcement: Downline member must also have this funnel unlocked
            if (unlocked.includes(funnelId)) {
              foundValidDownline = true;
              activeCode = candidateCode;
              break;
            }
          }
          
          currentIndex = (currentIndex + 1) % poolItems.length;
          attempts++;
        }

        if (foundValidDownline) {
          nextIndex = (currentIndex + 1) % poolItems.length;
        } else {
          // If NO ONE in the pool qualifies, fallback to the leader's own code
          activeCode = selected.affiliate_code;
        }
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
