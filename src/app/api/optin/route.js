import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveMx } from 'node:dns/promises';

export async function POST(req) {
  try {
    const { email, first_name, phone, sponsor_code, sponsor_name, landing_variant, team_slug } = await req.json();

    // 0. EMAIL VERIFICATION & SPAM PREVENTION
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const domain = email.split('@')[1].toLowerCase();

    // A list of common disposable/burner email domains
    const blockedDomains = new Set([
      'mailinator.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
      'guerrillamail.com', 'yopmail.com', 'throwawaymail.com', 'burnermail.io',
      'fakeinbox.com', 'tempmail.net', 'dropmail.me', 'getnada.com', 'trashmail.com'
    ]);

    if (blockedDomains.has(domain)) {
      return NextResponse.json({ success: false, error: 'Disposable or temporary email addresses are not permitted. Please use your real email.' }, { status: 400 });
    }

    // DNS MX Check to ensure the domain can physically receive mail
    try {
      const mxRecords = await resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json({ success: false, error: 'The email domain cannot receive mail. Please use a valid email address.' }, { status: 400 });
      }
    } catch (error) {
      // dns.resolveMx throws if the domain doesn't exist or has no MX records
      return NextResponse.json({ success: false, error: 'The email domain does not exist or is invalid.' }, { status: 400 });
    }

    // 1. LOCAL LEAD TRACKING (Supabase Shadow Copy)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const cleanSponsor = (sponsor_code || '1W145K').trim();

      await supabase.from('aurum_leads').insert([{
        email,
        first_name,
        sponsor_code: cleanSponsor,
        landing_variant: landing_variant || 'pitch',
        team_slug: team_slug || null
      }]);

      // Decrement rotator run if sponsor is in rotator and has runs left
      if (cleanSponsor && cleanSponsor !== '1W145K') {
        const { data: partner } = await supabase
          .from('aurum_affiliates')
          .select('id, rotator_runs, is_rotator')
          .eq('affiliate_code', cleanSponsor)
          .maybeSingle();

        if (partner && partner.is_rotator && (partner.rotator_runs || 0) > 0) {
          await supabase
            .from('aurum_affiliates')
            .update({ rotator_runs: partner.rotator_runs - 1 })
            .eq('id', partner.id);
          console.log(`Successfully decremented rotator_runs for partner ${cleanSponsor}. Remaining: ${partner.rotator_runs - 1}`);
        }
      }
    } catch (dbErr) {
      console.warn('Local lead tracking/decrement failed:', dbErr.message);
    }


    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not defined');
      return NextResponse.json({ success: true, message: 'Simulated success (API Key missing)' });
    }

    // Determine which list to add the contact to
    const defaultList = parseInt(process.env.BREVO_LIST_ID || '1');
    const variantList = landing_variant === 'pay-it-forward' || landing_variant === 'pay-it-forward-v2' 
      ? parseInt(process.env.BREVO_LIST_ID_VOUCHER || process.env.BREVO_LIST_ID || '1')
      : defaultList;

    const payload = {
      email,
      attributes: {
        FIRSTNAME: first_name,
        SMS: phone || '', 
        SPONSOR_CODE: sponsor_code || '1W145K',
        SPONSOR_NAME: sponsor_name || 'Aurum Corporate',
        LANDING_VARIANT: landing_variant || 'unknown'
      },
      listIds: [variantList],
      updateEnabled: true
    };

    let response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    // If LANDING_VARIANT doesn't exist in Brevo CRM yet, fallback to normal capture without it to prevent breaking the funnel
    if (response.status === 400) {
      const errorCheck = await response.clone().json();
      if (errorCheck.message && errorCheck.message.includes('LANDING_VARIANT')) {
        delete payload.attributes.LANDING_VARIANT;
        response = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
          },
          body: JSON.stringify(payload)
        });
      }
    }

    let data = {};
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.warn('Failed to parse response JSON:', jsonErr.message);
      }
    }

    if (!response.ok) {
      throw new Error(data.message || 'Error from Brevo');
    }

    // Direct SMTP Welcome Email Fallback Send
    try {
      const templateId = (landing_variant === 'pay-it-forward' || landing_variant === 'pay-it-forward-v2' || landing_variant === 'pay-it-forward-v3')
        ? 829  // Voucher Welcome Email ($100 AI Access)
        : 743; // Core Welcome Email

      const smtpRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          to: [{ email, name: first_name || '' }],
          templateId,
          params: {
            FIRSTNAME: first_name || '',
            SPONSOR_NAME: sponsor_name || 'Aurum Corporate'
          }
        })
      });

      if (!smtpRes.ok) {
        const errData = await smtpRes.json();
        console.error('Direct SMTP welcome email send failed response:', errData);
      } else {
        console.log(`Direct SMTP welcome email triggered successfully for ${email} (Template ID: ${templateId})`);
      }
    } catch (smtpErr) {
      console.error('Direct SMTP welcome email send failed:', smtpErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Brevo Opt-in Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
