'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';
import PerformanceChart from '@/components/PerformanceChart';
import OptInBadge from '@/components/OptInBadge';
import CustomTicker from '../blocks/CustomTicker';
import { stats } from '@/data/performance';

const BotEarningsBadge = ({ fallbackValue }) => {
  const [earnings, setEarnings] = useState(fallbackValue || null);

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
          <div style={{ width: '100%', height: '130px', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <img src="/images/aurum_exai_bot_promo.png" alt="Aurum EX-AI Bot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 8px #00ff88', animation: 'aurumPulseDot 2s infinite' }}></div>
            <span style={{ fontSize: '12px', color: '#00ff88', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>EX-AI BOT ACTIVE</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Performance</span>
          <span style={{ fontSize: '42px', color: '#00ff88', fontWeight: '900', textShadow: '0 0 20px rgba(0,255,136,0.4)', lineHeight: '1' }}>{earnings}</span>
        </div>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Algorithm</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>Neural-X v4.2</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Execution</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>Arbitrage High-Freq</span>
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
  );
};

const ConsultativeAngle = ({ project, handleOptIn, isProcessing, status }) => {
  const { content = {}, config = {} } = project;
  const [deposit, setDeposit] = useState(5000);
  const [yieldValue, setYieldValue] = useState(0);

  useEffect(() => {
    const monthlyRate = 1.784 / 12;
    setYieldValue(deposit * monthlyRate);
  }, [deposit]);

  return (
    <main className={styles.main}>

      {/* Hero Section with Video Background */}
      <section className={styles.hero}>
        <div className={styles.videoBg}>
          <div className={styles.videoOverlay} />
          <video autoPlay loop muted playsInline className={styles.bgVideo}>
            <source src={content.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-elements-loop-40432-large.mp4"} type="video/mp4" />
          </video>
        </div>

        <div className={styles.topNav}>
          <CustomTicker />
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Is Your Money Actually Working For You, or Just <span className={styles.highlight}>Losing to Inflation?</span>
          </h1>
          <h2 className={styles.heroSubtitle}>
            What if smart technology could generate daily profits for you, while you keep 100% control of your funds?
          </h2>
          <p className={styles.subtitle}>
            Over 118,000 everyday people have stopped guessing and started letting automation do the heavy lifting. Are you ready to see what a 24/7 passive income system looks like? No KYC Required.
          </p>

          <div className={styles.heroRow}>
            <div className={styles.calculatorCard} style={{ margin: '0', textAlign: 'left' }}>
              <h2 className={styles.calculatorTitle} style={{ textAlign: 'center' }}>See Your Aurum Wealth Projection</h2>
              <div className={styles.calcGrid}>
                <div className={styles.inputGroup}>
                  <label>Initial Liquidity Bridge (Deposit) <span style={{ float: 'right', color: '#2d8cf0', fontWeight: 'bold' }}>${parseInt(deposit).toLocaleString()}</span></label>
                  <input
                    type="range"
                    min="100"
                    max="99999"
                    step="100"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className={styles.rangeInput}
                    style={{ background: `linear-gradient(to right, #2d8cf0 ${((deposit - 100) / 99899) * 100}%, #333 ${((deposit - 100) / 99899) * 100}%)` }}
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
              <p className={styles.calcNote}>Projections based on historical 2025 performance. Past results do not guarantee future returns. Yield is generated through automated market activities and involves risk.</p>
            </div>

            <div className={styles.badgeWrapper}>
              <BotEarningsBadge fallbackValue={content.botValue} />
            </div>
          </div>
        </div>
      </section>

      {/* Opt-In + Trust Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustContent}>
          <div id="activation-portal" style={{ marginBottom: '64px', width: '100%', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className={styles.ctaMicroProof} style={{ marginBottom: '16px' }}>✓ Only 15 slots remaining for this cohort</div>
            <OptInBadge onOptIn={handleOptIn} isProcessing={isProcessing} status={status} wide={true} angle={project?.angle} />
          </div>
          <div className={styles.forbesBadge}>AS SEEN IN FORBES</div>
          <blockquote className={styles.trustQuote}>
            "Making digital assets as spendable as cash — without friction."
          </blockquote>
          <div className={styles.trustAuthor}>— Institutional Review, 2026</div>
        </div>
      </section>

      {/* Performance Analysis Section */}
      <section className={styles.statsSection} style={{ background: 'transparent' }}>
        <div className={styles.sectionHeader}>
          <div className={styles.liveBadge} style={{ margin: '0 auto 16px', width: 'fit-content' }}>
            <div className={styles.liveDot}></div>
            VERIFIED INSTITUTIONAL YIELD (2025)
          </div>
          <h2 className={styles.sectionTitle}>Have You Ever Watched Your Balance Grow While You Sleep?</h2>
          <p className={styles.sectionSub}>Instead of trying to convince you this works, we prefer to just show you the exact numbers from previous years.</p>
        </div>
        <div className={styles.performanceContainer}>
          <div className={styles.performanceChartWrapper}>
            <PerformanceChart />
          </div>
          <div className={styles.statsGrid} style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
            <div className={styles.statItem}>
              <div className={styles.statValue} style={{ fontSize: '24px' }}>{stats.totalAnnualYield}</div>
              <div className={styles.statLabel}>2025 Net Yield</div>
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

      {/* Ecosystem Section */}
      <section className={styles.ecosystemSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything You Need to Earn Passive Income in One AI-Powered Ecosystem</h2>
          <p className={styles.sectionSub}>Global Infrastructure. Institutional Security. Individual Freedom.</p>
        </div>
        <div className={styles.ecosystemGrid}>
          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}><img src="/images/aurum_subscription_promo.png" alt="Aurum Subscription" className={styles.ecoImage} /></div>
            <h3>AURUM Subscription</h3>
            <p><strong>Unlock the entire money-making machine for just $19.99/year.</strong> Full access to the bots, premium cards, NeoBank, community, and our built-in marketing plan so you can earn even more by inviting others.</p>
          </div>
          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}><img src="/images/aurum_card_promo.png" alt="Aurum Cards" className={styles.ecoImage} /></div>
            <h3>Aurum Cards</h3>
            <p><strong>Spend your AI earnings like normal money — anywhere in the world.</strong> Four premium tiers from instant-use Nova to the elite Infinity Card. Turn your passive yield into everyday spending power, online or offline.</p>
          </div>
          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}><img src="/images/aurum_neobank_promo.png" alt="Aurum NeoBank" className={styles.ecoImage} /></div>
            <h3>Aurum NeoBank</h3>
            <p><strong>Your all-in-one crypto + fiat bank account.</strong> Secure, private Web3 banking in a single app. Manage everything in one place with zero compromise.</p>
          </div>
          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}><img src="/images/aurum_zeus_bot_promo.png" alt="Aurum Zeus Bot" className={styles.ecoImage} /></div>
            <h3>Zeus AI Bot</h3>
            <p><strong>Mid-term yield optimizer that works while you live your life.</strong> Institutional-grade AI that spots opportunities and automatically adjusts strategies — no charts, no stress, just steady passive gains.</p>
          </div>
          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}><img src="/images/aurum_exai_bot_promo.png" alt="Aurum EX-AI Bot" className={styles.ecoImage} /></div>
            <h3>EX-AI Delta Bot</h3>
            <p><strong>The 24/7 autonomous trader that does all the work for you.</strong> Fully autonomous gap-capturing bot. It scans, executes, and compounds profits 24/7 with zero effort on your end.</p>
          </div>
        </div>
      </section>

      {/* Problem Agitation Section */}
      <section className={styles.problemSection}>
        <h2 className={styles.sectionTitle}>Which of These Frustrations is Holding You Back?</h2>
        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>📉</div>
            <p className={styles.problemQuote}>"I know inflation is eating my savings, but my bank only pays 0.01%."</p>
            <p className={styles.problemDesc}>Are you tired of watching your money lose its value while big banks use your deposits to make billions for themselves?</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>⏳</div>
            <p className={styles.problemQuote}>"I want to participate in the markets, but I don't have time to stare at charts."</p>
            <p className={styles.problemDesc}>Are you looking for an extra income stream, but simply can't afford to take on a highly stressful part-time job acting as a day trader?</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemEmoji}>🔒</div>
            <p className={styles.problemQuote}>"I don't trust crypto. I've heard the horror stories of locked funds."</p>
            <p className={styles.problemDesc}>How important is it to you that you keep total control of your money, with the ability to easily withdraw or spend your profits at any moment?</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>What Does the Solution Look Like For You?</h2>
        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <h3>Remove the Emotion</h3>
            <p>Instead of guessing when to buy or sell, what if you allowed a smart software to quietly scan 400+ data points per second to identify safe, profitable opportunities?</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>02</div>
            <h3>Automate the Capture</h3>
            <p>Could you sleep better knowing an automated tool was executing split-second trades to lock in small, steady profits on your behalf, without ever needing your input?</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>03</div>
            <h3>Keep Your Freedom</h3>
            <p>What if the profits hit your dashboard immediately? No lock-ups, no waiting. Just the absolute freedom to withdraw or spend your earnings anytime using your Neobank card.</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}><div className={styles.statValue}>118K+</div><div className={styles.statLabel}>Global Partners</div></div>
          <div className={styles.statItem}><div className={styles.statValue}>$115M+</div><div className={styles.statLabel}>Assets Orchestrated</div></div>
          <div className={styles.statItem}><div className={styles.statValue}>178.4%</div><div className={styles.statLabel}>2025 Avg. Yield</div></div>
          <div className={styles.statItem}><div className={styles.statValue}>0</div><div className={styles.statLabel}>Security Breaches</div></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>Escaping the Legacy Trap</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>"I stayed on the sidelines for 3 months after getting burned by other bots. My only regret? Losing those 3 months of pure passive income."</p>
            <p className={styles.testimonialAuthor}>— Marcus T., Former Portfolio Manager</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>"The first yield hit my dashboard in under 24 hours. It's not hype — it's a real process that just keeps scaling while I focus on my own business."</p>
            <p className={styles.testimonialAuthor}>— Sarah L., Tech Consultant & Side-Hustler</p>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialText}>"I replaced my entire passive-income goal 6 months ahead of schedule. The AI is finding gaps I didn't even know existed."</p>
            <p className={styles.testimonialAuthor}>— David R., E-commerce Founder</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Let's Address the Elephant in the Room</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>Can I actually take my money out?</h4>
            <p className={styles.faqAnswer}>How important is it to you that you can withdraw or spend your daily profits without friction? With the Aurum ecosystem, your daily profits are always available (processing within 24-48 hours). If you decide to put your initial deposit into the automated bot, that specific deposit is locked in for one year to keep the system stable. While early withdrawal is available with a 30% fee, the profits it makes every single day are 100% yours to spend or withdraw whenever you want. Fair, right?</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>How does the software actually make money?</h4>
            <p className={styles.faqAnswer}>Have you ever wondered how big banks make billions while paying you pennies? They buy assets for slightly less and sell them for slightly more across different global markets. Our software just does the exact same thing—finding tiny price differences and making split-second trades. Instead of the banks keeping all that profit, the software drops it directly into your account. Makes sense, right?</p>
          </div>
          <div className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>What's the catch? Is this really free to test?</h4>
            <p className={styles.faqAnswer}>Would you ever buy a car without test-driving it first? Neither would we. You can open your account and explore the software 100% risk-free. When you're ready to unlock the full features, it's just a flat $19.99/year. Beyond that, the platform only takes a small success fee on the actual profits it generates for you. In other words: If you don't make money, the system doesn't make money.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
        <h2 className={styles.title}>Is It Time to See the Numbers for Yourself?</h2>
        <p className={styles.finalCtaSub}>
          Instead of trying to convince you with hype, we believe in radical transparency. See the live algorithms, test the system, and decide if the Aurum ecosystem is the logical fit for your capital.
        </p>
        <a href="#activation-portal" className={styles.primaryCta} style={{ margin: '32px 0', display: 'inline-block', textDecoration: 'none' }}>
          View The Dashboards & Explore Risk-Free →
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
        <p className={styles.copyright}>© 2026 AURUM Ecosystem. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Documentation</a>
        </div>
      </footer>
    </main>
  );
};

export default ConsultativeAngle;
