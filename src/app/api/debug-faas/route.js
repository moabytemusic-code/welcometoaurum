import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '100-on-us-v2';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const results = {
    env: {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 15) : 'none'
    },
    query: {
      slug,
      timestamp: new Date().toISOString()
    }
  };

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ...results, error: 'Environment variables missing' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. Test basic connection
    const { data: test, error: testError } = await supabase.from('aurum_projects').select('slug').limit(1);
    results.connectionTest = { success: !testError, count: test?.length || 0, error: testError };

    // 2. Test specific slug
    const { data: project, error: projectError } = await supabase
      .from('aurum_projects')
      .select('slug, is_active')
      .eq('slug', slug)
      .maybeSingle();
    
    results.projectLookup = { 
      found: !!project, 
      isActive: project?.is_active, 
      error: projectError 
    };

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ ...results, fatal: err.message }, { status: 500 });
  }
}
