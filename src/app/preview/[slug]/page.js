'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the funnel components
const PitchFunnel = dynamic(() => import('../../pitch/page'), { ssr: false });
const ConsultativeFunnel = dynamic(() => import('../../consultative/page'), { ssr: false });

export default function PreviewPage() {
  const params = useParams();
  const slug = params.slug;

  const renderFunnel = () => {
    switch (slug) {
      case 'pitch':
        return <PitchFunnel />;
      case 'consultative':
        return <ConsultativeFunnel />;
      case 'v3':
        // Placeholder for v3
        return <div style={{ padding: '40px', color: '#fff' }}>Institutional Alpha (V3) Preview Coming Soon</div>;
      case 'v4':
        // Placeholder for v4
        return <div style={{ padding: '40px', color: '#fff' }}>The Yield Farmer (V4) Preview Coming Soon</div>;
      default:
        return <div style={{ padding: '40px', color: '#fff' }}>Funnel Variant Not Found</div>;
    }
  };

  return (
    <div className="preview-container">
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(45, 140, 240, 0.9)',
        color: '#fff',
        padding: '8px 16px',
        fontSize: '12px',
        fontWeight: '700',
        textAlign: 'center',
        zIndex: 9999,
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Preview Mode Active: This page is for demonstration only. Lead tracking is disabled.
      </div>
      <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading Demo...</div>}>
        {renderFunnel()}
      </Suspense>
    </div>
  );
}
