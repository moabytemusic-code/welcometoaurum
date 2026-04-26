import { redirect } from 'next/navigation';

export default function Home() {
  // The middleware (src/middleware.js) handles the smart redirect to active funnels.
  // This page is a fallback in case middleware is disabled.
  return null;
}
