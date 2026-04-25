'use client';

import HeroPitch from '../blocks/HeroPitch';
import styles from '@/app/finance.module.css';
import OptInBadge from '@/components/OptInBadge';
import PerformanceChart from '@/components/PerformanceChart';
import { stats } from '@/data/performance';

const PitchAngle = ({ project, handleOptIn, isProcessing, status }) => {
  const { content = {} } = project;

  return (
    <main className={styles.main}>
      <HeroPitch content={content.hero} />

      {/* Trust Proof Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustContent}>
          <div id="activation-portal" style={{ marginBottom: '64px', width: '100%', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className={styles.ctaMicroProof} style={{ marginBottom: '16px' }}>{content.ctaProof || '✓ Only 15 slots remaining for this cohort'}</div>
            <OptInBadge onOptIn={handleOptIn} isProcessing={isProcessing} status={status} wide={true} />
          </div>
          <div className={styles.forbesBadge}>AS SEEN IN FORBES</div>
          <blockquote className={styles.trustQuote}>
            {content.trustQuote || '“Making digital assets as spendable as cash — without friction.”'}
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
          <h2 className={styles.sectionTitle}>{content.statsTitle || 'Institutional Performance, Individual Control'}</h2>
          <p className={styles.sectionSub}>{content.statsSub || 'Visualize the compounding power of the Aurum AI algorithms through verified historical returns.'}</p>
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

      {/* Footer Branding */}
      <footer className={styles.footer}>
        <div className={styles.disclaimer}>
          {content.disclaimer || 'Past performance does not guarantee future results. Yield is generated through automated market activities and involves risk.'}
        </div>
        <p className={styles.copyright}>© 2026 {project.name}. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default PitchAngle;
