'use client';

import { useState } from 'react';
import styles from '@/app/admin/admin.module.css';
import { Sparkles, Layout, PenTool, Rocket, CheckCircle2, ChevronRight, Globe, Zap, Gift } from 'lucide-react';
import Link from 'next/link';

export default function FaaSBuilder() {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    slug: '',
    angle: 'pitch',
    content: {
      title: '',
      subtitle: '',
      description: '',
      videoUrl: ''
    },
    config: {
      showCalculator: true,
      showBotBadge: true,
      showYieldStats: true
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedUrl(`${window.location.origin}${data.path}`);
        nextStep();
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving project. Make sure the server is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateContent = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      content: { ...prev.content, [field]: value }
    }));
  };

  return (
    <main className={styles.builderMain}>
      <div className={styles.builderGlow} />
      
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.badge}>FaaS Platform v1.0</div>
          <h1 className={styles.title}>Project <span className={styles.highlight}>Architect</span></h1>
          <p className={styles.subtitle}>Deploy a new high-conversion funnel in seconds.</p>
        </header>

        {/* Stepper */}
        <div className={styles.stepper}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`${styles.step} ${step >= i ? styles.stepActive : ''}`}>
              <div className={styles.stepNumber}>{i}</div>
              <div className={styles.stepLabel}>
                {i === 1 && 'Identity'}
                {i === 2 && 'Angle'}
                {i === 3 && 'Copy'}
                {i === 4 && 'Launch'}
              </div>
              {i < 4 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className={styles.card}>
          {step === 1 && (
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <Globe className={styles.icon} />
                <h2>Project Identity</h2>
              </div>
              <div className={styles.inputGroup}>
                <label>Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Crypto Masters" 
                  value={projectData.name}
                  onChange={e => setProjectData({...projectData, name: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>URL Slug</label>
                <div className={styles.slugInput}>
                  <span>aurum.app/f/</span>
                  <input 
                    type="text" 
                    placeholder="crypto-masters" 
                    value={projectData.slug}
                    onChange={e => setProjectData({...projectData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  />
                </div>
              </div>
              <button className={styles.btnNext} onClick={nextStep} disabled={!projectData.slug}>
                Next: Choose Angle <ChevronRight />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <Layout className={styles.icon} />
                <h2>Sales Angle & Psychology</h2>
              </div>
              <div className={styles.angleGrid}>
                <div 
                  className={`${styles.angleCard} ${projectData.angle === 'pitch' ? styles.angleActive : ''}`}
                  onClick={() => setProjectData({...projectData, angle: 'pitch'})}
                >
                  <Rocket className={styles.angleIcon} />
                  <h3>Direct Pitch</h3>
                  <p>High energy, focus on rapid results and financial freedom.</p>
                </div>
                <div 
                  className={`${styles.angleCard} ${projectData.angle === 'consultative' ? styles.angleActive : ''}`}
                  onClick={() => setProjectData({...projectData, angle: 'consultative'})}
                >
                  <PenTool className={styles.angleIcon} />
                  <h3>Consultative</h3>
                  <p>Logical, build trust via education and interrogation.</p>
                </div>
                <div 
                  className={`${styles.angleCard} ${projectData.angle === 'pay-it-forward' ? styles.angleActive : ''}`}
                  onClick={() => setProjectData({...projectData, angle: 'pay-it-forward'})}
                >
                  <Gift className={styles.angleIcon} />
                  <h3>Pay It Forward</h3>
                  <p>Fund the user's first $100. Highest reciprocity & trust.</p>
                </div>
                <div className={styles.angleCardDisabled}>
                  <Zap className={styles.angleIcon} />
                  <h3>Fear/Urgency</h3>
                  <p>Coming Soon: Scarcity-driven layout.</p>
                </div>
              </div>

              <div className={styles.featureToggles}>
                <h3>Funnel Elements</h3>
                <div className={styles.toggleGrid}>
                  <label className={styles.toggleItem}>
                    <input 
                      type="checkbox" 
                      checked={projectData.config.showCalculator} 
                      onChange={e => setProjectData({...projectData, config: {...projectData.config, showCalculator: e.target.checked}})}
                    />
                    <span>Yield Calculator</span>
                  </label>
                  <label className={styles.toggleItem}>
                    <input 
                      type="checkbox" 
                      checked={projectData.config.showBotBadge} 
                      onChange={e => setProjectData({...projectData, config: {...projectData.config, showBotBadge: e.target.checked}})}
                    />
                    <span>Live Earnings Badge</span>
                  </label>
                  <label className={styles.toggleItem}>
                    <input 
                      type="checkbox" 
                      checked={projectData.config.showYieldStats} 
                      onChange={e => setProjectData({...projectData, config: {...projectData.config, showYieldStats: e.target.checked}})}
                    />
                    <span>Performance Charts</span>
                  </label>
                </div>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnBack} onClick={prevStep}>Back</button>
                <button className={styles.btnNext} onClick={nextStep}>Next: Content <ChevronRight /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <Sparkles className={styles.icon} />
                <h2>Copywriter Interface</h2>
              </div>
              <div className={styles.inputGroup}>
                <label>Main Headline (HTML Supported)</label>
                <textarea 
                  rows={2}
                  value={projectData.content.title}
                  onChange={e => updateContent('title', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Sub-headline</label>
                <input 
                  type="text"
                  value={projectData.content.subtitle}
                  onChange={e => updateContent('subtitle', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Background Video URL (MP4)</label>
                <input 
                  type="text"
                  value={projectData.content.videoUrl}
                  onChange={e => updateContent('videoUrl', e.target.value)}
                />
              </div>
              <div className={styles.btnRow}>
                <button className={styles.btnBack} onClick={prevStep}>Back</button>
                <button className={styles.btnNext} onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? 'Architecting...' : 'Deploy Funnel'} <Rocket />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles.successSection}>
              <CheckCircle2 className={styles.successIcon} />
              <h2>Funnel Deployed Successfully!</h2>
              <p>Your new project is live and ready for traffic.</p>
              
              <div className={styles.resultBox}>
                <code>{generatedUrl}</code>
                <button onClick={() => navigator.clipboard.writeText(generatedUrl)}>Copy</button>
              </div>

              <div className={styles.btnRow} style={{ justifyContent: 'center', marginTop: '32px' }}>
                <a href={generatedUrl} target="_blank" className={styles.btnPrimary}>View Live Project</a>
                <button className={styles.btnSecondary} onClick={() => setStep(1)}>Create Another</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .highlight { color: #d4af37; }
      `}</style>
    </main>
  );
}
