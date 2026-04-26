'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';
import Link from 'next/link';

export default function OnboardingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className={styles.main} style={{ background: '#050505', minHeight: '100vh', padding: '60px 24px' }}>
      
      {/* Top Security Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.05)', zIndex: 1000 }}>
        <div style={{ 
          width: '65%', 
          height: '100%', 
          background: 'linear-gradient(90deg, #d4af37, #f1c40f)', 
          boxShadow: '0 0 15px #d4af37' 
        }}></div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Security Alert */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '12px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '10px 24px',
          borderRadius: '100px',
          marginBottom: '40px'
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>System Status:</span>
          <span style={{ fontSize: '10px', color: '#00ff88', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Initialization 65% Complete</span>
        </div>

        <h1 className={styles.pitchTitle} style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '16px' }}>
          Welcome to the <span style={{ color: '#d4af37' }}>Aurum Inner Circle.</span>
        </h1>
        <p className={styles.pitchSub} style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginBottom: '60px' }}>
          Your briefing is ready. Follow these 3 steps to activate your EX-AI automated account.
        </p>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', textAlign: 'left' }}>
          
          {/* Step 1 */}
          <div className={styles.modalContent} style={{ padding: '32px', border: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(212, 175, 55, 0.02)' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ fontSize: '32px', opacity: 0.5 }}>01</div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Activate Your NeoBank Account</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                  To begin receiving your automated payouts, you must first initialize your Aurum NeoBank vault. This is where the EX-AI system deposits your earnings.
                </p>
                <Link 
                  href={process.env.NEXT_PUBLIC_AURUM_REGISTER_URL || '#'} 
                  target="_blank"
                  className={styles.primaryCta} 
                  style={{ display: 'inline-block', width: 'auto', padding: '12px 32px' }}
                >
                  Initialize Vault →
                </Link>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={styles.modalContent} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ fontSize: '32px', opacity: 0.5 }}>02</div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Join the Private Briefing Channel</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
                  Our team releases daily performance updates and strategy guides inside the private Telegram channel. Do not miss these briefings.
                </p>
                <p style={{ color: '#d4af37', fontSize: '14px', fontWeight: 'bold' }}>Link arriving in your email within 5 minutes.</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={styles.modalContent} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ fontSize: '32px', opacity: 0.5 }}>03</div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Schedule Your Orientation</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                  If you have questions about the EX-AI performance metrics, you can book a 1-on-1 strategy call with our onboarding specialists.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Powered by Aurum EX-AI Engine | v2.0 Production
          </p>
        </div>

      </div>
    </main>
  );
}
