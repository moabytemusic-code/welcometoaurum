'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/finance.module.css';

const CustomTicker = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/ticker');
        if (!res.ok) throw new Error('Proxy API Error');
        const formatted = await res.json();
        setData(formatted);
      } catch (err) {
        console.error('Ticker fetch error:', err);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return <div style={{ height: '48px', background: '#050505', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}></div>;

  return (
    <div className={styles.tickerTape}>
      <div className={styles.tickerTrack}>
        {data.concat(data).map((coin, index) => {
           let symbol = coin.symbol === 'USDT' ? 'USDT' : coin.symbol.replace('USDT', '');
           let change = parseFloat(coin.priceChangePercent);
           return (
            <div key={`${coin.symbol}-${index}`} className={styles.tickerItem}>
              <span style={{ fontWeight: '800', color: '#fff' }}>{symbol}</span>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>${parseFloat(coin.lastPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</span>
              <span style={{ color: change > 0 ? '#00ff88' : '#ff4444', fontWeight: 'bold' }}>
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default CustomTicker;
