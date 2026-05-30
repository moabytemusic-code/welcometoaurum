'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, ChevronRight } from 'lucide-react';

export default function ThankYouSyllabusPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Retrieve the email saved during the opt-in process
    const savedEmail = localStorage.getItem('aurum_email') || '';
    setEmail(savedEmail);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00ff88] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#2d8cf0] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        <div className="flex flex-col items-center gap-4 mb-2">
          <img 
            src="/images/aurumrise_university_logo.png" 
            alt="AurumRise University Logo" 
            className="h-20 w-20 rounded-2xl border border-white/10 shadow-2xl shadow-[#00ff88]/10" 
          />
          <div className="flex flex-col items-center">
            <span className="text-sm font-black tracking-wider uppercase">AURUMRISE</span>
            <span className="text-[10px] text-[#00ff88] font-bold tracking-widest uppercase">UNIVERSITY</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-[#00ff88]/10 px-4 py-1.5 rounded-full border border-[#00ff88]/20 flex items-center gap-2">
            <CheckCircle className="text-[#00ff88]" size={16} />
            <span className="text-xs font-bold text-[#00ff88] uppercase tracking-wider">Access Secured</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
          Welcome to the <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#2d8cf0]">Inside</span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-lg mx-auto">
          Your access has been secured. Before you can dive into the Education Portal, you need to create your free account.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="text-[#2d8cf0]" size={24} />
            <h2 className="text-2xl font-bold">10-Visit Free Pass</h2>
          </div>
          
          <p className="text-white/60 mb-8">
            You have been granted exactly 10 limited visits to the Official Education Portal. Create your password to begin your first session.
          </p>

          <a 
            href={`https://www.welcometoaurum.com/syllabus/register${email ? `?email=${encodeURIComponent(email)}` : ''}`}
            className="w-full sm:w-auto inline-flex bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-black text-lg px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:scale-105 transition-all justify-center items-center gap-2"
          >
            Create Your Free Account <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}
