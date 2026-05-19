'use client';

import { useState, useEffect } from 'react';
import styles from '../finance.module.css';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export default function GatewayCapture() {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [sponsorData, setSponsorData] = useState({ 
    code: '1W145K', 
    name: 'Aurum Corporate'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          landing_variant: 'gateway_capture'
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
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000' }}>
      
      {/* Full Screen Iframe */}
      <iframe 
        src="https://neyro.network/" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          zIndex: 1
        }}
        title="Neyro Live Platform"
      />

      {/* Custom Overlay Header to mask the original Neyro menu */}
      <header className="overlayHeader">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="https://neyro.network/img/logo.svg" alt="Neyro" style={{ height: '28px', filter: 'brightness(0) invert(1)' }} />
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', display: 'block' }}></div>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', textTransform: 'uppercase' }}>Secure Gateway</span>
        </div>

        {/* Toggle Button in Header (Desktop) */}
        {!isSidebarOpen && (
          <button 
            className="toggleBtn desktop-toggle"
            onClick={() => setIsSidebarOpen(true)}
          >
            <ChevronLeft size={20} /> Request Access
          </button>
        )}
      </header>

      {/* Mobile Toggle Button (Bottom Center) */}
      {!isSidebarOpen && (
        <button 
          className="toggleBtn mobile-toggle"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ChevronUp size={20} /> Request Access
        </button>
      )}

      {/* Floating Glassmorphism Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        
        {/* Sidebar Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>Gateway Access</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Invited by: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{sponsorData.name}</span></p>
          </div>
          <button 
            className="closeBtn"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ChevronRight className="desktop-icon" size={20} />
            <ChevronDown className="mobile-icon" size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid rgba(212,175,55,0.3)' }}>
              <Lock size={32} color="#d4af37" />
            </div>
            <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', marginBottom: '12px' }}>Request Secure Link</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6' }}>
              The live trading environment is currently locked. To protect our network, you must request a personalized access link to proceed.
            </p>
          </div>

          <form onSubmit={handleOptIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="email" 
              placeholder="Enter your best email..." 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                background: 'rgba(0,0,0,0.5)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff',
                height: '56px',
                borderRadius: '12px',
                padding: '0 20px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s'
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
                height: '56px',
                borderRadius: '12px',
                fontSize: '16px', 
                fontWeight: '900', 
                border: 'none', 
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                transition: 'transform 0.2s',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {isProcessing ? status : 'Send Me The Link'}
            </button>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '8px' }}>
              Your secure access link will be emailed immediately.
            </p>
          </form>

        </div>

      </div>

      <style jsx>{`
        .overlayHeader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(20px) saturate(150%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          z-index: 40;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* Desktop Defaults */
        .sidebar {
          position: absolute;
          top: 0;
          right: -450px;
          width: 100%;
          max-width: 420px;
          height: 100%;
          background: rgba(10, 10, 15, 0.6);
          backdrop-filter: blur(20px) saturate(150%);
          border-left: 1px solid rgba(255,255,255,0.1);
          z-index: 100;
          transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          box-shadow: -20px 0 60px rgba(0,0,0,0.5);
        }

        .sidebar.open {
          right: 0;
        }

        .toggleBtn {
          background: linear-gradient(135deg, #d4af37, #f1c40f);
          border: none;
          padding: 10px 20px;
          border-radius: 100px;
          color: #000;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(212,175,55,0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-toggle {
          display: none;
        }

        .closeBtn {
          background: rgba(255,255,255,0.05);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .closeBtn:hover {
          background: rgba(255,255,255,0.1);
        }

        .mobile-icon {
          display: none;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .overlayHeader {
            padding: 0 20px;
          }
          
          .desktop-toggle {
            display: none;
          }

          .mobile-toggle {
            display: flex;
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 50;
            white-space: nowrap;
          }

          .sidebar {
            max-width: 100%;
            height: auto;
            max-height: 85vh;
            top: auto;
            bottom: 0;
            right: 0;
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.1);
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 -20px 60px rgba(0,0,0,0.5);
          }
          
          .sidebar.open {
            transform: translateY(0);
          }

          .desktop-icon {
            display: none;
          }
          .mobile-icon {
            display: block;
          }
        }
      `}</style>
    </main>
  );
}
