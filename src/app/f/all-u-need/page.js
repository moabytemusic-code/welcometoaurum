'use client';

import { ArrowRight, Sprout, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AllUNeedLanding() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus('PREPARING ACCESS...');

    try {
      const response = await fetch('/api/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.name,
          landing_variant: 'all-u-need',
          team_slug: 'all-u-need' // Unique tag for the All U Need rotator
        })
      });
      if (response.ok) {
        const sponsorData = await response.json();
        setStatus('ACCESS GRANTED. REDIRECTING...');
        setTimeout(() => {
          window.location.href = `/thank-you?ref=${sponsorData.code}`;
        }, 1000);
      } else {
        throw new Error('Capture failed');
      }
    } catch (err) {
      console.error('Failed to capture lead:', err);
      window.location.href = `/thank-you?ref=1W145K`; // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#060906] text-white font-sans selection:bg-[#22c55e] selection:text-black">
      {/* Background Glows (Green & Gold mix) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#22c55e] opacity-[0.03] blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4af37] opacity-[0.04] blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Header / Logo Stylization */}
        <header className="mb-14">
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Sprout className="w-8 h-8 text-[#22c55e]" /> ALL U NEED
            </span>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-400">
              Garden Supply & Simple Wealth Systems
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 text-[#22c55e] text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          Exclusive Customer Invitation
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
          You've grown a beautiful garden. <br />
          <span className="text-[#d4af37]">Now, let's make your money work just as hard as you do.</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
          As a loyal <strong>All U Need</strong> customer, you know that the right tools and automation create the biggest yields. We're inviting you to apply that exact same science to your finances using our simple Private Wealth System.
        </p>

        {/* Optin Form Card */}
        <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-50"></div>

          <div className="flex flex-col gap-5 text-left mb-8">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-[#22c55e] mt-0.5 shrink-0" />
              <p className="text-gray-300 text-sm"><strong>Automatic Growth:</strong> Just like a timed waterer, this system works automatically to grow your savings.</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#22c55e] mt-0.5 shrink-0" />
              <p className="text-gray-300 text-sm"><strong>Community Growth Plan:</strong> Join the "All U Need" team and let our group system help you build your future.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="First Name" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#22c55e] transition-colors"
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#22c55e] transition-colors"
            />
            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#22c55e] hover:bg-[#1ea851] text-black font-extrabold uppercase tracking-widest rounded-xl px-5 py-4 mt-2 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {status || 'Preparing Access...'}</>
              ) : (
                <>Get The Free Breakdown <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-6 text-center">
            Zero commitment required to view the orientation.
          </p>
        </div>
      </div>
    </div>
  );
}
