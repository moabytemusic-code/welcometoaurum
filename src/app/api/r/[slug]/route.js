import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: In production, ensure these env variables are set securely.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('to');

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'Supabase URL is missing.' }, { status: 500 });
  }

  try {
    // Call the Postgres RPC function to atomically get the next member ID and increment their count
    const { data: assignedMemberId, error } = await supabase
      .rpc('process_rotator_conversion', { p_rotator_slug: slug });

    if (error) {
      console.error('Rotator RPC Error:', error);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }

    if (!assignedMemberId) {
      // Fallback behavior if rotator is empty or completed
      // You can change this to a default admin link or a different page.
      const fallbackUrl = 'https://backoffice.aurum.foundation/register';
      return NextResponse.redirect(fallbackUrl);
    }

    // Determine the final destination
    let finalUrl;
    if (redirectTo === 'onboarding') {
      const origin = new URL(request.url).origin;
      finalUrl = `${origin}/onboarding?ref=${assignedMemberId}`;
    } else {
      finalUrl = `https://backoffice.aurum.foundation/register?ref=${assignedMemberId}`;
    }

    // Perform a 302 temporary redirect so the browser doesn't cache the assigned link
    return NextResponse.redirect(finalUrl);

  } catch (err) {
    console.error('Unexpected error in rotator route:', err);
    return NextResponse.json({ error: 'Unexpected Error' }, { status: 500 });
  }
}
