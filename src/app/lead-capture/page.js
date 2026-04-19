'use client';

import { useState } from 'react';
import styles from '../finance.module.css';

export default function LeadCapture() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus('ESTABLISHING SECURE NODE...');

    try {
      // Step 1: Simulated "Institutional Validation"
      await new Promise(r => setTimeout(r, 800));
      setStatus('VERIFYING CONTACT INTEGRITY...');
      await new Promise(r => setTimeout(r, 800));
      setStatus('SYNCING WITH AURUM ECOSYSTEM...');

      // Step 2: API Opt-in
      const res = await fetch('/api/optin', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.name,
          phone: formData.phone,
          landing_variant: 'lead-capture'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setStatus('ACCESS GRANTED. REDIRECTING...');
        setTimeout(() => {
          // Redirect to the consultative flow
          window.location.href = '/consultative';
        }, 1200);
      } else {
        throw new Error('Capture failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('ERROR ENCOUNTERED. REDIRECTING...');
      setTimeout(() => {
        window.location.href = '/consultative';
      }, 1500);
    }
  };

  return (
    <main className={styles.captureContainer}>
      <div className={styles.captureCard}>
        {/* Connection Pulse Indicator */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '32px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 20px',
          borderRadius: '100px',
          width: 'max-content',
          margin: '0 auto 32px auto'
        }}>
          <div style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 10px #00ff88', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>Secure Node: Active 94%</span>
        </div>

        {!isProcessing ? (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '24px',
              background: 'rgba(45, 140, 240, 0.1)',
              padding: '8px 16px',
              borderRadius: '100px',
              width: 'max-content',
              maxWidth: '100%',
              margin: '0 auto 24px auto',
              border: '1px solid rgba(45, 140, 240, 0.2)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d8cf0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span style={{ fontSize: '11px', color: '#2d8cf0', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>Institutional Grade Portal</span>
            </div>

            <h1 className={styles.captureTitle}>The World's First <br/><span style={{textShadow: '0 0 30px rgba(0, 255, 136, 0.3)'}}>AI Money Machine.</span></h1>
            <p className={styles.captureSub}>
              Enter your authorization details to secure your private access link and institutional yield breakdown.
            </p>

            <form onSubmit={handleSubmit} className={styles.captureForm}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  required 
                  className={styles.captureInput}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  placeholder="Institutional Email" 
                  required 
                  className={styles.captureInput}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="tel" 
                  placeholder="SMS Enabled Mobile Number" 
                  required 
                  className={styles.captureInput}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <button type="submit" className={styles.primaryCta} style={{ width: '100%', marginTop: '8px' }}>
                Initialize Connection Flow →
              </button>
            </form>

            <div className={styles.captureSafe}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Privacy Protected. End-to-End Encryption Active.</span>
            </div>
          </>
        ) : (
          <div className={styles.processingState}>
            <div className={styles.spinner} />
            <div className={styles.statusText}>{status}</div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '-8px' }}>Encrypting your data stream for secure transport...</p>
          </div>
        )}
      </div>

      {/* Subtle Background Elements - Hidden on small mobile to prevent overflow issues */}
      <div className="mobile-hide" style={{
        position: 'absolute',
        top: '15%',
        right: '15%',
        width: '120px',
        height: '120px',
        background: 'rgba(45, 140, 240, 0.05)',
        borderRadius: '30px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transform: 'rotate(15deg)',
        animation: 'float 10s infinite alternate',
        zIndex: 1
      }}></div>
      <div className="mobile-hide" style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        width: '80px',
        height: '80px',
        background: 'rgba(0, 255, 136, 0.05)',
        borderRadius: '50%',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'float 8s infinite alternate-reverse',
        zIndex: 1
      }}></div>

      <style jsx>{`
        @media (max-width: 600px) {
          .mobile-hide { display: none; }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-40px) rotate(10deg); }
        }
      `}</style>
    </main>
  );
}
