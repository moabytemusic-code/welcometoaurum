import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: partner, error } = await supabase
      .from('aurum_affiliates')
      .select('id, affiliate_code, full_name, email, password')
      .eq('email', email.trim())
      .maybeSingle();

    if (error) {
      console.error('Database query error during partner auth:', error);
      return NextResponse.json({ error: 'Auth service temporarily unavailable' }, { status: 500 });
    }

    if (!partner || partner.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const response = NextResponse.json({ 
      success: true,
      partner: {
        code: partner.affiliate_code,
        name: partner.full_name,
        email: partner.email
      }
    });

    // Set HTTP-only session cookie for the partner
    response.cookies.set('aurum_partner_session', partner.affiliate_code, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Partner Auth Server Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('aurum_partner_session', '', { maxAge: 0, path: '/' });
  return response;
}
