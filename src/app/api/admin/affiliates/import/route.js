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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'DATABASE CONFIG MISSING: No Supabase keys found on the server. Please check your Vercel Dashboard.' 
      }, { status: 500 });
    }

    // Build the client FRESH for this request to ensure latest env vars are used
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    console.log(`Attempting to upsert ${formatted.length} partners...`);

    const { data, error } = await supabase
      .from('aurum_affiliates')
      .upsert(formatted, { onConflict: 'email' })
      .select();

    if (error) {
      console.error('Supabase Upsert Error:', error);
      // Detailed error for common failures (like missing columns)
      if (error.message.includes('column') && error.message.includes('not found')) {
        return NextResponse.json({ 
          error: 'DATABASE SHEMA MISMATCH: Please ensure the "last_served_at" column exists in Supabase. Check console for details.' 
        }, { status: 500 });
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      count: data?.length || 0,
      partners: data || []
    });

  } catch (err) {
    console.error('Import API CRITICAL Error:', err);
    return NextResponse.json({ error: `Server Error: ${err.message}` }, { status: 500 });
  }
}
