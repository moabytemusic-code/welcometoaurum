'use client';

import { useState, useEffect } from 'react';
import { Gift, ShieldCheck, Zap, Lock, Shield, Globe, Activity, TrendingUp, ArrowRight } from 'lucide-react';

const PayItForwardAngleV3 = ({ project, handleOptIn, isProcessing, status }) => {
  const { content = {} } = project;
  const [fundingPool, setFundingPool] = useState(8400);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setFundingPool(p => p > 100 ? p - Math.floor(Math.random() * 100) : p);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOptIn(formData);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      
      {/* Urgency Bar */}
      <div className="bg-emerald-500 text-slate-950 py-2.5 px-4 text-center font-bold text-sm md:text-base tracking-wider uppercase">
        🔥 Today&apos;s Funding Pool: ${fundingPool.toLocaleString()} Remaining • Only 1,000 accounts
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full max-h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-8">
          Zero Risk Trial
        </div>
        
        <h1 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
          The First $100 On Us – <br className="hidden md:block" />
          <span className="text-emerald-400">Start AI Trading Risk-Free</span>
        </h1>
        
        <p className="relative z-10 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          We give you <strong className="text-white"> $100 real capital</strong> to test Quantum Alpha, our non-custodial AI trading agent. Zero risk.
        </p>
        
        {/* Hero Form */}
        <div className="relative z-10 w-full max-w-2xl mx-auto mb-12">
          {!isProcessing ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input 
                type="text" 
                placeholder="First Name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full sm:w-1/3 bg-slate-900/80 border border-slate-700 focus:border-emerald-500 rounded-xl px-6 py-4 text-white placeholder-slate-500 outline-none transition"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full sm:w-1/3 bg-slate-900/80 border border-slate-700 focus:border-emerald-500 rounded-xl px-6 py-4 text-white placeholder-slate-500 outline-none transition"
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                Claim My Free $100 <ArrowRight size={20} />
              </button>
            </form>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-emerald-400 font-bold tracking-widest uppercase">{status || 'Processing...'}</p>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-2"><Lock size={16} className="text-emerald-500" /> Non-Custodial</div>
          <div className="flex items-center gap-2"><Globe size={16} className="text-emerald-500" /> On-Chain</div>
          <div className="flex items-center gap-2"><Shield size={16} className="text-emerald-500" /> Your Wallet, Your Funds</div>
        </div>
      </section>

      {/* Social Proof / Performance Section */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Proven On-Chain Performance</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Quantum Alpha analyzes millions of data points to execute precision trades 24/7.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center hover:border-emerald-500/50 transition duration-300">
              <Activity className="mx-auto mb-4 text-emerald-500" size={36} />
              <div className="text-4xl font-black text-emerald-400 mb-2">+18.12%</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Since start of month<br/><span className="text-emerald-500/80">(+1.03% Daily)</span></div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center hover:border-emerald-500/50 transition duration-300">
              <TrendingUp className="mx-auto mb-4 text-emerald-500" size={36} />
              <div className="text-4xl font-black text-white mb-2">16,579</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Deals Executed<br/><span className="text-slate-500">Fully Automated</span></div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center hover:border-emerald-500/50 transition duration-300">
              <Zap className="mx-auto mb-4 text-emerald-500" size={36} />
              <div className="text-4xl font-black text-white mb-2">55%</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Win Rate<br/><span className="text-slate-500">Consistent Edge</span></div>
            </div>
          </div>

          {/* Screenshots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center p-4 h-80 shadow-2xl shadow-emerald-500/5 hover:-translate-y-2 transition duration-300">
              <img src="/proof2.png" alt="Daily Performance" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center p-4 h-80 shadow-2xl shadow-emerald-500/5 hover:-translate-y-2 transition duration-300">
              <img src="/proof1.jpg" alt="Stats" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center p-4 h-80 shadow-2xl shadow-emerald-500/5 hover:-translate-y-2 transition duration-300">
              <img src="/proof3.png" alt="Dashboard" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Section: Why & What */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Why We're Giving $100 */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Why We&apos;re Giving $100</h2>
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="bg-emerald-500/10 p-3 rounded-xl h-fit shrink-0">
                <ShieldCheck className="text-emerald-500" size={28} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white">Zero Risk for You</h4>
                <p className="text-slate-400 text-base leading-relaxed">We put up the starting capital. You don&apos;t risk any of your own money to test it.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="bg-emerald-500/10 p-3 rounded-xl h-fit shrink-0">
                <Activity className="text-emerald-500" size={28} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white">See Real Results First</h4>
                <p className="text-slate-400 text-base leading-relaxed">Watch the AI trade 24/7 on-chain before adding your own capital.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="bg-emerald-500/10 p-3 rounded-xl h-fit shrink-0">
                <Gift className="text-emerald-500" size={28} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white">True Pay-It-Forward</h4>
                <p className="text-slate-400 text-base leading-relaxed">We&apos;d rather help new users succeed than spend money on advertising.</p>
              </div>
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-emerald-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-10 relative z-10">What You Get:</h2>
          <ul className="space-y-6 relative z-10">
            <li className="flex gap-5 items-center">
              <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 shrink-0"><Gift size={24} /></div>
              <span className="font-bold text-lg text-slate-200">$100 starting capital</span>
            </li>
            <li className="flex gap-5 items-center">
              <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 shrink-0"><Zap size={24} /></div>
              <span className="font-bold text-lg text-slate-200">Full access to Quantum Alpha</span>
            </li>
            <li className="flex gap-5 items-center">
              <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 shrink-0"><Activity size={24} /></div>
              <span className="font-bold text-lg text-slate-200">Live performance dashboard</span>
            </li>
            <li className="flex gap-5 items-center">
              <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 shrink-0"><Globe size={24} /></div>
              <span className="font-bold text-lg text-slate-200">24/7 automated trading</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center max-w-4xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <h2 className="relative z-10 text-4xl md:text-5xl font-black mb-8 text-white">Ready to see the AI work?</h2>
        <p className="relative z-10 text-slate-300 mb-12 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Limited daily pool. After claiming, join our next webinar to see the full strategy live.
        </p>
        
        <div className="relative z-10 w-full max-w-3xl mx-auto mb-8">
          {!isProcessing ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input 
                type="text" 
                placeholder="First Name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full sm:w-1/3 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-2xl px-6 py-5 text-white placeholder-slate-500 outline-none transition text-lg"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full sm:w-1/3 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-2xl px-6 py-5 text-white placeholder-slate-500 outline-none transition text-lg"
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 py-5 rounded-2xl flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-[0_0_40px_rgba(16,185,129,0.4)] text-lg"
              >
                Claim My Free $100 Before It&apos;s Gone
              </button>
            </form>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-emerald-400 font-bold tracking-widest uppercase">{status || 'Processing...'}</p>
            </div>
          )}
        </div>
        
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 text-center text-slate-500 text-sm px-6">
        <p className="mb-4 max-w-2xl mx-auto leading-relaxed">The $100 credit is a starting capital allocation within the Aurum Ecosystem. Terms and conditions apply. Funding is subject to availability of the daily pool.</p>
        <p>© 2026 {project.name || 'Aurum'}. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default PayItForwardAngleV3;
