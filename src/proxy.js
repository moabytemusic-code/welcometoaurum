import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Protection for Admin Pages (Excluding API routes and Login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const session = request.cookies.get('neo_admin_session')?.value;
    if (!session || session !== 'authenticated') {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
