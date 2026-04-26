'use client';

import { useState } from 'react';
import styles from '../app/finance.module.css';
import { Shield, Lock, Globe, ArrowRight } from 'lucide-react';

const OptInBadge = ({ onOptIn, isProcessing, status, wide = false, angle = 'pitch' }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onOptIn(formData);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB').split('/').join('.');

  const buttonText = angle === 'pay-it-forward' 
    ? 'Claim My Free $100 →' 
    : 'Activate Wealth Generator →';

  const portalSubtitle = angle === 'pay-it-forward'
    ? 'Secure Claim Portal'
    : 'Unified Activation Portal';

  return (
    <div style={{
      width: '100%',
      padding: wide ? 'var(--badge-padding, 48px)' : 'var(--badge-padding, 32px)',
      background: 'rgba(5, 5, 5, 0.7)',
      backdropFilter: 'blur(40px) saturate(150%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '32px',
      boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style jsx>{`
        div {
          --badge-padding: 48px;
        }
        .window-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        .header-content {
          text-align: left;
        }
        .header-top {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 4px;
          color: #d4af37;
          margin-bottom: 8px;
        }
        .header-title {
          font-size: ${wide ? '24px' : '18px'};
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .field-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        @media (max-width: 600px) {
          div {
            --badge-padding: 24px !important;
          }
          .window-header {
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
            text-align: center !important;
          }
          .header-content {
            text-align: center !important;
          }
          .header-top {
            text-align: center !important;
          }
          .header-title {
            font-size: 20px !important;
            text-align: center !important;
          }
          .secure-node-badge {
            margin-top: 4px;
            text-align: center;
          }
          .field-label {
            font-size: 13px !important;
            justify-content: center !important;
            text-align: center !important;
          }
          .submit-btn {
            height: 60px !important;
            font-size: 13px !important;
          }
          .footer-badges {
            flex-direction: column !important;
            gap: 12px !important;
          }
        }
      `}</style>
      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #d4af37, transparent)' }} />
      <div className={styles.scanline} style={{ opacity: 0.1 }} />
      
      {/* Header */}
      <div className="window-header">
        <div className="header-content">
          <div className="header-top">AURUM</div>
          <div className="header-title">{portalSubtitle}</div>
        </div>
        <div className="secure-node-badge">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 10px #00ff88' }} />
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>SECURE NODE: {dateStr}</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div style={{ width: '100%', zIndex: 2 }}>
        {!isProcessing ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '100%', maxWidth: '420px' }}>
                <label className="field-label">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.modalInput}
                  style={{ width: '100%', height: '56px', padding: '0 20px', borderRadius: '16px', fontSize: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', textAlign: 'center' }}
                />
              </div>

              <div style={{ width: '100%', maxWidth: '420px' }}>
                <label className="field-label">
                  <Globe size={12} /> Institutional Email
                </label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={styles.modalInput}
                  style={{ width: '100%', height: '56px', padding: '0 20px', borderRadius: '16px', fontSize: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', textAlign: 'center' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <button
                type="submit"
                className={`${styles.primaryCta} submit-btn`}
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  height: '64px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: '900',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  borderRadius: '20px',
                  boxShadow: '0 15px 45px rgba(212, 175, 55, 0.25)',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {buttonText}
              </button>
              
              <div className="footer-badges" style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'rgba(255,255,255,0.3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600' }}>
                  <Lock size={12} /> 256-BIT ENCRYPTION
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', color: '#00ff88' }}>
                  <Shield size={12} /> NO CREDIT CARD REQUIRED
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div className={styles.spinner} style={{ margin: '0 auto 32px', width: '56px', height: '56px', borderTopColor: '#d4af37' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#fff', fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase' }}>{status || 'SYNCING NODE...'}</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>AUTHORIZED SESSION IN PROGRESS</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        input::placeholder { color: rgba(255,255,255,0.15); }
        .primaryCta:hover { transform: translateY(-2px); filter: brightness(1.1); transition: all 0.2s; }
      `}</style>
    </div>
  );
};

export default OptInBadge;
