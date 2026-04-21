'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';

export default function FunnelLibrary() {
  const [liveStats, setLiveStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/funnels/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setLiveStats(data);
        }
      } catch (e) {
        console.error('Stats fetch error:', e);
      }
    };
    fetchStats();
  }, []);

  const funnels = [
    { 
      id: 'pitch', 
      name: 'Legacy Pitch', 
      desc: 'High-pressure financial pitching focusing on rapid returns and LEGACY banking frustrations.',
      status: 'Active',
      audience: 'Newbies / General',
      leads: liveStats['pitch'] || 0
    },
    { 
      id: 'consultative', 
      name: 'Consultative Masterclass', 
      desc: '"Telling Ain\'t Selling" framework. Uses interrogative psychology to build deep trust.',
      status: 'Active',
      audience: 'Educated / Skeptics',
      leads: liveStats['consultative'] || 0
    },
    { 
      id: 'breakdown', 
      name: 'Breakdown Masterpiece', 
      desc: 'The original high-conversion funnel. Focuses on the "Digital Marketing Lifestyle" and automated wealth building.',
      status: 'Active',
      audience: 'Entrepreneurial / Wealth Seekers',
      leads: liveStats['breakdown'] || 0
    },
    { 
      id: 'v3', 
      name: 'Institutional Alpha (Draft)', 
      desc: 'Focuses on the Neobanking utility and global spending power of the Aurum Card.',
      status: 'Locked',
      audience: 'Global Travelers',
      leads: liveStats['v3'] || 0
    },
    { 
      id: 'v4', 
      name: 'The Yield Farmer (Draft)', 
      desc: 'Deep dive into the EX-AI Bot algorithms for technical or math-oriented audiences.',
      status: 'Locked',
      audience: 'Tech/Crypto Savvy',
      leads: liveStats['v4'] || 0
    }
  ];

  return (
    <div>
      <h1 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '8px' }}>Funnel Library</h1>
      <p className={styles.sectionSub} style={{ textAlign: 'left', marginBottom: '40px' }}>Manage landing page variants and assign them to specific audience segments.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {funnels.map((funnel) => (
          <div key={funnel.id} style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '24px', 
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{funnel.name}</h3>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: '900', 
                padding: '4px 10px', 
                borderRadius: '100px', 
                background: funnel.status === 'Active' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255,255,255,0.05)',
                color: funnel.status === 'Active' ? '#00ff88' : 'rgba(255,255,255,0.3)',
                letterSpacing: '1px'
              }}>
                {funnel.status.toUpperCase()}
              </span>
            </div>
            
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6', flexGrow: 1 }}>{funnel.desc}</p>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Target Audience</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d8cf0' }}>{funnel.audience}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Captured Leads</div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>{funnel.leads}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className={styles.primaryCta} style={{ padding: '12px 20px', fontSize: '14px', flexGrow: 1 }}>Edit Copy</button>
              <button 
                className={styles.primaryCta} 
                style={{ 
                  padding: '12px 20px', 
                  fontSize: '14px', 
                  background: 'transparent', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: 'none'
                }}
                onClick={() => window.open(`/?v=${funnel.id}`, '_blank')}
              >
                Preview
              </button>
            </div>
          </div>
        ))}

        {/* Add New Funnel Placeholder */}
        <div style={{ 
          background: 'rgba(255,255,255,0.01)', 
          border: '2px dashed rgba(255,255,255,0.05)', 
          borderRadius: '24px', 
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          cursor: 'pointer',
          minHeight: '300px'
        }}>
          <div style={{ fontSize: '40px' }}>➕</div>
          <div style={{ fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>Deploy New Audience variant</div>
        </div>
      </div>
    </div>
  );
}
