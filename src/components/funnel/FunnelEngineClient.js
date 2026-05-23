'use client';

import { useState, useEffect } from 'react';
import AngleRegistry from '@/components/funnel/AngleRegistry';

export default function FunnelEngineClient({ initialProject, angleId }) {
  const [project] = useState(initialProject);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [sponsorData, setSponsorData] = useState({ code: '1W145K', name: 'Aurum Corporate' });

  useEffect(() => {
    const resolveSponsor = async () => {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');

      if (refCode) {
        // 1. Direct link overrides everything
        try {
          const res = await fetch(`/api/rotator?code=${refCode}&funnel=${angleId}`);
          if (res.ok) {
            const data = await res.json();
            setSponsorData(data);
            localStorage.setItem('aurum_affiliate', JSON.stringify(data));
          }
        } catch (err) { console.error('Sponsor error:', err); }
      } else {
        // 2. No ref code in URL. Check local storage.
        const stored = localStorage.getItem('aurum_affiliate');
        if (stored) {
          try {
            setSponsorData(JSON.parse(stored));
          } catch (e) {
            localStorage.removeItem('aurum_affiliate');
          }
        } else {
          // 3. No ref, no local storage -> ROTATOR
          try {
            const res = await fetch(`/api/rotator?funnel=${angleId}`);
            if (res.ok) {
              const data = await res.json();
              setSponsorData(data);
              localStorage.setItem('aurum_affiliate', JSON.stringify(data));
            }
          } catch (err) { console.error('Sponsor error:', err); }
        }
      }
    };
    resolveSponsor();
  }, [angleId]);

  const handleOptIn = async (data) => {
    setIsProcessing(true);
    setStatus('SCANNING LIQUIDITY GAPS...');
    
    try {
      const res = await fetch('/api/optin', {
        method: 'POST',
        body: JSON.stringify({ 
          email: data.email, 
          first_name: data.name || 'Friend',
          sponsor_code: sponsorData.code,
          sponsor_name: sponsorData.name,
          landing_variant: angleId
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        setStatus('ACCESS GRANTED. REDIRECTING...');
        setTimeout(() => {
          window.location.href = `/thank-you?ref=${sponsorData.code}`;
        }, 1000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'System error. Please try again.');
      }
    } catch (err) {
      console.error('Opt-in error:', err);
      alert(err.message);
      setIsProcessing(false);
      setStatus('');
    }
  };

  if (!project) return null;

  // Resolve the Angle Component from the Registry
  const AngleComponent = AngleRegistry[angleId] || AngleRegistry['pitch'];

  return (
    <AngleComponent 
      project={project} 
      handleOptIn={handleOptIn}
      isProcessing={isProcessing}
      status={status}
    />
  );
}
