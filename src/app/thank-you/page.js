'use client';
import { useState, useEffect, Suspense } from 'react';
import styles from '@/app/finance.module.css';
import { Mail, Gift, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function ThankYouContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '1W145K';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className={styles.main} style={{ background: '#050505', minHeight: '100vh', padding: '80px 24px' }}>
      
      {/* Top Progress Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.05)', zIndex: 1000 }}>
        <div style={{ 
          width: '65%', 
          height: '100%', 
          background: 'linear-gradient(90deg, #00ff88, #d4af37)', 
          boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)' 
        }}></div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Success Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '12px', 
          background: 'rgba(0, 255, 136, 0.05)', 
          border: '1px solid rgba(0, 255, 136, 0.2)',
          padding: '12px 28px',
          borderRadius: '100px',
          marginBottom: '48px',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <CheckCircle2 size={20} style={{ color: '#00ff88' }} />
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Access Requested Successfully</span>
        </div>

        <h1 className={styles.title} style={{ fontSize: 'clamp(32px, 8vw, 56px)', marginBottom: '24px', lineHeight: '1.1' }}>
          Check Your Inbox.<br />
          <span style={{ color: '#d4af37' }}>The Orientation Is Coming.</span>
        </h1>
        
        <p className={styles.subtitle} style={{ marginBottom: '64px', opacity: 0.8, fontSize: '18px' }}>
          We have just sent your <strong>Live Orientation Webinar</strong> link and your <strong>$100 Starting Fund</strong> instructions to your email.
        </p>

        {/* Action Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', textAlign: 'left' }}>
          
          {/* Step 1: Email */}
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '24px', 
            padding: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px'
          }}>
            <div style={{ color: '#d4af37', background: 'rgba(212,175,55,0.1)', padding: '16px', borderRadius: '16px', shrink: 0 }}>
              <Mail size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px', fontWeight: '800' }}>1. Find the Email</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                Look for an email from <strong>"Aurum Orientation Team"</strong>. It contains your unique link to join the next live session.
              </p>
            </div>
          </div>

          {/* Step 2: Spam Alert */}
          <div style={{ 
            background: 'rgba(255, 50, 50, 0.03)', 
            border: '1px solid rgba(255, 50, 50, 0.15)', 
            borderRadius: '24px', 
            padding: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px'
          }}>
            <div style={{ color: '#ff3232', background: 'rgba(255,50,50,0.1)', padding: '16px', borderRadius: '16px', shrink: 0 }}>
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px', fontWeight: '800' }}>2. Check Spam/Promotions</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                If you don't see it within 2 minutes, check your <strong>Spam</strong> or <strong>Promotions</strong> folder. Mark us as "Not Spam" to ensure you get the updates.
              </p>
            </div>
          </div>

          {/* Step 3: Voucher */}
          <div style={{ 
            background: 'rgba(0, 255, 136, 0.03)', 
            border: '1px solid rgba(0, 255, 136, 0.1)', 
            borderRadius: '24px', 
            padding: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px'
          }}>
            <div style={{ color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '16px', borderRadius: '16px', shrink: 0 }}>
              <Gift size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px', fontWeight: '800' }}>3. Claim Your $100</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
                Inside the email, you'll find the specific instructions to claim your $100 starting fund during the Orientation Webinar.
              </p>
            </div>
          </div>

        </div>

        {/* Assigned Sponsor Footer */}
        <div style={{ marginTop: '64px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Invitation Code: <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{ref}</span> • Secure Orientation Queue
          </p>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
