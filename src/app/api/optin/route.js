import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, first_name, phone, sponsor_code, sponsor_name, landing_variant } = await req.json();

    if (!phone || phone.trim() === '') {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not defined');
      return NextResponse.json({ success: true, message: 'Simulated success (API Key missing)' });
    }

    const payload = {
      email,
      attributes: {
        FIRSTNAME: first_name,
        SMS: phone || '', // Phone support added for lead capture
        SPONSOR_CODE: sponsor_code || '1W145K',
        SPONSOR_NAME: sponsor_name || 'Aurum Corporate',
        LANDING_VARIANT: landing_variant || 'unknown'
      },
      listIds: [parseInt(process.env.BREVO_LIST_ID || '1')],
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
