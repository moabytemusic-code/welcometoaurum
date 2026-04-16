import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Note: To get a truly random row efficiently in large tables, 
    // a common pattern is querying a random offset.
    // However, for small/medium affiliate tables, fetching all active IDs is safe.
    
    const { data: partners, error } = await supabase
      .from('aurum_affiliates')
      .select('affiliate_code, full_name, email, phone, rotator_pool')
      .eq('is_promoted', true);

    if (error || !partners || partners.length === 0) {
      // If no promoted partners are found, we don't throw an error, 
      // we just fall through to the fallback logic.
      console.log('No promoted partners found, using fallback.');
    } else {
      // Pick a random partner
      const randomIndex = Math.floor(Math.random() * partners.length);
      const selected = partners[randomIndex];

      // LOGIC: Override affiliate_code with the first item in rotator_pool if it exists
      let activeCode = selected.affiliate_code;
      if (selected.rotator_pool && selected.rotator_pool.trim().length > 0) {
        // Split by comma, space, or newline
        const poolCodes = selected.rotator_pool.split(/[,\s\n]+/).filter(c => c.length > 0);
        if (poolCodes.length > 0) {
          activeCode = poolCodes[0];
        }
      }

      return NextResponse.json({
        code: activeCode,
        name: selected.full_name,
        email: selected.email,
        phone: selected.phone,
        url: `https://backoffice.aurum.foundation/auth/sign-up?ref=${activeCode}`
      });
    }

    // Default Fallback
    return NextResponse.json({
      code: "1W145K",
      name: "Aurum Corporate",
      email: "support@aurum.foundation",
      phone: "N/A",
      url: "https://backoffice.aurum.foundation/auth/sign-up?ref=1W145K"
    });
  } catch (error) {
    console.error('Rotator Supabase API Error:', error);
    // Safe hard fallback
    return NextResponse.json({
      code: "1W145K",
      name: "Aurum Corporate",
      email: "support@aurum.foundation",
      phone: "N/A",
      url: "https://backoffice.aurum.foundation/auth/sign-up?ref=1W145K"
    });
  }
}
