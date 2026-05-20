const allPartners = [
  { affiliate_code: '1W145K', unlocked_funnels: 'pitch,gateway' },
  { affiliate_code: 'B', unlocked_funnels: 'pitch,gateway' },
  { affiliate_code: 'C', unlocked_funnels: 'pitch,gateway' }
];

const funnelId = 'gateway';

function resolveNextSponsor(recentLeads) {
  const codeToPartnerMap = {};
  for (const p of allPartners) {
    codeToPartnerMap[p.affiliate_code.trim()] = p;
  }

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

  // Case 1: The most recent lead was a non-1W145K partner
  if (countOwnerLeads === 0) {
    const latest = recentRotatorLeads[0];
    const P = latest.partner;

    let count = 0;
    for (const item of recentRotatorLeads) {
      if (item.sponsor_code === P.affiliate_code) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 3) {
      return null; // Next is Corporate tax (1W145K)
    } else {
      return P;
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

  // Case 2: We have consecutive 1W145K leads at the top but no non-owner partner exists yet in history
  if (!lastNonOwnerPartner) {
    if (countOwnerLeads === 1) return codeToPartnerMap['1W145K'] || null;
    if (countOwnerLeads === 2) return codeToPartnerMap['1W145K'] || null;
    if (countOwnerLeads === 3) return null; // Corporate tax
    
    // Move to next partner in sequence after 1W145K
    const ownerPartner = codeToPartnerMap['1W145K'];
    if (!ownerPartner) return allPartners[0];
    return getNextPartnerAfter(ownerPartner);
  }

  // Case 3: We have a non-owner partner before the 1W145K leads
  const nextPartner = getNextPartnerAfter(lastNonOwnerPartner);

  if (nextPartner && nextPartner.affiliate_code !== '1W145K') {
    // If the next partner in sequence is a regular partner, serve them immediately on the first lead after corporate
    if (countOwnerLeads === 1) {
      return nextPartner;
    }
    return null;
  }

  // If the next partner in sequence IS 1W145K, then 1W145K gets its own turn:
  if (countOwnerLeads === 1) return codeToPartnerMap['1W145K'] || null; // Partner lead 1
  if (countOwnerLeads === 2) return codeToPartnerMap['1W145K'] || null; // Partner lead 2
  if (countOwnerLeads === 3) return codeToPartnerMap['1W145K'] || null; // Partner lead 3
  if (countOwnerLeads === 4) return null; // Corporate tax

  // countOwnerLeads >= 5: 1W145K has finished its turn. Move to next partner in sequence after 1W145K.
  const ownerPartner = codeToPartnerMap['1W145K'];
  if (!ownerPartner) return allPartners[0];
  return getNextPartnerAfter(ownerPartner);
}

// Run simulation
const recentLeads = [];
console.log("=== RUNNING CORRECTED MOCK SIMULATION WITH OWNER IN ROTATION ===");
for (let i = 1; i <= 20; i++) {
  const selected = resolveNextSponsor(recentLeads);
  const code = selected ? selected.affiliate_code : '1W145K';
  console.log(`Lead ${i} -> Sponsor: ${code}`);
  recentLeads.unshift({ sponsor_code: code, created_at: new Date() });
}
