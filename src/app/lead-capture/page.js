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
              width: 'fit-content',
              margin: '0 auto 24px auto',
              border: '1px solid rgba(45, 140, 240, 0.2)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d8cf0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span style={{ fontSize: '11px', color: '#2d8cf0', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Institutional Grade Port</span>
            </div>

            <h1 className={styles.captureTitle}>Access the World's First <br/><span style={{color: '#00ff88'}}>AI Money Machine.</span></h1>
            <p className={styles.captureSub}>
              Enter your details below to receive your private access link and institutional yield breakdown via SMS and Email.
            </p>

            <form onSubmit={handleSubmit} className={styles.captureForm}>
              <input 
                type="text" 
                placeholder="First Name" 
                required 
                className={styles.captureInput}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Best Email Address" 
                required 
                className={styles.captureInput}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="Phone Number (for yields alerts)" 
                required 
                className={styles.captureInput}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <button type="submit" className={styles.primaryCta} style={{ width: '100%', marginTop: '8px' }}>
                Initialize Connection →
              </button>
            </form>

            <div className={styles.captureSafe}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Privacy Protected. No KYC Required. No Credit Card Needed.
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

      {/* Subtle Background Elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(45, 140, 240, 0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 255, 136, 0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
    </main>
  );
}
