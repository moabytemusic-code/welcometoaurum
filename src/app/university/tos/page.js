'use client';

import React, { useState } from 'react';
import { ArrowLeft, Scale, ShieldAlert, Key, FileText, Ban, Sparkles, HelpCircle } from 'lucide-react';

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('welcome');

  const sections = [
    { id: 'welcome', label: '1. Welcome & Acceptance', icon: FileText },
    { id: 'purpose', label: '2. Educational Purpose Only', icon: Scale },
    { id: 'access', label: '3. Complimentary Access & Limits', icon: Key },
    { id: 'abuse', label: '4. Scraping & System Abuse', icon: Ban },
    { id: 'partner', label: '5. Partner Commissions Program', icon: Sparkles },
    { id: 'disclaimer', label: '6. Limitation of Liability', icon: ShieldAlert },
    { id: 'faq', label: '7. Frequently Answered Questions', icon: HelpCircle },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased relative">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-[#00ff88] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[50%] bg-[#2d8cf0] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[#00ff88]"
              aria-label="Back to home"
            >
              <ArrowLeft size={18} />
            </a>
            <div className="flex items-center gap-2">
              <img src="/images/aurumrise_university_logo.png" alt="University Logo" className="h-8 w-auto rounded border border-white/10" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase">AURUMRISE</span>
                <span className="text-[9px] text-[#00ff88] font-bold tracking-widest uppercase">UNIVERSITY</span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[10px] sm:text-xs text-white/40 font-mono">Last Updated: May 31, 2026</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Table of Contents */}
          <aside className="lg:col-span-4 sticky top-28 bg-[#0b0b0b] border border-white/5 rounded-2xl p-4 sm:p-6 hidden lg:block backdrop-blur-md">
            <h3 className="text-sm font-black tracking-widest text-[#00ff88] uppercase mb-4 px-2">Table of Contents</h3>
            <nav className="flex flex-col gap-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#00ff88]/10 to-[#2d8cf0]/10 border border-[#00ff88]/20 text-[#00ff88]' 
                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[#00ff88]' : 'text-white/40'} />
                    {sec.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-6 pt-6 border-t border-white/5 px-2">
              <p className="text-[10px] text-white/40 leading-relaxed">
                By registering your pass and accessing our Syllabus, you acknowledge and agree to these Terms of Service.
              </p>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="lg:col-span-8 bg-[#0b0b0b]/60 border border-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 space-y-12">
            <div>
              <span className="text-xs font-bold text-[#00ff88] uppercase tracking-widest">REGULATORY BOUNDARIES</span>
              <h1 className="text-3xl sm:text-4xl font-black mt-2 font-heading">Terms of Service</h1>
              <p className="text-white/60 text-sm mt-4 leading-relaxed">
                Welcome to Aurumrise University (the "University", "Platform"). These Terms of Service govern your use of the website at <a href="https://aurumriseuniversity.com" className="text-[#00ff88] hover:underline">aurumriseuniversity.com</a> and the educational services, interactive AI guides, databases, and syllabus modules provided herein. Please read them thoroughly.
              </p>
            </div>

            <div className="border-t border-white/5 pt-8 space-y-12">
              
              {/* Section 1 */}
              <section id="welcome" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="text-[#00ff88] shrink-0" size={20} />
                  1. Welcome & Acceptance
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    By registering for a complimentary pass, claiming access tokens, logging into the Education Portal, or interacting with our AI guide, you unconditionally agree to comply with and be bound by these Terms of Service. If you do not agree to all terms, you must immediately cease accessing the Platform.
                  </p>
                  <p>
                    We reserve the right, at our sole discretion, to change or modify portions of these Terms of Service at any time. If we do so, we will post the changes on this page and update the "Last Updated" date above. Your continued use of the Platform constitutes your acceptance of the revised Terms.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="purpose" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Scale className="text-[#2d8cf0] shrink-0" size={20} />
                  2. Educational Purpose Only
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-yellow-200 text-xs">
                    <span className="font-bold">IMPORTANT NOTICE:</span> All curriculum materials, interactive chatbot queries, mathematical formulas, and algorithmic models presented in our Syllabus are strictly for educational and informational purposes. They do not constitute financial, investment, legal, or tax advice.
                  </div>
                  <p>
                    The University does not act as a broker, custodian, portfolio manager, or financial advisor. Any information, projections, or calculations relating to trading bots (e.g. Zeus AI, EX-AI Delta Bot), card levels, or asset allocations are based on historical performance (such as verified 2026 data) and simulated projections. Past performance is not indicative of future results.
                  </p>
                  <p>
                    You agree that any actions you take following the inspection of our modules, neobank infrastructure blueprints, or partner card structures are taken at your own risk. You should consult a licensed financial professional before committing capital to any digital asset activity.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="access" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Key className="text-[#00ff88] shrink-0" size={20} />
                  3. Complimentary Access & Limits
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    Because our Syllabus features a live, dedicated AI chatbot guide, each query consumes significant database, processing, and vector search compute power. To manage server resources responsibly:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/60 pl-2">
                    <li>Complimentary passes are capped at a maximum of <span className="text-white font-bold">10 active login sessions</span> per user profile.</li>
                    <li>Account tokens are non-transferable and may not be shared across individuals.</li>
                    <li>We reserve the right to temporarily pause public registrations or lock active sessions when monthly compute resource quotas are reached.</li>
                  </ul>
                  <p>
                    Upon exhaustion of your 10 complimentary sessions, your access to the active portal will pause. You will not be automatically billed or asked for a payment method. To extend access, you may apply to our Premium Card tier or the Partner Program.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section id="abuse" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Ban className="text-red-500 shrink-0" size={20} />
                  4. Scraping & System Abuse
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    All content, course structure, database schemas, code snippets, and proprietary chatbot training configurations are the exclusive intellectual property of the University.
                  </p>
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs">
                    <span className="font-bold">PROHIBITED ACTIONS:</span> Scraping, bulk data extraction, automated page querying, indexing bots, IP rotation scripts, or stress-testing our server nodes is strictly prohibited.
                  </div>
                  <p>
                    We actively enforce automated IP checks and behavior anomaly detection. Any user profile or IP address detected attempting to scrap, copy, clone, or overload the Syllabus API will have their access instantly revoked without notice, and we reserve the right to take legal action where proprietary assets are infringed.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="partner" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-purple-400 shrink-0" size={20} />
                  5. Partner Commissions Program
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    The Platform showcases promotional details about the optional Partner Program. Becoming a partner provides commission structures, rank progressions, and card level upgrades (Nova, Nebula, Zenith, Infinity).
                  </p>
                  <p>
                    Any commissions or partner rewards are paid out in accordance with the official affiliate schemas active in the admin portal. We do not guarantee partner earnings. Affiliate allocations are governed by referral link tracking stored via web browser local storage and cookies. You agree not to manipulate, bypass, or spoof affiliate tracking URLs.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="disclaimer" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="text-yellow-500 shrink-0" size={20} />
                  6. Limitation of Liability
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    THE PLATFORM, SYLLABUS, AND CHATBOT SYSTEM ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                  </p>
                  <p>
                    In no event shall Aurumrise University, its founders (including Bryan Benson, Drei Menza, and Ahmad Zen), affiliates, or service providers be liable for any direct, indirect, incidental, special, or consequential damages resulting from your access to, or inability to access, the portal, including but not limited to server downtime, API quota exhaustion, loss of data, or investment losses arising from digital asset transactions.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="faq" className="scroll-mt-32 space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="text-[#00ff88] shrink-0" size={20} />
                  7. Frequently Answered Questions (Terms)
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/5">
                    <h4 className="font-bold text-sm text-white">Why is there a 10-login quota?</h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      Our chatbot queries use high-performance LLM engines. To maintain speed for all enrolled students and keep the service complimentary, we restrict individual test passes to 10 active sessions.
                    </p>
                  </div>
                  
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/5">
                    <h4 className="font-bold text-sm text-white">Will I get auto-charged when my pass expires?</h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      No. We do not collect billing details or credit card information during the complimentary registration process, so there is zero risk of unwanted charges.
                    </p>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-black/40 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs text-white/40 space-y-2">
          <p>© 2026 AURUMRISE UNIVERSITY. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="/about" className="hover:text-[#00ff88] transition-colors">About Us</a>
            <a href="/privacy" className="hover:text-[#00ff88] transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-[#00ff88] transition-colors">Home Page</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
