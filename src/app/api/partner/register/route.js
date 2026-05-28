import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { fullName, email, password, affiliateCode } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email, and password are required.' }, { status: 400 });
    }

    if (fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Full name must be at least 2 characters.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Check if email already exists
    const { data: existingEmail, error: emailCheckError } = await supabase
      .from('aurum_affiliates')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();

    if (emailCheckError) {
      console.error('Database error checking email:', emailCheckError);
      return NextResponse.json({ error: 'Auth service database check failed.' }, { status: 500 });
    }

    if (existingEmail) {
      return NextResponse.json({ error: 'An account with this email address already exists.' }, { status: 400 });
    }

    let finalCode = '';
    
    // 2. Resolve the affiliate code
    if (affiliateCode && affiliateCode.trim() !== '') {
      finalCode = affiliateCode.trim().toUpperCase();
      
      // Validate affiliate code format (alphanumeric, 3-20 characters)
      const codeRegex = /^[A-Z0-9_-]{3,20}$/;
      if (!codeRegex.test(finalCode)) {
        return NextResponse.json({ error: 'Affiliate Code must be 3-20 alphanumeric characters, dashes, or underscores.' }, { status: 400 });
      }

      // Check if code already exists
      const { data: existingCode, error: codeCheckError } = await supabase
        .from('aurum_affiliates')
        .select('id')
        .eq('affiliate_code', finalCode)
        .maybeSingle();

      if (codeCheckError) {
        console.error('Database error checking code:', codeCheckError);
        return NextResponse.json({ error: 'Auth service database check failed.' }, { status: 500 });
      }

      if (existingCode) {
        return NextResponse.json({ error: 'This affiliate code is already taken. Please choose another.' }, { status: 400 });
      }
    } else {
      // Auto-generate a unique 6-character uppercase alphanumeric code
      let unique = false;
      let attempts = 0;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      
      while (!unique && attempts < 10) {
        attempts++;
        let candidate = '';
        for (let i = 0; i < 6; i++) {
          candidate += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const { data: existingCode } = await supabase
          .from('aurum_affiliates')
          .select('id')
          .eq('affiliate_code', candidate)
          .maybeSingle();

        if (!existingCode) {
          finalCode = candidate;
          unique = true;
        }
      }

      if (!unique) {
        return NextResponse.json({ error: 'Failed to generate a unique affiliate code. Please try again or specify one manually.' }, { status: 500 });
      }
    }

    // 3. Prepare registration object
    const now = new Date().toISOString();
    const newPartner = {
      full_name: fullName.trim(),
      email: email.trim(),
      password: password, // Store in plain text to align with project database schema design
      affiliate_code: finalCode,
      affiliate_id: finalCode,
      plan: 'BASE',
      is_promoted: false,
      is_rotator: false,
      unlocked_funnels: 'aurum-pitch,home',
      last_served_at: now
    };

    // 4. Insert into database
    const { data: inserted, error: insertError } = await supabase
      .from('aurum_affiliates')
      .insert([newPartner])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: insertError.message || 'Failed to create partner account.' }, { status: 500 });
    }

    // 5. Success response & set session cookie
    const response = NextResponse.json({
      success: true,
      partner: {
        code: inserted.affiliate_code,
        name: inserted.full_name,
        email: inserted.email
      }
    });

    response.cookies.set('aurum_partner_session', inserted.affiliate_code, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Partner Registration Server Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
