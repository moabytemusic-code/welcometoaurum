'use client';

import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, Database, Share2, Cookie, Trash2, ShieldCheck, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('collect');

  const sections = [
    { id: 'collect', label: '1. What We Collect', icon: Eye },
    { id: 'use', label: '2. How We Use It', icon: Database },
    { id: 'thirdparty', label: '3. Third-Party Services', icon: Share2 },
    { id: 'cookies', label: '4. Cookies & Session Storage', icon: Cookie },
    { id: 'retention', label: '5. Data Retention & Deletion', icon: Trash2 },
    { id: 'security', label: '6. Security & Audits', icon: ShieldCheck },
    { id: 'contact', label: '7. Privacy Contact', icon: Mail },
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
                We respect your personal space and data. Our privacy architecture aligns with modern web standards and security checks.
              </p>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="lg:col-span-8 bg-[#0b0b0b]/60 border border-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 space-y-12">
            <div>
              <span className="text-xs font-bold text-[#00ff88] uppercase tracking-widest">DATA ARCHITECTURE</span>
              <h1 className="text-3xl sm:text-4xl font-black mt-2 font-heading">Privacy Policy</h1>
              <p className="text-white/60 text-sm mt-4 leading-relaxed">
                Aurumrise University ("we", "our", "Platform") values the privacy of our visitors and students. This Privacy Policy details how we collect, store, share, and protect your information when you register for a pass and interact with the Syllabus on our website, <a href="https://aurumriseuniversity.com" className="text-[#00ff88] hover:underline">aurumriseuniversity.com</a>.
              </p>
            </div>

            <div className="border-t border-white/5 pt-8 space-y-12">
              
              {/* Section 1 */}
              <section id="collect" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Eye className="text-[#00ff88] shrink-0" size={20} />
                  1. What We Collect
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    When you register for a complimentary pass to inspect the Syllabus, we collect essential identifiers required to create your session account:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/60 pl-2">
                    <li><span className="text-white font-semibold">Registration Details:</span> First Name, Email Address, and Password.</li>
                    <li><span className="text-white font-semibold">Affiliate Information:</span> Affiliate tracking data (e.g. sponsor codes, referrers) to reward matching partner commissions.</li>
                    <li><span className="text-white font-semibold">Session Status:</span> Visit count, active tokens, and navigation logs inside the education portal.</li>
                    <li><span className="text-white font-semibold">Compute Telemetry:</span> IP addresses, browser agents, and query histories used strictly to optimize LLM performance and database search speeds.</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section id="use" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="text-[#2d8cf0] shrink-0" size={20} />
                  2. How We Use Your Data
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    We process your information based on legitimate educational, security, and operational needs:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/60 pl-2">
                    <li><span className="text-white font-semibold">Portal Operations:</span> To generate access tokens, record syllabus modules completed, and maintain your 10-login quota limits.</li>
                    <li><span className="text-white font-semibold">AI Interaction:</span> To feed relevant context to the interactive chatbot, allowing it to reply accurately based on your course orientation queries.</li>
                    <li><span className="text-white font-semibold">Abuse Prevention:</span> To perform active IP scraping and bot-detection checks to secure our education portal database.</li>
                    <li><span className="text-white font-semibold">Partner Support:</span> To sync referrer connections to active affiliate rotators so sponsors are credited correctly.</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section id="thirdparty" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Share2 className="text-purple-400 shrink-0" size={20} />
                  3. Third-Party Infrastructure Services
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    Your data is stored securely and is never sold to marketing brokers. We rely on top-tier infrastructure partners to power our application backend:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/60 pl-2">
                    <li><span className="text-white font-semibold">Supabase:</span> Our secure PostgreSQL database and auth backend provider. It hosts prospect data under institutional-grade encryption standards.</li>
                    <li><span className="text-white font-semibold">Brevo:</span> Used to dispatch email verification codes, notifications regarding your expiring pass, and partner onboarding instructions.</li>
                    <li><span className="text-white font-semibold">Vercel:</span> Our serverless and Edge hosting infrastructure. It routes network requests and logs telemetry data for compute optimization.</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section id="cookies" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cookie className="text-yellow-500 shrink-0" size={20} />
                  4. Cookies & Session Storage
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    We deploy functional cookies and storage objects to maintain session integrity:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/60 pl-2">
                    <li><span className="text-white font-semibold">`aurum_freemium_session`:</span> Standard session cookie to verify your registration status when browsing syllabus pages.</li>
                    <li><span className="text-white font-semibold">`aurum_affiliate`:</span> Stored in local storage to preserve the referrer ID who invited you to the Platform, ensuring they receive correct commissions.</li>
                    <li><span className="text-white font-semibold">`landing_variant`:</span> Used for internal A/B layout experiments to improve opt-in form alignment and load speeds.</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section id="retention" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trash2 className="text-red-500 shrink-0" size={20} />
                  5. Data Retention & Deletion
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    If your complimentary pass expires and your account becomes inactive, we retain your email and referral mappings in our database.
                  </p>
                  <p>
                    You have the right to request the complete deletion of your registration history, email address, and affiliate association. To do so, please contact our support team. Once verified, your account and associated database rows will be permanently deleted from our active clusters within 7 business days.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="security" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="text-[#00ff88] shrink-0" size={20} />
                  6. Security & Audits
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    We implement SSL encryption across all entry channels. Access to user accounts, admin panels, and rotator analytics is restricted to authenticated managers.
                  </p>
                  <p>
                    Because we provide simulated access to trading algorithms, we do not store credit cards, bank accounts, or digital asset keys. This significantly reduces our attack surface, ensuring that your financial data remains completely non-custodial and secure.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="contact" className="scroll-mt-32 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="text-[#2d8cf0] shrink-0" size={20} />
                  7. Privacy Contact
                </h2>
                <div className="text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    For questions regarding data processing, partner tracking, or to request a data dump or deletion audit, please contact our privacy compliance team via our official email or open an active chat query in the University guide widget.
                  </p>
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
            <a href="/tos" className="hover:text-[#00ff88] transition-colors">Terms of Service</a>
            <a href="/" className="hover:text-[#00ff88] transition-colors">Home Page</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
