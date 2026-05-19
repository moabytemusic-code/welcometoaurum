'use client';

import { useState, useEffect } from 'react';
import styles from '../finance.module.css';
import { Lock } from 'lucide-react';

export default function GatewayCapture() {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [sponsorData, setSponsorData] = useState({ 
    code: '1W145K', 
    name: 'Aurum Corporate'
  });

  useEffect(() => {
    const resolveSponsor = async () => {
      try {
        const res = await fetch('/api/rotator?funnel=neyro-gateway');
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
    setStatus('GENERATING SECURE LINK...');
    
    try {
      await fetch('/api/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sponsor_code: sponsorData.code,
          sponsor_name: sponsorData.name,
          landing_variant: 'neyro_gateway'
        })
      });
    } catch (error) {
      console.error(error);
    }
    
    setTimeout(() => {
      window.location.href = '/gateway/thankyou';
    }, 1000);
  };

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000', fontFamily: 'sans-serif' }}>
      
      {/* Native Neyro Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          objectFit: 'cover',
          opacity: 0.6
        }}
      >
        <source src="https://neyro.network/assets/video/firstscreen.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay Gradient for Readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>

      {/* Top Navigation */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="https://neyro.network/img/logo.svg" alt="Neyro" style={{ height: '32px', filter: 'brightness(0) invert(1)' }} />
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', display: 'none' }}></div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}>
          Invited by: <span style={{ color: '#00ff88' }}>{sponsorData.name}</span>
        </div>
      </header>

      {/* Centered Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 80px)',
        padding: '20px'
      }}>
        
        {/* Glassmorphic Capture Form */}
        <div style={{
          background: 'rgba(10, 10, 15, 0.4)',
          backdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          padding: '48px',
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', padding: '6px 16px', borderRadius: '100px', marginBottom: '32px' }}>
            <Lock size={14} color="#d4af37" />
            <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Restricted Access</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 40px)', fontWeight: '900', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            The Next Era of Agentic Trading
          </h1>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px', padding: '0 10px' }}>
            Neyro is the first non‑custodial AI agent layer for trading. Enter your best email to request a secure link to the live gateway.
          </p>

          <form onSubmit={handleOptIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="email" 
              placeholder="Enter your email address..." 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                background: 'rgba(0,0,0,0.6)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff',
                height: '60px',
                borderRadius: '16px',
                padding: '0 24px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
                textAlign: 'center'
              }}
              onFocus={(e) => e.target.style.borderColor = '#d4af37'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button 
              type="submit" 
              disabled={isProcessing}
              style={{ 
                background: 'linear-gradient(135deg, #d4af37, #f1c40f)', 
                color: '#000', 
                height: '60px',
                borderRadius: '16px',
                fontSize: '16px', 
                fontWeight: '900', 
                border: 'none', 
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(212,175,55,0.3)',
                transition: 'transform 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {isProcessing ? status : 'Generate Secure Link'}
            </button>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '12px' }}>
              Your secure access link will be emailed immediately.
            </p>
          </form>

        </div>

      </div>

    </main>
  );
}
