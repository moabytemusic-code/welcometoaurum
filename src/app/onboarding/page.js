'use client';

import { useState } from 'react';
import styles from './onboarding.module.css';
import { Shield, Smartphone, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Onboarding() {
  const [complete, setComplete] = useState([false, false, false]);

  const toggleStep = (index) => {
    const newComplete = [...complete];
    newComplete[index] = !newComplete[index];
    setComplete(newComplete);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.badge}>Phase 2: Activation</div>
          <h1 className={styles.title}>Your Activation Checklist</h1>
          <p className={styles.subtitle}>Complete these 3 essential steps to initialize your AURUM account and start your gap capture.</p>
        </header>

        <div className={styles.stepsGrid}>
          {/* Step 1: Funding */}
          <div className={`${styles.stepCard} ${complete[0] ? styles.active : ''}`}>
            <div className={styles.stepHeader}>
              <Smartphone className={styles.icon} />
              <h3>01. Prepare Your Liquidity</h3>
            </div>
            <p>Ensure you have your funds ready in a compatible wallet (Exodus or Trust Wallet).</p>
            <ul className={styles.checklist}>
              <li>✓ $19.99 USD for primary License Activation</li>
              <li>✓ $100.00 USD minimum for initial Bot liquidity</li>
              <li>✓ Small amount of GAS (BNB/ETH) for transactions</li>
            </ul>
            <button className={styles.checkBtn} onClick={() => toggleStep(0)}>
              {complete[0] ? 'Funds Ready' : 'Mark as Ready'}
              <CheckCircle2 className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Step 2: VPN */}
          <div className={`${styles.stepCard} ${complete[1] ? styles.active : ''}`}>
            <div className={styles.stepHeader}>
              <Globe className={styles.icon} />
              <h3>02. Establish Connection</h3>
            </div>
            <p>If you are in the <strong>US, CA, or MX</strong>, you must use a VPN set to a "Europe" or "Asia" region to access the registration gateway.</p>
            <div className={styles.proTip}>
              <strong>PRO TIP:</strong> We recommend using "Crypto Nation" logic if asked for your region during setup.
            </div>
            <button className={styles.checkBtn} onClick={() => toggleStep(1)}>
              {complete[1] ? 'VPN Active' : 'Confirm VPN Active'}
              <CheckCircle2 className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Step 3: Registration */}
          <div className={`${styles.stepCard} ${complete[2] ? styles.active : ''}`}>
            <div className={styles.stepHeader}>
              <Shield className={styles.icon} />
              <h3>03. Launch Node</h3>
            </div>
            <p>Click the button below to secure your position in the backoffice and create your account.</p>
            <a 
              href={process.env.NEXT_PUBLIC_AURUM_REGISTER_URL || "https://backoffice.aurum.foundation/register"}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.registerBtn}
              onClick={() => toggleStep(2)}
            >
              Create My AURUM Account <ArrowRight className="ml-2" />
            </a>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>Questions? Your sponsor's invite code ({process.env.NEXT_PUBLIC_SPONSOR_ID || "ACTIVE"}) is pre-filled for your security.</p>
          <div className={styles.disclaimer}>
            Every Aurum member generates yield daily. Time is precious.
          </div>
        </footer>
      </div>
    </main>
  );
}
