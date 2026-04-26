import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    const { slug, newName } = await req.json();
    if (!slug || !newName) {
      return NextResponse.json({ error: 'Missing slug or newName' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('aurum_projects')
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq('slug', slug);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to rename project in Supabase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
