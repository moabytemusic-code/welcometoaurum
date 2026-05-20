// Mock partners
const allPartners = [
  { affiliate_code: 'A', unlocked_funnels: 'pitch,gateway', rotator_pool: '' },
  { affiliate_code: 'B', unlocked_funnels: 'pitch,gateway', rotator_pool: '' },
  { affiliate_code: 'C', unlocked_funnels: 'pitch,gateway', rotator_pool: '' }
];

const funnelId = 'gateway';

function resolveNextSponsor(recentLeads) {
  const codeToPartnerMap = {};
  for (const p of allPartners) {
    codeToPartnerMap[p.affiliate_code] = p;
  }

  // Filter and map recent leads
  const recentRotatorLeads = [];
  for (const lead of recentLeads) {
    const parentPartner = codeToPartnerMap[lead.sponsor_code];
    if (parentPartner) {
      recentRotatorLeads.push({
        sponsor_code: lead.sponsor_code,
        partner: parentPartner,
        is_corporate: false
      });
    } else if (lead.sponsor_code === '1W145K') {
      recentRotatorLeads.push({
        sponsor_code: '1W145K',
        partner: null,
        is_corporate: true
      });
    }
  }

  if (recentRotatorLeads.length === 0) {
    // Select first partner who has funnel unlocked
    for (const p of allPartners) {
      const unlocked = (p.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
      if (unlocked.includes(funnelId)) return p.affiliate_code;
    }
    return '1W145K';
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
      return allPartners[0].affiliate_code;
    }

    let startIndex = allPartners.findIndex(p => p.affiliate_code === lastServedPartner.affiliate_code);
    if (startIndex === -1) startIndex = 0;

    for (let i = 1; i <= allPartners.length; i++) {
      const idx = (startIndex + i) % allPartners.length;
      const candidate = allPartners[idx];
      const unlocked = (candidate.unlocked_funnels || 'pitch').split(',').map(s => s.trim());
      if (unlocked.includes(funnelId)) return candidate.affiliate_code;
    }
    return '1W145K';
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
      return '1W145K'; // Corporate
    } else {
      return P.affiliate_code;
    }
  }
}

// Run simulation
const recentLeads = [];
console.log("Starting simulation of 15 lead assignments...");
for (let i = 1; i <= 15; i++) {
  const code = resolveNextSponsor(recentLeads);
  console.log(`Lead ${i} assigned to: ${code}`);
  recentLeads.unshift({ sponsor_code: code, created_at: new Date() });
}
