import { NextResponse } from 'next/server';
import rotatorData from '../../../data/rotator.json';

export async function GET() {
  try {
    const codes = rotatorData.codes || [];
    
    // Fallback if list is empty
    if (codes.length === 0) {
      const fallbackCode = process.env.NEXT_PUBLIC_SPONSOR_ID || "1W145K";
      return NextResponse.json({
        code: fallbackCode,
        url: `https://backoffice.aurum.foundation/register?ref=${fallbackCode}`
      });
    }

    // Pick a random code
    const randomIndex = Math.floor(Math.random() * codes.length);
    const selectedCode = codes[randomIndex];

    return NextResponse.json({
      code: selectedCode,
      url: `https://backoffice.aurum.foundation/register?ref=${selectedCode}`
    });
  } catch (error) {
    console.error('Rotator API Error:', error);
    // Safe hard fallback
    return NextResponse.json({
      code: "1W145K",
      url: "https://backoffice.aurum.foundation/register?ref=1W145K"
    });
  }
}
