import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Fetch the current active funnel
  const { data: projects } = await supabase
    .from('aurum_projects')
    .select('slug, angle')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (projects && projects.length > 0) {
    // Redirect to the active funnel
    redirect(`/f/${projects[0].slug}/${projects[0].angle}`);
  }

  // Fallback to the manage page if no funnels are active so you aren't stuck on a blank screen
  redirect('/admin/manage');
}
