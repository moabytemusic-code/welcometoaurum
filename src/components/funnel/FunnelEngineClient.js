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
      // 1. Check for existing session in localStorage
      const stored = localStorage.getItem('aurum_affiliate');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSponsorData(parsed);
          // We still ping the API if a NEW ref is in the URL to override
        } catch (e) {
          localStorage.removeItem('aurum_affiliate');
        }
      }

      // 2. Resolve Sponsor (Individual ref or Rotator)
      try {
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get('ref');
        
        // IMPORTANT: We pass the angleId as the 'funnel' param so the rotator knows which permission to check
        const url = refCode 
          ? `/api/rotator?code=${refCode}&funnel=${angleId}` 
          : `/api/rotator?funnel=${angleId}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSponsorData(data);
          localStorage.setItem('aurum_affiliate', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Sponsor resolution error:', err);
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
          window.location.href = '/onboarding';
        }, 1000);
      } else {
        throw new Error('Capture failed');
      }
    } catch (err) {
      console.error('Opt-in error:', err);
      setStatus('ERROR: REDIRECTING TO ONBOARDING...');
      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 1500);
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
