import { NextResponse } from 'next/server';
import { isValidAdminSession } from '@/lib/auth';

/**
 * Server-side Heartbeat for Admin Session
 * Returns the absolute truth about whether the server sees the admin cookie.
 */
export async function GET() {
  const authenticated = await isValidAdminSession();
  
  return NextResponse.json({ 
    authenticated,
    timestamp: new Date().toISOString(),
    status: authenticated ? 'Active' : 'Missing/Invalid'
  }, { 
    headers: { 'Cache-Control': 'no-store' } 
  });
}
