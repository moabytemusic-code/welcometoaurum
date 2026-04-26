import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request) {
  try {
    // Vercel provides country information in headers
    const countryCode = request.headers.get('x-vercel-ip-country') || 'US';
    
    return NextResponse.json({
      country_code: countryCode,
      source: 'vercel-edge'
    });
  } catch (err) {
    console.error('Location detection error:', err);
    return NextResponse.json({ country_code: 'US', error: true }, { status: 500 });
  }
}
