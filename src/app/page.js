'use client';

import { useState, useEffect } from 'react';
import styles from './finance.module.css';

export default function Home() {
  const [deposit, setDeposit] = useState(5000);
  const [yieldValue, setYieldValue] = useState(0);

  const [stream, setStream] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Simulated yield calculation based on historical 142% avg
    const monthlyRate = 1.42 / 12;
    setYieldValue(deposit * monthlyRate);
  }, [deposit]);

  const handleOptIn = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus('SCANNIG LIQUIDITY GAPS...');
    
    // Step 1: Simulated "Live Processing"
    await new Promise(r => setTimeout(r, 800));
    setStatus('VERIFYING PARTNER SLOTS...');
    await new Promise(r => setTimeout(r, 800));
    setStatus('ALLOCATING SYSTEM NODE...');
    await new Promise(r => setTimeout(r, 800));

    // Step 2: Push to Brevo
    try {
      const res = await fetch('/api/optin', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email, first_name: formData.name }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        setStatus('ACCESS GRANTED. REDIRECTING...');
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 1000);
      } else {
        throw new Error('Capture failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('ERROR: RETRYING REDIRECT...');
      window.location.href = '/onboarding';
    }
  };

  useEffect(() => {
    const locations = ['London', 'New York', 'Singapore', 'Dubai', 'Tokyo', 'Zurich', 'Seoul'];
    const interval = setInterval(() => {
      const newOp = {
        id: Date.now(),
        location: locations[Math.floor(Math.random() * locations.length)],
        amount: (Math.random() * 45 + 5).toFixed(2),
        time: 'JUST NOW'
      };
      setStream(prev => [newOp, ...prev].slice(0, 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      {/* Modal Gate */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {!isProcessing ? (
              <>
                <h2 className={styles.modalTitle}>Establish Your Connection</h2>
                <p className={styles.modalSub}>Where should we send your official partner link and personalized yield breakdown?</p>
                <form onSubmit={handleOptIn} className={styles.modalForm}>
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    required 
                    className={styles.modalInput}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Best Email Address" 
                    required 
                    className={styles.modalInput}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <button type="submit" className={styles.primaryCta}>Initialize Connection →</button>
                  <p className={styles.modalSafe}>✓ No Credit Card Required. Institutional Privacy Active.</p>
                </form>
              </>
            ) : (
              <div className={styles.processingState}>
                <div className={styles.spinner} />
                <div className={styles.statusText}>{status}</div>
              </div>
            )}
            <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>×</button>
          </div>
        </div>
      )}

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
        
        <div className={styles.heroContent}>
          <div className={styles.topNav}>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot} /> 
              LIVE OPS: {stream.length > 0 ? `GAP CAPTURED IN ${stream[0].location.toUpperCase()} (+$${stream[0].amount})` : 'SCANNING FOR GAPS...'}
            </div>
          </div>

          <div className={styles.badge}>
            Institutional Liquidity Active
          </div>
          
          <h1 className={styles.title}>
            AURUM: The AI That Pays You <span className={styles.highlight}>While You Sleep</span>
          </h1>
          
          <p className={styles.subtitle}>
            Stop watching your money collect dust in a bank account while inflation eats it alive. Let AURUM’s AI bots hunt hidden market gaps 24/7 and deposit real passive income straight into your dashboard — completely on autopilot.
          </p>

          <p className={styles.socialProofSmall}>
            Join 18,000+ everyday people already earning monthly yield from AI-powered crypto finance.
          </p>

          <div className={styles.ctaContainer}>
            <button className={styles.primaryCta} onClick={() => setIsModalOpen(true)}>Claim My Free AI Breakdown →</button>
            <div className={styles.ctaMicroProof}>✓ Only 15 spots left in this cohort</div>
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

      {/* Main Breakdown Video Section */}
      <section className={styles.videoSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>The Internal Breakdown</h2>
          <p className={styles.sectionSub}>Watch exactly how our AI captures liquidity gaps in real-time.</p>
        </div>
        <div className={styles.videoWrapper}>
          <iframe 
            src="https://www.youtube.com/embed/WnrMvNnGYkk?rel=0&autoplay=0" 
            title="AURUM Breakdown" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className={styles.videoFrame}
          ></iframe>
        </div>
      </section>

      {/* Yield Projector Section */}
      <section className={styles.calculatorSection}>
        <div className={styles.calculatorCard}>
          <h2 className={styles.calculatorTitle}>See How Much Passive Income AURUM Could Make You</h2>
          <div className={styles.calcGrid}>
            <div className={styles.inputGroup}>
              <label>Initial Liquidity Bridge (Deposit)</label>
              <input 
                type="range" 
                min="500" 
                max="50000" 
                step="500" 
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className={styles.rangeInput}
              />
              <div className={styles.inputValue}>${parseInt(deposit).toLocaleString()}</div>
            </div>
            <div className={styles.resultsGroup}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Est. Monthly Yield</span>
                <span className={styles.resultValue}>+${Math.round(yieldValue).toLocaleString()}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Est. Annual Projection (142.4%)</span>
                <span className={styles.resultValueHighlight}>+${Math.round(yieldValue * 12).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <p className={styles.calcNote}>Projections based on historical 2025 performance. Past results do not guarantee future returns. Yield is generated through automated market activities and involves risk.</p>
        </div>
      </section>

      {/* Product Ecosystem Section */}
      <section className={styles.ecosystemSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything You Need to Earn Passive Income in One AI-Powered Ecosystem</h2>
          <p className={styles.sectionSub}>Global Infrastructure. Institutional Security. Personal Profit.</p>
        </div>
        <div className={styles.ecosystemGrid}>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_subscription_promo.png" alt="Aurum Subscription" className={styles.ecoImage} />
            </div>
            <h3>AURUM SUBSCRIPTION</h3>
            <p><strong>$19.99/year unlocks the entire money-making machine.</strong> Get full access to the bots, premium cards, NeoBank, community, and our built-in marketing plan so you can earn even more by inviting others.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_card_promo.png" alt="Aurum Cards" className={styles.ecoImage} />
            </div>
            <h3>AURUM CARDS</h3>
            <p><strong>Spend your crypto like normal money — anywhere in the world.</strong> Four premium tiers from instant-use Nova to the elite Infinity Card. Turn your AI earnings into everyday spending power, online or offline.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_neobank_promo.png" alt="Aurum NeoBank" className={styles.ecoImage} />
            </div>
            <h3>AURUM NEOBANK</h3>
            <p><strong>Your all-in-one crypto + fiat bank account.</strong> Secure, private Web3 banking in a single app. Manage everything in one place with zero compromise.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_zeus_bot_promo.png" alt="Aurum Zeus Bot" className={styles.ecoImage} />
            </div>
            <h3>ZEUS AI BOT</h3>
            <p><strong>Mid-term yield optimizer that works while you live your life.</strong> Institutional-grade AI that spots opportunities and automatically adjusts strategies — no charts, no stress, just steady gains.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_exai_bot_promo.png" alt="Aurum EX-AI Bot" className={styles.ecoImage} />
            </div>
            <h3>EX-AI DELTA BOT</h3>
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
            <p className={styles.problemDesc}>You grind for every dollar, but traditional banks use it to print money for themselves and throw you pennies.</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>🤯</div>
            <p className={styles.problemQuote}>“Every ‘AI bot’ I tried felt like a 2017 crypto scam.”</p>
            <p className={styles.problemDesc}>The internet is full of hype. You want something legitimate, institutional-grade, and actually built for real passive income.</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>😰</div>
            <p className={styles.problemQuote}>“Inflation is destroying my savings faster than I can hustle side gigs.”</p>
            <p className={styles.problemDesc}>Cash is no longer safe — it’s a guaranteed loss. You need an AI system that outpaces inflation on autopilot.</p>
          </div>
        </div>
      </section>

      {/* Solution Section (How it works) */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How AURUM’s AI Actually Prints You Passive Income (3 Simple Steps)</h2>
        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <h3>Identify the Gap</h3>
            <p>Our AI scans 400+ data points every second to find tiny price imbalances that normal people (and most traders) never see.</p>
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
            <div className={styles.statValue}>18K+</div>
            <div className={styles.statLabel}>Global Partners</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>$30M+</div>
            <div className={styles.statLabel}>Assets Orchestrated</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>142.4%</div>
            <div className={styles.statLabel}>2025 Avg. Yield</div>
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
            <p className={styles.testimonialText}>“The first yield hit my dashboard in under 24 hours. It’s not hype — it’s a real process that just keeps scaling.”</p>
            <p className={styles.testimonialAuthor}>— Sarah L., Tech Consultant & Side-Hustler</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>“I replaced my entire passive-income goal 6 months ahead of schedule. The AI is finding gaps I didn’t even know existed.”</p>
            <p className={styles.testimonialAuthor}>— David R., E-commerce Founder</p>
          </div>
        </div>
      </section>

      {/* Final CTA Override */}
      <section className={styles.finalCta}>
        <h2 className={styles.title}>Ready to Turn On Your Personal AI Money Machine?</h2>
        <p className={styles.finalCtaSub}>Once they’re gone, the next opening could be weeks away.</p>
        
        <div className={styles.urgencyBox}>
          <p>⚠️ <strong>Limited Opening:</strong> Only 15 spots left in this cohort.</p>
        </div>

        <button 
          className={styles.primaryCta} 
          style={{ margin: '32px 0' }}
          onClick={() => setIsModalOpen(true)}
        >
          Claim My Free Invite & Activate AURUM →
        </button>

        <div className={styles.ctaBadges}>
          <span>✓ No credit card needed</span>
          <span>✓ Starts working in under 24 hours</span>
          <span>✓ 100% liquid — withdraw or spend anytime</span>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.disclaimer}>
          Past performance does not guarantee future results. Yield is generated through automated market activities and involves risk.
        </div>
        <p className={styles.copyright}>© 2026 AURUM Ecosystem. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Documentation</a>
        </div>
      </footer>
    </main>
  );
}
