'use client';

import { useState, useEffect } from 'react';
import { Gift, ShieldCheck, Zap, Lock, Shield, Globe, Activity, TrendingUp } from 'lucide-react';
import OptInBadge from '@/components/OptInBadge';

const PayItForwardAngleV2 = ({ project, handleOptIn, isProcessing, status }) => {
  const { content = {} } = project;
  const [fundingPool, setFundingPool] = useState(8400);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOptIn(formData);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFundingPool(p => p > 100 ? p - Math.floor(Math.random() * 100) : p);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0010] text-slate-100 font-sans selection:bg-[#ff3cac]/30">
      
      {/* Urgency Bar */}
      <div className="bg-gradient-to-r from-[#ff6b35] to-[#c026d3] text-white py-3 px-4 text-center font-black text-sm md:text-base tracking-wider uppercase">
        🔥 Today&apos;s Funding Pool: ${fundingPool.toLocaleString()} Remaining
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-24 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Background Video & Glows */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0010]/95 to-[#c026d3]/10 z-10" />
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-25">
            <source src={content.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-futuristic-digital-connection-technology-background-40432-large.mp4"} type="video/mp4" />
          </video>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full max-h-[700px] bg-[#c026d3]/15 blur-[120px] rounded-full pointer-events-none z-0" />
        
        <div className="relative z-10 inline-block px-5 py-2 rounded-full border border-[#c026d3]/40 bg-[#c026d3]/15 text-[#ff3cac] text-xs md:text-sm font-black tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(192,38,211,0.2)]">
          🎁 Limited to the next 1,000 accounts only
        </div>
        
        <h1 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
          The First $100 On Us – <br className="hidden md:block" />
          <span className="bg-gradient-to-br from-[#ff6b35] to-[#c026d3] bg-clip-text text-transparent">
            Start Risk-Free
          </span>
        </h1>
        
        <p className="relative z-10 text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed text-center">
          We&apos;re giving you <strong className="text-white"> $100 in real trading capital</strong> to test <strong>Quantum Alpha</strong> — our non-custodial AI trading agent. Zero risk.
        </p>

        {/* Hero Form */}
        <div className="relative z-10 w-full max-w-3xl mx-auto mb-12">
          {!isProcessing ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input 
                type="text" 
                placeholder="First Name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full sm:w-1/3 bg-black/40 border border-[#c026d3]/30 focus:border-[#ff6b35] rounded-2xl p-4 md:px-6 md:py-5 text-white placeholder-slate-500 outline-none transition text-base md:text-lg"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full sm:w-1/3 bg-black/40 border border-[#c026d3]/30 focus:border-[#ff6b35] rounded-2xl p-4 md:px-6 md:py-5 text-white placeholder-slate-500 outline-none transition text-base md:text-lg"
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-[#ff6b35] to-[#c026d3] hover:opacity-90 text-white font-black p-4 md:px-10 md:py-5 rounded-2xl flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-[0_0_40px_rgba(255,107,53,0.4)] text-base md:text-lg"
              >
                Claim My Free $100 Before It&apos;s Gone
              </button>
            </form>
          ) : (
            <div className="bg-black/40 border border-[#c026d3]/30 rounded-2xl p-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#c026d3]/30 border-t-[#ff6b35] rounded-full animate-spin mb-4" />
              <p className="text-[#ff6b35] font-bold tracking-widest uppercase">{status || 'Processing...'}</p>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-2"><Lock size={16} className="text-[#ff6b35]" /> Non-Custodial</div>
          <div className="flex items-center gap-2"><Globe size={16} className="text-[#ff6b35]" /> On-Chain</div>
          <div className="flex items-center gap-2"><Shield size={16} className="text-[#ff6b35]" /> Your Wallet, Your Funds</div>
        </div>
      </section>

      {/* Social Proof / Performance Section */}
      <section className="bg-black/40 border-y border-white/5 py-20 px-6 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Proven On-Chain Performance</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Recent Performance (May 2026):</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-[#14001e]/80 border border-[#c026d3]/20 rounded-2xl p-8 text-center hover:border-[#ff6b35]/50 transition duration-300">
              <Activity className="mx-auto mb-4 text-[#ff6b35]" size={36} />
              <div className="text-4xl font-black text-[#ff6b35] mb-2">+18.12%</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Since start of month<br/><span className="text-[#ff6b35]/80">(+1.03% Daily)</span></div>
            </div>
            <div className="bg-[#14001e]/80 border border-[#c026d3]/20 rounded-2xl p-8 text-center hover:border-[#ff6b35]/50 transition duration-300">
              <TrendingUp className="mx-auto mb-4 text-[#ff6b35]" size={36} />
              <div className="text-4xl font-black text-white mb-2">16,579</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Deals Executed<br/><span className="text-slate-500">Fully Automated</span></div>
            </div>
            <div className="bg-[#14001e]/80 border border-[#c026d3]/20 rounded-2xl p-8 text-center hover:border-[#ff6b35]/50 transition duration-300">
              <Zap className="mx-auto mb-4 text-[#ff6b35]" size={36} />
              <div className="text-4xl font-black text-white mb-2">55%</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Win Rate<br/><span className="text-slate-500">Consistent Edge</span></div>
            </div>
          </div>

          {/* Screenshots Grid (V3 Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#14001e]/80 border border-[#c026d3]/20 rounded-2xl flex items-center justify-center p-4 h-80 shadow-2xl shadow-[#c026d3]/10 hover:-translate-y-2 transition duration-300">
              <img src="/proof2.png" alt="Daily Performance" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
            <div className="bg-[#14001e]/80 border border-[#c026d3]/20 rounded-2xl flex items-center justify-center p-4 h-80 shadow-2xl shadow-[#c026d3]/10 hover:-translate-y-2 transition duration-300">
              <img src="/proof1.jpg" alt="Stats" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
            <div className="bg-[#14001e]/80 border border-[#c026d3]/20 rounded-2xl flex items-center justify-center p-4 h-80 shadow-2xl shadow-[#c026d3]/10 hover:-translate-y-2 transition duration-300">
              <img src="/proof3.png" alt="Dashboard" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Section: Why & What (V3 Style Layout, V2 Colors/Copy) */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Why We're Doing This */}
        <div>
          <h2 className="text-3xl md:text-4xl font-black mb-10 text-white">Why We&apos;re Doing This</h2>
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="bg-[#c026d3]/15 p-3 rounded-xl h-fit shrink-0 border border-[#c026d3]/30">
                <ShieldCheck className="text-[#ff6b35]" size={28} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white">Zero Risk for You</h4>
                <p className="text-slate-300 text-base leading-relaxed">We fund the account. You don’t risk any of your own money to test it.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="bg-[#c026d3]/15 p-3 rounded-xl h-fit shrink-0 border border-[#c026d3]/30">
                <Zap className="text-[#ff6b35]" size={28} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white">See Real Results First</h4>
                <p className="text-slate-300 text-base leading-relaxed">Watch the AI trade 24/7 on-chain before adding your own capital.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="bg-[#c026d3]/15 p-3 rounded-xl h-fit shrink-0 border border-[#c026d3]/30">
                <Gift className="text-[#ff6b35]" size={28} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white">True Pay-It-Forward</h4>
                <p className="text-slate-300 text-base leading-relaxed">We’d rather help new users succeed than spend money on advertising.</p>
              </div>
            </div>
          </div>
        </div>

        {/* What You Get Immediately */}
        <div className="bg-[rgba(20,0,30,0.7)] backdrop-blur-xl border border-[#c026d3]/30 rounded-3xl p-8 lg:p-12 shadow-[0_0_50px_rgba(192,38,211,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35]/10 blur-[100px] rounded-full pointer-events-none" />
          
          <h3 className="text-2xl md:text-3xl font-black mb-10 relative z-10 text-white">What You Get Immediately:</h3>
          <ul className="space-y-6 relative z-10">
            <li className="flex gap-5 items-center">
              <div className="text-[#ff6b35] shrink-0"><Gift size={24} /></div>
              <span className="font-bold text-lg text-slate-200">$100 starting capital (fully non-custodial)</span>
            </li>
            <li className="flex gap-5 items-center">
              <div className="text-[#ff6b35] shrink-0"><Zap size={24} /></div>
              <span className="font-bold text-lg text-slate-200">Access to <strong>Quantum Alpha</strong> AI Agent</span>
            </li>
            <li className="flex gap-5 items-center">
              <div className="text-[#ff6b35] shrink-0"><Activity size={24} /></div>
              <span className="font-bold text-lg text-slate-200">Live performance dashboard</span>
            </li>
            <li className="flex gap-5 items-center">
              <div className="text-[#ff6b35] shrink-0"><Shield size={24} /></div>
              <span className="font-bold text-lg text-slate-200">Full transparency (on-chain)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA & OptInBadge */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-[300px] bg-[#c026d3]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <h3 className="relative z-10 font-black text-3xl md:text-4xl text-white mb-10">Ready to see the AI work?</h3>
        
        <div className="relative z-10 w-full max-w-3xl mx-auto mb-16">
          {!isProcessing ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input 
                type="text" 
                placeholder="First Name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full sm:w-1/3 bg-black/40 border border-[#c026d3]/30 focus:border-[#ff6b35] rounded-2xl p-4 md:px-6 md:py-5 text-white placeholder-slate-500 outline-none transition text-base md:text-lg"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full sm:w-1/3 bg-black/40 border border-[#c026d3]/30 focus:border-[#ff6b35] rounded-2xl p-4 md:px-6 md:py-5 text-white placeholder-slate-500 outline-none transition text-base md:text-lg"
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-[#ff6b35] to-[#c026d3] hover:opacity-90 text-white font-black p-4 md:px-10 md:py-5 rounded-2xl flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-[0_0_40px_rgba(255,107,53,0.4)] text-base md:text-lg"
              >
                Claim My Free $100 Before It&apos;s Gone
              </button>
            </form>
          ) : (
            <div className="bg-black/40 border border-[#c026d3]/30 rounded-2xl p-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#c026d3]/30 border-t-[#ff6b35] rounded-full animate-spin mb-4" />
              <p className="text-[#ff6b35] font-bold tracking-widest uppercase">{status || 'Processing...'}</p>
            </div>
          )}
        </div>

        {/* Scarcity & Trust Signals */}
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-base font-bold text-white mb-8 border-b border-white/10 pb-8 leading-relaxed">
            <span className="text-[#ff6b35]">Limited Offer</span> — Funding pool resets daily. Once it&apos;s gone, it&apos;s gone.<br/><br/>
            <span className="text-white"><strong>Next Step:</strong> After claiming, we recommend joining our next live webinar to see exactly how the AI works.</span>
          </p>
          
          <div className="flex justify-center gap-6 flex-wrap text-white/60 text-sm font-medium">
            <div className="flex items-center gap-2"><Lock size={16} /> Non-custodial: Your keys, your funds</div>
            <div className="flex items-center gap-2"><ShieldCheck size={16} /> On-chain execution</div>
            <div className="flex items-center gap-2"><Globe size={16} /> Canadian registered company</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-white/30 text-xs md:text-sm px-6">
        <p className="mb-4 max-w-2xl mx-auto leading-relaxed">
          The $100 credit is a starting capital allocation within the Aurum Ecosystem. Terms and conditions apply. Funding is subject to availability of the daily pool.
        </p>
        <p>© 2026 {project.name || 'Aurum'}. All rights reserved.</p>
      </footer>

    </main>
  );
};

export default PayItForwardAngleV2;
