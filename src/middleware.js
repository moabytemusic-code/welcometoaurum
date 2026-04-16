import { NextResponse } from 'next/server';

export const config = {
  matcher: '/',
};

export function middleware(request) {
  // Only apply to the root URL exact match
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  // Check for a URL parameter 'v' to manually force a variant (useful for affiliates)
  const urlVariant = request.nextUrl.searchParams.get('v');
  let variant = '';

  if (urlVariant === 'pitch' || urlVariant === 'consultative') {
    variant = urlVariant;
  } else {
    // Check if user already has an assigned variant cookie
    variant = request.cookies.get('landing_variant')?.value;

    // If no variant is set or it's invalid, flip a coin
    if (!variant || (variant !== 'pitch' && variant !== 'consultative')) {
      variant = Math.random() < 0.5 ? 'pitch' : 'consultative';
    }
  }

  // Rewrite the request to the chosen variant's page folder
  const url = request.nextUrl.clone();
  url.pathname = `/${variant}`;

  const response = NextResponse.rewrite(url);

  // Set the cookie so the user always sees the same variant on return visits (lasts 30 days)
  response.cookies.set('landing_variant', variant, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return response;
}
