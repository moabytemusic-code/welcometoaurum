import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
    }

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set a secure session cookie
      // In a real production app, you'd use a more robust JWT or Iron Session
      // Dynamically determine domain for production stability
      const host = request.headers.get('host') || '';
      const domain = host.includes('welcometoaurum.com') ? '.welcometoaurum.com' : undefined;

      response.cookies.set('aurum_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
        domain: domain,
        // Add explicit expires for better persistence
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Auth server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('aurum_admin_session', '', { maxAge: 0 });
  return response;
}
