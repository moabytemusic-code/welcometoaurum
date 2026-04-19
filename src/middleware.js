import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase for Middleware
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const config = {
  matcher: '/',
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Protection for Admin Routes
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const session = request.cookies.get('aurum_admin_session')?.value;
    if (!session || session !== 'authenticated') {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Ignore other sub-pages, internal assets, and APIs
  if (pathname !== '/') return NextResponse.next();

  // 3. Dynamic Variant Selection (Selective Rotator)
  const urlVariant = request.nextUrl.searchParams.get('v');
  const ref = request.nextUrl.searchParams.get('ref');
  let variant = '';
  
  // Default funnels to rotate through (only include existing local folders)
  let allowedFunnels = ['pitch', 'consultative']; 

  const isDev = process.env.NODE_ENV === 'development';

  // If we have an affiliate reference, lookup their specific permissions
  if (ref) {
    try {
      const { data } = await supabase
        .from('aurum_affiliates')
        .select('unlocked_funnels')
        .eq('affiliate_code', ref)
        .single();

      if (data?.unlocked_funnels) {
        const customList = data.unlocked_funnels.split(',').map(s => s.trim()).filter(Boolean);
        if (customList.length > 0) {
          allowedFunnels = customList;
        }
      }
    } catch (e) {
      console.error('Affiliate lookup failed:', e);
    }
  }

  // Decision Phase
  const cookieVariant = request.cookies.get('landing_variant')?.value;

  // Rule 1: Forced URL variant (only if allowed)
  if (urlVariant && allowedFunnels.includes(urlVariant)) {
    variant = urlVariant;
  } 
  // Rule 2: Sticky Cookie (only if still allowed)
  else if (cookieVariant && allowedFunnels.includes(cookieVariant)) {
    variant = cookieVariant;
  }
  // Rule 3: Selective Rotation (pick random from allowed list)
  else {
    variant = allowedFunnels[Math.floor(Math.random() * allowedFunnels.length)];
  }

  // Handle external redirect for the breakdown variant (Skip in Dev to allow local testing)
  if (variant === 'breakdown' && !isDev) {
    const offerUrl = process.env.NEXT_PUBLIC_OFFER_URL || 'https://www.theaifinancebreakdown.com';
    const redirectUrl = new URL(offerUrl);
    if (ref) redirectUrl.searchParams.set('ref', ref);
    
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('landing_variant', variant, { maxAge: 60 * 60 * 24 * 30, path: '/' });
    return response;
  }

  // Rewrite the request to the chosen variant's page folder
  const url = request.nextUrl.clone();
  url.pathname = `/${variant}`;

  const response = NextResponse.rewrite(url);
  response.cookies.set('landing_variant', variant, { maxAge: 60 * 60 * 24 * 30, path: '/' });

  return response;
}
