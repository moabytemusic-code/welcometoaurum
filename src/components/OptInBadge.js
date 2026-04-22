'use client';

import { useState } from 'react';
import styles from '../app/finance.module.css';

const OptInBadge = ({ onOptIn, isProcessing, status, wide = false }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onOptIn(formData);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB').split('/').join('.');

  return (
    <div style={{
      width: '100%',
      padding: wide ? '40px' : '24px',
      background: 'rgba(10, 10, 10, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(45, 140, 240, 0.3)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className={styles.scanline} />
      <div className={styles.windowGlow} />
      
      {/* Header */}
      <div className={styles.windowHeader} style={{ marginBottom: wide ? '32px' : '20px' }}>
        <div className={styles.windowTitle}>AURUM</div>
        <div className={styles.windowSubtitle}>{wide ? 'Unified Activation Portal' : 'Activation Portal'}</div>
        <div className={styles.windowTimestamp}>
          <span className={styles.indicatorPulse} style={{ background: '#2D8CF0' }} />
          SECURE: {dateStr}
        </div>
      </div>

      {/* Form Section */}
      <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
        {!isProcessing ? (
          <form 
            onSubmit={handleSubmit} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
              width: '100%'
            }}
          >
            {/* Input Row */}
            <div style={{ 
              display: 'flex', 
              flexDirection: wide ? 'row' : 'column', 
              gap: '20px' 
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Operator Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.modalInput}
                  style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '12px', fontSize: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Institutional Email
                </label>
                <input
                  type="email"
                  placeholder="name@institution.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={styles.modalInput}
                  style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '12px', fontSize: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
            
            {/* Button Row (Centered Below) */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                className={styles.primaryCta}
                style={{
                  width: wide ? '360px' : '100%',
                  height: '56px',
                  padding: '0 24px',
                  fontSize: '15px',
                  fontWeight: '950',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(45, 140, 240, 0.4)'
                }}
              >
                Activate Wealth Generator →
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className={styles.spinner} style={{ margin: '0 auto 24px', width: '48px', height: '48px' }} />
            <span style={{ fontSize: '11px', color: '#fff', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>{status || 'SYNCING NODE...'}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.windowFooter}>
        PORTAL-NODE-2026-FINAL
      </div>

      <style jsx>{`
        @keyframes aurumSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OptInBadge;
