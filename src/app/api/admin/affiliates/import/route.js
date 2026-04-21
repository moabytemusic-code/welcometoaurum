import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidAdminSession } from '@/lib/auth';

/**
 * PRODUCTION IMPORT API
 * Now using dynamic client initialization for maximum Vercel/Edge reliability.
 */
export async function POST(request) {
  // Check auth using standard Next.js headers system
  if (!(await isValidAdminSession())) {
    return NextResponse.json({ 
      error: 'Auth failed: Session invalid or expired. Please refresh the page.' 
    }, { status: 401 });
  }

  try {
    // 1. HARDENED ENVIRONMENT SANITIZATION
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Strip any hidden spaces, newlines, or invisible characters
    const supabaseUrl = rawUrl.trim().replace(/[\n\r]/g, '');
    const supabaseAnonKey = rawKey.trim().replace(/[\n\r]/g, '');

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'DATABASE CONFIG MISSING: No Supabase keys found on the server. Please check your Vercel Dashboard.' 
      }, { status: 500 });
    }

    // Build the client FRESH for this request
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // DEEP DIAGNOSTIC: Test the URL format
    const urlCheck = {
      length: supabaseUrl.length,
      startsWithHttps: supabaseUrl.startsWith('https://'),
      domain: supabaseUrl.split('/')[2] || 'UNKNOWN'
    };
    
    console.log('--- DB CONNECTION DIAGNOSTIC ---');
    console.log('URL Info:', urlCheck);

    const { partners } = await request.json();

    if (!Array.isArray(partners)) {
      return NextResponse.json({ error: 'Partners must be an array' }, { status: 400 });
    }

    // Prepare partners for insertion
    const now = new Date().toISOString();
    const formatted = partners.map(p => ({
      full_name: p.full_name || p.name || 'Unknown Partner',
      email: p.email,
      affiliate_code: p.affiliate_code || p.code,
      phone: p.phone || '',
      is_promoted: p.is_promoted ?? true,
      unlocked_funnels: p.unlocked_funnels || 'pitch,consultative',
      last_served_at: now
    }));

    const { data, error } = await supabase
      .from('aurum_affiliates')
      .upsert(formatted, { onConflict: 'email' })
      .select();

    if (error) {
      return NextResponse.json({ 
        error: `DATABASE REJECTED REQUEST: ${error.message}`,
        details: error
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      count: data?.length || 0
    });

  } catch (err) {
    console.error('Import API CRITICAL Error:', err);
    return NextResponse.json({ 
      error: `PROD NETWORK ERROR: ${err.message}`,
      cause: err.cause?.message || 'Unknown network blockage',
      stack: err.stack?.split('\n')[0] // Safely return the first stack line
    }, { status: 500 });
  }
}
