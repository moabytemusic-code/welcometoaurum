'use client';

import React, { useEffect } from 'react';
import OptInForm from '@/components/OptInForm';
import ChatWidgetEmbed from '@/components/ChatWidgetEmbed';
import { 
  Sparkles, 
  BookOpen, 
  Bot, 
  Zap, 
  Shield, 
  ChevronRight, 
  GraduationCap, 
  Clock, 
  ArrowRight, 
  HelpCircle, 
  Users, 
  Server 
} from 'lucide-react';

export default function UniversityLandingPage() {
  useEffect(() => {
    // Capture and save affiliate ref code if present in the URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('aurum_affiliate', ref);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans antialiased">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-[#00ff88] rounded-full blur-[150px] opacity-[0.07] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[50%] bg-[#2d8cf0] rounded-full blur-[150px] opacity-[0.07] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/images/aurumrise_university_logo.png" alt="AurumRise University Logo" className="h-10 sm:h-12 w-auto rounded-lg border border-white/10 shadow-md shadow-[#00ff88]/10" />
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black tracking-wider uppercase">AURUMRISE</span>
            <span className="text-[10px] text-[#00ff88] font-bold tracking-widest uppercase">UNIVERSITY</span>
          </div>
        </div>
        <div>
          <a 
            href="#register" 
            className="text-xs sm:text-sm font-bold bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88]/30 text-[#00ff88] px-4 py-2 rounded-full transition-all flex items-center gap-2"
          >
            Claim Access <ChevronRight size={14} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Pitch and Value Proposition (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 w-fit">
              <Sparkles size={16} className="text-[#00ff88]" />
              <span className="text-xs font-bold text-[#00ff88] uppercase tracking-wider">
                TEMPORARY PARTNER-BYPASS ACTIVE
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight font-heading">
              Inspect the Code.<br />
              Verify the Strategy.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#2d8cf0]">
                Enter the University.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
              We are temporarily lifting our partner-only restriction. Secure a complimentary 10-visit pass to the official Education Portal to inspect our proprietary algorithmic models, neobank infrastructure, and partner commissions. No credit card required.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
                <div className="bg-[#00ff88]/20 p-2 rounded-lg text-[#00ff88] shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Temporary Access Window</h4>
                  <p className="text-xs text-white/50 mt-0.5">Doors close when monthly compute limits are reached.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
                <div className="bg-[#2d8cf0]/20 p-2 rounded-lg text-[#2d8cf0] shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Zero Commitment Required</h4>
                  <p className="text-xs text-white/50 mt-0.5">No credit cards, billing, or transaction details needed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Lead Capture Form Card (5 cols) */}
          <div id="register" className="lg:col-span-5 relative">
            {/* Ambient Glow behind the card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff88]/10 to-[#2d8cf0]/10 rounded-3xl filter blur-xl -z-10" />
            
            <div className="bg-black/40 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-black">Register Your Pass</h3>
                <p className="text-xs sm:text-sm text-white/50 mt-1">
                  Secure your complimentary 10-session token instantly.
                </p>
              </div>

              {/* Dynamic OptInForm component */}
              <OptInForm 
                buttonText="Claim Your Complimentary Pass"
                variant="university-freemium"
                redirectUrl="/thank-you-syllabus"
              />

              <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                  <span>100% Complimentary Access to Syllabus</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                  <span>No Payment Required</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                  <span>Secured via SSL & Non-Custodial Verification</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Section 2: Problem Agitation */}
        <section className="mt-24 sm:mt-32 border-t border-white/5 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black">Tired of Black Boxes & Marketing Hype?</h2>
            <p className="text-white/60 mt-3 text-sm sm:text-base">
              The wealth education industry is flooded with copy-paste gurus who hide their systems behind paywalls. We believe in total verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
              <span className="text-3xl">😤</span>
              <h4 className="font-bold text-lg text-white">"Every system is a black box."</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                Most platforms show screenshots of gains but hide the underlying mechanisms. Aurum Rise University opens the actual educational blueprints for audits.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
              <span className="text-3xl">😫</span>
              <h4 className="font-bold text-lg text-white">"I hate trial subscriptions."</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                You shouldn't have to enter a credit card just to check if the course content is premium. Our 10-visit pass is entirely complimentary, with zero future billing rules.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
              <span className="text-3xl">🤯</span>
              <h4 className="font-bold text-lg text-white">"Show me the math."</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                We layout the exact modules explaining our algorithmic trading configurations, deposit rules, and asset-backed settlement models so you verify before participating.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Curriculum / Course Preview */}
        <section className="mt-24 sm:mt-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              <img 
                src="/images/aurumrise_university_logo.png" 
                alt="AurumRise University Seal" 
                className="h-16 w-16 rounded-xl border border-white/10 shadow-lg shadow-black/50 hidden sm:block"
              />
              <div>
                <span className="text-xs font-bold text-[#00ff88] uppercase tracking-widest">
                  OFFICIAL SYLLABUS OUTLINE
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-2">What You Will Inspect</h2>
              </div>
            </div>
            <p className="text-white/50 max-w-md text-sm">
              Your complimentary pass grants full, unrestricted access to the complete learning modules and active AI chatbot query tools.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Module 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#00ff88]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00ff88]/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="bg-[#00ff88]/10 text-[#00ff88] w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mb-6">
                01
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#00ff88] transition-colors">
                Ecosystem Infrastructure
              </h3>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Understand the delta between stagnant fiat-banking assets and active digital asset allocations. Learn the foundational pillars of our neobank.
              </p>
              <ul className="space-y-3 text-xs text-white/80 border-t border-white/5 pt-6">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                  Orientation and founding team backgrounds
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                  The structural mechanics of token utility
                </li>
              </ul>
            </div>

            {/* Module 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#2d8cf0]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#2d8cf0]/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="bg-[#2d8cf0]/10 text-[#2d8cf0] w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mb-6">
                02
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#2d8cf0] transition-colors">
                Algorithmic Yield Systems
              </h3>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                A technical deep dive into the bot algorithms that automate trading setups, capture cross-exchange spreads, and run flash swaps.
              </p>
              <ul className="space-y-3 text-xs text-white/80 border-t border-white/5 pt-6">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2d8cf0]" />
                  Activation rules and deposit routing
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2d8cf0]" />
                  Quant trading operations & parameters
                </li>
              </ul>
            </div>

            {/* Module 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="bg-purple-500/10 text-purple-400 w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mb-6">
                03
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                Partner Distribution & RWA
              </h3>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Inspect how partner commissions are distributed, how card levels work, and how real-world assets (RWA) secure vaults.
              </p>
              <ul className="space-y-3 text-xs text-white/80 border-t border-white/5 pt-6">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Commission structures & rank progression
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Physical asset backing settlement models
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Section 4: Credentials */}
        <section className="mt-24 sm:mt-32 bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-12 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-[#00ff88] uppercase tracking-widest">
                MEET THE FOUNDING TEAM
              </span>
              <h2 className="text-3xl font-black mt-2">Binance-Grade Institutional Leadership</h2>
              <p className="text-sm text-white/60 mt-4 leading-relaxed">
                Aurum Rise is built and managed by veteran operators from leading global digital asset exchanges and algorithmic operations. We value compliance, technical rigor, and complete transparency.
              </p>
              
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-[#00ff88]/10 text-[#00ff88] px-3 py-1 rounded-full text-xs font-bold font-mono">CEO</div>
                  <div>
                    <h5 className="font-bold text-sm">Bryan Benson</h5>
                    <p className="text-xs text-white/50">Former Director at Binance, establishing top-tier asset standards.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#2d8cf0]/10 text-[#2d8cf0] px-3 py-1 rounded-full text-xs font-bold font-mono">Trading</div>
                  <div>
                    <h5 className="font-bold text-sm">Drei Menza</h5>
                    <p className="text-xs text-white/50">Co-Founder & Dir. of Trading Operations, overseeing algorithmic execution.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-black/40 border border-white/10">
              <h4 className="font-bold text-base text-[#00ff88] flex items-center gap-2">
                <Server size={18} /> Compute Capacity Limits
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Because our Syllabus includes an interactive AI guide, requests require high compute loads on our database and models. As a result:
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Passes are capped at 10 logins per user
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Public registrations are paused when API quotas peak
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  IP scraping checks are strictly enforced
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: FAQ */}
        <section className="mt-24 sm:mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black">Frequently Answered Objections</h2>
            <p className="text-sm text-white/50 mt-2">
              Everything you need to know about the complimentary University pass.
            </p>
          </div>

          <div className="space-y-6">
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <HelpCircle size={16} className="text-[#00ff88]" />
                Why is this access limited to 10 visits?
              </h4>
              <p className="text-sm text-white/60 mt-2 leading-relaxed pl-6">
                Our education portal features a live AI chatbot query system. Because each query runs vector searches and language models, it consumes real server compute resources. To prevent API abuse and scraping bots from extracting our proprietary educational assets, we limit complimentary passes to 10 active sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <HelpCircle size={16} className="text-[#00ff88]" />
                Will I be asked for a credit card when my 10 visits run out?
              </h4>
              <p className="text-sm text-white/60 mt-2 leading-relaxed pl-6">
                No. Your pass is completely complimentary and does not require a payment method. When your 10 sessions expire, your account simply pauses. If you wish to continue using the portal, you can optionally apply to become a partner or obtain a premium access card.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <HelpCircle size={16} className="text-[#00ff88]" />
                Who created the curriculum?
              </h4>
              <p className="text-sm text-white/60 mt-2 leading-relaxed pl-6">
                The curriculum is developed by our founders: Bryan Benson (former Binance Director), Drei Menza (Co-Founder & Director of Trading Operations), and Ahmad Zen (Co-Founder & Marketing Director), ensuring institutional-grade credibility.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Floating Chat Widget Embed */}
      <ChatWidgetEmbed delaySeconds={20} />
    </div>
  );
}
