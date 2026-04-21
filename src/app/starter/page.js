'use client';

import { useState, useEffect } from 'react';
import styles from '../finance.module.css';
import { Check, AlertCircle, ArrowRight, User, Mail, Globe, Shield, Smartphone } from 'lucide-react';

export default function StarterFunnel() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [sponsorData, setSponsorData] = useState({ 
    code: '1W145K', 
    name: 'Aurum Corporate', 
    url: 'https://backoffice.aurum.foundation/auth/sign-up?ref=1W145K' 
  });

  useEffect(() => {
    const resolveSponsor = async () => {
      const stored = localStorage.getItem('aurum_affiliate');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSponsorData(parsed);
          return;
        } catch (e) {
          localStorage.removeItem('aurum_affiliate');
        }
      }

      try {
        const res = await fetch('/api/rotator?funnel=starter');
        if (res.ok) {
          const data = await res.json();
          setSponsorData(data);
          localStorage.setItem('aurum_affiliate', JSON.stringify(data));
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
    setStatus('GENERATING YOUR GUIDE...');
    
    try {
      const res = await fetch('/api/optin', {
        method: 'POST',
        body: JSON.stringify({ 
          email: formData.email, 
          first_name: formData.name || 'Friend',
          sponsor_code: sponsorData.code,
          sponsor_name: sponsorData.name,
          landing_variant: 'starter'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        setStatus('SUCCESS! REDIRECTING...');
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 1000);
      } else {
        throw new Error('Capture failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('ERROR: REDIRECTING...');
      window.location.href = '/onboarding';
    }
  };

  return (
    <main className={styles.main} style={{ background: '#050505', color: '#fff', minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '60px 20px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ 
            background: '#d4af37', 
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
            Financial Freedom Starter Kit
          </div>
          
          <h1 style={{ fontSize: '38px', fontWeight: '950', lineHeight: '1.05', marginBottom: '20px', color: '#fff' }}>
            Get Your FREE Aurum Starter Guide + Instant Backoffice Access
          </h1>
          
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', fontWeight: '500', marginBottom: '40px', lineHeight: '1.4' }}>
            AI Trading Bots • Real Daily Results • Partner Program Explained
          </p>
          
          <div style={{ 
            background: 'rgba(20, 20, 20, 0.6)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.3)', 
            padding: '32px 24px', 
            borderRadius: '28px', 
            marginBottom: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <p style={{ fontSize: '13px', color: '#00ff88', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📍 Limited free guides sent today in Pakistan, Indonesia & India
            </p>
            
            <form onSubmit={handleOptIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>Enter your email to get the FREE guide instantly</h3>
              <input 
                type="email" 
                placeholder="Institutional Email Address" 
                required 
                className={styles.modalInput}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#fff',
                  height: '56px',
                  borderRadius: '14px'
                }}
              />
              <button 
                type="submit" 
                className={styles.primaryCta} 
                style={{ 
                  background: '#d4af37', 
                  color: '#000', 
                  width: '100%', 
                  height: '64px',
                  fontSize: '18px', 
                  fontWeight: '900', 
                  border: 'none', 
                  boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
                  textTransform: 'uppercase'
                }}
              >
                {isProcessing ? status : 'SEND ME THE FREE GUIDE NOW'}
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>🛡️ Zero Spam</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>⚡ Instant Delivery</span>
              </div>
            </form>
          </div>

          <button 
            onClick={() => window.location.href = '/onboarding'}
            style={{ 
              background: 'transparent', 
              border: '2px solid rgba(255,255,255,0.1)', 
              color: 'rgba(255,255,255,0.6)', 
              padding: '20px 32px', 
              borderRadius: '20px', 
              width: '100%', 
              fontWeight: '800',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Skip & Go Straight to Onboarding Guide →
          </button>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0, fontWeight: '600', letterSpacing: '0.5px' }}>
          🌎 JOINED BY 18,000+ PARTNERS WORLDWIDE • TRUSTED IN PAKISTAN • INDONESIA • INDIA • PHILIPPINES • BRAZIL • NIGERIA
        </p>
      </div>

      {/* Results Teaser */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '12px', color: '#fff' }}>Here’s what my EX-AI and ZEUS bots are doing right now…</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '48px', fontSize: '16px' }}>Real-time performance captured from my personal institutional dashboard.</p>
        
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '32px', margin: '0 -20px', padding: '0 20px', scrollSnapType: 'x mandatory', alignItems: 'stretch' }}>
          <BotEarningsBadge />
          <ResultCard 
            src="/images/aurum_result_1.png" 
            title="EX-AI BOT" 
            badge="DAILY PERFORMANCE"
            result="+$14.82 Today"
          />
          <ResultCard 
            src="/images/aurum_result_2.png" 
            title="ZEUS BOT" 
            badge="CONSISTENT YIELD"
            result="+$8.40 Today"
          />
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 20px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '900', marginBottom: '48px' }}>How It Works (3 simple steps)</h2>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <StepCard 
            num="01" 
            title="Activate for only $20/year" 
            desc="One small annual license unlocks the entire AI ecosystem and global card network." 
          />
          <StepCard 
            num="02" 
            title="AI bots run 24/7" 
            desc="No trading experience required. Our algorithms scan global gaps and capture yield while you sleep." 
          />
          <StepCard 
            num="03" 
            title="Profit & Partner Program" 
            desc="Earn from automated bot results + generational commissions from the multi-level partner program." 
          />
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 20px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '32px', textAlign: 'center' }}>Institutional Benefits</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <BenefitItem text="Real AI-powered trading bots (EX-AI + ZEUS)" />
          <BenefitItem text="NeoBank + global crypto cards" />
          <BenefitItem text="Generous multi-level partner commissions" />
          <BenefitItem text="Full backoffice transparency & live tracking" />
          <BenefitItem text="Beginner-friendly activation (No experience needed)" />
        </div>
      </section>

      {/* Video Content */}
      <section style={{ padding: '80px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '32px' }}>Full System Deep-Dive</h2>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            <iframe 
              src="https://www.youtube.com/embed/WmlQRcubvR4" 
              title="Aurum System Overview" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{ width: '100%', height: '100%' }}
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 20px', maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '48px', textAlign: 'center', fontSize: '32px', fontWeight: '900' }}>Common Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: '#d4af37', fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>Q: How much does it cost to start?</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>A: Only $20/year for the subscription license. This gives you full access to the bots, card ordering, and the referral program.</p>
          </div>
          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: '#d4af37', fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>Q: Is this system safe?</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>A: Always do your own research. I only promote what I personally use with my own capital. The system is built for long-term sustainability.</p>
          </div>
        </div>
      </section>

      {/* Final CTA / Disclaimer */}
      <section style={{ padding: '100px 20px', textAlign: 'center', background: 'linear-gradient(0deg, rgba(212, 175, 55, 0.08) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '950', marginBottom: '32px' }}>Secure Your Slot Today</h2>
          
          <form onSubmit={handleOptIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <input 
              type="email" 
              placeholder="Your Best Email" 
              required 
              className={styles.modalInput}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ background: 'rgba(255,255,255,0.05)', height: '56px' }}
            />
            <button 
              type="submit" 
              className={styles.primaryCta} 
              style={{ background: '#d4af37', color: '#000', width: '100%', height: '64px', fontSize: '18px', fontWeight: '900' }}
            >
              SEND ME THE FREE GUIDE NOW
            </button>
          </form>

          <button 
            onClick={() => window.location.href = '/onboarding'}
            style={{ 
              background: 'transparent', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: 'rgba(255,255,255,0.4)', 
              padding: '16px', 
              borderRadius: '14px', 
              width: '100%',
              fontSize: '14px',
              fontWeight: '700'
            }}
          >
            Skip to Onboarding Guide →
          </button>

          <div style={{ 
            marginTop: '80px', 
            padding: '32px', 
            background: 'rgba(10, 10, 10, 0.8)', 
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px', 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.3)', 
            textAlign: 'left', 
            lineHeight: '1.8' 
          }}>
            <p style={{ fontWeight: '800', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontSize: '14px' }}>#AD DISCLOSURE & RISK WARNING</p>
            This is an affiliate link. If you activate through my link I may earn a commission at no extra cost to you. 
            Past performance is not indicative of future results. Only invest what you can afford to lose. 
            Cryptocurrency markets contain inherent risks. Use the Aurum software as an automated tool, not a financial guarantee.
          </div>
        </div>
      </section>

    </main>
  );
}

function ResultCard({ src, title, badge, result }) {
  return (
    <div style={{ 
      minWidth: '280px', 
      background: 'rgba(255,255,255,0.02)', 
      borderRadius: '24px', 
      padding: '20px', 
      border: '1px solid rgba(255,255,255,0.05)',
      scrollSnapAlign: 'center'
    }}>
      <div style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
         <img src={src} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '10px', color: '#d4af37', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{badge}</span>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>{title}</h4>
        </div>
        <div style={{ fontSize: '14px', fontWeight: '900', color: '#00ff88' }}>{result}</div>
      </div>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontSize: '60px', fontWeight: '900', color: 'rgba(212, 175, 55, 0.05)', position: 'absolute', top: '-10px', right: '-10px' }}>{num}</div>
      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#d4af37', marginBottom: '12px' }}>{title}</h3>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>{desc}</p>
    </div>
  );
}

const BotEarningsBadge = () => {
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch('/api/aurum-bot');
        if (!res.ok) throw new Error('Bot proxy fail');
        const data = await res.json();
        if (data && data.bot && data.bot !== "N/A") {
          setEarnings(data.bot);
        }
      } catch (err) {
        console.error('Earnings fetch error:', err);
      }
    };
    fetchEarnings();
    const interval = setInterval(fetchEarnings, 600000);
    return () => clearInterval(interval);
  }, []);

  if (!earnings) return (
    <div style={{ minWidth: '280px', height: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>SYNCHRONIZING DATA...</span>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 1s ease-out', minWidth: '280px' }}>
      <div style={{ 
        height: '100%',
        background: 'rgba(10, 10, 10, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        textAlign: 'center'
      }}>
        <div style={{ width: '100%' }}>
          <div style={{ 
            width: '100%', 
            height: '150px', 
            borderRadius: '16px', 
            overflow: 'hidden',
            marginBottom: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <img 
              src="/images/aurum_exai_bot_promo.png" 
              alt="Aurum EX-AI Bot" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 8px #00ff88', animation: 'aurumPulseDot 2s infinite' }}></div>
            <span style={{ fontSize: '11px', color: '#00ff88', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>EX-AI BOT ACTIVE</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Data Pulse</span>
          <span style={{ fontSize: '48px', color: '#00ff88', fontWeight: '950', textShadow: '0 0 20px rgba(0,255,136,0.4)', lineHeight: '1' }}>{earnings}</span>
        </div>

        <div style={{ 
          width: '100%', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '14px', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Algorithm</span>
            <span style={{ color: '#fff', fontWeight: '700' }}>NEURAL-X v4.2</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Last Update</span>
            <span style={{ color: 'rgba(0, 255, 136, 0.8)', fontWeight: '700' }}>JUST NOW</span>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes aurumPulseDot {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  )
}

function BenefitItem({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ color: '#00ff88' }}><Check size={20} strokeWidth={4}/></div>
      <span style={{ fontSize: '16px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>{text}</span>
    </div>
  );
}
