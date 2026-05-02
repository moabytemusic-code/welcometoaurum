import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
import { isValidAdminSession } from '@/lib/auth';

/**
 * SHARED MASTER CLIENT UTILITY
 */
function getMasterClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request) {
  /*
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  */

  const supabase = getMasterClient();

  const { searchParams } = new URL(request.url);
  const quick = searchParams.get('quick');
  const search = searchParams.get('search');

  try {
    if (quick) {
      const { count, error } = await supabase
        .from('aurum_affiliates')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return NextResponse.json({ count });
    }

    let query = supabase
      .from('aurum_affiliates')
      .select('*');

    if (search) {
      // Search by full_name, affiliate_code, or email (case-insensitive)
      // We wrap values in double quotes to handle spaces correctly in .or()
      const s = `"%${search}%"`;
      console.log(`[BACKEND SEARCH] Query: full_name.ilike.${s},affiliate_code.ilike.${s},email.ilike.${s}`);
      query = query.or(`full_name.ilike.${s},affiliate_code.ilike.${s},email.ilike.${s}`);
    }

    const { data, error } = await query.order('last_served_at', { ascending: false, nullsFirst: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getMasterClient();
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('aurum_affiliates')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getMasterClient();
    const body = await request.json();
    const { data, error } = await supabase
      .from('aurum_affiliates')
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getMasterClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { error } = await supabase
      .from('aurum_affiliates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
