import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const data = await request.json();
    const { slug, name, angle, content, config } = data;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch current status to preserve it
    let isActive = true;
    const { data: existing } = await supabase
      .from('aurum_projects')
      .select('is_active')
      .eq('slug', slug)
      .maybeSingle();
    
    if (existing) {
      isActive = existing.is_active;
    }

    // 2. Upsert with preserved status
    const { error } = await supabase
      .from('aurum_projects')
      .upsert({
        slug,
        name,
        angle,
        content,
        config,
        is_active: isActive,
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });

    if (error) throw error;

    return NextResponse.json({ success: true, path: `/f/${slug}/${angle}` });
  } catch (err) {
    console.error('Save error in Supabase:', err);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}
