"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Star, Users, Zap, Shield, ArrowRight, Loader2, DollarSign } from 'lucide-react';
import ChatWidgetEmbed from '@/components/ChatWidgetEmbed';

export default function ServicesPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    telegram: "",
    affiliateCode: ""
  });

  const plans = [
    {
      id: "basic",
      name: "Basic Service",
      price: "Free",
      icon: <Shield size={24} className="text-[#00ff88]" />,
      description: "Get started with the foundational tools to build your network.",
      features: [
        "Syllabus Access",
        "AI Chat Assistant",
        "Done-for-you Funnels",
        "Custom QR Codes",
        "Every 4th lead goes to Aurum Rise"
      ],
      popular: false
    },
    {
      id: "vip",
      name: "VIP Service",
      price: "$4.99",
      period: "/mo",
      icon: <Star size={24} className="text-[#2d8cf0]" />,
      description: "Keep 100% of your leads and scale your personal network faster.",
      features: [
        "Syllabus Access",
        "AI Chat Assistant",
        "Done-for-you Funnels",
        "Custom QR Codes",
        "Keep ALL your leads (100%)"
      ],
      popular: true
    },
    {
      id: "admin_manager",
      name: "Aurum Manager",
      price: "$9.99",
      period: "/mo",
      icon: <Users size={24} className="text-purple-400" />,
      description: "Manage and promote your downline via the Rotator service.",
      features: [
        "Everything in VIP",
        "Access to Aurum Manager",
        "Assign codes to rotator",
        "Build your downline's lists automatically"
      ],
      popular: false
    },
    {
      id: "paid_rotator",
      name: "Paid Traffic Rotator",
      price: "$100+",
      period: " min",
      icon: <Zap size={24} className="text-orange-400" />,
      description: "Participate in corporate paid traffic campaigns for hands-free growth.",
      features: [
        "Guaranteed Traffic Streams",
        "Professionally managed campaigns",
        "Direct lead placement",
        "Minimum $100 per account funding"
      ],
      popular: false
    }
  ];

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      setError("Please select a service plan first.");
      return;
    }
    
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan: selectedPlan
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to submit order");

      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-xl w-full bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-md text-center relative z-10">
          <div className="w-20 h-20 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00ff88]/30">
            <Check size={40} className="text-[#00ff88]" />
          </div>
          <h1 className="text-4xl font-black mb-4">Order Placed!</h1>
          <p className="text-md text-white/70 mb-6 leading-relaxed">
            Your request for <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong> ({plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.period}) has been recorded.
          </p>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 text-center">
            <h4 className="text-lg font-black text-[#00ff88] uppercase tracking-wider mb-3">Next Step: Crypto Payment</h4>
            <p className="text-sm text-white/60 mb-6">
              To finalize your upgrade, please proceed to the secure crypto checkout portal to select your preferred network and verify your transaction.
            </p>
            <a 
              href={`https://www.welcometoaurum.com/syllabus/checkout.html?email=${encodeURIComponent(formData.email)}&firstName=${encodeURIComponent(formData.firstName)}&lastName=${encodeURIComponent(formData.lastName)}`}
              className="inline-flex bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-black py-4 px-8 rounded-xl transition-all items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,136,0.3)] text-lg"
            >
              Proceed to Crypto Checkout <ArrowRight size={20} />
            </a>
            <p className="text-[11px] text-white/40 leading-relaxed mt-6">
              A copy of your order details has also been sent to <strong>{formData.email}</strong>.
            </p>
          </div>

          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Return Home
          </button>
        </div>
        <ChatWidgetEmbed />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00ff88] selection:text-black font-sans relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[#00ff88]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#2d8cf0]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00ff88] to-[#2d8cf0] rounded-lg" />
          <span className="text-xl font-black tracking-tight">Aurum Rise</span>
        </Link>
        <Link href="/" className="text-sm font-bold text-white/60 hover:text-white transition-colors">
          Back to Home
        </Link>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#2d8cf0]">Arsenal</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            Select the tier that fits your growth strategy. You will receive an email with instructions to finalize your setup and payment securely via Crypto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white/5 border rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col h-full ${
                selectedPlan === plan.id 
                  ? "border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.15)] bg-[#00ff88]/5" 
                  : plan.popular 
                    ? "border-[#2d8cf0]/50 hover:border-[#2d8cf0]" 
                    : "border-white/10 hover:border-white/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2d8cf0] to-[#00ff88] text-black text-xs font-black uppercase tracking-wider py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6 flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {plan.icon}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedPlan === plan.id ? "border-[#00ff88] bg-[#00ff88]" : "border-white/20"
                }`}>
                  {selectedPlan === plan.id && <Check size={14} className="text-black" />}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-black">{plan.price}</span>
                {plan.period && <span className="text-white/50 text-sm font-medium">{plan.period}</span>}
              </div>
              
              <p className="text-sm text-white/60 mb-6 flex-grow">{plan.description}</p>
              
              <ul className="space-y-3 mt-auto pt-6 border-t border-white/10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                    <Check size={16} className="text-[#00ff88] shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Checkout Form */}
        {selectedPlan && (
          <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md animate-in fade-in slide-in-from-bottom-10 duration-500">
            <h2 className="text-3xl font-black mb-2">Finalize Your Request</h2>
            <p className="text-white/60 mb-8">
              You selected the <strong>{plans.find(p => p.id === selectedPlan)?.name}</strong>. Fill out your details below and we will email you the payment instructions.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">First Name *</label>
                  <input 
                    required
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Last Name *</label>
                  <input 
                    required
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">Email Address *</label>
                <input 
                  required
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Telegram Handle</label>
                  <input 
                    type="text" 
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    placeholder="@johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">Your Aurum Affiliate Code (Optional)</label>
                <input 
                  type="text" 
                  name="affiliateCode"
                  value={formData.affiliateCode}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  placeholder="e.g. 1W145K"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#00ff88] text-black font-black text-lg py-4 rounded-xl mt-6 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={20} className="animate-spin" /> Processing...</>
                ) : (
                  <>Send Payment Instructions <ArrowRight size={20} /></>
                )}
              </button>
              
              <div className="text-center mt-4 text-xs text-white/40 flex items-center justify-center gap-2">
                <DollarSign size={12} /> <strong>Instructions for Crypto Payments (BTC, USDT, BNB, LTC) will be emailed securely.</strong>
              </div>
            </form>
          </div>
        )}
      </main>

      <ChatWidgetEmbed />
    </div>
  );
}
