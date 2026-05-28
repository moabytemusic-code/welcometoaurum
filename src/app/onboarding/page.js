'use client';
import { useState, useEffect, Suspense } from 'react';
import styles from '@/app/finance.module.css';
import { Mail, Gift, Video, AlertCircle, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function OnboardingContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '1W145K'; // Default to admin code if missing

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
          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Claim Your Voucher & Register for Zoom</span>
        </div>

        <h1 className={styles.title} style={{ fontSize: 'clamp(28px, 8vw, 48px)', marginBottom: '16px' }}>
          Welcome to the <span style={{ color: '#d4af37' }}>Orientation.</span>
        </h1>
        <p className={styles.subtitle} style={{ marginBottom: '60px', opacity: 0.8 }}>
          Your guide is ready. Complete these 3 simple steps to activate your automated account and claim your voucher.
        </p>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          
          {/* Step 1: Voucher Redemption */}
          <div className={styles.modalContent} style={{ padding: '40px 24px', border: '1px solid rgba(0, 255, 136, 0.2)', background: 'rgba(0, 255, 136, 0.02)', margin: 0, maxWidth: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '16px', borderRadius: '50%' }}><Gift size={32} /></div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '22px', color: '#fff', marginBottom: '12px', fontWeight: '800' }}>Redeem Your $100 Starting Fund</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 12px' }}>
                  We've reserved a $100 starting fund voucher for your account. We have sent the redemption instructions to your inbox.
                </p>
                <div style={{ color: '#00ff88', fontWeight: '900', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Check your Email →
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Zoom Call */}
          <div className={styles.modalContent} style={{ padding: '40px 24px', border: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(212, 175, 55, 0.02)', margin: 0, maxWidth: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ color: '#d4af37', background: 'rgba(212, 175, 55, 0.1)', padding: '16px', borderRadius: '50%' }}><Mail size={32} /></div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '22px', color: '#fff', marginBottom: '12px', fontWeight: '800' }}>Step 2: Join the Live Orientation</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px' }}>
                  We don't want you to guess. Join our next <strong>Live Zoom Call</strong> to see exactly how we set up the 24/7 system in under 5 minutes. No tech skills required — just watch and follow along.
                </p>
                
                {/* Spam Alert */}
                <div style={{ 
                  background: 'rgba(255, 50, 50, 0.03)', 
                  border: '1px solid rgba(255, 50, 50, 0.15)', 
                  padding: '20px', 
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'center',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} style={{ color: '#ff3232' }} />
                    <span style={{ color: '#ff3232', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Cannot find the email?</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.5' }}>
                    Check your <strong>Spam or Promotions folder</strong> for an email from the <strong>"Aurum Rise Onboarding Team"</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Briefing */}
          <div className={styles.modalContent} style={{ padding: '40px 24px', margin: 0, maxWidth: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '50%' }}><Video size={32} /></div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '22px', color: '#fff', marginBottom: '12px', fontWeight: '800' }}>Private Updates & Support</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                  Real-time account updates and community yield reports. Access is granted automatically after your Zoom Orientation.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Final Registration Action */}
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Ready to Activate?</h2>
          <a 
            href={`https://backoffice.aurum.foundation/register?ref=${ref}`}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '12px',
              background: 'linear-gradient(135deg, #d4af37, #f1c40f)', 
              color: '#000', 
              padding: '20px 48px', 
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '900',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 10px 30px rgba(212,175,55,0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Create My Aurum Account <ArrowRight size={20} />
          </a>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '16px' }}>
            Assigned Sponsor Code: <strong style={{ color: '#d4af37' }}>{ref}</strong>
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px', paddingBottom: '60px' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '700' }}>
            AURUM RISE ONBOARDING TEAM • SECURE ACCESS
          </p>
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 600px) {
          main { padding: 40px 16px !important; }
        }
      `}</style>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>Setting things up...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
