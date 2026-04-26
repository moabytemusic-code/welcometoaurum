import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Fetch active funnels
  const { data: projects } = await supabase
    .from('aurum_projects')
    .select('slug, angle')
    .eq('is_active', true)
    .limit(1);

  if (projects && projects.length > 0) {
    redirect(`/f/${projects[0].slug}/${projects[0].angle}`);
  }

  // Final fallback to the primary pitch funnel
  redirect('/f/aurum-pitch/pitch');
}
