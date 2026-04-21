import { cookies } from 'next/headers';

/**
 * Checks if the current requester has a valid admin session.
 * Standardizes authentication across all App Router API routes.
 */
export async function isValidAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('aurum_admin_session')?.value;
  
  const isValid = session === 'authenticated';
  
  if (!isValid) {
    console.warn('--- Admin Auth Failure ---');
    console.warn('Path:', typeof window === 'undefined' ? '[Server]' : '[Client]');
    console.warn('Cookie status:', !!session);
  } else {
    console.log('--- Admin Auth Success ---');
  }

  return isValid;
}
