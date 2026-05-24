import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase for Middleware
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Protection for Admin Pages (Excluding API routes and Login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const session = request.cookies.get('aurum_admin_session')?.value;
    if (!session || session !== 'authenticated') {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
