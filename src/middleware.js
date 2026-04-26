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

  // 2. Ignore other sub-pages, internal assets, and APIs
  if (pathname !== '/') return NextResponse.next();

  // 3. Dynamic FaaS Selection (Fetch active projects from Supabase)
  let activeProjects = [];
  try {
    const { data } = await supabase
      .from('aurum_projects')
      .select('slug, angle')
      .eq('is_active', true);
    activeProjects = data || [];
  } catch (e) {
    console.error('Failed to fetch active projects for middleware:', e);
  }

  // Fallback if no projects are active
  if (activeProjects.length === 0) {
    return NextResponse.next(); // Let it fall through to a 404 or default page
  }

  // 4. Decision Phase
  const ref = request.nextUrl.searchParams.get('ref');
  const urlVariant = request.nextUrl.searchParams.get('v');
  const cookieVariant = request.cookies.get('landing_variant')?.value;

  let selected = activeProjects[0]; // Default to the first active project

  // Rule 1: Forced URL variant (only if active)
  if (urlVariant) {
    const forced = activeProjects.find(p => p.slug === urlVariant);
    if (forced) selected = forced;
  } 
  // Rule 2: Sticky Cookie (only if still active)
  else if (cookieVariant) {
    const sticky = activeProjects.find(p => p.slug === cookieVariant);
    if (sticky) selected = sticky;
  }
  // Rule 3: Rotation (pick random from active projects)
  else if (activeProjects.length > 1) {
    selected = activeProjects[Math.floor(Math.random() * activeProjects.length)];
  }

  // Rewrite the request to the chosen FaaS URL
  // We use REDIRECT here instead of rewrite to ensure the sponsor logic in FunnelEngineClient.js 
  // picks up the slug and angle correctly from the URL.
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/f/${selected.slug}/${selected.angle}`;
  if (ref) redirectUrl.searchParams.set('ref', ref);

  const response = NextResponse.redirect(redirectUrl);
  
  // Set sticky cookie
  response.cookies.set('landing_variant', selected.slug, { 
    maxAge: 60 * 60 * 24 * 30, 
    path: '/' 
  });

  return response;
}
