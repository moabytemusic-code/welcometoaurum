import { redirect } from 'next/navigation';

export default function Home() {
  // Fallback redirect in case middleware doesn't rewrite correctly or for environments without middleware
  redirect('/pitch');
}
