'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';
import Link from 'next/link';
import { Mail, Gift, Video, AlertCircle } from 'lucide-react';

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
          width: '85%', 
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
          background: 'rgba(212, 175, 55, 0.05)', 
          border: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '10px 24px',
          borderRadius: '100px',
          marginBottom: '40px'
        }}>
          <span style={{ fontSize: '10px', color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Next Steps:</span>
          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Claim Your $100 & Register for Zoom Call</span>
        </div>

        <h1 className={styles.pitchTitle} style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '16px' }}>
          Welcome to the <span style={{ color: '#d4af37' }}>Aurum Inner Circle.</span>
        </h1>
        <p className={styles.pitchSub} style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginBottom: '60px' }}>
          Your briefing is ready. Complete these 3 critical steps to activate your automated account and claim your voucher.
        </p>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', textAlign: 'left' }}>
          
          {/* Step 1: Voucher Redemption */}
          <div className={styles.modalContent} style={{ padding: '32px', border: '1px solid rgba(0, 255, 136, 0.2)', background: 'rgba(0, 255, 136, 0.02)' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ color: '#00ff88' }}><Gift size={32} /></div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Redeem Your $100 Liquidity Voucher</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                  We've reserved a $100 liquidity voucher for your new account. Initialize your Aurum NeoBank vault now to claim it and start your first EX-AI bot cycle.
                </p>
                <Link 
                  href={process.env.NEXT_PUBLIC_AURUM_REGISTER_URL || '#'} 
                  target="_blank"
                  className={styles.primaryCta} 
                  style={{ display: 'inline-block', width: 'auto', padding: '12px 32px', background: '#00ff88', color: '#000', boxShadow: '0 8px 32px rgba(0, 255, 136, 0.3)' }}
                >
                  Claim $100 Voucher Now →
                </Link>
              </div>
            </div>
          </div>

          {/* Step 2: Zoom Call */}
          <div className={styles.modalContent} style={{ padding: '32px', border: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(212, 175, 55, 0.02)' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ color: '#d4af37' }}><Mail size={32} /></div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Check Your Email: Zoom Orientation</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                  Our team has sent your invitation for the <strong>Live Zoom Onboarding Call</strong>. This is where we walkthrough the system and ensure your AI is configured for maximum yield.
                </p>
                
                {/* Spam Alert */}
                <div style={{ 
                  background: 'rgba(255, 50, 50, 0.05)', 
                  border: '1px solid rgba(255, 50, 50, 0.2)', 
                  padding: '16px', 
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <AlertCircle size={20} style={{ color: '#ff3232', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Cannot find the email?</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                      Please check your <strong>Spam or Promotions folder</strong> for an email from the <strong>"Aurum Rise Onboarding Team"</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Briefing */}
          <div className={styles.modalContent} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ opacity: 0.5 }}><Video size={32} /></div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Join the Private Briefing Channel</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                  Stay updated with real-time performance metrics and institutional alerts. Access to the private channel is granted after your Zoom Orientation.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Powered by Aurum Rise Onboarding Team | v2.0
          </p>
        </div>

      </div>
    </main>
  );
}
