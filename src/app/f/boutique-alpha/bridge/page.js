'use client';

import { ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';

export default function BoutiqueAlphaBridge() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#d4af37] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center">
        {/* Header */}
        <header className="mb-10 w-full flex justify-between items-center border-b border-white/10 pb-6">
          <div className="text-xl font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#f9e29c]">
            Aurum Elite
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400 font-semibold bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
            <CheckCircle2 className="w-4 h-4" />
            Invitation Verified
          </div>
        </header>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight mb-4">
          You're In. Next Step: <span className="text-[#d4af37]">Activation</span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-10 text-center max-w-2xl">
          Watch the brief orientation video below to understand how the Alpha Group's downline rotator ensures your success, then activate your position.
        </p>

        {/* Video Placeholder */}
        <div className="w-full aspect-video bg-black/60 border border-white/10 rounded-3xl overflow-hidden relative group mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
            <PlayCircle className="w-20 h-20 text-[#d4af37] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
          </div>
          <img 
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000" 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        {/* Action Card */}
        <div className="w-full max-w-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-md text-center">
          <h3 className="text-2xl font-bold mb-4">Claim Your Position in the Rotator</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            By clicking below, you will be securely redirected to the Aurum registration system. You will be assigned to the next available sponsor in the Alpha Group queue.
          </p>
          
          <a 
            href="/api/r/downline-builder"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-[#d4af37] to-[#f9e29c] text-black font-extrabold uppercase tracking-wide rounded-2xl px-10 py-5 hover:translate-y-[-2px] hover:shadow-[0_15px_40px_-5px_rgba(212,175,55,0.4)] transition-all gap-3 text-lg"
          >
            Activate My Node <ArrowRight className="w-6 h-6" />
          </a>

          <p className="text-sm text-gray-500 mt-6">
            Make sure you have your $19.99 membership fee and $100 starting capital ready.
          </p>
        </div>

      </div>
    </div>
  );
}
