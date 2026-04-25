import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    const { email, first_name, phone, sponsor_code, sponsor_name, landing_variant } = await req.json();

    // 1. LOCAL LEAD TRACKING (Supabase Shadow Copy)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('aurum_leads').insert([{
        email,
        first_name,
        sponsor_code: sponsor_code || '1W145K',
        landing_variant: landing_variant || 'pitch'
      }]);
    } catch (dbErr) {
      console.warn('Local lead tracking failed:', dbErr.message);
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error from Brevo');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Brevo Opt-in Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
