'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/admin/admin.module.css';
import { Network, CheckCircle2, XCircle, Users, Activity } from 'lucide-react';

export default function RotatorManager() {
  const [rotators, setRotators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRotators();
  }, []);

  const fetchRotators = async () => {
    try {
      const res = await fetch('/api/admin/rotators/list');
      const data = await res.json();
      setRotators(data);
    } catch (err) {
      console.error('Failed to load rotators', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRotatorStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    
    // Optimistic UI update
    setRotators(rotators.map(r => r.id === id ? { ...r, status: newStatus } : r));
    
    try {
      await fetch('/api/admin/rotators/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newStatus })
      });
    } catch (err) {
      console.error('Failed to toggle rotator', err);
      // Revert on failure
      fetchRotators();
    }
  };

  return (
    <main className={styles.builderMain}>
      <div className={styles.builderGlow} />
      
      <div className={styles.container} style={{ maxWidth: '1000px' }}>
        <header className={styles.header}>
          <div className={styles.badge}>Rotator Engine v1.0</div>
          <h1 className={styles.title}>Manage <span className={styles.highlight}>Downlines</span></h1>
          <p className={styles.subtitle}>Control traffic distribution for your boutique teams and system rotators.</p>
        </header>

        <div className={styles.card} style={{ padding: '0', overflow: 'hidden' }}>
          <div className={styles.sectionHeader} style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: 0 }}>
            <Network className={styles.icon} />
            <h2>Active Rotators</h2>
          </div>

          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading rotators...</div>
          ) : rotators.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No rotators found in the database.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {rotators.map((rotator, idx) => (
                <div key={rotator.id} 
                  className={styles.campaignRow}
                  style={{ 
                    borderBottom: idx !== rotators.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: rotator.status === 'ACTIVE' ? 'transparent' : 'rgba(255,0,0,0.02)',
                    padding: '24px 32px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {rotator.name}
                      {rotator.status === 'ACTIVE' ? (
                        <span style={{ fontSize: '10px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Active</span>
                      ) : (
                        <span style={{ fontSize: '10px', background: 'rgba(255,50,50,0.1)', color: '#ff3232', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Paused</span>
                      )}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '16px' }}>
                      <span><strong>Type:</strong> {rotator.type}</span>
                      <span><strong>Slug:</strong> /api/r/{rotator.slug}</span>
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '24px' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> Members</span>
                      <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{rotator.total_members || 0}</span>
                    </div>

                    <button 
                      onClick={() => toggleRotatorStatus(rotator.id, rotator.status)}
                      style={{
                        background: rotator.status === 'ACTIVE' ? 'rgba(255,50,50,0.1)' : 'rgba(0,255,136,0.1)',
                        color: rotator.status === 'ACTIVE' ? '#ff3232' : '#00ff88',
                        border: rotator.status === 'ACTIVE' ? '1px solid rgba(255,50,50,0.2)' : '1px solid rgba(0,255,136,0.2)',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        minWidth: '130px',
                        justifyContent: 'center'
                      }}
                    >
                      {rotator.status === 'ACTIVE' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                      {rotator.status === 'ACTIVE' ? 'Pause Traffic' : 'Activate Traffic'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
