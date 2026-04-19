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

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const res = await fetch('/api/admin/affiliates?quick=true');
        if (res.ok) {
          const data = await res.json();
          setStats(s => ({ ...s, totalAffiliates: data.count }));
        }
      } catch (e) {
        console.error('Stats fetch error:', e);
      }
    };
    fetchQuickStats();
  }, []);

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
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>System Activity Stream</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ActivityItem text="New affiliate 'MAXWELL' joined the pool." time="2 mins ago" />
            <ActivityItem text="Consultative variant outperforming Pitch by 12% in last 24h." time="1 hour ago" />
            <ActivityItem text="Telegram scraper updated bot percentages to +0.38%." time="4 hours ago" />
            <ActivityItem text="Rotator re-balanced based on weighting settings." time="Yesterday" />
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
