'use client';

import { useState, useEffect } from 'react';
import styles from './finance-breakdown/finance.module.css';

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
      window.location.href = 'https://www.theaifinancebreakdown.com';
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

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        
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
          Stop Donating Your Wealth to Legacy Banks. Let <span className={styles.highlight}>AURUM AI</span> Capture the Gaps.
        </h1>
        
        <p className={styles.subtitle}>
          Join 18,000+ partners leveraging the world’s first AI-driven Neobanking ecosystem designed to squeeze maximum yield from global markets—24/7, on autopilot.
        </p>

        <div className={styles.ctaContainer}>
          <button className={styles.primaryCta} onClick={() => setIsModalOpen(true)}>Claim My AI Breakdown →</button>
          <div className={styles.ctaMicroProof}>✓ 15 slots remaining for this cohort</div>
        </div>
      </section>

      {/* Trust Proof Section (Forbes) */}
      <section className={styles.trustSection}>
        <div className={styles.trustContent}>
          <div className={styles.forbesBadge}>AS SEEN IN FORBES</div>
          <blockquote className={styles.trustQuote}>
            "Aurum exemplifies the approach of building infrastructure that bridges the two worlds... enabling users to fund accounts with digital assets and spend in local currencies... making digital assets as spendable as cash—without friction."
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
          <h2 className={styles.calculatorTitle}>Project Your Gap Capture</h2>
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
          <p className={styles.calcNote}>*Projections based on historical 2025 performance. Past results do not guarantee future returns.</p>
        </div>
      </section>

      {/* Product Ecosystem Section */}
      <section className={styles.ecosystemSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Global Infrastructure</h2>
          <p className={styles.sectionSub}>A complete Web3 Banking suite controlled by one AI orchestrator.</p>
        </div>
        <div className={styles.ecosystemGrid}>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_subscription_promo.png" alt="Aurum Subscription" className={styles.ecoImage} />
            </div>
            <h3>AURUM Subscription</h3>
            <p>Unlock full ecosystem access for just $19.99/year. Gain entry to bots, cards, community, and the marketing plan to grow your network.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_card_promo.png" alt="Aurum Cards" className={styles.ecoImage} />
            </div>
            <h3>Aurum Cards</h3>
            <p>Four tiers of premium crypto debit cards—from the instant-use Nova to the elite Infinity Card. Spend crypto anywhere in the world, online or offline.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_neobank_promo.png" alt="Aurum NeoBank" className={styles.ecoImage} />
            </div>
            <h3>Aurum NeoBank</h3>
            <p>A Web 3.0 Bank for secure, private management of both crypto and fiat. One card, one app, global access—zero compromise.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_zeus_bot_promo.png" alt="Aurum Zeus Bot" className={styles.ecoImage} />
            </div>
            <h3>Zeus AI Bot</h3>
            <p>Institutional-grade liquidity management. The Zeus bot detects mid-term opportunities and auto-adjusts strategies to optimize profit without manual input.</p>
          </div>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_exai_bot_promo.png" alt="Aurum EX-AI Bot" className={styles.ecoImage} />
            </div>
            <h3>EX-AI Delta Bot</h3>
            <p>Fully autonomous trading. Analyzes the market, executes gap captures, and maximizes yield 24/7—with no stress, no effort, maximum precision.</p>
          </div>

        </div>
      </section>

      {/* Problem Agitation Section */}
      <section className={styles.problemSection}>
        <h2 className={styles.sectionTitle}>Why Traditional Finance is Failing You</h2>
        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>😤</div>
            <p className={styles.problemQuote}>"My bank is literally laughing at me with this 0.01% interest."</p>
            <p className={styles.problemDesc}>You work hard for your money, but your bank uses it to make billions while handing you back "dust." The system isn't broken—it's working exactly as intended, for them.</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>🤯</div>
            <p className={styles.problemQuote}>"Every 'AI Bot' I see looks like a scam from 2017."</p>
            <p className={styles.problemDesc}>The market is flooded with miracle miners. You’re looking for a legitimate, institutional-grade ecosystem that values capital preservation as much as profit.</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>😰</div>
            <p className={styles.problemQuote}>"Inflation is eating my savings faster than I can earn."</p>
            <p className={styles.problemDesc}>Staying in cash is no longer "safe"—it's a guaranteed loss. You need a vehicle that outpaces inflation in real-time, 24/7.</p>
          </div>
        </div>
      </section>

      {/* Solution Section (How it works) */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>The "Liquidity Gap" Mechanism</h2>
        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <h3>Identify the Gap</h3>
            <p>Our AI scans 400+ data points every second to find temporary price imbalances retail traders can't see.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>02</div>
            <h3>Automated Capture</h3>
            <p>The ecosystem executes millisecond-fast captures to secure the arbitrage, stacking micro-gains rapidly.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>03</div>
            <h3>Real-Time Payout</h3>
            <p>Profits are settled instantly into your dashboard. No lock-ups, just pure liquid performance.</p>
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
            <p className={styles.testimonialText}>"I've been burned by 'trading bots' before. I stayed on the sidelines of AURUM for 3 months. My only regret? Losing those 3 months of yield."</p>
            <p className={styles.testimonialAuthor}>— Marcus T., Former Portfolio Manager</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>"Seeing the first yield hit my dashboard within 24 hours was the 'aha' moment. It’s not a promise—it’s a process that scales."</p>
            <p className={styles.testimonialAuthor}>— Sarah L., Tech Consultant</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>"I replaced my passive income goal 6 months ahead of schedule. The AI captures gaps I didn't even know existed."</p>
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
            <p className={styles.faqAnswer}>Absolutely not. AURUM is built on the principle of liquidity. Your funds remain yours, and you can initiate a withdrawal at any time with no penalties.</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>How does the AI actually make money?</h4>
            <p className={styles.faqAnswer}>It identifies "Liquidity Gaps"—temporary imbalances in market price. By filling these gaps faster than any human, it captures the difference as profit.</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Is it really free to join?</h4>
            <p className={styles.faqAnswer}>Yes. We only profit when you do. There are no monthly fees. We take a success fee on the backend of the yield generated.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.title}>Ready to Start Your Breakdown?</h2>
        <div className={styles.urgencyBox}>
          <p>⚠️ <strong>Limited Opening:</strong> Maintaining our yield ratio requires strict partner limits. <strong>15 slots remaining</strong> for current cohort.</p>
        </div>
        <button 
          className={styles.primaryCta} 
          style={{ margin: '32px 0' }}
          onClick={() => setIsModalOpen(true)}
        >
          Claim My Invite & Start Breakdown →
        </button>
        <div className={styles.ctaBadges}>
          <span>✓ 100% Free Access</span>
          <span>✓ No Credit Card Required</span>
          <span>✓ Institutional Encryption</span>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 AURUM Ecosystem. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Documentation</a>
        </div>
      </footer>
    </main>
  );
}
