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
        .from('neo_affiliates')
        .select('id, affiliate_code, full_name, email, phone, rotator_pool')
        .eq('affiliate_code', code)
        .maybeSingle();

      if (partner) {
        return NextResponse.json({
          code: partner.affiliate_code,
          name: partner.full_name,
          email: partner.email,
          phone: partner.phone || "N/A",
          url: `https://backoffice.neo.foundation/auth/sign-up?ref=${partner.affiliate_code}`
        });
      }
    }

    const funnelId = searchParams.get('funnel') || 'pitch';

    function fallbackCorporate() {
      return NextResponse.json({
        code: "1W145K",
        name: "Neo Corporate",
        email: "support@neo.foundation",
        phone: "N/A",
        url: "https://backoffice.neo.foundation/auth/sign-up?ref=1W145K"
      });
    }

    // Fetch all active rotator partners ordered by join date who have runs remaining or are the owner
    const { data: allPartners, error: partnersError } = await supabase
      .from('neo_affiliates')
      .select('id, affiliate_code, full_name, email, phone, rotator_pool, rotator_index, created_at, unlocked_funnels, rotator_runs')
      .eq('is_rotator', true)
      .or('rotator_runs.gt.0,affiliate_code.eq.1W145K')
      .order('created_at', { ascending: true });

    if (partnersError) throw partnersError;

    if (!allPartners || allPartners.length === 0) {
      return fallbackCorporate();
    }

    // Fetch the most recent 100 leads to determine rotation sequence
    const { data: recentLeads } = await supabase
      .from('neo_leads')
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

    // Helper to find the next partner in sequence after a given partner
    function getNextPartnerAfter(partner) {
      let startIndex = allPartners.findIndex(p => p.affiliate_code === partner.affiliate_code);
      if (startIndex === -1) startIndex = 0;

      for (let i = 1; i <= allPartners.length; i++) {
        const idx = (startIndex + i) % allPartners.length;
        const candidate = allPartners[idx];
        const unlocked = (candidate.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
        if (unlocked.includes(funnelId)) return candidate;
      }
      return null;
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
      // Count consecutive 1W145K leads at the top of history
      let lastNonOwnerPartner = null;
      let countOwnerLeads = 0;

      for (const item of recentRotatorLeads) {
        if (item.sponsor_code === '1W145K') {
          countOwnerLeads++;
        } else {
          lastNonOwnerPartner = item.partner;
          break;
        }
      }

      if (countOwnerLeads === 0) {
        // The most recent lead went to a regular non-1W145K partner
        const latest = recentRotatorLeads[0];
        const P = latest.partner;

        // Safety check: verify P is still active and has this funnel unlocked
        const unlocked = (P.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
        if (!unlocked.includes(funnelId)) {
          selected = getNextPartnerAfter(P);
          if (!selected) return fallbackCorporate();
        } else {
          let count = 0;
          for (const item of recentRotatorLeads) {
            if (item.sponsor_code === P.affiliate_code) {
              count++;
            } else {
              break;
            }
          }

          if (count >= 3) {
            return fallbackCorporate(); // Next lead is Corporate tax
          } else {
            selected = P;
          }
        }
      } else {
        // We have consecutive 1W145K leads at the top of history
        if (!lastNonOwnerPartner) {
          // If we only have 1W145K leads in history
          if (countOwnerLeads === 1 || countOwnerLeads === 2) {
            selected = codeToPartnerMap['1W145K'];
          } else if (countOwnerLeads === 3) {
            return fallbackCorporate(); // Corporate tax
          } else {
            const ownerPartner = codeToPartnerMap['1W145K'];
            selected = ownerPartner ? getNextPartnerAfter(ownerPartner) : allPartners[0];
          }
          if (!selected) return fallbackCorporate();
        } else {
          const nextPartner = getNextPartnerAfter(lastNonOwnerPartner);

          if (nextPartner && nextPartner.affiliate_code !== '1W145K') {
            // Next partner is a regular partner, serve them on lead 1 after corporate tax
            if (countOwnerLeads === 1) {
              selected = nextPartner;
            } else {
              return fallbackCorporate();
            }
          } else {
            // Next partner is 1W145K, so 1W145K gets its own turn:
            if (countOwnerLeads === 1 || countOwnerLeads === 2 || countOwnerLeads === 3) {
              selected = codeToPartnerMap['1W145K'];
            } else if (countOwnerLeads === 4) {
              return fallbackCorporate(); // Corporate tax
            } else {
              const ownerPartner = codeToPartnerMap['1W145K'];
              selected = ownerPartner ? getNextPartnerAfter(ownerPartner) : allPartners[0];
            }
          }
          if (!selected) return fallbackCorporate();
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
          .from('neo_affiliates')
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
      .from('neo_affiliates')
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
      url: `https://backoffice.neo.foundation/auth/sign-up?ref=${activeCode}`
    });

  } catch (error) {
    console.error('Sequential Rotator CRITICAL Error:', error);
    return NextResponse.json({
      code: "1W145K",
      name: "Neo Corporate",
      email: "support@neo.foundation",
      phone: "N/A",
      url: "https://backoffice.neo.foundation/auth/sign-up?ref=1W145K"
    });
  }
}
