import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/', '/admin/:path*', '/api/admin/:path*'],
};

export async function proxy(request) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Support local testing via ?domain=aurumriseuniversity.com
  const testingDomain = request.nextUrl.searchParams.get('domain');
  const isUniversityHost = host.includes('aurumriseuniversity.com') || testingDomain === 'aurumriseuniversity.com';

  if (isUniversityHost && url.pathname === '/') {
    url.pathname = '/university';
    return NextResponse.rewrite(url);
  }

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
