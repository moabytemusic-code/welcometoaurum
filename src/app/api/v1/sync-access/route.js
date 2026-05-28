import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  // 1. Security Check
  const authHeader = request.headers.get('Authorization');
  const secretKey = process.env.SYNC_SECRET_KEY || 'aurum-dev-key'; // Fallback for dev

  if (authHeader !== `Bearer ${secretKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { affiliate_code, funnel_id } = body;

    if (!affiliate_code || !funnel_id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 2. Fetch current unlocked list
    const { data, error: fetchError } = await supabase
      .from('aurum_affiliates')
      .select('id, unlocked_funnels')
      .eq('affiliate_code', affiliate_code)
      .single();

    if (fetchError || !data) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    // 3. Append the new funnel
    let current = (data.unlocked_funnels || 'pitch').split(',').map(s => s.trim()).filter(Boolean);
    
    if (!current.includes(funnel_id)) {
      current.push(funnel_id);
    }

    const updatedString = current.join(',');

    // 4. Update the database
    const { error: updateError } = await supabase
      .from('aurum_affiliates')
      .update({ unlocked_funnels: updatedString })
      .eq('id', data.id);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      affiliate: affiliate_code, 
      unlocked: updatedString 
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
