import { NextResponse } from 'next/server';

let cachedHistory = null;
let lastFetchTime = 0;

export async function GET() {
  const now = Date.now();
  
  // Cache for 4 hours for historical data
  if (cachedHistory && now - lastFetchTime < 14400000) { 
    return NextResponse.json(cachedHistory);
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
    
    // Find all individual message text blocks
    const messages = html.match(/class="tgme_widget_message_text js-message_text" dir="auto">([\s\S]*?)<\/div>/g) || [];
    
    const history = messages.map(msg => {
      // Filter for result posts
      if (!msg.includes('AURUM Bot Results')) return null;

      // Extract Date: specifically looking for the string after "AURUM Bot Results, "
      const dateMatch = msg.match(/AURUM Bot Results,\s*(?:<b>)?([^<]+)(?:<\/b>)?/i);
      const dateStr = dateMatch ? dateMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim() : 'Unknown';
      
      // Extract EX-AI BOT yield
      const botMatch = msg.match(/EX-AI BOT[\s\S]*?Daily return:\s*(?:<b>)?([+-]?[\d.]+)%/i);
      // Extract EX-AI PRO yield
      const proMatch = msg.match(/EX-AI PRO[\s\S]*?Daily return:\s*(?:<b>)?([+-]?[\d.]+)%/i);
      
      if (!botMatch && !proMatch) return null;

      return {
        date: dateStr,
        bot: botMatch ? `${botMatch[1].startsWith('+') ? '' : '+'}${botMatch[1]}%` : "N/A",
        pro: proMatch ? `${proMatch[1].startsWith('+') ? '' : '+'}${proMatch[1]}%` : "N/A",
      };
    }).filter(Boolean);

    // Sort by date (Telegram usually returns chronologically, so we reverse for 'Latest First')
    const finalHistory = history.reverse();

    cachedHistory = finalHistory;
    lastFetchTime = now;

    return NextResponse.json(finalHistory);
  } catch (err) {
    if (cachedHistory) return NextResponse.json(cachedHistory);
    return NextResponse.json({ error: 'Failed to fetch history', details: err.message }, { status: 500 });
  }
}
