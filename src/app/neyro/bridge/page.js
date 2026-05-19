'use client';

import { useState, useEffect } from 'react';
import styles from '../../finance.module.css';
import { Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function NeyroBridge() {
  const [sponsorData, setSponsorData] = useState({ 
    code: '1W145K', 
    name: 'Aurum Corporate'
  });

  useEffect(() => {
    const resolveSponsor = async () => {
      try {
        const res = await fetch('/api/rotator?funnel=neyro');
        if (res.ok) {
          const data = await res.json();
          setSponsorData(data);
        }
      } catch (err) {
        console.error('Sponsor error:', err);
      }
    };
    resolveSponsor();
  }, []);

  return (
    <main className={styles.main} style={{ background: '#050505', color: '#fff', minHeight: '100vh', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <section style={{ padding: '80px 20px', textAlign: 'center', width: '100%', maxWidth: '700px', background: 'linear-gradient(180deg, rgba(0, 255, 136, 0.08) 0%, transparent 100%)' }}>
        
        <div style={{ width: '80px', height: '80px', background: 'rgba(0,255,136,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: '2px solid rgba(0,255,136,0.3)' }}>
          <CheckCircle2 size={40} color="#00ff88" />
        </div>

        <div style={{ 
          color: '#00ff88', 
          fontSize: '13px', 
          fontWeight: '900', 
          display: 'inline-block', 
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Step 1 Complete
        </div>
        
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '950', lineHeight: '1.1', marginBottom: '24px', color: '#fff', letterSpacing: '-1px' }}>
          Your Registration Was Successful.
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px', fontWeight: '500', marginBottom: '48px', lineHeight: '1.5' }}>
          We just sent your exclusive invitation to the live Zoom Orientation. This is where we will reveal exactly how the automated system works.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #2d8cf0, #0052cc)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(45,140,240,0.3)' }}>
              <Mail size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Check Your Email Now</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0', fontSize: '14px' }}>From: Support @ Aurum Foundation</p>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '24px', fontSize: '16px' }}>
            Your sponsor (<strong>{sponsorData.name}</strong>) has reserved a spot for you on the next live Zoom Orientation. The email contains your private access link and the exact time of the call.
          </p>

          <div style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.2)', padding: '20px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <AlertTriangle size={24} color="#ff4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ color: '#ff4444', fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>CRITICAL: Check Your Spam/Promotions Folder</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                Because this contains a live Zoom link, automated email filters sometimes accidentally flag it. If you don't see the email in your primary inbox within 2 minutes, check your Spam or Promotions folders.
              </p>
            </div>
          </div>

        </div>

      </section>

    </main>
  );
}
