'use client';

import { useState, useEffect } from 'react';
import styles from '../finance.module.css';

export default function NeyroCapture() {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [sponsorData, setSponsorData] = useState({ 
    code: '1W145K', 
    name: 'Aurum Corporate'
  });

  // Fetch Sponsor via Rotator
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

  const handleOptIn = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus('SECURING YOUR SPOT...');
    
    try {
      // Use existing optin endpoint
      await fetch('/api/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sponsor_code: sponsorData.code,
          sponsor_name: sponsorData.name,
          landing_variant: 'neyro_premium'
        })
      });
    } catch (error) {
      console.error(error);
    }
    
    setTimeout(() => {
      window.location.href = '/neyro/bridge';
    }, 1000);
  };

  return (
    <main className={styles.main} style={{ background: '#050505', color: '#fff', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glow & Image */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://neyro.network/img/bg_og.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>

      <header style={{ position: 'relative', zIndex: 10, padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="https://neyro.network/img/logo.svg" alt="Neyro" style={{ height: '32px', filter: 'brightness(0) invert(1)' }} />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>
          Invited by: <span style={{ color: '#00ff88' }}>{sponsorData.name}</span>
        </div>
      </header>

      {/* Hero Section - Centered & Curiosity Driven */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginTop: '4vh' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', padding: '6px 16px', borderRadius: '100px', marginBottom: '32px' }}>
          <div style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 10px #00ff88', animation: 'pulse 2s infinite' }}></div>
          <span style={{ fontSize: '12px', color: '#00ff88', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>By Invitation Only</span>
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: '950', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
          Discover The Automated AI Agent Generating Passive Income <span style={{ color: '#00ff88' }}>24/7.</span>
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', lineHeight: '1.6', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto' }}>
          Keep 100% control of your funds. Zero technical experience required. Enter your best email below to unlock your exclusive invitation and see how it works.
        </p>

        <form onSubmit={handleOptIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px', margin: '0 auto' }}>
          <input 
            type="email" 
            placeholder="Enter your best email..." 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: '#fff',
              height: '64px',
              borderRadius: '16px',
              padding: '0 24px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s',
              textAlign: 'center'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00ff88'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button 
            type="submit" 
            disabled={isProcessing}
            style={{ 
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', 
              color: '#000', 
              height: '64px',
              borderRadius: '16px',
              fontSize: '18px', 
              fontWeight: '900', 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,255,136,0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {isProcessing ? status : 'UNLOCK MY INVITATION'}
          </button>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '12px' }}>
            Your data is secure. No spam, ever.
          </p>
        </form>

      </section>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
      `}</style>
    </main>
  );
}
