'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/admin/admin.module.css';
import { List, CheckCircle2, XCircle, Settings, ExternalLink, Trash2, Edit2, Sparkles } from 'lucide-react';

export default function FaaSManager() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showQR, setShowQR] = useState(null);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects/list');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProjectStatus = async (slug, currentStatus) => {
    setProjects(projects.map(p => p.slug === slug ? { ...p, isActive: !currentStatus } : p));
    try {
      await fetch('/api/admin/projects/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, isActive: !currentStatus })
      });
    } catch (err) {
      console.error('Failed to toggle project', err);
      fetchProjects();
    }
  };

  const deleteProject = (slug) => {
    setProjectToDelete(slug);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      await fetch('/api/admin/projects/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: projectToDelete })
      });
      setShowDeleteModal(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project', err);
      alert('Error deleting project');
    }
  };

  const renameProject = async (slug, currentName) => {
    const newName = window.prompt("Enter new internal name for this funnel:", currentName);
    if (!newName || newName === currentName) return;

    try {
      await fetch('/api/admin/projects/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, newName })
      });
      fetchProjects();
    } catch (err) {
      console.error('Failed to rename project', err);
      alert('Error renaming project');
    }
  };

  return (
    <main className={styles.builderMain}>
      <div className={styles.builderGlow} />
      
      <div className={styles.container} style={{ maxWidth: '1000px' }}>
        <header className={styles.header}>
          <div className={styles.badge}>FaaS Platform v1.0</div>
          <h1 className={styles.title}>Manage <span className={styles.highlight}>Campaigns</span></h1>
          <p className={styles.subtitle}>Toggle your deployed funnels on or off globally.</p>
        </header>

        <div className={styles.card} style={{ padding: '0', overflow: 'hidden' }}>
          <div className={styles.sectionHeader} style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: 0 }}>
            <List className={styles.icon} />
            <h2>Live Funnels</h2>
          </div>

          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading campaigns...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No funnels deployed yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {projects.map((project, idx) => (
                <div key={project.slug} 
                  className={styles.campaignRow}
                  style={{ 
                    borderBottom: idx !== projects.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: project.isActive ? 'transparent' : 'rgba(255,0,0,0.02)'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {project.name}
                      <button 
                        onClick={() => renameProject(project.slug, project.name)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center' }}
                        title="Edit Name"
                        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                      >
                        <Edit2 size={14} />
                      </button>
                      {project.isActive ? (
                        <span style={{ fontSize: '10px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Active</span>
                      ) : (
                        <span style={{ fontSize: '10px', background: 'rgba(255,50,50,0.1)', color: '#ff3232', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Offline</span>
                      )}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                      Angle: {project.angle} • Slug: /{project.slug}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <a href={`/f/${project.slug}/${project.angle}`} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', transition: 'color 0.2s' }}>
                      View Live <ExternalLink size={14} />
                    </a>
                    
                    <button 
                      onClick={() => toggleProjectStatus(project.slug, project.isActive)}
                      style={{
                        background: project.isActive ? 'rgba(255,50,50,0.1)' : 'rgba(0,255,136,0.1)',
                        color: project.isActive ? '#ff3232' : '#00ff88',
                        border: project.isActive ? '1px solid rgba(255,50,50,0.2)' : '1px solid rgba(0,255,136,0.2)',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {project.isActive ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                      {project.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <button 
                      onClick={() => setShowQR(project)}
                      style={{ background: 'none', border: 'none', color: '#00ff88', cursor: 'pointer', padding: '4px' }}
                      title="Get QR Code"
                    >
                      <Sparkles size={18} />
                    </button>

                    <button 
                      onClick={() => deleteProject(project.slug)}
                      style={{
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.3)',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.2s'
                      }}
                      title="Permanently Delete Funnel"
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ff3232'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%',
            textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ marginBottom: '8px', color: '#fff' }}>Funnel QR Code</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              Scan to open: {showQR.name}
            </p>
            
            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'inline-block', marginBottom: '24px' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${baseUrl}/f/${showQR.slug}/${showQR.angle}`)}`}
                alt="Funnel QR Code"
                style={{ display: 'block' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(`${baseUrl}/f/${showQR.slug}/${showQR.angle}`)}`;
                  link.download = `QR_${showQR.slug}.png`;
                  link.target = "_blank";
                  link.click();
                }}
                style={{ padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Download High-Res (1000px)
              </button>
              <button 
                onClick={() => setShowQR(null)}
                style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#111', border: '1px solid rgba(255,50,50,0.3)',
            borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%',
            textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ color: '#ff3232', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Trash2 size={48} />
            </div>
            <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '12px' }}>Permanently Delete Funnel?</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to delete the <strong>{projectToDelete}</strong> funnel? This will permanently remove the JSON configuration and take the funnel offline immediately. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => { setShowDeleteModal(false); setProjectToDelete(null); }}
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteProject}
                style={{ flex: 1, padding: '12px', background: '#ff3232', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Delete Funnel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
