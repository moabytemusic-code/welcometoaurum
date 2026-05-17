'use client';

import { useState, useEffect } from 'react';
import styles from '../finance.module.css';
import { Shield } from 'lucide-react';

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
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://neyro.network/img/bg_og.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2, zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>

      <header style={{ position: 'relative', zIndex: 10, padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="https://neyro.network/img/logo.svg" alt="Neyro" style={{ height: '32px', filter: 'brightness(0) invert(1)' }} />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.6)' }}>
          Invited by: <span style={{ color: '#00ff88' }}>{sponsorData.name}</span>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 10, padding: '20px 20px 80px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start', marginTop: '20px' }}>
        
        {/* Copy Column */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', padding: '6px 12px', borderRadius: '100px', marginBottom: '24px' }}>
            <div style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 10px #00ff88', animation: 'pulse 2s infinite' }}></div>
            <span style={{ fontSize: '11px', color: '#00ff88', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>System Online</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: '950', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
            Meet the Personal AI System That Trades Your Capital <span style={{ color: '#00ff88' }}>24/7.</span>
          </h1>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
            Keep 100% control of your funds. Zero technical experience required. See how you can deploy your own automated trading agent in under 5 minutes.
          </p>

          <form onSubmit={handleOptIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
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
                height: '60px',
                borderRadius: '16px',
                padding: '0 24px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
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
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {isProcessing ? status : 'SHOW ME HOW IT WORKS'}
            </button>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '8px' }}>
              Your data is secure. No spam, ever.
            </p>
          </form>
        </div>

        {/* Visual Mock Dashboard Widget */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            background: 'linear-gradient(145deg, rgba(20,20,20,0.8), rgba(10,10,10,0.95))',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '32px',
            padding: '32px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>NEURAL-X AGENT</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#00ff88', fontWeight: 'bold' }}>ACTIVE</span>
                <div style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 8px #00ff88' }}></div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Daily Yield Avg</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>+1.42%</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Uptime</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#00ff88' }}>99.9%</span>
              </div>
            </div>

            {/* Simulated Sync Feed */}
            <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '16px', padding: '16px', fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,255,136,0.6)' }}>
              <div style={{ marginBottom: '8px' }}>&gt; Analyzing global liquidity gaps...</div>
              <div style={{ marginBottom: '8px' }}>&gt; Strategy: Quantum Alpha running</div>
              <div style={{ color: '#00ff88' }}>&gt; Executing micro-trades... SUCCESS</div>
            </div>
          </div>
          
          {/* Decorative floating elements */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '12px', borderRadius: '16px', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="#d4af37" />
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#d4af37' }}>100% Non-Custodial</span>
          </div>
        </div>

      </section>

      {/* 3-Step Frictionless Framework */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 20px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.02))', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '60px' }}>Start in 3 Simple Steps</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(0,255,136,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#00ff88' }}>
                <span style={{ fontSize: '20px', fontWeight: '900' }}>1</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Secure Connection</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>Activate your account securely from anywhere in the world. (VPN may be required for NA users).</p>
            </div>

            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(0,255,136,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#00ff88' }}>
                <span style={{ fontSize: '20px', fontWeight: '900' }}>2</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Connect Your Fund</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>Link a minimum $250 starting fund via a secure Web3 wallet. You never hand over your capital.</p>
            </div>

            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(0,255,136,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#00ff88' }}>
                <span style={{ fontSize: '20px', fontWeight: '900' }}>3</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Activate AI</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>Flip the switch and let the algorithm do the heavy lifting while you monitor the daily yield.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 900px) {
          section {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          form {
            margin: 0 auto;
          }
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
      `}</style>
    </main>
  );
}
