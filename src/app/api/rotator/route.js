import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Note: To get a truly random row efficiently in large tables, 
    // a common pattern is querying a random offset.
    // However, for small/medium affiliate tables, fetching all active IDs is safe.
    
    const { data: partners, error } = await supabase
      .from('aurum_affiliates')
      .select('affiliate_code, full_name, email, phone');

    if (error || !partners || partners.length === 0) {
      throw new Error(error?.message || 'No partners found in Supabase');
    }

    // Pick a random partner
    const randomIndex = Math.floor(Math.random() * partners.length);
    const selected = partners[randomIndex];

    return NextResponse.json({
      code: selected.affiliate_code,
      name: selected.full_name,
      email: selected.email,
      phone: selected.phone,
      url: `https://backoffice.aurum.foundation/register?ref=${selected.affiliate_code}`
    });
  } catch (error) {
    console.error('Rotator Supabase API Error:', error);
    // Safe hard fallback to primary sponsor
    return NextResponse.json({
      code: "1W145K",
      name: "Aurum Corporate",
      email: "support@aurum.foundation",
      phone: "N/A",
      url: "https://backoffice.aurum.foundation/register?ref=1W145K"
    });
  }
}
