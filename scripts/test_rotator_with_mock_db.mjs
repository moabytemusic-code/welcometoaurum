// Mocking the rotator logic with mock DB query responses to verify sequence correctness
const allPartners = [
  { id: '1', affiliate_code: 'A', unlocked_funnels: 'pitch,gateway', rotator_pool: '' },
  { id: '2', affiliate_code: 'B', unlocked_funnels: 'pitch,gateway', rotator_pool: '' },
  { id: '3', affiliate_code: 'C', unlocked_funnels: 'pitch,gateway', rotator_pool: '' }
];

const funnelId = 'gateway';

function resolveNextSponsor(recentLeads) {
  // Map of affiliate_code -> partner
  const codeToPartnerMap = {};
  for (const p of allPartners) {
    codeToPartnerMap[p.affiliate_code.trim()] = p;
  }

  // Filter and map recent leads
  const recentRotatorLeads = [];
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

  if (recentRotatorLeads.length === 0) {
    for (const p of allPartners) {
      const unlocked = (p.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
      if (unlocked.includes(funnelId)) return p;
    }
    return null;
  }

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
      for (const p of allPartners) {
        const unlocked = (p.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
        if (unlocked.includes(funnelId)) return p;
      }
      return null;
    }

    let startIndex = allPartners.findIndex(p => p.affiliate_code === lastServedPartner.affiliate_code);
    if (startIndex === -1) startIndex = 0;

    for (let i = 1; i <= allPartners.length; i++) {
      const idx = (startIndex + i) % allPartners.length;
      const candidate = allPartners[idx];
      const unlocked = (candidate.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
      if (unlocked.includes(funnelId)) return candidate;
    }
    return null;
  } else {
    // Count consecutive assignments for this partner
    const P = latest.partner;
    let count = 0;
    for (const item of recentRotatorLeads) {
      if (!item.is_corporate && item.partner.affiliate_code === P.affiliate_code) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 3) {
      return null; // Corporate fallback
    } else {
      return P;
    }
  }
}

// Run simulation
const recentLeads = [];
console.log("=== SIMULATING ROTATION SEQUENCE ===");
for (let i = 1; i <= 15; i++) {
  const selected = resolveNextSponsor(recentLeads);
  const code = selected ? selected.affiliate_code : '1W145K';
  console.log(`Lead ${i} -> Sponsor: ${code}`);
  recentLeads.unshift({ sponsor_code: code, created_at: new Date() });
}
