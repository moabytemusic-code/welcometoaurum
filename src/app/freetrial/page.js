'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Star, ChevronRight, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import ChatWidgetEmbed from '@/components/ChatWidgetEmbed';

function FreeTrialContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [hasSavedEmail, setHasSavedEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Check URL parameters first (high priority for email links)
    const urlEmail = searchParams.get('email');
    if (urlEmail) {
      localStorage.setItem('aurum_email', urlEmail);
      setEmail(urlEmail);
      setHasSavedEmail(true);
      return;
    }

    // 2. Check local storage
    const savedEmail = localStorage.getItem('aurum_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setHasSavedEmail(true);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputEmail) return;

    setLoading(true);
    // Save to local storage for future returning visits
    localStorage.setItem('aurum_email', inputEmail);
    setEmail(inputEmail);
    setHasSavedEmail(true);
    
    // Redirect instantly to the portal
    setTimeout(() => {
      window.location.href = `https://www.welcometoaurum.com/syllabus?email=${encodeURIComponent(inputEmail)}`;
    }, 500);
  };

  const handleClearSession = () => {
    localStorage.removeItem('aurum_email');
    setEmail('');
    setHasSavedEmail(false);
    setInputEmail('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00ff88]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2d8cf0]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto w-full border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00ff88] to-[#2d8cf0] rounded-lg" />
          <span className="text-xl font-black tracking-wider uppercase">AURUM RISE</span>
        </Link>
        <Link href="/services" className="text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
          Upgrade to VIP <Star size={14} className="text-[#00ff88]" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 flex-grow flex flex-col justify-center items-center text-center w-full">
        
        {/* Onboarding Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 mb-8">
          <BookOpen size={16} className="text-[#00ff88]" />
          <span className="text-xs font-black text-[#00ff88] uppercase tracking-wider">
            Syllabus Access Terminal
          </span>
        </div>

        {/* Dynamic Header */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
          {hasSavedEmail ? (
            <>Welcome Back to the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#2d8cf0]">Free Trial Portal</span></>
          ) : (
            <>Resume Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#2d8cf0]">Syllabus Access</span></>
          )}
        </h1>

        <p className="text-md md:text-lg text-white/60 max-w-xl mb-12 leading-relaxed">
          {hasSavedEmail 
            ? `We detected your session for ${email}. Access the course modules and automated tools instantly below.`
            : "Enter your trial email address below to reconnect to the Education Portal and resume your syllabus pass."
          }
        </p>

        {/* Action Panel */}
        <div className="w-full max-w-lg mb-12">
          
          {hasSavedEmail ? (
            /* Scenario 1: Email found -> Show instant access */
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#00ff88]/30 transition-all duration-300 text-center">
              <h3 className="text-xl font-bold mb-2">Active Pass Secured</h3>
              <p className="text-sm text-white/40 mb-8">
                Your 10-visit limit will be tracked securely in Supabase.
              </p>
              
              <a 
                href={`https://www.welcometoaurum.com/syllabus?email=${encodeURIComponent(email)}`}
                className="w-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-black py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,136,0.3)] text-lg mb-4"
              >
                Enter Education Portal <ArrowRight size={20} />
              </a>

              <button 
                onClick={handleClearSession}
                className="text-xs text-white/30 hover:text-white/60 transition-colors underline"
              >
                Not you? Click here to switch email
              </button>
            </div>
          ) : (
            /* Scenario 2: No email found -> Render input form */
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#2d8cf0]/30 transition-all duration-300 text-left">
              <h3 className="text-xl font-bold mb-2 text-center sm:text-left">Enter Your Email</h3>
              <p className="text-sm text-white/50 mb-6 leading-relaxed text-center sm:text-left">
                Provide the email you used to register. We will instantly redirect you to your trial dashboard.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  required
                  type="email" 
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="Enter your registered email address" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#2d8cf0] transition-colors"
                />
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#2d8cf0] hover:bg-[#1a7ad6] text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01]"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Launching Portal...</>
                  ) : (
                    <>Access Syllabus Portal <ChevronRight size={18} /></>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Upgrade Callout */}
        <div className="w-full max-w-3xl bg-gradient-to-r from-[#d4af37]/5 to-[#d4af37]/0 border border-[#d4af37]/20 rounded-2xl p-6 text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-[#d4af37]/10 p-3 rounded-xl border border-[#d4af37]/20 text-[#d4af37] shrink-0 mt-0.5">
              <Star size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white text-md">Bypass the 10-Visit Limit</h4>
              <p className="text-xs text-white/50 mt-1">Upgrade to Aurum VIP for unlimited access to the portal, permanent tools, and custom branding.</p>
            </div>
          </div>
          <Link 
            href="/services" 
            className="bg-[#d4af37] hover:bg-[#bfa032] text-black font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shrink-0 w-full sm:w-auto text-center"
          >
            Upgrade to VIP
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-white/5 w-full">
        <p className="text-xs text-white/30 flex items-center justify-center gap-1.5">
          <HelpCircle size={14} /> Need support? Use the live chat widget in the bottom right corner.
        </p>
      </footer>

      {/* Chat Widget Embed */}
      <ChatWidgetEmbed />
    </div>
  );
}

export default function FreeTrialAccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#00ff88]">
        Loading trial access...
      </div>
    }>
      <FreeTrialContent />
    </Suspense>
  );
}
