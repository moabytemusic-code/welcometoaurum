'use client';

import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';
import { performanceData, stats } from '../data/performance';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10, 10, 10, 0.95)',
        border: '1px solid rgba(45, 140, 240, 0.3)',
        padding: '12px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#fff', fontSize: '14px', marginBottom: '8px' }}>{label} 2025</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ margin: 0, color: '#00ff88', fontSize: '12px' }}>
            Monthly Yield: +{payload[0].value}%
          </p>
          <p style={{ margin: 0, color: '#2d8cf0', fontSize: '12px' }}>
            Balance: ${payload[1].value.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={performanceData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2d8cf0" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2d8cf0" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="rgba(255,255,255,0.4)" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            yAxisId="left" 
            stroke="rgba(255,255,255,0.4)" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="rgba(255,255,255,0.4)" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
          />
          <Bar 
            yAxisId="left" 
            dataKey="yield" 
            name="Monthly Yield %" 
            fill="#00ff88" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
            opacity={0.8}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="balance"
            fill="url(#colorBalance)"
            stroke="none"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="balance" 
            name="Cumulative Balance ($)" 
            stroke="#2d8cf0" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#2d8cf0', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
