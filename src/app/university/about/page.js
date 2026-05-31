'use client';

import React from 'react';
import { ArrowLeft, Sparkles, Shield, Cpu, Users, GraduationCap, ChevronRight, Server } from 'lucide-react';

export default function AboutUniversity() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-[#00ff88] rounded-full blur-[150px] opacity-[0.06] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[50%] bg-[#2d8cf0] rounded-full blur-[150px] opacity-[0.06] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <a 
            href="/" 
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[#00ff88]"
            aria-label="Back to home"
          >
            <ArrowLeft size={18} />
          </a>
          <div className="flex items-center gap-2">
            <img src="/images/aurumrise_university_logo.png" alt="University Logo" className="h-10 w-auto rounded-lg border border-white/10 shadow-md shadow-[#00ff88]/10" />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-wider uppercase">AURUMRISE</span>
              <span className="text-[10px] text-[#00ff88] font-bold tracking-widest uppercase">UNIVERSITY</span>
            </div>
          </div>
        </div>
        <div>
          <a 
            href="/#register" 
            className="text-xs sm:text-sm font-bold bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88]/30 text-[#00ff88] px-4 py-2 rounded-full transition-all flex items-center gap-2"
          >
            Claim Access <ChevronRight size={14} />
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20">
            <GraduationCap size={16} className="text-[#00ff88]" />
            <span className="text-xs font-bold text-[#00ff88] uppercase tracking-wider">Our Philosophy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight font-heading">
            Radical Transparency.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#2d8cf0]">
              Verify Before Participating.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            AurumRise University was founded to challenge the traditional financial education industry. We believe in replacing marketing hype with actual blueprints, opening our algorithmic setups, neobank structures, and commissions program for institutional-grade audits.
          </p>
        </section>

        {/* Core Pillars */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#00ff88] uppercase tracking-widest">EDUCATIONAL FRAMEWORK</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">The Three Pillars of Our Curriculum</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 hover:border-[#00ff88]/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88]">
                <Cpu size={20} />
              </div>
              <h3 className="font-bold text-lg">1. Ecosystem Infrastructure</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Deconstructs the operational dynamics of token utility, card hierarchies (Nova to Infinity), and private neobanking rails that bypass standard legacy friction.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 hover:border-[#2d8cf0]/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#2d8cf0]/10 flex items-center justify-center text-[#2d8cf0]">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-lg">2. Quantitative Systems</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                A mathematical deep dive into autonomous quant algorithms. Inspect active configurations, arbitrage setups, and daily compounding yield behaviors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 hover:border-purple-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-lg">3. RWA & Card Commissions</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Understand how real-world assets (RWA) secure digital deposits, and audit the math behind partner progressions and referral rank rewards.
              </p>
            </div>
          </div>
        </section>

        {/* Founding Team */}
        <section className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#00ff88] uppercase tracking-widest">LEADERSHIP CREDO</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Binance-Grade Institutional Experience</h2>
            <p className="text-sm text-white/60 mt-3 leading-relaxed">
              Our curriculum is designed and managed by seasoned digital asset executives and quant managers who values compliance, transparency, and technical rigor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#00ff88]/10 text-[#00ff88] px-3 py-1 rounded-full text-xs font-bold font-mono">CEO</div>
                <h4 className="font-bold text-white">Bryan Benson</h4>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Former Director at Binance, establishing high standards for token utility, liquidity analysis, and compliance parameters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#2d8cf0]/10 text-[#2d8cf0] px-3 py-1 rounded-full text-xs font-bold font-mono">TRADING</div>
                <h4 className="font-bold text-white">Drei Menza</h4>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Co-Founder and Director of Trading Operations, bringing over a decade of quantitative trading infrastructure development.
              </p>
            </div>
          </div>
        </section>

        {/* Compute Architecture Warning */}
        <section className="grid md:grid-cols-12 gap-8 items-center border-t border-white/5 pt-16">
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-2xl font-black flex items-center gap-2">
              <Server size={22} className="text-[#00ff88]" />
              Compute Quotas & Bot Protection
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Because our syllabus portal integrates an active AI guide powered by advanced language models, loading the database and querying vector coordinates consumes server compute quotas.
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              To prevent scrapers from downloading our proprietary course assets and to protect our server nodes, we strictly limit complimentary test passes to 10 login sessions per user profile. Anomalous browser actions and scraping attempts will result in automated IP bans.
            </p>
          </div>
          <div className="md:col-span-5 bg-black/40 border border-white/10 p-6 rounded-2xl space-y-4">
            <h4 className="font-black text-sm text-[#00ff88] uppercase tracking-wider">Access Parameters</h4>
            <div className="space-y-3 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                <span>Capped at 10 logins per user profile</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                <span>Real-time vector search logs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                <span>Strict IP behavior checks enforced</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                <span>Zero payment verification required to test</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-16 bg-black/40 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs text-white/40 space-y-3">
          <p className="max-w-2xl mx-auto leading-relaxed">
            Disclaimer: AurumRise University provides financial education and training models. Simulated trading setups do not guarantee real returns.
          </p>
          <p>© 2026 AURUMRISE UNIVERSITY. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="/privacy" className="hover:text-[#00ff88] transition-colors font-bold">Privacy Policy</a>
            <a href="/tos" className="hover:text-[#00ff88] transition-colors font-bold">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
