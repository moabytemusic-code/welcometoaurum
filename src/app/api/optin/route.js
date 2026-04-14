import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, first_name } = await req.json();

    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not defined');
      return NextResponse.json({ success: true, message: 'Simulated success (API Key missing)' });
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: first_name,
        },
        listIds: [parseInt(process.env.BREVO_LIST_ID || '1')],
        updateEnabled: true
      })
    });

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
