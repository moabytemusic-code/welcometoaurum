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
    // Prioritize Service Role Key for Admin Access, fallback to Anon Key
    const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Strip any hidden spaces, newlines, or invisible characters
    let supabaseUrl = rawUrl.trim().replace(/[\n\r]/g, '');
    const supabaseKey = rawKey.trim().replace(/[\n\r]/g, '');

    // FORCE PROTOCOL: Ensure URL starts with https://
    if (supabaseUrl && !supabaseUrl.startsWith('http')) {
      supabaseUrl = `https://${supabaseUrl}`;
    }

    if (!supabaseUrl || !supabaseKey) {
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
    const restUrl = `${supabaseUrl}/rest/v1/aurum_affiliates?on_conflict=email`;
    
    // DIAGNOSTIC 1: Sanity Ping to GitHub (Connectivity Check)
    let sanityStatus = 'UNTESTED';
    try {
      const sanityCheck = await fetch('https://api.github.com/zen', { signal: AbortSignal.timeout(3000) });
      sanityStatus = sanityCheck.ok ? 'CONNECTED' : `FAILED (${sanityCheck.status})`;
    } catch (e) {
      sanityStatus = `BLOCKED: ${e.message}`;
    }

    // DIAGNOSTIC 2: URL Integrity
    const urlMetrics = {
      length: supabaseUrl.length,
      domain: supabaseUrl.split('/')[2] || 'NONE',
      hasSpace: supabaseUrl.includes(' '),
      hasNewLine: supabaseUrl.includes('\n'),
      protocol: supabaseUrl.split(':')[0]
    };

    const dbRes = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(formatted)
    });

    if (!dbRes.ok) {
      const errorText = await dbRes.text();
      return NextResponse.json({ 
        error: `DATABASE REJECTED REQUEST: ${dbRes.status}`,
        details: errorText,
        diagnostics: { sanityStatus, urlMetrics }
      }, { status: 500 });
    }

    const data = await dbRes.json();

    return NextResponse.json({ 
      success: true, 
      count: data?.length || 0,
      diagnostics: { sanityStatus, urlMetrics }
    });

  } catch (err) {
    console.error('Import API CRITICAL Error:', err);
    
    // Perform GitHub ping even in general failure catch
    let sanityStatusFallback = 'OFFLINE';
    try {
      const s = await fetch('https://api.github.com/zen', { signal: AbortSignal.timeout(2000) });
      if (s.ok) sanityStatusFallback = 'ONLINE';
    } catch(e) {}

    return NextResponse.json({ 
      error: `PROD NETWORK ERROR: ${err.message}`,
      cause: err.cause?.message || 'Check project pause status on Supabase',
      sanity: sanityStatusFallback,
      stack: err.stack?.split('\n')[0],
      code: err.code || 'NO_CODE'
    }, { status: 500 });
  }
}
