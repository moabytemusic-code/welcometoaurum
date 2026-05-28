import { NextResponse } from 'next/server';

let cachedData = null;
let lastFetchTime = 0;

export async function GET() {
  const now = Date.now();
  
  // Cache for 1 hour to prevent Telegram IP bans
  if (cachedData && now - lastFetchTime < 3600000) { 
    return NextResponse.json(cachedData);
  }

  try {
    const res = await fetch('https://t.me/s/aurum_eng', { 
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error('Telegram fetch failed');
    const html = await res.text();
    
    // More robust regex to handle various tag nesting and whitespace
    const botMatch = html.match(/EX-AI BOT[\s\S]*?Daily return:\s*(?:<b>)?([+-]?[\d.]+)%/i);
    const proMatch = html.match(/EX-AI PRO[\s\S]*?Daily return:\s*(?:<b>)?([+-]?[\d.]+)%/i);
    
    let botVal = botMatch ? botMatch[1] : null;
    let proVal = proMatch ? proMatch[1] : null;

    if (!botVal && !proVal) {
      if (cachedData) return NextResponse.json(cachedData);
      return NextResponse.json({ bot: "N/A", pro: "N/A" });
    }

    const result = {
      bot: botVal ? `${botVal.startsWith('+') ? '' : '+'}${botVal}%` : "N/A",
      pro: proVal ? `${proVal.startsWith('+') ? '' : '+'}${proVal}%` : "N/A",
      timestamp: now
    };

    cachedData = result;
    lastFetchTime = now;

    return NextResponse.json(result);
  } catch (err) {
    if (cachedData) return NextResponse.json(cachedData);
    return NextResponse.json({ bot: "N/A", pro: "N/A" });
  }
}
