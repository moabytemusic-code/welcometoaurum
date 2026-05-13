'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';
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

const ConsultativeAngle = ({ project, handleOptIn, isProcessing, status }) => {
  const [deposit, setDeposit] = useState(1500);
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
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-elements-loop-40432-large.mp4" type="video/mp4" />
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
            What if simple technology could help you grow your savings every day, while you keep 100% control?
          </h2>
          
          <p className={styles.subtitle}>
            Over 118,000 regular people have stopped guessing and started letting automation do the heavy lifting. Are you ready to see how a simple passive income system works? No ID Required.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', width: '100%' }}>
            <div style={{ width: '90%', maxWidth: '900px' }}>
              <OptInBadge onOptIn={handleOptIn} isProcessing={isProcessing} status={status} wide={true} minimal={true} angle="consultative" />
            </div>
          </div>

          <div className={styles.heroRow}>
            
            <div className={styles.calculatorCard} style={{ margin: '0', textAlign: 'left' }}>
              <h2 className={styles.calculatorTitle} style={{ textAlign: 'center' }}>See Your AurumRise Wealth Projection</h2>
            <div className={styles.calcGrid}>
                <div className={styles.inputGroup}>
                  <label>Starting Balance (Deposit)</label>
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
          <p className={styles.sectionSub}>Global Network. Real Security. Your Control.</p>
        </div>
        <div className={styles.ecosystemGrid}>

          <div className={styles.ecoCard}>
            <div className={styles.ecoImageWrapper}>
              <img src="/images/aurum_subscription_promo.png" alt="Aurum Subscription" className={styles.ecoImage} />
            </div>
            <h3>AURUMRISE Subscription</h3>
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

      {/* Stats Bar */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}><div className={styles.statValue}>118K+</div><div className={styles.statLabel}>Global Partners</div></div>
          <div className={styles.statItem}><div className={styles.statValue}>$115M+</div><div className={styles.statLabel}>Total Funds Managed</div></div>
          <div className={styles.statItem}><div className={styles.statValue}>178.4%</div><div className={styles.statLabel}>2026 Avg. Yield</div></div>
          <div className={styles.statItem}><div className={styles.statValue}>0</div><div className={styles.statLabel}>Security Breaches</div></div>
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
};

export default ConsultativeAngle;
