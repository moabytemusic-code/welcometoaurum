'use client';

import { useState, useEffect } from 'react';
import styles from '../finance.module.css';

export default function NeyroCapture() {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [sponsorData, setSponsorData] = useState({ 
    code: '1W145K', 
    name: 'Neo Corporate'
  });

  // Fetch Sponsor via Rotator
  useEffect(() => {
    const resolveSponsor = async () => {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');

      if (refCode) {
        // 1. Direct link overrides everything
        try {
          const res = await fetch(`/api/rotator?code=${refCode}&funnel=neyro`);
          if (res.ok) {
            const data = await res.json();
            setSponsorData(data);
            localStorage.setItem('neo_affiliate', JSON.stringify(data));
          }
        } catch (err) { console.error('Sponsor error:', err); }
      } else {
        // 2. No ref code in URL. Check local storage.
        const stored = localStorage.getItem('neo_affiliate');
        if (stored) {
          try {
            setSponsorData(JSON.parse(stored));
          } catch (e) {
            localStorage.removeItem('neo_affiliate');
          }
        } else {
          // 3. No ref, no local storage -> ROTATOR
          try {
            const res = await fetch('/api/rotator?funnel=neyro');
            if (res.ok) {
              const data = await res.json();
              setSponsorData(data);
              localStorage.setItem('neo_affiliate', JSON.stringify(data));
            }
          } catch (err) { console.error('Sponsor error:', err); }
        }
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
      const res = await fetch('/api/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sponsor_code: sponsorData.code,
          sponsor_name: sponsorData.name,
          landing_variant: 'neyro_protocol'
        })
      });
      
      if (res.ok) {
        setTimeout(() => {
          window.location.href = '/neyro/bridge';
        }, 1000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'System error. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
      setIsProcessing(false);
      setStatus('');
    }
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
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', padding: '6px 16px', borderRadius: '100px', marginBottom: '32px' }}>
            <div style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 10px #00ff88', animation: 'pulse 2s infinite' }}></div>
            <span style={{ fontSize: '12px', color: '#00ff88', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>By Invitation Only</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 40px)', fontWeight: '900', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Discover The Automated AI Agent Generating Passive Income <span style={{ color: '#00ff88' }}>24/7.</span>
          </h1>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px', padding: '0 10px' }}>
            Keep 100% control of your funds. Zero technical experience required. Enter your best email below to unlock your exclusive invitation and see how it works.
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
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button 
              type="submit" 
              disabled={isProcessing}
              style={{ 
                background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', 
                color: '#000', 
                height: '60px',
                borderRadius: '16px',
                fontSize: '16px', 
                fontWeight: '900', 
                border: 'none', 
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,255,136,0.2)',
                transition: 'transform 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {isProcessing ? status : 'Unlock My Invitation'}
            </button>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '12px' }}>
              Your secure invitation will be emailed immediately.
            </p>
          </form>

        </div>

      </div>

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
