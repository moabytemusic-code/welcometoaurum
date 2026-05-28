'use client';

import { ArrowRight, CheckCircle2, PlayCircle, Sprout } from 'lucide-react';

export default function AllUNeedBridge() {
  return (
    <div className="min-h-screen bg-[#060906] text-white font-sans selection:bg-[#22c55e] selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#22c55e] opacity-[0.04] blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center">
        {/* Header */}
        <header className="mb-10 w-full flex justify-between items-center border-b border-white/5 pb-6">
          <div className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
            <Sprout className="w-6 h-6 text-[#22c55e]" /> ALL U NEED
          </div>
          <div className="flex items-center gap-2 text-sm text-[#22c55e] font-bold bg-[#22c55e]/10 px-4 py-1.5 rounded-full border border-[#22c55e]/20">
            <CheckCircle2 className="w-4 h-4" />
            Priority Status Active
          </div>
        </header>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight mb-4">
          Welcome to the Orientation. <br />
          <span className="text-[#d4af37]">Here is how the system works.</span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-10 text-center max-w-2xl leading-relaxed">
          Watch the brief orientation video below to understand how the Neo ecosystem works for you, exactly like a perfectly tuned irrigation system.
        </p>

        {/* Video Placeholder */}
        <div className="w-full aspect-video bg-black border border-white/10 rounded-3xl overflow-hidden relative group mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
            <PlayCircle className="w-20 h-20 text-[#22c55e] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
          </div>
          {/* Subtle green overlay on the thumbnail to match brand */}
          <div className="absolute inset-0 bg-[#22c55e]/5 mix-blend-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000" 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover opacity-60 grayscale-[30%]"
          />
        </div>

        {/* Action Card */}
        <div className="w-full max-w-2xl bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
          
          <h3 className="text-2xl font-bold mb-4 text-white">Enter the AllUNeed Team Growth System</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            By clicking below, you will be securely redirected to the Neo registration portal. You will be automatically assigned to the next available position in our private community group.
          </p>
          
          <a 
            href="/api/r/all-u-need?to=onboarding"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-[#d4af37] to-[#f9e29c] text-black font-extrabold uppercase tracking-widest rounded-xl px-10 py-5 hover:translate-y-[-2px] hover:shadow-[0_15px_40px_-5px_rgba(212,175,55,0.4)] transition-all gap-3 text-lg"
          >
            Start Growing My Savings <ArrowRight className="w-6 h-6" />
          </a>

          <p className="text-sm text-gray-500 mt-6">
            Make sure you have your $19.99 membership fee and $100 starting fund ready to set up your account.
          </p>
        </div>

      </div>
    </div>
  );
}
