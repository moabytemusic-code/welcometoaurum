import { useState, useEffect } from 'react';
import styles from './onboarding.module.css';
import { Shield, Smartphone, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Onboarding() {
  const [complete, setComplete] = useState([false, false, false]);
  const [rotatorData, setRotatorData] = useState({ 
    code: "...", 
    url: "https://backoffice.aurum.foundation/register" 
  });

  useEffect(() => {
    const resolveCode = async () => {
      // Step 1: Check persistence
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

      // Step 2: Fetch from rotator API
      try {
        const res = await fetch('/api/rotator');
        if (!res.ok) throw new Error('Rotator fail');
        const data = await res.json();
        setRotatorData(data);
        localStorage.setItem('aurum_affiliate', JSON.stringify(data));
      } catch (err) {
        console.error('Rotator error:', err);
        // Fallback to env default
        const fallback = {
          code: "1W145K",
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
              href={rotatorData.url}
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
          <p>Questions? Your sponsor's invite code ({rotatorData.code}) is pre-filled for your security.</p>
          <div className={styles.disclaimer}>
            Every Aurum member generates yield daily. Time is precious.
          </div>
        </footer>
      </div>
    </main>
  );
}
