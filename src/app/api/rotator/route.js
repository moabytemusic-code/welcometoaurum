import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Note: To get a truly random row efficiently in large tables, 
    // a common pattern is querying a random offset.
    // However, for small/medium affiliate tables, fetching all active IDs is safe.
    
    const { data: partners, error } = await supabase
      .from('aurum_affiliates')
      .select('affiliate_code, full_name, email, phone')
      .eq('is_promoted', true);

    if (error || !partners || partners.length === 0) {
      // If no promoted partners are found, we don't throw an error, 
      // we just fall through to the fallback logic.
      console.log('No promoted partners found, using fallback.');
    } else {
      // Pick a random partner
      const randomIndex = Math.floor(Math.random() * partners.length);
      const selected = partners[randomIndex];

      return NextResponse.json({
        code: selected.affiliate_code,
        name: selected.full_name,
        email: selected.email,
        phone: selected.phone,
        url: `https://backoffice.aurum.foundation/auth/sign-up?ref=${selected.affiliate_code}`
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
