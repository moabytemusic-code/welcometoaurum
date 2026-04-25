'use client';

import { useState, useEffect } from 'react';
import HeroPitch from '../blocks/HeroPitch';
import styles from '@/app/finance.module.css';
import { Gift, ShieldCheck, Zap } from 'lucide-react';

const PayItForwardAngle = ({ project, handleOptIn, isProcessing, status }) => {
  const { content = {} } = project;
  const [fundingPool, setFundingPool] = useState(8400);

  useEffect(() => {
    // Simulated live pool decrement
    const interval = setInterval(() => {
      setFundingPool(p => p > 100 ? p - Math.floor(Math.random() * 100) : p);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const whyGiveawaySection = (
    <div style={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: '24px', padding: '40px', margin: '40px auto 0', maxWidth: '900px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', textAlign: 'center', color: '#fff' }}>Why are we giving away $100?</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', textAlign: 'left' }}>
        <div>
          <div style={{ color: '#00ff88', marginBottom: '12px' }}><Gift size={28} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Zero Risk</h4>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>The hardest part of getting started is the first step. We've removed that completely by giving you the money to start.</p>
        </div>
        <div>
          <div style={{ color: '#00ff88', marginBottom: '12px' }}><ShieldCheck size={28} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>See It To Believe It</h4>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>We want you to watch the AI actually make money with our capital before you ever risk a single penny of your own.</p>
        </div>
        <div>
          <div style={{ color: '#00ff88', marginBottom: '12px' }}><Zap size={28} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Win-Win Partnership</h4>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>Our community grows when people win. Instead of paying for ads, we just put that money directly into your account.</p>
        </div>
      </div>
    </div>
  );

  return (
    <main className={styles.main}>
      {/* Funding Status Bar */}
      <div style={{ background: '#00ff88', color: '#000', padding: '12px', textAlign: 'center', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px' }}>
        Live Funding Pool: ${fundingPool.toLocaleString()} Available for Distribution
      </div>

      <HeroPitch 
        project={project} 
        handleOptIn={handleOptIn}
        isProcessing={isProcessing}
        status={status}
        preOptInSlot={whyGiveawaySection}
        content={{
          ...content,
          title: content.title || 'Claim Your <span class="highlight">$100 Starting Capital.</span>',
          subtitle: content.subtitle || 'We are funding the first 1,000 accounts to prove the power of AI Finance.',
          botImageUrl: "/images/aurum_funding_voucher.png",
          botLabel: "VOUCHER ACTIVE",
          botStatus: "ALLOCATION STATUS",
          botValue: "$100.00"
        }} 
      />

      {/* Footer Branding */}
      <footer className={styles.footer}>
        <div className={styles.disclaimer}>
          The $100 credit is a starting capital allocation within the Aurum Ecosystem. Terms and conditions apply. Funding is subject to availability of the daily pool.
        </div>
        <p className={styles.copyright}>© 2026 {project.name}. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default PayItForwardAngle;
