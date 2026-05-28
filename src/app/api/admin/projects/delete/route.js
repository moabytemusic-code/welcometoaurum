import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidAdminSession } from '@/lib/auth';

export async function POST(req) {
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('neo_projects')
      .delete()
      .eq('slug', slug);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project in Supabase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
