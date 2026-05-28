'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';

export default function OptInForm({ buttonText = "Unlock Now", variant = "default", redirectUrl = "/syllabus" }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: firstName,
          landing_variant: variant
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // Track successful conversion in local storage (optional)
      localStorage.setItem('neo_optin', 'true');
      localStorage.setItem('neo_email', email);

      // Redirect to the syllabus or desired page
      // Use absolute URL to avoid any routing/basePath ambiguity
      if (redirectUrl.startsWith('http')) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = window.location.origin + redirectUrl;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}
      
      <div>
        <input 
          type="text" 
          placeholder="First Name" 
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/50 transition-all"
        />
      </div>
      <div>
        <input 
          type="email" 
          required
          placeholder="Enter your best email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/50 transition-all"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-black text-lg py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : buttonText}
      </button>
    </form>
  );
}
