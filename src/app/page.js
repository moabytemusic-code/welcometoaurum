'use client';

import React, { useEffect } from 'react';
import OptInForm from '@/components/OptInForm';
import ChatWidgetEmbed from '@/components/ChatWidgetEmbed';
import { Sparkles, BookOpen, Bot, Zap, Shield, ChevronRight } from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    // Chatbot widget will remain closed by default, relying on the waving animation to attract attention.
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00ff88] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#2d8cf0] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src="/images/aurum_logo.png" alt="Aurum Rise Logo" className="h-10 w-auto" />
          <span className="text-xl font-black tracking-wider">AURUM RISE</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="/partner/login" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
            Partner Login
          </a>
          <a href="#freemium" className="text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
            Get Free Access <ChevronRight size={16} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy & Value Proposition */}
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 w-fit">
              <Sparkles size={16} className="text-[#00ff88]" />
              <span className="text-sm font-bold text-[#00ff88] uppercase tracking-wide">
                Free Premium Masterclass
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Discover the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#2d8cf0]">AI-Powered Wealth</span> Education.
            </h1>
            
            <p className="text-lg lg:text-xl text-white/60 leading-relaxed max-w-xl">
              Learn how AI finance, algorithmic trading models, neobank infrastructure, and automation are changing the future of money — without needing to be a trader or tech expert.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a href="#freemium" className="bg-[#00ff88] text-black font-black text-lg px-8 py-4 rounded-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all flex items-center justify-center gap-2">
                Unlock the Masterclass & Official Syllabus <BookOpen size={20} />
              </a>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open_aurum_chatbot'));
                  window.postMessage({ type: 'aurum_chat_toggle', isOpen: true }, '*');
                }}
                className="bg-white/5 border border-white/10 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Meet The AI <Bot size={20} />
              </button>
            </div>

            <div className="flex items-center gap-8 mt-8 border-t border-white/10 pt-8">
              <div>
                <h4 className="text-3xl font-black">18k+</h4>
                <p className="text-sm text-white/40 font-semibold uppercase tracking-wider">Active Partners</p>
              </div>
              <div>
                <h4 className="text-3xl font-black">100%</h4>
                <p className="text-sm text-white/40 font-semibold uppercase tracking-wider">Free Access</p>
              </div>
            </div>
          </div>

          {/* Right: Glassmorphism Syllabus Preview & Opt-In */}
          <div id="freemium" className="relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88] to-[#2d8cf0] rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl transform-gpu transition-transform duration-500 group-hover:rotate-y-2">
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <BookOpen className="text-[#00ff88]" size={28} />
                  Syllabus Access
                </h3>
                <span className="bg-[#00ff88]/10 text-[#00ff88] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Value: $997</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="bg-[#2d8cf0]/20 p-2 rounded-lg"><Bot className="text-[#2d8cf0]" size={20} /></div>
                  <div>
                    <h4 className="font-bold text-md">Algorithmic Trading Models</h4>
                    <p className="text-sm text-white/50 mt-1">Learn how AI analyzes market data and identifies potential opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="bg-[#00ff88]/20 p-2 rounded-lg"><Zap className="text-[#00ff88]" size={20} /></div>
                  <div>
                    <h4 className="font-bold text-md">Ecosystem Infrastructure</h4>
                    <p className="text-sm text-white/50 mt-1">Deep dive into the architecture powering the world's first AI-driven neobank.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="bg-purple-500/20 p-2 rounded-lg"><Shield className="text-purple-400" size={20} /></div>
                  <div>
                    <h4 className="font-bold text-md">Security & Automation</h4>
                    <p className="text-sm text-white/50 mt-1">Understand the fail-safes and risk mitigation protocols used by the bot.</p>
                  </div>
                </div>
              </div>

              {/* OptIn Component replaces static form */}
              <OptInForm 
                buttonText="Unlock the Masterclass & Official Syllabus"
                variant="syllabus-freemium"
                redirectUrl="/thank-you-syllabus"
              />
              
              <p className="text-center text-xs text-white/40 mt-4">
                By entering your email, you agree to receive updates from Aurum Rise. We respect your privacy.
              </p>
            </div>
          </div>
          
        </div>
      </main>

      {/* Floating Chat Widget Embed */}
      <ChatWidgetEmbed />
    </div>
  );
}
