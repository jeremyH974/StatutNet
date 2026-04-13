'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SimulationInputs } from '@/engine/types';
import { computeAll } from '@/engine';
import { formatCurrency } from '@/lib/formatters';

interface MultiYearChartProps {
  inputs: SimulationInputs;
  years?: number;
  growthRate?: number;
}

export function MultiYearChart({ inputs, years = 5, growthRate = 0.05 }: MultiYearChartProps) {
  const data = useMemo(() => {
    const points = [];
    for (let y = 0; y < years; y++) {
      const factor = Math.pow(1 + growthRate, y);
      const yearInputs: SimulationInputs = {
        ...inputs,
        chiffreAffaires: Math.round(inputs.chiffreAffaires * factor),
        chargesReelles: Math.round(inputs.chargesReelles * factor),
      };
      const r = computeAll(yearInputs);
      points.push({
        annee: `A${y + 1}`,
        ca: yearInputs.chiffreAffaires,
        micro: r.micro.revenuNetApresIR,
        eurl: r.eurl.revenuNetApresIR,
        sasu: r.sasu.revenuNetApresIR,
      });
    }
    return points;
  }, [inputs, years, growthRate]);

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-1">
        Projection sur {years} ans
      </h3>
      <p className="text-xs text-muted mb-4">
        Croissance annuelle de {Math.round(growthRate * 100)}% du CA et des charges
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="annee" tick={{ fontSize: 12, fill: 'var(--muted)' }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} tickLine={false} axisLine={false} width={45} />
          <Tooltip
            formatter={(value, name) => {
              const labels: Record<string, string> = { micro: 'Micro', eurl: 'EURL', sasu: 'SASU' };
              return [formatCurrency(Number(value)), labels[String(name)] || String(name)];
            }}
            labelFormatter={(label) => {
              const point = data.find(d => d.annee === label);
              return point ? `${label} — CA : ${formatCurrency(point.ca)}` : label;
            }}
            contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
          />
          <Legend formatter={(v: string) => ({ micro: 'Micro', eurl: 'EURL', sasu: 'SASU' }[v] || v)} wrapperStyle={{ fontSize: '11px' }} />
          <Line type="monotone" dataKey="micro" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="eurl" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="sasu" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
