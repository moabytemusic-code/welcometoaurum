import FunnelEngineClient from '@/components/funnel/FunnelEngineClient';

async function getProject(projectId) {
  try {
    // For Server Components, we use an absolute URL or fetch from the filesystem directly
    // Since we are in a local dev environment, we use the internal API URL
    const baseUrl = process.env.SITE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/admin/projects/load?slug=${projectId}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error('Server-side project fetch failed:', e);
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
    title: `${project.name} | ${project.content.subtitle || 'Official Page'}`,
    description: project.content.description || 'Welcome to our platform.'
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
