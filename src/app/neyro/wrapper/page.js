'use client';

import { useState, useEffect } from 'react';
import styles from '../../finance.module.css';
import { ChevronRight, ChevronLeft, Shield, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function NeyroWrapper() {
  const [sponsorData, setSponsorData] = useState({ 
    code: '1W145K', 
    name: 'Aurum Corporate'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // If on mobile, start with the sidebar closed so they can see the site
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }

    const resolveSponsor = async () => {
      try {
        const res = await fetch('/api/rotator?funnel=neyro-wrapper');
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
            <ChevronLeft size={20} /> View Setup Guide
          </button>
        )}
      </header>

      {/* Mobile Toggle Button (Bottom Center) */}
      {!isSidebarOpen && (
        <button 
          className="toggleBtn mobile-toggle"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ChevronUp size={20} /> View Setup Guide
        </button>
      )}

      {/* Floating Glassmorphism Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        
        {/* Sidebar Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>Quick Setup Guide</h2>
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', padding: '16px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Shield size={18} color="#00ff88" />
              <h3 style={{ color: '#00ff88', fontSize: '14px', fontWeight: '800' }}>1. Prepare Funds & Wallet</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.5' }}>
              Free to explore. To activate AI: <strong>$19.99/yr fee</strong> + min <strong>$250 USD</strong> starting fund. Keep crypto in a Web3 wallet (like Trust Wallet) for gas fees.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>2</div>
              <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '800' }}>VPN Required (NA Only)</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.5' }}>
              If in US, CA, or MX, you must use a VPN set to <strong>Europe or Asia</strong> to register.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={18} color="#d4af37" />
              <h3 style={{ color: '#d4af37', fontSize: '14px', fontWeight: '800' }}>3. Create Official Account</h3>
            </div>
            <ul style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: '1.6', margin: 0, paddingLeft: '16px' }}>
              <li>Your sponsor code is pre-filled.</li>
              <li>Under Profile, set phone and country to <strong>"CRYPTONATION"</strong>.</li>
              <li>Verify your email to finalize.</li>
            </ul>
          </div>

        </div>

        {/* Sticky Footer CTA */}
        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.5)' }}>
          <a 
            href={`https://backoffice.aurum.foundation/register?ref=${sponsorData.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="registerBtn"
          >
            Register via Sponsor
          </a>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '12px' }}>
            Opens Aurum secure portal in a new tab
          </p>
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
          background: rgba(10, 10, 15, 0.5);
          backdrop-filter: blur(12px) saturate(150%);
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
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          border: none;
          padding: 10px 20px;
          border-radius: 100px;
          color: #000;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,255,136,0.3);
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

        .registerBtn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #d4af37, #f1c40f);
          color: #000;
          font-weight: 900;
          font-size: 16px;
          text-transform: uppercase;
          border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(212,175,55,0.3);
          transition: transform 0.2s;
        }
        .registerBtn:hover {
          transform: translateY(-2px);
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
