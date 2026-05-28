'use client';

import { ArrowRight, Shield, Users, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function BoutiqueAlphaLanding() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus('SECURING SPOT...');

    try {
      const response = await fetch('/api/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.name,
          landing_variant: 'boutique-alpha',
          team_slug: 'boutique-alpha' // Tag for later rotator entry
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
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4af37] opacity-5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4af37] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Header */}
        <header className="mb-12">
          <div className="text-2xl font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#f9e29c]">
            Neo Elite: Growth Group
          </div>
        </header>

        {/* Hero Section */}
        <div className="inline-block px-4 py-2 rounded-full border border-[#d4af37]/30 bg-white/5 text-[#d4af37] text-sm font-semibold tracking-wider uppercase mb-8 backdrop-blur-sm">
          Private Invitation Only
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          The AI Shift is happening. Here is your invitation to keep up without the confusion.
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
          Our group uses a simple "Team Growth System" to make sure every member gets a fair start. See how we've simplified the process of growing your savings on autopilot.
        </p>

        {/* Optin Form Card */}
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col gap-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-[#d4af37] mt-1" />
              <p className="text-gray-300"><strong>Simple Team System:</strong> Get plugged into our automated group engine that helps the whole team grow.</p>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-[#d4af37] mt-1" />
              <p className="text-gray-300"><strong>Fair Share Growth:</strong> Our system is designed to help every new member build their future sequentially.</p>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-[#d4af37] mt-1" />
              <p className="text-gray-300"><strong>Quick Start:</strong> Start seeing how the Neo system works for you in as little as 15 minutes.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="First Name" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all"
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all"
            />
            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f9e29c] text-black font-extrabold uppercase tracking-wide rounded-2xl px-5 py-4 mt-2 hover:translate-y-[-2px] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {status || 'Securing Spot...'}</>
              ) : (
                <>Watch the Orientation <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-6 text-center">
            By joining, you agree to our terms. Your information is 100% secure.
          </p>
        </div>
      </div>
    </div>
  );
}
