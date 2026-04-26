'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';
import OptInBadge from '@/components/OptInBadge';
import CustomTicker from './CustomTicker';

const BotEarningsBadge = ({ imageUrl, fallbackValue }) => {
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
              src={imageUrl || "/images/aurum_exai_bot_promo.png"}
              alt="Aurum EX-AI Bot"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
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
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Algorithm</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>Neural-X v4.2</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Execution</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>Arbitrage High-Freq</span>
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

const HeroPitch = ({ project, content = {}, handleOptIn, isProcessing, status, preOptInSlot }) => {
  const [deposit, setDeposit] = useState(5000);
  const [yieldValue, setYieldValue] = useState(0);

  const activeConfig = project?.config || {};

  useEffect(() => {
    // Simulated yield calculation
    const monthlyRate = 1.784 / 12;
    setYieldValue(deposit * monthlyRate);
  }, [deposit]);

  return (
    <>
      <section className={styles.hero}>
      <div className={styles.videoBg}>
        <div className={styles.videoOverlay} />
        <video
          autoPlay
          loop
          muted
          playsInline
          key={content.videoUrl}
          className={styles.bgVideo}
        >
          <source src={content.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-elements-loop-40432-large.mp4"} type="video/mp4" />
        </video>
      </div>

      {activeConfig.showTicker !== false && (
        <div className={styles.topNav}>
          <CustomTicker />
        </div>
      )}

      <div className={styles.heroContent}>
        <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: content.title || 'Master Your Financial <span class="' + styles.highlight + '">Future.</span>' }} />

        <h2 className={styles.heroSubtitle}>
          {content.subtitle || "The next generation of automated growth."}
        </h2>

        <p className={styles.subtitle}>
          {content.description || "Join thousands of users leveraging advanced technology to scale their results on autopilot."}
        </p>

        {preOptInSlot}

          <div style={{ maxWidth: '800px', margin: '40px auto 0', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <OptInBadge 
              onOptIn={handleOptIn} 
              isProcessing={isProcessing} 
              status={status} 
              wide={true} 
              angle={project?.angle} 
            />
          </div>
        </div>
      </section>

      {/* Calculator & Bot Window (Moved Down) */}
      {(activeConfig.showCalculator || activeConfig.showBotBadge) && (
        <section style={{ padding: '80px 24px', background: 'linear-gradient(to bottom, #050505, rgba(255,255,255,0.02))' }}>
          <div className={styles.heroRow} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', width: '100%' }}>
            {activeConfig.showCalculator && (
              <div className={styles.calculatorCard} style={{ margin: '0 auto', textAlign: 'left' }}>
                <h2 className={styles.calculatorTitle} style={{ textAlign: 'center' }}>{content.calcTitle || "Project Your Potential Results"}</h2>
                <div className={styles.calcGrid}>
                  <div className={styles.inputGroup}>
                    <label>{content.calcLabel || "Initial Capital"} <span style={{ float: 'right', color: '#2d8cf0', fontWeight: 'bold' }}>${parseInt(deposit).toLocaleString()}</span></label>
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
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                      gap: '16px' 
                    }}>
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>Est. Monthly Yield</span>
                        <span className={styles.resultValue}>+${Math.round(yieldValue).toLocaleString()}</span>
                      </div>
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>Est. Annual (178.4%)</span>
                        <span className={styles.resultValueHighlight}>+${Math.round(yieldValue * 12).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={styles.resultItem} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                      <span className={styles.resultLabel}>Total Projected (1 Year)</span>
                      <span className={styles.resultValueTotal}>${Math.round(deposit + (yieldValue * 12)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <p className={styles.calcNote}>{content.calcNote || "Projections based on historical performance data. Past results do not guarantee future returns."}</p>
              </div>
            )}

            {activeConfig.showBotBadge && (
              <div className={styles.badgeWrapper} style={{ margin: '0 auto' }}>
                <BotEarningsBadge imageUrl={content.botImageUrl} fallbackValue={content.botValue} />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default HeroPitch;
