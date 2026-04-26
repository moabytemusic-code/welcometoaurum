import FunnelEngineClient from '@/components/funnel/FunnelEngineClient';
import { createClient } from '@supabase/supabase-js';

async function getProject(projectId) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: project, error } = await supabase
      .from('aurum_projects')
      .select('*')
      .eq('slug', projectId)
      .maybeSingle();

    if (error || !project) return null;

    return {
      ...project,
      isActive: project.is_active
    };
  } catch (err) {
    console.error('Error fetching project directly from Supabase:', err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  
  if (!project) {
    return {
      title: "Funnel Offline",
      description: "This project is currently unavailable."
    };
  }

  return {
    title: project.name || 'Aurum Funnel',
    description: project.content?.description || 'Official Page'
  };
}

export default async function FunnelEnginePage({ params }) {
  const { projectId, angleId } = await params;
  const project = await getProject(projectId);

  if (!project || project.isActive === false) {
    return (
      <div style={{ background: '#050505', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
        <div>
          <h1 style={{ color: '#d4af37', marginBottom: '16px' }}>404: Funnel Offline</h1>
          <p>Project not found or currently inactive. Please check the URL or create it in the Builder.</p>
        </div>
      </div>
    );
  }

  return (
    <FunnelEngineClient initialProject={project} angleId={angleId} />
  );
}
