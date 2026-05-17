'use client';

import { useState, useEffect } from 'react';
import styles from '../../finance.module.css';

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
    <main className={styles.main} style={{ background: '#050505', color: '#fff', minHeight: '100vh', paddingBottom: '80px' }}>
      
      <section style={{ padding: '60px 20px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(0, 255, 136, 0.08) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ 
            background: '#00ff88', 
            color: '#000', 
            padding: '4px 12px', 
            borderRadius: '4px', 
            fontSize: '11px', 
            fontWeight: '900', 
            display: 'inline-block', 
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Success — You're almost in
          </div>
          
          <h1 style={{ fontSize: '38px', fontWeight: '950', lineHeight: '1.05', marginBottom: '20px', color: '#fff' }}>
            Watch This Brief Orientation Before You Begin
          </h1>
          
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', fontWeight: '500', marginBottom: '40px', lineHeight: '1.4' }}>
            Here is exactly what you need to know about setting up your personal AI system. Follow these simple steps below.
          </p>
          
          {/* Live Preview of Neyro */}
          <div style={{ 
            width: '100%', 
            height: '400px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '24px', 
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            marginBottom: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '8px 16px', background: 'rgba(0,0,0,0.8)', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
               <span style={{ fontSize: '11px', color: '#00ff88', fontWeight: 'bold', textTransform: 'uppercase' }}>Live Preview</span>
               <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>neyro.network</span>
            </div>
            <iframe 
              src="https://neyro.network/" 
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                paddingTop: '32px'
              }}
              title="Neyro Live Preview"
            />
          </div>

        </div>
      </section>

      <section style={{ padding: '20px', maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Your Next Steps</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          
          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: '#00ff88', fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>1. Prepare Your Funds & Wallet</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '12px' }}>
              It is completely free to join and explore the platform. However, to start generating returns, you will need a <strong>$19.99 annual membership fee</strong>, and a minimum of <strong>$250 USD</strong> for your AI trading agent.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', borderLeft: '3px solid #d4af37', paddingLeft: '12px' }}>
              💡 PRO TIP: Ensure you have your funds ready in a compatible Web 3 wallet (like Trust Wallet) and have matching crypto for gas fees.
            </p>
          </div>

          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: '#00ff88', fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>2. Enable Your VPN (North America)</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '12px' }}>
              If you are located in the <strong>US, Canada, or Mexico</strong>, you must use a VPN set to a country outside these regions to access the registration page. 
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', borderLeft: '3px solid #00ff88', paddingLeft: '12px' }}>
              🌍 Set your location to "Europe" or "Asia" for seamless access to the digital banking engine.
            </p>
          </div>

          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: '#00ff88', fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>3. Create Account & Activate</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '12px' }}>
              Follow these simple steps when creating your profile:
            </p>
            <ul style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.8', marginLeft: '20px' }}>
              <li><strong>Contact:</strong> Enter your working email.</li>
              <li><strong>Invite Code:</strong> Your sponsor's code will be pre-filled automatically.</li>
              <li><strong>Profile:</strong> Set your birthday and set phone and country to <strong>"CRYPTONATION"</strong> at the bottom of the dropdown.</li>
              <li><strong>Activation:</strong> Verify your email to finalize activation!</li>
            </ul>
          </div>

        </div>

        <div style={{ textAlign: 'center' }}>
          <a 
            href={`https://backoffice.aurum.foundation/neyro/?ref=${sponsorData.code}`} 
            style={{ 
              display: 'inline-block',
              background: '#d4af37', 
              color: '#000', 
              width: '100%', 
              padding: '20px',
              fontSize: '18px', 
              fontWeight: '900', 
              border: 'none', 
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}
          >
            CONTINUE TO NEYRO
          </a>
          <p style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            You will be redirected securely to the official Aurum / Neyro portal.
          </p>
        </div>
      </section>

    </main>
  );
}
