'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';
import { Gift, ShieldCheck, Zap, Lock, Shield, Globe } from 'lucide-react';
import OptInBadge from '@/components/OptInBadge';

// ─── VIBRANT THEME PALETTE ────────────────────────────────────────────────────
// Primary:  #ff6b35  (hot coral / electric orange)
// Accent:   #c026d3  (deep violet / fuchsia)
// Glow:     #ff3cac  (hot pink)
// BG:       #0a0010  (ultra-deep violet-black)
// ─────────────────────────────────────────────────────────────────────────────

const THEME = {
  primary: '#ff6b35',
  accent: '#c026d3',
  glow: '#ff3cac',
  bg: '#0a0010',
  bgCard: 'rgba(20, 0, 30, 0.7)',
  border: 'rgba(192, 38, 211, 0.25)',
  highlight: 'linear-gradient(135deg, #ff6b35 0%, #c026d3 100%)',
  barBg: 'linear-gradient(90deg, #ff6b35, #c026d3)',
};

const PayItForwardAngleV2 = ({ project, handleOptIn, isProcessing, status }) => {
  const { content = {} } = project;
  const [fundingPool, setFundingPool] = useState(8400);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setFundingPool(p => p > 100 ? p - Math.floor(Math.random() * 100) : p);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOptIn(formData);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB').split('/').join('.');

  return (
    <main style={{ background: THEME.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#fff' }}>

      {/* ── Announcement Bar ─────────────────────────────────────────────── */}
      <div style={{ background: THEME.barBg, padding: '12px', textAlign: 'center', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', color: '#fff' }}>
        🔥 Today&apos;s Funding Pool: ${fundingPool.toLocaleString()} Remaining
      </div>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '80px 24px' }}>

        {/* Background video */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,0,16,0.92) 0%, rgba(192,38,211,0.12) 100%)', zIndex: 1 }} />
          <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }}>
            <source src={content.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-futuristic-digital-connection-technology-background-40432-large.mp4"} type="video/mp4" />
          </video>
        </div>

        {/* Radial glow orbs */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', background: `radial-gradient(circle, rgba(192,38,211,0.15) 0%, transparent 70%)`, zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-50px', right: '-100px', width: '500px', height: '500px', background: `radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)`, zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>

          {/* Badge */}
          <div style={{ display: 'inline-block', background: 'rgba(192,38,211,0.15)', border: '1px solid rgba(192,38,211,0.4)', borderRadius: '100px', padding: '8px 20px', fontSize: '12px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#ff3cac', marginBottom: '32px' }}>
            🎁 Limited to 1,000 accounts this week
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
            The First $100 On Us – <br/>
            <span style={{ background: THEME.highlight, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Start Trading with Zero Risk
            </span>
          </h1>

          <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto 40px', textAlign: 'left' }}>
            <p style={{ marginBottom: '16px' }}>
              We&apos;re giving you <strong>$100 in real trading capital</strong> so you can test our <strong>non-custodial AI trading agent (Quantum Alpha)</strong> completely risk-free.
            </p>
            <p style={{ marginBottom: '24px' }}>
              Watch the AI trade 24/7 on-chain while you keep full control of the funds.
            </p>
            
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '800', color: THEME.primary, marginBottom: '12px', fontSize: '16px' }}>Recent Performance (May 2026):</h3>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '15px' }}>
                <li style={{ marginBottom: '8px' }}>• Quantum Alpha: <strong>+1.03%</strong> in one day | <strong>+18.12%</strong> since start of month</li>
                <li style={{ marginBottom: '8px' }}>• 16,579 total deals executed</li>
                <li>• 55% win rate</li>
              </ul>
            </div>
            
            {/* Performance Images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', marginBottom: '48px', marginTop: '16px' }}>
              <img 
                src="/proof1.jpg" 
                alt="Performance Stats" 
                style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
              />
              <img 
                src="/proof2.png" 
                alt="Daily Performance" 
                style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
              />
              <img 
                src="/proof3.png" 
                alt="Performance Dashboard" 
                style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
              />
            </div>
            
            <h3 style={{ fontWeight: '800', marginBottom: '16px', fontSize: '20px', color: '#fff', textAlign: 'center' }}>What You Get:</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: '0 auto 32px', fontSize: '16px', maxWidth: '400px' }}>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><Gift size={18} style={{ color: THEME.primary, marginRight: '12px' }}/> $100 starting capital (non-custodial – stays in your wallet)</li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><Zap size={18} style={{ color: THEME.primary, marginRight: '12px' }}/> Access to <strong>Quantum Alpha</strong> AI trading agent</li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}><Globe size={18} style={{ color: THEME.primary, marginRight: '12px' }}/> Live performance tracking</li>
              <li style={{ display: 'flex', alignItems: 'center' }}><Shield size={18} style={{ color: THEME.primary, marginRight: '12px' }}/> Full transparency on-chain</li>
            </ul>

            <h3 style={{ fontWeight: '800', fontSize: '20px', color: '#fff', textAlign: 'center', marginBottom: '24px' }}>Ready to see the AI work?</h3>
          </div>

          {/* ── Opt-In Form (Moved Up) ────────────────────────────────────────────── */}
          <div style={{ maxWidth: '900px', width: '90%', margin: '0 auto 48px', display: 'flex', justifyContent: 'center' }}>
            <OptInBadge 
              onOptIn={handleOptIn} 
              isProcessing={isProcessing} 
              status={status}
              wide={true}
              minimal={true}
              angle="pay-it-forward"
            />
          </div>

          {/* "Why" Section */}
          <div style={{ background: THEME.bgCard, backdropFilter: 'blur(20px)', border: `1px solid ${THEME.border}`, borderRadius: '24px', padding: '40px', marginBottom: '48px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '32px', textAlign: 'center', color: '#fff' }}>Why We&apos;re Giving Away $100</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
              {[
                { icon: <ShieldCheck size={32} />, title: 'Zero Risk for You', desc: "We put up the starting capital. You don’t risk any of your own money to test it." },
                { icon: <Zap size={32} />, title: 'See Real Results First', desc: "Experience how the AI finds opportunities in the market before you ever add your own funds." },
                { icon: <Gift size={32} />, title: 'True Pay-It-Forward', desc: "We’d rather invest in new users succeeding than spend money on ads." },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ color: THEME.primary, marginBottom: '16px' }}>{item.icon}</div>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scarcity & Trust Signals */}
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '32px' }}>
              <span style={{ color: THEME.primary }}>Limited Offer</span> – Once today&apos;s pool is gone, it&apos;s gone.<br/>
              Only 1,000 accounts this round.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}><Lock size={14} style={{ marginRight: '6px' }} /> Non-custodial: Your keys, your funds</div>
              <div style={{ display: 'flex', alignItems: 'center' }}><ShieldCheck size={14} style={{ marginRight: '6px' }} /> On-chain execution</div>
              <div style={{ display: 'flex', alignItems: 'center' }}><Globe size={14} style={{ marginRight: '6px' }} /> Canadian registered company</div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 12px' }}>
          The $100 credit is a starting capital allocation within the Aurum Ecosystem. Terms and conditions apply. Funding is subject to availability of the daily pool.
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>© 2026 {project.name}. All rights reserved.</p>
      </footer>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: rgba(192, 38, 211, 0.5) !important;
        }
        input::placeholder {
          color: rgba(255,255,255,0.15);
        }
      `}</style>
    </main>
  );
};

export default PayItForwardAngleV2;
