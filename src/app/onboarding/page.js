'use client';

import { useState, useEffect } from 'react';
import styles from './onboarding.module.css';
import { 
  Shield, 
  Smartphone, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Phone, 
  User, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function Onboarding() {
  const [complete, setComplete] = useState([false, false, false]);
  const [rotatorData, setRotatorData] = useState({ 
    code: "...", 
    name: "Loading Sponsor...",
    email: "",
    phone: "",
    url: "https://backoffice.aurum.foundation/register" 
  });

  useEffect(() => {
    const resolveCode = async () => {
      const stored = localStorage.getItem('aurum_affiliate');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRotatorData(parsed);
          return;
        } catch (e) {
          localStorage.removeItem('aurum_affiliate');
        }
      }

      try {
        const res = await fetch('/api/rotator');
        if (!res.ok) throw new Error('Rotator fail');
        const data = await res.json();
        setRotatorData(data);
        localStorage.setItem('aurum_affiliate', JSON.stringify(data));
      } catch (err) {
        console.error('Rotator error:', err);
        const fallback = {
          code: "1W145K",
          name: "Aurum Corporate",
          email: "support@aurum.foundation",
          phone: "N/A",
          url: "https://backoffice.aurum.foundation/register?ref=1W145K"
        };
        setRotatorData(fallback);
      }
    };

    resolveCode();
  }, []);

  const toggleStep = (index) => {
    const newComplete = [...complete];
    newComplete[index] = !newComplete[index];
    setComplete(newComplete);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        
        {/* Floating Sponsor Badge */}
        <div className={styles.sponsorBadge}>
          <div className={styles.sponsorLabel}>Your Trusted Sponsor</div>
          <div className={styles.sponsorInfo}>
            <div className={styles.sponsorMeta}><User size={14}/> {rotatorData.name}</div>
            {rotatorData.email && <div className={styles.sponsorMeta}><Mail size={14}/> {rotatorData.email}</div>}
            {rotatorData.phone && rotatorData.phone !== "N/A" && <div className={styles.sponsorMeta}><Phone size={14}/> {rotatorData.phone}</div>}
            <div className={styles.sponsorMeta} style={{color: '#2D8CF0', fontWeight: 'bold'}}>ID: {rotatorData.code}</div>
          </div>
        </div>

        <header className={styles.header}>
          <div className={styles.badge}>Phase 2: Account Activation</div>
          <h1 className={styles.title}>System Initialization</h1>
          <p className={styles.subtitle}>
            Follow these verified steps from the Aurum Institutional team to secure your position and activate your AI trading node.
          </p>
        </header>

        <div className={styles.stepsGrid}>
          
          {/* Step 1: Liquidity */}
          <div className={`${styles.stepCard} ${complete[0] ? styles.active : ''}`}>
            <div className={styles.stepNumber}>01</div>
            <div className={styles.iconWrapper}><Smartphone /></div>
            <h3 className={styles.stepTitle}>Prepare Liquidity</h3>
            <p className={styles.stepDesc}>Ensure your Web3 wallet (Exodus or Trust) is staged with the activation minimums.</p>
            
            <div className={styles.proTip}>
              <AlertCircle size={14} style={{marginBottom: '4px'}}/>
              <strong>EXODUS TIP:</strong> Ensure you have matching gas fees (BNB or ETH) in your wallet before proceeding.
            </div>

            <ul className={styles.checklist}>
              <li><Check className={styles.checkIcon}/> $19.99 for annual License</li>
              <li><Check className={styles.checkIcon}/> $100.00 min for Bot Liquidity</li>
              <li><Check className={styles.checkIcon}/> Gas for Network Fees</li>
            </ul>

            <button 
              className={`${styles.checkBtn} ${complete[0] ? styles.btnActive : ''}`} 
              onClick={() => toggleStep(0)}
            >
              {complete[0] ? 'LIQUIDITY READY' : 'MARK AS READY'}
              {complete[0] && <CheckCircle2 className="ml-2 w-4 h-4" />}
            </button>
          </div>

          {/* Step 2: Global Guard */}
          <div className={`${styles.stepCard} ${complete[1] ? styles.active : ''}`}>
            <div className={styles.stepNumber}>02</div>
            <div className={styles.iconWrapper}><Globe /></div>
            <h3 className={styles.stepTitle}>Global Gateway</h3>
            <p className={styles.stepDesc}>North American members (US/CA/MX) must establish a secure tunnel for registration.</p>
            
            <div className={styles.proTip}>
              <strong>GATEWAY TIP:</strong> Set your VPN to "Europe" or "Asia" before clicking the create button.
            </div>

            <ul className={styles.checklist}>
              <li><Check className={styles.checkIcon}/> VPN Active & Verified</li>
              <li><Check className={styles.checkIcon}/> Location: Outside NA</li>
              <li><Check className={styles.checkIcon}/> Encryption: AES-256</li>
            </ul>

            <button 
              className={`${styles.checkBtn} ${complete[1] ? styles.btnActive : ''}`} 
              onClick={() => toggleStep(1)}
            >
              {complete[1] ? 'GATEWAY SECURED' : 'VERIFY CONNECTION'}
              {complete[1] && <CheckCircle2 className="ml-2 w-4 h-4" />}
            </button>
          </div>

          {/* Step 3: Deployment */}
          <div className={`${styles.stepCard} ${complete[2] ? styles.active : ''}`}>
            <div className={styles.stepNumber}>03</div>
            <div className={styles.iconWrapper}><Shield /></div>
            <h3 className={styles.stepTitle}>Launch Node</h3>
            <p className={styles.stepDesc}>Initialize your profile. Ensure you use the specific country logic for verification.</p>
            
            <div className={styles.proTip}>
              <strong>REGISTRATION LOGIC:</strong> Use country code "CRYPTONATION" in the dropdown for seamless setup.
            </div>

            <ul className={styles.checklist}>
              <li><Check className={styles.checkIcon}/> Photo ID ready for upload</li>
              <li><Check className={styles.checkIcon}/> Email verification pending</li>
              <li><Check className={styles.checkIcon}/> Sponsor: {rotatorData.code}</li>
            </ul>

            <a 
              href={rotatorData.url}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.registerBtn}
              onClick={() => toggleStep(2)}
            >
              Deploy My Account <ArrowRight className="ml-2" />
            </a>
          </div>

        </div>

        <footer className={styles.footer}>
          <div className={styles.countdown}>TIME IS PRECIOUS. EVERY SECOND IS A MISSED EARNING EVENT.</div>
          <p className={styles.terms}>
            By proceeding, you verify that you have contacted your sponsor ({rotatorData.name}) for final briefing. Aurum algorithms generate yield daily.
          </p>
        </footer>

      </div>
    </main>
  );
}
