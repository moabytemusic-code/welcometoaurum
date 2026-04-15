import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,usd-coin,ripple,dogecoin,cardano,avalanche-2&vs_currencies=usd&include_24hr_change=true', { 
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error('API Error');
    const json = await res.json();
    
    const targets = [
      { id: 'bitcoin', symbol: 'BTC' },
      { id: 'ethereum', symbol: 'ETH' },
      { id: 'tether', symbol: 'USDT' },
      { id: 'binancecoin', symbol: 'BNB' },
      { id: 'solana', symbol: 'SOL' },
      { id: 'usd-coin', symbol: 'USDC' },
      { id: 'ripple', symbol: 'XRP' },
      { id: 'dogecoin', symbol: 'DOGE' },
      { id: 'cardano', symbol: 'ADA' },
      { id: 'avalanche-2', symbol: 'AVAX' }
    ];

    const formatted = targets.map(t => {
      const coin = json[t.id];
      if (!coin) return null;
      return {
        symbol: t.symbol,
        lastPrice: coin.usd,
        priceChangePercent: coin.usd_24h_change || 0
      };
    }).filter(Boolean);
    
    return NextResponse.json(formatted);
  } catch (err) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
