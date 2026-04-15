import { NextResponse } from 'next/server';

let cachedData = null;
let lastFetchTime = 0;

export async function GET() {
  const now = Date.now();
  
  // Return cached data if under 15 seconds old to prevent rate limits naturally
  if (cachedData && (now - lastFetchTime < 15000)) {
    return NextResponse.json(cachedData);
  }

  try {
    const res = await fetch('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,USDT,BNB,SOL,USDC,XRP,DOGE,ADA,AVAX&tsyms=USD', { 
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    
    const json = await res.json();
    if (!json.RAW) throw new Error('Invalid payload structure');
    
    const prioritySymbols = ["BTC", "ETH", "USDT", "BNB", "SOL", "USDC", "XRP", "DOGE", "ADA", "AVAX"];

    const formatted = prioritySymbols.map(sym => {
      const data = json.RAW[sym]?.USD;
      if (!data) return null;
      return {
        symbol: sym,
        lastPrice: data.PRICE,
        priceChangePercent: data.CHANGEPCT24HOUR || 0
      };
    }).filter(Boolean);
    
    cachedData = formatted;
    lastFetchTime = now;
    
    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Proxy Ticker Error:", err);
    if (cachedData) return NextResponse.json(cachedData);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
