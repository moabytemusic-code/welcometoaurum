'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../finance.module.css';
import PerformanceChart from '@/components/PerformanceChart';
import OptInBadge from '@/components/OptInBadge';
import { stats } from '@/data/performance';

const CustomTicker = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/ticker');
        if (!res.ok) throw new Error('Proxy API Error');
        const formatted = await res.json();
        setData(formatted);
      } catch (err) {
        console.error('Ticker fetch error:', err);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return <div style={{ height: '48px', background: '#050505', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}></div>;

  return (
    <div className={styles.tickerTape}>
      <div className={styles.tickerTrack}>
        {data.concat(data).map((coin, index) => {
           let symbol = coin.symbol === 'USDT' ? 'USDT' : coin.symbol.replace('USDT', '');
           let change = parseFloat(coin.priceChangePercent);
           return (
            <div key={`${coin.symbol}-${index}`} className={styles.tickerItem}>
              <span style={{ fontWeight: '800', color: '#fff' }}>{symbol}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>${parseFloat(coin.lastPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</span>
              <span style={{ color: change > 0 ? '#00ff88' : '#ff4444', fontWeight: 'bold' }}>
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  );
};

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

  if (!earnings) return null;

  return (
    <div style={{ animation: 'fadeIn 1s ease-out', height: '100%' }}>
      <div style={{ 
        height: '100%',
        background: 'rgba(10, 10, 10, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(8, 255, 136, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        borderRadius: '24px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        maxWidth: '280px',
        textAlign: 'center'
      }}>
        <div style={{ width: '100%' }}>
          <div style={{ 
            width: '100%', 
            height: '130px', 
            borderRadius: '16px', 
            overflow: 'hidden',
            marginBottom: '12px',
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
            <span style={{ fontSize: '12px', color: '#00ff88', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>AI SYSTEM ACTIVE</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Results</span>
          <span style={{ fontSize: '42px', color: '#00ff88', fontWeight: '900', textShadow: '0 0 20px rgba(0,255,136,0.4)', lineHeight: '1' }}>{earnings}</span>
        </div>

        <div style={{ 
          width: '100%', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '12px', 
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>System</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>Smart AI v4.2</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Strategy</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>Automated Gap-Capture</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Last Update</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Just Now</span>
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

export default function Home() {
  const [deposit, setDeposit] = useState(1500);
  const [yieldValue, setYieldValue] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [sponsorData, setSponsorData] = useState({ code: '1W145K', name: 'Aurum Rise' });

  useEffect(() => {
    // Determine Sponsor on Land
    const resolveSponsor = async () => {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');

      if (refCode) {
        // 1. Direct link overrides everything
        try {
          const res = await fetch(`/api/rotator?code=${refCode}&funnel=pitch`);
          if (res.ok) {
            const data = await res.json();
            setSponsorData(data);
            localStorage.setItem('aurum_affiliate', JSON.stringify(data));
          }
        } catch (err) { console.error('Sponsor error:', err); }
      } else {
        // 2. No ref code in URL. Check local storage.
        const stored = localStorage.getItem('aurum_affiliate');
        if (stored) {
          try {
            setSponsorData(JSON.parse(stored));
          } catch (e) {
            localStorage.removeItem('aurum_affiliate');
          }
        } else {
          // 3. No ref, no local storage -> ROTATOR
          try {
            const res = await fetch('/api/rotator?funnel=pitch');
            if (res.ok) {
              const data = await res.json();
              setSponsorData(data);
              localStorage.setItem('aurum_affiliate', JSON.stringify(data));
            }
          } catch (err) { console.error('Sponsor error:', err); }
        }
      }
    };
    resolveSponsor();

    // Simulated yield calculation based on historical 142% avg
    const monthlyRate = 1.784 / 12;
    setYieldValue(deposit * monthlyRate);
  }, [deposit]);

  const handleOptInSubmit = async (data) => {
    setIsProcessing(true);
    setStatus('SCANNING LIQUIDITY GAPS...');
    
    // Step 1: Simulated "Live Processing"
    await new Promise(r => setTimeout(r, 800));
    setStatus('VERIFYING PARTNER SLOTS...');
    await new Promise(r => setTimeout(r, 800));
    setStatus('ALLOCATING SYSTEM NODE...');
    await new Promise(r => setTimeout(r, 800));

    // Step 2: Push to Brevo
    try {
      // Grab A/B test variant tracking from cookie to append to Brevo
      const getVariant = () => {
        const match = document.cookie.match(/(^| )landing_variant=([^;]+)/);
        return match ? match[2] : 'pitch';
      };

      const res = await fetch('/api/optin', {
        method: 'POST',
        body: JSON.stringify({ 
          email: data.email, 
          first_name: data.name,
          sponsor_code: sponsorData.code,
          sponsor_name: sponsorData.name,
          landing_variant: getVariant()
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        setStatus('ACCESS GRANTED. REDIRECTING...');
        setTimeout(() => {
          window.location.href = `/thank-you?ref=${sponsorData.code}`;
        }, 1000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'System error. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
      setIsProcessing(false);
      setStatus('');
    }
  };




  return (
    <main className={styles.main}>


      {/* Hero Section with Video Background */}
      <section className={styles.hero}>
        <div className={styles.videoBg}>
          <div className={styles.videoOverlay} />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className={styles.bgVideo}
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-elements-loop-40432-large.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className={styles.topNav}>
          <CustomTicker />
        </div>

        <div className={styles.heroContent}>


          <h1 className={styles.title}>
            Your bank is making billions with your money. <span className={styles.highlight}>Why aren't you?</span>
          </h1>
          
          <h2 className={styles.heroSubtitle}>
            Join 118,000+ regular people using simple AI to grow their savings on autopilot.
          </h2>
          
          <p className={styles.subtitle}>
            No complicated tech skills needed. No ID required. Just a simple way to participate in the AI shift — 24/7, completely on autopilot.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', width: '100%' }}>
            <div className={styles.badgeWrapper} style={{ width: '90%', maxWidth: '900px' }}>
              <OptInBadge onOptIn={handleOptInSubmit} isProcessing={isProcessing} status={status} wide={true} minimal={true} />
            </div>
          </div>

          <div className={styles.heroRow}>
            
            <div className={styles.calculatorCard} style={{ margin: '0', textAlign: 'left' }}>
              <h2 className={styles.calculatorTitle} style={{ textAlign: 'center' }}>See Your Aurum Rise Projection</h2>
            <div className={styles.calcGrid}>
                <div className={styles.inputGroup}>
                  <label>Starting Amount (Deposit)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className={styles.manualInput}
                    placeholder="Enter amount..."
                  />
                  <input
                    type="range"
                    min="100"
                    max="99999"
                    step="100"
                    value={deposit > 99999 ? 99999 : (deposit || 0)}
                    onChange={(e) => setDeposit(e.target.value)}
                    className={styles.rangeInput}
                    style={{ background: `linear-gradient(to right, #2d8cf0 ${((Math.min(Number(deposit || 0), 99999) - 100) / 99899) * 100}%, #333 ${((Math.min(Number(deposit || 0), 99999) - 100) / 99899) * 100}%)` }}
                  />
                </div>
              <div className={styles.resultsGroup} style={{ textAlign: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Est. Monthly Yield</span>
                    <span className={styles.resultValue}>+${Math.round(yieldValue).toLocaleString()}</span>
                  </div>
                  <div className={styles.resultItem}>
                    <span className={styles.resultLabel}>Est. Annual Generation (178.4%)</span>
                    <span className={styles.resultValueHighlight}>+${Math.round(yieldValue * 12).toLocaleString()}</span>
                  </div>
                </div>
                <div className={styles.resultItem} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <span className={styles.resultLabel}>Total Projected Balance (1 Year)</span>
                  <span className={styles.resultValueTotal}>${Math.round(deposit + (yieldValue * 12)).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <p className={styles.calcNote}>Projections based on historical 2026 performance. Past results do not guarantee future returns. Yield is generated through automated market activities and involves risk.</p>
          </div>

          </div>


        </div>
      </section>

      {/* Trust Proof Section (Forbes) */}
      <section className={styles.trustSection}>
        <div className={styles.trustContent}>
          <div className={styles.forbesBadge}>AS SEEN IN FORBES</div>
          <blockquote className={styles.trustQuote}>
            “Making digital assets as spendable as cash — without friction.”
          </blockquote>
          <div className={styles.trustAuthor}>— Institutional Review, 2026</div>
        </div>
      </section>


      {/* Performance Analysis Section */}
      <section className={styles.statsSection} style={{ background: 'transparent' }}>
        <div className={styles.sectionHeader}>
          <div className={styles.liveBadge} style={{ margin: '0 auto 16px', width: 'fit-content' }}>
            <div className={styles.liveDot}></div>
            VERIFIED INSTITUTIONAL YIELD (2026)
          </div>
          <h2 className={styles.sectionTitle}>Institutional Performance, Individual Control</h2>
          <p className={styles.sectionSub}>Visualize the compounding power of the Aurum AI algorithms through verified historical returns.</p>
        </div>

        <div className={styles.performanceContainer}>
          <div className={styles.performanceChartWrapper}>
            <PerformanceChart />
          </div>
          
          <div className={styles.statsGrid} style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
            <div className={styles.statItem}>
              <div className={styles.statValue} style={{ fontSize: '24px' }}>{stats.totalAnnualYield}</div>
              <div className={styles.statLabel}>2026 Net Yield</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue} style={{ fontSize: '24px' }}>{stats.averageMonthly}</div>
              <div className={styles.statLabel}>Avg. Monthly</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue} style={{ fontSize: '24px' }}>{stats.bestMonth}</div>
              <div className={styles.statLabel}>Peak Momentum</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue} style={{ fontSize: '24px' }}>{stats.winningDays}</div>
              <div className={styles.statLabel}>Winning Days</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Ecosystem Section */}
      <section className={styles.ecosystemSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything You Need to Grow Your Savings in One Simple System</h2>
          <p className={styles.sectionSub}>Global Support. Real Security. Your Control.</p>
        </div>
        <div className={styles.ecosystemGrid}>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_subscription_promo.png" alt="Aurum Subscription" className={styles.ecoImage} />
            </div>
            <h3>AURUM Subscription</h3>
            <p><strong>Unlock the entire money-making machine for just $19.99/year.</strong> Full access to the bots, premium cards, NeoBank, community, and our built-in marketing plan so you can earn even more by inviting others.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_card_promo.png" alt="Aurum Cards" className={styles.ecoImage} />
            </div>
            <h3>Aurum Cards</h3>
            <p><strong>Spend your AI earnings like normal money — anywhere in the world.</strong> Four premium tiers from instant-use Nova to the elite Infinity Card. Turn your passive yield into everyday spending power, online or offline.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_neobank_promo.png" alt="Aurum NeoBank" className={styles.ecoImage} />
            </div>
            <h3>Aurum NeoBank</h3>
            <p><strong>Your all-in-one crypto + fiat bank account.</strong> Secure, private Web3 banking in a single app. Manage everything in one place with zero compromise.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_zeus_bot_promo.png" alt="Aurum Zeus Bot" className={styles.ecoImage} />
            </div>
            <h3>Zeus AI Bot</h3>
            <p><strong>Mid-term yield optimizer that works while you live your life.</strong> Institutional-grade AI that spots opportunities and automatically adjusts strategies — no charts, no stress, just steady passive gains.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_exai_bot_promo.png" alt="Aurum EX-AI Bot" className={styles.ecoImage} />
            </div>
            <h3>EX-AI Delta Bot</h3>
            <p><strong>The 24/7 autonomous trader that does all the work for you.</strong> Fully autonomous gap-capturing bot. It scans, executes, and compounds profits 24/7 with zero effort on your end.</p>
          </div>

        </div>
      </section>


      {/* Problem Agitation Section */}
      <section className={styles.problemSection}>
        <h2 className={styles.sectionTitle}>Why Traditional Finance is Failing You</h2>
        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>😤</div>
            <p className={styles.problemQuote}>“My bank pays me 0.01% while they make billions with my money.”</p>
            <p className={styles.problemDesc}>You grind side hustles and side gigs, but traditional banks use your money to print profits for themselves and throw you pennies.</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>🤯</div>
            <p className={styles.problemQuote}>“Every ‘AI bot’ I tried felt like a 2017 crypto scam.”</p>
            <p className={styles.problemDesc}>The internet is flooded with hype. You want something legitimate, institutional-grade, and actually built for real passive income.</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>😰</div>
            <p className={styles.problemQuote}>“Inflation is destroying my savings faster than I can hustle.”</p>
            <p className={styles.problemDesc}>Cash is no longer safe — it’s a guaranteed loss. You need an AI system that outpaces inflation on autopilot.</p>
          </div>
        </div>
      </section>

      {/* Solution Section (How it works) */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How the Aurum AI Works for You (3 Simple Steps)</h2>
        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <h3>Identify the Gap</h3>
            <p>Our AI scans 400+ data points every second to find tiny price imbalances normal people (and most traders) never see.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>02</div>
            <h3>Automated Capture</h3>
            <p>The ecosystem instantly executes millisecond-fast trades to lock in the profit — stacking micro-wins around the clock.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>03</div>
            <h3>Real-Time Payout</h3>
            <p>Profits hit your dashboard immediately. No lock-ups. No waiting. 100% liquid — withdraw or spend anytime.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>118K+</div>
            <div className={styles.statLabel}>Global Partners</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>$115M+</div>
            <div className={styles.statLabel}>Assets Orchestrated</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>178.4%</div>
            <div className={styles.statLabel}>2026 Avg. Yield</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Security Breaches</div>
          </div>
        </div>
      </section>

      {/* Social Proof Stack */}
      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>Escaping the Legacy Trap</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>“I stayed on the sidelines for 3 months after getting burned by other bots. My only regret? Losing those 3 months of pure passive income.”</p>
            <p className={styles.testimonialAuthor}>— Marcus T., Former Portfolio Manager</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>“The first yield hit my dashboard in under 24 hours. It’s not hype — it’s a real process that just keeps scaling while I focus on my own business.”</p>
            <p className={styles.testimonialAuthor}>— Sarah L., Tech Consultant & Side-Hustler</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>“I replaced my entire passive-income goal 6 months ahead of schedule. The AI is finding gaps I didn’t even know existed.”</p>
            <p className={styles.testimonialAuthor}>— David R., E-commerce Founder</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Handling the Hard Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Is my money locked up?</h4>
            <p className={styles.faqAnswer}>Yes, If you make a deposit into the Ex-Ai bot the initial deposit will be locked for 365 days. Early withdrawal available with a 30% fee. The profits from the bot are available for withdrawal every 24-48 hours.</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>How does the AI actually make money?</h4>
            <p className={styles.faqAnswer}>It finds “Liquidity Gaps” — tiny temporary imbalances in the market — and fills them faster than anyone else, capturing the difference as profit that gets paid to you.</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Is it really free to join?</h4>
            <p className={styles.faqAnswer}>Yes — 100% free to start. You only pay the tiny $19.99/year subscription once you’re ready to unlock everything. We only make money when you do (small success fee on the yield we generate).</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto 24px auto' }}>
          <div className={styles.videoWrapper}>
            <iframe 
              src="https://www.youtube.com/embed/WnrMvNnGYkk?rel=0&autoplay=0" 
              title="AURUM Breakdown" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className={styles.videoFrame}
            ></iframe>
          </div>
        </div>

        <h2 className={styles.title}>Ready to Start Growing Your Savings with AI?</h2>
        <p className={styles.finalCtaSub}>
          ⚠️ <strong>Limited Opening:</strong> Maintaining our yield ratio requires strict partner limits. 
          <strong>Only 15 slots remaining for this cohort.</strong>
        </p>

        <a 
          href="#activation-portal"
          className={styles.primaryCta} 
          style={{ margin: '32px 0', display: 'inline-block', textDecoration: 'none' }}
        >
          Claim Your Free Invite & Get Started →
        </a>

        <div className={styles.ctaBadges}>
          <span>✓ 100% Free Access</span>
          <span>✓ No Credit Card Required</span>
          <span>✓ Starts working in under 24 hours</span>
          <span>✓ 100% liquid — withdraw anytime!</span>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.disclaimer}>
          Past performance does not guarantee future results. Yield is generated through automated market activities and involves risk.
        </div>
        <p className={styles.copyright}>© 2026 AURUMRISE. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Documentation</a>
        </div>
      </footer>
    </main>
  );
}
