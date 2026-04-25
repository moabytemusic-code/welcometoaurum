'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AngleRegistry from '@/components/funnel/AngleRegistry';

export default function FunnelEnginePage() {
  const { projectId, angleId } = useParams();
  const router = useRouter();
  
  const [project, setProject] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // In a real FaaS app, this would fetch from Supabase:
    // const { data } = await supabase.from('projects').select('*').eq('id', projectId).single();
    
    // For now, we mock the project data
    const mockProject = {
      id: projectId,
      name: projectId === 'aurum' ? 'AURUM Ecosystem' : 'New Project',
      content: {
        hero: {
          title: projectId === 'aurum' 
            ? 'Stop Donating Your Wealth to <span style="color: #d4af37">Legacy Banks.</span>'
            : `Welcome to the ${projectId} Revolution.`,
          subtitle: 'Let AI handle the heavy lifting while you scale.',
          description: 'Join the world\'s first automated prospecting engine.'
        }
      }
    };
    
    setProject(mockProject);
  }, [projectId]);

  const handleOptIn = async (data) => {
    setIsProcessing(true);
    setStatus('VALIDATING PROJECT ACCESS...');
    await new Promise(r => setTimeout(r, 1500));
    setStatus('SUCCESS. REDIRECTING...');
    setTimeout(() => {
       // In production, redirect to project-specific onboarding
       window.location.href = '/onboarding';
    }, 1000);
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
