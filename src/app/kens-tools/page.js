import styles from './kens-tools.module.css';
import Link from 'next/link';
import { ArrowRight, Bot, Target, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

export default function KensTools() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.glow} />
        
        <div className={styles.badge}>Precision Marketing Systems</div>
        
        <h1 className={styles.title}>
          Master the AI Tools to Scale Your <span className={styles.highlight}>Aurum Income.</span>
        </h1>
        
        <p className={styles.subtitle}>
          Stop the manual grind. We teach network marketers how to build automated prospecting engines that funnel high-quality leads directly into the Aurum ecosystem.
        </p>

        <div className={styles.ctaContainer}>
          <Link href="#blueprint" className={styles.buttonPrimary}>
            Access the Blueprint <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Blueprint Grid */}
      <section id="blueprint" className={styles.grid}>
        <div className={styles.card}>
          <Bot className={styles.icon} />
          <h3 className={styles.cardTitle}>AI-Driven Prospecting</h3>
          <p className={styles.cardText}>
            Deploy sophisticated bots that handle initial outreach, vetting, and engagement while you sleep. High-touch results with zero effort.
          </p>
        </div>

        <div className={styles.card}>
          <Target className={styles.icon} />
          <h3 className={styles.cardTitle}>The Conversion Funnel</h3>
          <p className={styles.cardText}>
            Pre-built, battle-tested marketing pages designed specifically for network marketing psychology. Turn cold traffic into warm leads.
          </p>
        </div>

        <div className={styles.card}>
          <Zap className={styles.icon} />
          <h3 className={styles.cardTitle}>Aurum Direct Bridge</h3>
          <p className={styles.cardText}>
            Our proprietary integration system sends every validated lead straight to your Aurum referral link, ensuring 100% attribution.
          </p>
        </div>

        <div className={styles.card}>
          <TrendingUp className={styles.icon} />
          <h3 className={styles.cardTitle}>Scaling Systems</h3>
          <p className={styles.cardText}>
            Learn how to use AI to duplicate your success across your entire downline. Build a system that grows without your constant presence.
          </p>
        </div>

        <div className={styles.card}>
          <ShieldCheck className={styles.icon} />
          <h3 className={styles.cardTitle}>Finance Breakdown Circle</h3>
          <p className={styles.cardText}>
            Exclusive access to the AI Finance Breakdown community, where we share the latest algorithmic shifts in the banking ecosystem.
          </p>
        </div>
        
        <div className={styles.card} style={{ border: '1px solid var(--gold)' }}>
          <TrendingUp className={styles.icon} />
          <h3 className={styles.cardTitle}>Passive Liquidity Training</h3>
          <p className={styles.cardText}>
            Go beyond tools. Understand the mechanics of Aurum's liquidity pools to maximize your personal and team yields.
          </p>
        </div>
      </section>

      {/* Aurum Call to Action */}
      <section className={styles.aurumSection}>
        <h2 className={styles.aurumTitle}>Ready to Bridge Your Tools to the Ecosystem?</h2>
        <p className={styles.subtitle} style={{ margin: '0 auto 32px' }}>
          Connect your marketing engine to the core of the AI Finance Breakdown.
        </p>
        <a 
          href={process.env.NEXT_PUBLIC_AURUM_REGISTER_URL || "https://backoffice.aurum.foundation/register"}
          className={styles.aurumLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Activate Your Aurum Node Now <ArrowRight className="inline-block ml-2" />
        </a>
      </section>

      <footer style={{ padding: '60px 24px', textAlign: 'center', color: '#666', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <p>© 2026 Ken's Business Tools x AI Finance Breakdown. All rights reserved.</p>
      </footer>
    </main>
  );
}
