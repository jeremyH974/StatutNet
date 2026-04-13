'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { StatusResult } from '@/engine/types';
import { formatCurrency } from '@/lib/formatters';

interface ComparisonChartProps {
  statuses: StatusResult[];
}

const COLORS = ['#0d9488', '#0ea5e9', '#8b5cf6'];

export function ComparisonChart({ statuses }: ComparisonChartProps) {
  const data = statuses.map((s, i) => ({
    name: s.label,
    net: s.revenuNetApresIR,
    fill: COLORS[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          tickLine={false}
          axisLine={false}
          width={45}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), 'Revenu net']}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Bar dataKey="net" radius={[6, 6, 0, 0]} maxBarSize={60}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
