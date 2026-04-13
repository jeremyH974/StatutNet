'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { StatusResult } from '@/engine/types';
import { formatCurrency } from '@/lib/formatters';

interface WaterfallChartProps {
  statuses: StatusResult[];
}

export function WaterfallChart({ statuses }: WaterfallChartProps) {
  const data = statuses.map((s) => ({
    name: s.label.replace(' à l\'IS', ''),
    cotisations: s.cotisationsSociales,
    is: s.impotSocietes,
    ir: s.impotRevenu,
    dividendesTax: s.prelevementsDividendes,
    charges: s.chargesReelles,
    net: s.revenuNetApresIR,
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
          formatter={(value, name) => {
            const labels: Record<string, string> = {
              net: 'Revenu net',
              cotisations: 'Cotisations',
              is: 'IS',
              ir: 'IR',
              dividendesTax: 'Prél. dividendes',
              charges: 'Charges',
            };
            return [formatCurrency(Number(value)), labels[String(name)] || String(name)];
          }}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Legend
          formatter={(value: string) => {
            const labels: Record<string, string> = {
              net: 'Net',
              cotisations: 'Cotisations',
              is: 'IS',
              ir: 'IR',
              dividendesTax: 'Prél. div.',
              charges: 'Charges',
            };
            return labels[value] || value;
          }}
          wrapperStyle={{ fontSize: '11px' }}
        />
        <Bar dataKey="net" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
        <Bar dataKey="cotisations" stackId="a" fill="#f59e0b" />
        <Bar dataKey="ir" stackId="a" fill="#ef4444" />
        <Bar dataKey="is" stackId="a" fill="#8b5cf6" />
        <Bar dataKey="dividendesTax" stackId="a" fill="#ec4899" />
        <Bar dataKey="charges" stackId="a" fill="#94a3b8" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
