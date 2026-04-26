import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: projects, error } = await supabase
      .from('aurum_projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Map DB fields to UI expectations
    const mappedProjects = projects.map(p => ({
      ...p,
      isActive: p.is_active
    }));

    return NextResponse.json(mappedProjects);
  } catch (error) {
    console.error('Failed to list projects from Supabase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
