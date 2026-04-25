'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';
import { Gift, ShieldCheck, Zap, Lock, Shield, Globe } from 'lucide-react';

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
        🔥 Live Funding Pool: ${fundingPool.toLocaleString()} Remaining — Claim Yours Now
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
            🎁 Limited Time Offer — 1,000 Accounts Only
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
            Claim Your Free{' '}
            <span style={{ background: THEME.highlight, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              $100 Starting Capital.
            </span>
          </h1>

          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto 40px' }}>
            {content.subtitle || "We're funding 1,000 accounts with $100 to prove our AI generates at least $1/day on autopilot. No risk. No strings."}
          </p>

          {/* "Why" Section */}
          <div style={{ background: THEME.bgCard, backdropFilter: 'blur(20px)', border: `1px solid ${THEME.border}`, borderRadius: '24px', padding: '40px', marginBottom: '48px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '28px', textAlign: 'center', color: '#fff' }}>Why are we giving away $100?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
              {[
                { icon: <Gift size={28} />, title: 'Zero Risk', desc: "The hardest part of getting started is the first step. We've removed that completely by giving you the money to start." },
                { icon: <ShieldCheck size={28} />, title: 'See It To Believe It', desc: "We want you to watch the AI actually make money with our capital before you ever risk a single penny of your own." },
                { icon: <Zap size={28} />, title: 'Win-Win Partnership', desc: "Our community grows when people win. Instead of paying for ads, we put that money directly into your account." },
              ].map(item => (
                <div key={item.title}>
                  <div style={{ color: THEME.primary, marginBottom: '12px' }}>{item.icon}</div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>{item.title}</h4>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Opt-In Form ───────────────────────────────────────────────── */}
          <div style={{ background: THEME.bgCard, backdropFilter: 'blur(40px)', border: `1px solid ${THEME.border}`, borderRadius: '32px', padding: '48px', position: 'relative', overflow: 'hidden' }}>
            {/* Accent stripe */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: THEME.highlight }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '4px', color: THEME.primary, marginBottom: '8px' }}>AURUM</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>Secure Claim Portal</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ width: '6px', height: '6px', background: THEME.primary, borderRadius: '50%', boxShadow: `0 0 10px ${THEME.primary}` }} />
                <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>SECURE NODE: {dateStr}</span>
              </div>
            </div>

            {!isProcessing ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: '420px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <Globe size={12} /> Your Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', height: '56px', padding: '0 20px', borderRadius: '16px', fontSize: '15px', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(192,38,211,0.2)`, color: '#fff', textAlign: 'center', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      maxWidth: '420px',
                      height: '64px',
                      fontSize: '16px',
                      fontWeight: '900',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      background: THEME.highlight,
                      color: '#fff',
                      boxShadow: `0 15px 45px rgba(255, 107, 53, 0.35)`,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 20px 60px rgba(255,107,53,0.5)`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 15px 45px rgba(255,107,53,0.35)`; }}
                  >
                    Claim My Free $100 →
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.3)' }}>
                      <Lock size={12} /> 256-BIT ENCRYPTION
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', color: THEME.primary }}>
                      <Shield size={12} /> NO CREDIT CARD REQUIRED
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', border: `3px solid rgba(255,255,255,0.1)`, borderTop: `3px solid ${THEME.primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 32px' }} />
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase' }}>{status || 'PROCESSING CLAIM...'}</span>
                <br />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>AUTHORIZED SESSION IN PROGRESS</span>
              </div>
            )}
          </div>

          {/* Proof line */}
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
            {content.ctaProof || '✓ Verified: $8,400 remaining in today\'s funding pool'}
          </p>
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
