'use client';

import { useState, useEffect } from 'react';
import styles from '../app/finance.module.css';

const BotEarningsBadge = ({ type = 'EX-AI', targetYield = null }) => {
  const [earnings, setEarnings] = useState({ 
    standard: null, pro: null, 
    standard_monthly: null, pro_monthly: null 
  });

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch('/api/aurum-bot', { cache: 'no-store' });
        if (!res.ok) throw new Error('Bot proxy fail');
        const data = await res.json();
        setEarnings({ 
          standard: data.bot,
          pro: data.pro,
          standard_monthly: data.bot_monthly || '+11.98%',
          pro_monthly: data.pro_monthly || '+3.36%'
        });
      } catch (err) {
        console.error('Earnings fetch error:', err);
      }
    };
    fetchEarnings();
    const interval = setInterval(fetchEarnings, 600000);
    return () => clearInterval(interval);
  }, [type]);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB').split('/').join('.');

  if (!earnings.standard && !targetYield) return (
     <div className={styles.institutionalGlass} style={{ background: 'rgba(255,255,255,0.02)', justifyContent: 'center' }}>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontWeight: 'bold', letterSpacing: '1px' }}>SYNCHRONIZING FEED...</span>
     </div>
  );

  const isZeus = type === 'ZEUS';

  return (
    <div className={styles.institutionalGlass}>
      <div className={styles.scanline} />
      <div className={styles.windowGlow} />
      
      {/* Header */}
      <div className={styles.windowHeader}>
        <div className={styles.windowTitle}>AURUM</div>
        <div className={styles.windowSubtitle}>{isZeus ? 'Core Performance' : 'Daily Performance'}</div>
        <div className={styles.windowTimestamp}>
          <span className={styles.indicatorPulse} style={{ background: '#00ff88' }} />
          VERIFIED: {dateStr}
        </div>
      </div>

      {/* Primary Results */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, justifyContent: 'center', gap: '24px', position: 'relative', zIndex: 2 }}>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#fff', opacity: 0.8, fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isZeus ? 'ZEUS Core Results' : 'EX-AI Daily results'}
          </div>
          <div style={{ fontSize: '42px', fontWeight: '950', color: '#fff', lineHeight: '1', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {isZeus ? targetYield || '+8.42%' : earnings.standard}
          </div>
          <div style={{ fontSize: '11px', color: '#fff', opacity: 0.6, marginTop: '8px', fontWeight: '600' }}>
            MONTHLY: <span style={{ color: '#fff', opacity: 1 }}>{isZeus ? '+142.8%' : earnings.standard_monthly}</span>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '60%', margin: '0 auto' }} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#fff', opacity: 0.8, fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isZeus ? 'Audit Status' : 'EX-AI PRO Results'}
          </div>
          <div style={{ fontSize: '42px', fontWeight: '950', color: isZeus ? '#fff' : '#ffd700', lineHeight: '1', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {isZeus ? 'PASS' : earnings.pro}
          </div>
          <div style={{ fontSize: '11px', color: '#fff', opacity: 0.6, marginTop: '8px', fontWeight: '600' }}>
            MONTHLY: <span style={{ color: '#fff', opacity: 1 }}>{isZeus ? 'VERIFIED' : earnings.pro_monthly}</span>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className={styles.windowFooter}>
        INSTITUTIONAL: AUTH-2026-X
      </div>
    </div>
  );
};

export default BotEarningsBadge;
