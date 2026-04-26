'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalAffiliates: 0,
    activeVariants: 2,
    latestSignup: 'Never',
    rotatorStatus: 'Active'
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const res = await fetch('/api/admin/affiliates?quick=true');
        const projectRes = await fetch('/api/admin/projects/list');
        
        if (res.ok && projectRes.ok) {
          const affiliateData = await res.json();
          const projectData = await projectRes.json();
          const activeCount = projectData.filter(p => p.isActive).length;
          
          setStats(s => ({ 
            ...s, 
            totalAffiliates: affiliateData.count,
            activeVariants: activeCount
          }));
        }
      } catch (e) {
        console.error('Stats fetch error:', e);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/admin/activity', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (e) {
        console.error('Activity fetch error:', e);
      }
    };

    fetchQuickStats();
    fetchActivity();
    
    const interval = setInterval(() => {
      fetchQuickStats();
      fetchActivity();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffSeconds = Math.floor((now - then) / 1000);
    
    if (diffSeconds < 0) return 'Just now';
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} mins ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    return then.toLocaleDateString();
  };

  return (
    <div>
      <h1 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '8px' }}>Global Commander</h1>
      <p className={styles.sectionSub} style={{ textAlign: 'left', marginBottom: '40px' }}>Ecosystem oversight and traffic distribution dashboard.</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '60px' }}>
        <StatCard label="Total Partners" value={stats.totalAffiliates} icon="🤝" />
        <StatCard label="Live Funnels" value={stats.activeVariants} icon="🚀" />
        <StatCard label="System Status" value="Online" icon="🔒" color="#00ff88" />
        <StatCard label="A/B Weighting" value="50/50" icon="⚖️" />
      </div>

      {/* Main Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '24px', 
          padding: '32px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>System Activity Stream</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 8px #00ff88' }}></div>
              <span style={{ fontSize: '10px', color: '#00ff88', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Feed</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activities.length > 0 ? (
              activities.map(activity => (
                <ActivityItem key={activity.id} text={activity.text} time={formatRelativeTime(activity.timestamp)} />
              ))
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                No recent activity detected.
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '32px', background: 'rgba(45, 140, 240, 0.05)', border: '1px solid rgba(45, 140, 240, 0.2)', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Commander Pro-Tip</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6' }}>
            To force a specific variant for a partner, instruct them to use the `?v=` parameter. For example: `?v=consultative` will bypass the coin-flip for their traffic.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = '#2d8cf0' }) {
  return (
    <div style={{ 
      background: 'rgba(255,255,255,0.02)', 
      border: '1px solid rgba(255,255,255,0.05)', 
      padding: '24px', 
      borderRadius: '20px' 
    }}>
      <div style={{ fontSize: '24px', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: '900', color: color }}>{value}</div>
    </div>
  );
}

function ActivityItem({ text, time }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{text}</span>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{time}</span>
    </div>
  );
}
