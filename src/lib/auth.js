import { cookies, headers } from 'next/headers';

/**
 * Checks if the current requester has a valid admin session.
 * Standardizes authentication across all App Router API routes.
 * Supports BOTH Cookie and Authorization Header for maximum production stability.
 */
export async function isValidAdminSession() {
  // 1. Check Cookie (Primary)
  const cookieStore = await cookies();
  const session = cookieStore.get('aurum_admin_session')?.value;
  
  // 2. Check Authorization Header (Secondary Fallback for POST resilience)
  const headerList = await headers();
  const authHeader = headerList.get('authorization');
  
  const isCookieValid = session === 'authenticated';
  const isHeaderValid = authHeader === 'Bearer authenticated';
  
  const isValid = isCookieValid || isHeaderValid;
  
  if (!isValid) {
    console.warn('--- Admin Auth Failure ---');
    console.warn('Cookie Present:', !!session);
    console.warn('Header Present:', !!authHeader);
  }

  return isValid;
}
