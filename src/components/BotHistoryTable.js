'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

export default function BotHistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/admin/bot/history');
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('History fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] animate-pulse">
        <Activity className="w-8 h-8 text-[#00ff88] mb-4 animate-spin" />
        <span className="text-xs font-bold tracking-widest text-[#00ff88]/50 uppercase">Synchronizing Institutional Ledger...</span>
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-[#00ff88]/5 to-transparent flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88]">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase">The Institutional Record</h3>
            <p className="text-[10px] text-white/40 tracking-widest uppercase font-bold">Historical Daily Bot Yields</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff88]/10 rounded-full border border-[#00ff88]/20">
          <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_8px_#00ff88]" />
          <span className="text-[10px] font-black text-[#00ff88] tracking-widest uppercase">Verified Feed</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/2 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-white/30 tracking-widest uppercase">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 tracking-widest uppercase text-right">EX-AI BOT</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 tracking-widest uppercase text-right">EX-AI PRO</th>
              <th className="px-6 py-4 text-[10px] font-black text-white/30 tracking-widest uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white/90">{row.date}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-sm font-black text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">{row.bot}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-sm font-black text-blue-400 drop-shadow-[0_0_10px_rgba(45,140,240,0.3)]">{row.pro}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
                      <ShieldCheck size={12} className="text-white/40" />
                      <span className="text-[9px] font-bold text-white/40 uppercase">Audited</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-center">
        <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-black flex items-center gap-2">
          <TrendingUp size={10} /> Data Source: Official Aurum Institutional Broadcast
        </p>
      </div>
    </div>
  );
}
