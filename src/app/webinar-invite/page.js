'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, ArrowRight, Zap, Gift, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import styles from '../finance.module.css';
import CustomTicker from '@/components/funnel/blocks/CustomTicker';
import PerformanceChart from '@/components/PerformanceChart';

const WebinarInvite = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [sponsorData, setSponsorData] = useState({ code: 'AURUM', name: 'Aurum Rise' });
  const [seatsRemaining, setSeatsRemaining] = useState(12);
  const [showNotification, setShowNotification] = useState(false);
  const [recentName, setRecentName] = useState('Someone');

  useEffect(() => {
    // Scarcity simulation
    const interval = setInterval(() => {
      setSeatsRemaining(prev => prev > 3 ? prev - 1 : prev);
    }, 45000);
    
    // Social Proof simulation
    const names = ['Marcus', 'Sarah', 'David', 'James', 'Elena', 'Michael', 'Robert', 'Linda'];
    const showNotice = () => {
      setRecentName(names[Math.floor(Math.random() * names.length)]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };
    
    const noticeTimeout = setTimeout(showNotice, 3000);
    const noticeInterval = setInterval(showNotice, 25000);

    return () => {
      clearInterval(interval);
      clearInterval(noticeInterval);
      clearTimeout(noticeTimeout);
    };
  }, []);

  useEffect(() => {
    // Resolve sponsor (simplified for build)
    const resolveSponsor = async () => {
      try {
        const res = await fetch('/api/rotator?funnel=webinar');
        if (res.ok) {
          const data = await res.json();
          setSponsorData(data);
        }
      } catch (err) {
        console.error('Sponsor resolution error:', err);
      }
    };
    resolveSponsor();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus('VERIFYING GIVEAWAY ELIGIBILITY...');
    
    await new Promise(r => setTimeout(r, 1200));
    setStatus('RESERVING WEBINAR SEAT...');
    await new Promise(r => setTimeout(r, 1000));
    setStatus('ALLOCATING ACCESS TOKEN...');
    await new Promise(r => setTimeout(r, 800));

    try {
      const res = await fetch('/api/optin', {
        method: 'POST',
        body: JSON.stringify({ 
          ...formData,
          sponsor_code: sponsorData.code,
          landing_variant: 'webinar_invite'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        setStatus('ACCESS GRANTED. REDIRECTING...');
        setTimeout(() => {
          window.location.href = `/thank-you?ref=${sponsorData.code}&webinar=true`;
        }, 1000);
      } else {
        throw new Error('Capture failed');
      }
    } catch (err) {
      window.location.href = `/thank-you?ref=${sponsorData.code}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      <Head>
        <title>Stop Watching Your Savings Shrink | Live Webinar Orientation</title>
        <meta name="description" content="Discover the institutional-grade automation system that generated 178.4% average yields for regular people in 2025." />
      </Head>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <nav className="relative z-50 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">AURUM<span className="text-indigo-400">RISE</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-500 tracking-widest uppercase">Live Orientation Active</span>
             </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-2 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-24">
            
            {/* Left Column: Hero & Video */}
            <div className="lg:col-span-6 space-y-4">
              {/* Hero Section */}
              <div className="text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest mb-6">
                    <Users size={14} className="text-indigo-400" />
                    Trusted by 118,000+
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent px-2">
                    Stop Watching Your <span className="text-indigo-400">Savings Shrink.</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed">
                    Discover the "Institutional-Grade" Automation System that generated average yields of <span className="text-white font-bold underline decoration-indigo-500/50 underline-offset-8">178.4%</span> for ordinary people in 2026.
                  </p>
                </motion.div>
              </div>

              {/* Video Player Section */}
              {!isProcessing && (
                <div className="max-w-md rounded-2xl overflow-hidden border border-white/5 shadow-inner bg-black/40 relative group cursor-pointer shadow-2xl shadow-indigo-500/10">
                      <video 
                        id="hero-video"
                        src="/videos/webinar_hook.mp4" 
                        autoPlay 
                        loop 
                        playsInline
                        className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        onClick={(e) => {
                          e.target.muted = !e.target.muted;
                          const overlay = document.getElementById('audio-overlay');
                          if (overlay) overlay.style.display = e.target.muted ? 'flex' : 'none';
                        }}
                        onLoadedMetadata={(e) => e.target.muted = true}
                      />
                      <div id="audio-overlay" className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-black/20 transition-all pointer-events-none"
                        onClick={() => {
                          const v = document.getElementById('hero-video');
                          if (v) {
                            v.muted = false;
                            document.getElementById('audio-overlay').style.display = 'none';
                          }
                        }}>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 animate-pulse">
                          <Zap size={24} className="text-white fill-white" />
                        </div>
                        <span className="text-[10px] font-black text-white mt-4 tracking-widest uppercase bg-black/60 px-3 py-1 rounded-full">Click for Sound</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">Verified Result</span>
                      </div>
                </div>
              )}
              
              {/* Giveaway Banner (Moved from Form) */}
              <div className="max-w-md bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                  <Gift className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Attend & Qualify for $100</div>
                  <div className="text-white/50 text-[11px] font-bold uppercase tracking-wider">First 100 people only</div>
                </div>
              </div>
            </div>

            {/* Right Column: Opt-in Box */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start sticky top-32">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative w-full max-w-md"
              >
                <div className="absolute inset-0 bg-indigo-500/10 blur-[80px]" />
                
                <div className="relative bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl overflow-hidden">
                  
                  {!isProcessing ? (
                    <>
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                          {seatsRemaining} Seats Remaining
                        </div>
                        <h3 className="text-3xl font-black mb-3">Secure Your Seat</h3>
                        <div className="space-y-2 mb-6">
                           {[
                             "The exact 'Gap-Capture' algorithm revealed.",
                             "Step-by-step guide to daily withdrawals.",
                             "Live qualification for the $100 Giveaway."
                           ].map((item, i) => (
                             <div key={i} className="flex items-center gap-3 text-left">
                               <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                               <span className="text-white/60 text-xs font-bold leading-tight">{item}</span>
                             </div>
                           ))}
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-3">Check Your Orientation Potential</label>
                        <div className="flex items-center gap-4">
                           <div className="flex-1">
                             <div className="text-[10px] text-white/40 mb-1 font-bold uppercase">Initial Capital</div>
                             <div className="text-xl font-black text-white">$1,500</div>
                           </div>
                           <ArrowRight size={20} className="text-white/20" />
                           <div className="flex-1 text-right">
                             <div className="text-[10px] text-indigo-400 mb-1 font-bold uppercase">Est. Monthly</div>
                             <div className="text-xl font-black text-indigo-400">+$223.00</div>
                           </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                          <input 
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-indigo-500/50 transition-colors text-white placeholder:text-white/10 font-bold"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Secure Email Address</label>
                          <input 
                            required
                            type="email"
                            placeholder="name@company.com"
                            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-indigo-500/50 transition-colors text-white placeholder:text-white/10 font-bold"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Phone Number (Optional)</label>
                          <input 
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-indigo-500/50 transition-colors text-white placeholder:text-white/10 font-bold"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full h-14 md:h-16 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/30 flex flex-col items-center justify-center mt-6 active:scale-95 group"
                        >
                          <div className="flex items-center gap-3">
                            GRANT MY ACCESS NOW <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                          <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Orientation Link Sent via Email</span>
                        </button>

                        <div className="flex items-center justify-center gap-6 pt-6 text-[10px] font-bold text-white/30 tracking-widest">
                          <div className="flex items-center gap-2"><Lock size={12} /> 256-BIT ENCRYPTION</div>
                          <div className="flex items-center gap-2 text-emerald-400"><Shield size={12} /> NO CREDIT CARD</div>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="py-20 text-center space-y-10">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={32} />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-black text-white uppercase tracking-[0.2em]">{status}</h4>
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Authorized Session In Progress</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Social Proof & Problems (Moved below form) */}
          <div className="max-w-5xl mx-auto space-y-12 mb-32">
            {/* Problem Section (Horizontal grid) */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { emoji: "😤", quote: "My bank pays me pennies while they make billions.", sub: "Stop the wealth leak." },
                { emoji: "😫", quote: "I want to invest, but I don't have 40 hours to stare at charts.", sub: "Automate the heavy lifting." },
                { emoji: "🤯", quote: "I'm tired of risky schemes and pyramid scams.", sub: "Built on real AI tech." }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors text-center">
                  <div className="text-3xl mb-4">{item.emoji}</div>
                  <p className="text-[15px] font-bold text-white mb-2 leading-snug">"{item.quote}"</p>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Forbes & Proof */}
            <div className="pt-12 border-t border-white/5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 grayscale opacity-40">
                 <div className="text-2xl font-black tracking-widest">FORBES</div>
                 <div className="text-xl font-black italic">Institutional Review</div>
                 <div className="text-2xl font-black">2026 GLOBAL FINANCE</div>
              </div>
            </div>
          </div>

          {/* Bonus Stack Section */}
          <section className="mt-40">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">The Attendee Bonus Stack</h2>
              <p className="text-white/40 text-lg">Valued at over $297 — Yours free just for showing up.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               <div className="relative group">
                 <div className="absolute inset-0 bg-indigo-600/5 rounded-[32px] group-hover:bg-indigo-600/10 transition-colors" />
                 <div className="relative p-6 md:p-10 border border-white/5 rounded-[32px] flex flex-col items-center text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-indigo-500/20">
                      <Gift size={28} className="md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black mb-4">$100 Cash Giveaway</h3>
                    <p className="text-white/50 leading-relaxed font-medium text-sm md:text-base">We are giving away $100 to the first 100 people who attend and qualify during the session. Simple, direct, and verifiable.</p>
                    <div className="mt-6 md:mt-8 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] md:text-xs font-black uppercase tracking-widest">Limited Availability</div>
                 </div>
               </div>

               <div className="relative group">
                 <div className="absolute inset-0 bg-blue-600/5 rounded-[32px] group-hover:bg-blue-600/10 transition-colors" />
                 <div className="relative p-6 md:p-10 border border-white/5 rounded-[32px] flex flex-col items-center text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-blue-500/20">
                      <Zap size={28} className="md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black mb-4">The Wealth-Builder Accelerator</h3>
                    <p className="text-white/50 leading-relaxed font-medium text-sm md:text-base">Unlock our proprietary software built to identify high-yield market gaps automatically. Yours free just for joining the orientation.</p>
                    <div className="mt-6 md:mt-8 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-widest">$197 Value · FREE</div>
                 </div>
               </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mt-40 grid md:grid-cols-3 gap-12 max-w-6xl mx-auto text-center">
             {[
               { icon: Globe, title: "Absolute Financial Peace", desc: "Stop worrying about market volatility. Our software scans 400+ data points per second to identify safe, consistent opportunities." },
               { icon: Zap, title: "Total Time Freedom", desc: "Reclaim your weekends. The AI does the heavy lifting, allowing you to focus on what matters while your capital works." },
               { icon: Lock, title: "100% Capital Control", desc: "Never worry about locked funds. Your daily profits are yours to spend or withdraw anytime via our NeoBank card." }
             ].map((benefit, i) => (
               <div key={i} className="space-y-6">
                 <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
                    <benefit.icon size={28} />
                 </div>
                 <h4 className="text-xl font-black">{benefit.title}</h4>
                 <p className="text-white/40 text-sm leading-relaxed font-medium">{benefit.desc}</p>
               </div>
             ))}
          </section>

          {/* Final Social Proof */}
          <section className="mt-40 py-24 border-t border-white/5 text-center">
             <div className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em] mb-12">Radical Transparency</div>
             <div className="grid md:grid-cols-4 gap-12">
                <div>
                   <div className="text-4xl font-black mb-2">118K+</div>
                   <div className="text-white/30 text-xs font-bold uppercase tracking-widest">Global Partners</div>
                </div>
                <div>
                   <div className="text-4xl font-black mb-2">$115M+</div>
                   <div className="text-white/30 text-xs font-bold uppercase tracking-widest">Funds Managed</div>
                </div>
                <div>
                   <div className="text-4xl font-black mb-2">178.4%</div>
                   <div className="text-white/30 text-xs font-bold uppercase tracking-widest">2025 Avg Yield</div>
                </div>
                <div>
                   <div className="text-4xl font-black mb-2">0</div>
                   <div className="text-white/30 text-xs font-bold uppercase tracking-widest">Security Breaches</div>
                </div>
             </div>
          </section>

          {/* Footer Footer */}
          <footer className="mt-40 text-center py-12 border-t border-white/5 space-y-6">
            <div className="flex justify-center gap-8">
               <Zap className="text-indigo-500 opacity-20" size={24} />
               <Zap className="text-indigo-500 opacity-20" size={24} />
               <Zap className="text-indigo-500 opacity-20" size={24} />
            </div>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">© 2026 AURUM RISE SYSTEMS · ALL RIGHTS RESERVED</p>
            <div className="flex justify-center gap-6 text-white/10 text-[10px] font-bold uppercase tracking-widest">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-white transition-colors">Risk Disclosure</a>
            </div>
          </footer>


          {/* Social Proof Notification */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: showNotification ? 1 : 0, x: showNotification ? 0 : -100 }}
            className="fixed bottom-8 left-8 z-[100] hidden md:flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl"
          >
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <Users size={18} className="text-indigo-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{recentName} from USA</div>
              <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Just Reserved their orientation seat</div>
            </div>
          </motion.div>

        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #050505;
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default WebinarInvite;
