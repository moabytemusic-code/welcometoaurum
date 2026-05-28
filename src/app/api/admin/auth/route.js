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
      
      // Set a robust production-ready session cookie
      response.cookies.set('aurum_admin_session', 'authenticated', {
        httpOnly: true,
        secure: true, // Always use secure in production/https
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // Extend to 7 days for convenience
        path: '/',
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
