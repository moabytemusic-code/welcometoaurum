import React from 'react';
import { BookOpen, CheckCircle, Lock, PlayCircle, Shield } from 'lucide-react';

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center font-black text-black text-xl">
            A
          </div>
          <span className="text-xl font-black tracking-wider">AURUM RISE</span>
        </div>
        <div className="flex gap-4">
          <span className="bg-[#00ff88]/10 text-[#00ff88] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <CheckCircle size={16} /> Access Granted
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-6">
          The Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#2d8cf0]">Syllabus</span>
        </h1>
        <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
          You've successfully unlocked access to the Aurum Rise masterclass. Below is the curriculum covering our proprietary AI trading algorithms and neobanking ecosystem.
        </p>

        {/* Video Placeholder (Optional) */}
        <div className="aspect-video bg-black/50 border border-white/10 rounded-2xl flex items-center justify-center mb-16 relative overflow-hidden group cursor-pointer hover:border-[#00ff88]/50 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-t from-[#00ff88]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <PlayCircle className="text-white/20 group-hover:text-[#00ff88] transition-colors" size={80} />
          <span className="absolute bottom-6 left-6 text-white/40 font-semibold tracking-wider uppercase text-sm">
            Orientation Module • 12:45
          </span>
        </div>

        {/* Modules Grid */}
        <div className="text-left space-y-6">
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-[#2d8cf0]/20 p-4 rounded-xl shrink-0">
              <Shield className="text-[#2d8cf0]" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Module 1: The AI Paradigm</h3>
              <p className="text-white/60 mb-4">
                Discover the fundamental shift from emotional manual trading to quantitative, algorithmic data processing.
              </p>
              <ul className="space-y-2 text-sm text-white/40 font-medium">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#00ff88]" /> Introduction to Algorithmic Yield</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#00ff88]" /> Mitigating Market Volatility</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#00ff88]" /> Deep Dive into Aurum Rise Core</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row gap-6 items-start">
            {/* Locked Overlay Example */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Lock className="text-white/40 mb-3" size={32} />
              <p className="font-bold text-white/60">Module Unlocks Tomorrow</p>
            </div>
            
            <div className="bg-[#00ff88]/20 p-4 rounded-xl shrink-0">
              <BookOpen className="text-[#00ff88]" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Module 2: Ecosystem Architecture</h3>
              <p className="text-white/60 mb-4">
                How the Neobank infrastructure connects seamlessly to the trading bot for daily liquidity.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
