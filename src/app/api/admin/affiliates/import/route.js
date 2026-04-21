import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isValidAdminSession } from '@/lib/auth';

export const runtime = 'nodejs'; // FORCE FULL SERVER COMPATIBILITY

/**
 * PRODUCTION IMPORT API
 * Now using Dynamic Native Fetch + Node.js Runtime for absolute resilience.
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

    // Build the client FRESH for this request to ensure latest env vars are used
    // const supabase = createClient(supabaseUrl, supabaseAnonKey); // BYPASSING LIBRARY

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

    // ULTIMATE DIRECT CONNECT logic (Bypassing Library)
    console.log('--- DIRECT CONNECT UPSERT START ---');
    const restUrl = `${supabaseUrl}/rest/v1/aurum_affiliates`;
    
    const dbRes = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(formatted)
    });

    if (!dbRes.ok) {
      const errorText = await dbRes.text();
      return NextResponse.json({ 
        error: `DATABASE REJECTED REQUEST (Direct Connect): ${dbRes.status}`,
        details: errorText
      }, { status: 500 });
    }

    const data = await dbRes.json();

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
