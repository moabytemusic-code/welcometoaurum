import { NextResponse } from 'next/server';

export async function GET() {
  const funnels = [
    { 
      id: 'breakdown', 
      name: 'Breakdown Masterpiece', 
      desc: 'The original high-conversion funnel. Focuses on the "Digital Marketing Lifestyle" and automated wealth building.',
      audience: 'Entrepreneurial / Wealth Seekers',
      previewUrl: '/preview/breakdown',
      public: true 
    },
    { 
      id: 'pitch', 
      name: 'Legacy Pitch', 
      desc: 'High-pressure financial pitching focusing on rapid returns and LEGACY banking frustrations.',
      audience: 'Newbies / General',
      previewUrl: '/preview/pitch',
      public: true
    },
    { 
      id: 'consultative', 
      name: 'Consultative Masterclass', 
      desc: '"Telling Ain\'t Selling" framework. Uses interrogative psychology to build deep trust.',
      audience: 'Educated / Skeptics',
      previewUrl: '/preview/consultative',
      public: true
    },
    { 
      id: 'v3', 
      name: 'Institutional Alpha', 
      desc: 'Focuses on the Neobanking utility and global spending power of the Aurum Card.',
      audience: 'Global Travelers',
      previewUrl: '/preview/v3',
      public: false // Private for now
    },
    { 
      id: 'v4', 
      name: 'The Yield Farmer', 
      desc: 'Deep dive into the EX-AI Bot algorithms for technical or math-oriented audiences.',
      audience: 'Tech/Crypto Savvy',
      previewUrl: '/preview/v4',
      public: false // Private for now
    }
  ];

  // Only expose public funnels to the external catalog/marketplace
  const publicFunnels = funnels.filter(f => f.public);

  return NextResponse.json(publicFunnels);
}
