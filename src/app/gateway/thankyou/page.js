'use client';

import styles from '../../finance.module.css';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function GatewayThankYou() {
  return (
    <main className={styles.main} style={{ background: '#050505', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>

      <section style={{ position: 'relative', zIndex: 10, padding: '40px 20px', textAlign: 'center', width: '100%', maxWidth: '600px' }}>
        
        <div style={{ width: '80px', height: '80px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: '2px solid rgba(212,175,55,0.3)' }}>
          <CheckCircle2 size={40} color="#d4af37" />
        </div>
        
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '950', lineHeight: '1.1', marginBottom: '24px', color: '#fff', letterSpacing: '-1px' }}>
          Access Granted.
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px', fontWeight: '500', marginBottom: '48px', lineHeight: '1.5' }}>
          Your secure Gateway access link has been generated and sent to your email.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px', textAlign: 'left' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d4af37, #f1c40f)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(212,175,55,0.2)' }}>
              <Mail size={24} color="#000" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>Check Your Email</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0', fontSize: '14px' }}>From: Aurum Rise Onboarding Team</p>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>
            Click the private link inside the email to enter the live Gateway. If you do not see it within 2 minutes, please check your <strong>Spam or Promotions</strong> folder.
          </p>

        </div>

      </section>

    </main>
  );
}
