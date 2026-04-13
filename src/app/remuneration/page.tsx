'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { computeEURL } from '@/engine/eurl';
import { computeSASU } from '@/engine/sasu';
import type { SimulationInputs } from '@/engine/types';
import { NumberInput } from '@/components/ui/NumberInput';
import { formatCurrency } from '@/lib/formatters';

const baseInputs: SimulationInputs = {
  chiffreAffaires: 100_000,
  activityType: 'BNC',
  partsFiscales: 1,
  chargesReelles: 15_000,
  withACRE: false,
  withVersementLiberatoire: false,
  remunerationPctEURL: 70,
  remunerationPctSASU: 70,
  dividendeTaxMode: 'pfu',
  capitalSocialEURL: 1_000,
};

export default function RemunerationPage() {
  const [ca, setCa] = useState(100_000);
  const [charges, setCharges] = useState(15_000);
  const [status, setStatus] = useState<'eurl' | 'sasu'>('eurl');

  const chartData = useMemo(() => {
    const points = [];
    for (let pct = 0; pct <= 100; pct += 5) {
      const inputs: SimulationInputs = {
        ...baseInputs,
        chiffreAffaires: ca,
        chargesReelles: charges,
        remunerationPctEURL: pct,
        remunerationPctSASU: pct,
      };
      const result = status === 'eurl' ? computeEURL(inputs) : computeSASU(inputs);
      points.push({
        pct,
        net: result.revenuNetApresIR,
        remuneration: result.revenuNetAvantIR - result.dividendesNets,
        dividendes: result.dividendesNets,
      });
    }
    return points;
  }, [ca, charges, status]);

  const bestPct = chartData.reduce((best, p) => p.net > best.net ? p : best, chartData[0]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
        Simulateur rémunération dirigeant
      </h1>
      <p className="text-muted text-center mt-2 max-w-xl mx-auto">
        Trouvez le split optimal entre rémunération et dividendes pour maximiser votre revenu net.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <NumberInput label="CA annuel HT" value={ca} onChange={setCa} suffix="€" step={5000} />
        <NumberInput label="Charges annuelles" value={charges} onChange={setCharges} suffix="€" step={1000} />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Statut</p>
          <div className="flex gap-2">
            {(['eurl', 'sasu'] as const).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  status === s ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/40'
                }`}>
                {s === 'eurl' ? 'EURL' : 'SASU'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultat optimal */}
      <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
        <p className="text-sm text-muted">Split optimal pour {status.toUpperCase()}</p>
        <p className="text-2xl font-bold text-primary-dark mt-1">
          {bestPct.pct}% rémunération / {100 - bestPct.pct}% dividendes
        </p>
        <p className="text-lg font-semibold text-foreground mt-1">
          Net disponible : {formatCurrency(bestPct.net)}
        </p>
      </div>

      {/* Graphique */}
      <div className="mt-6 bg-surface border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Revenu net selon le % de rémunération
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="pct" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickFormatter={v => `${v}%`} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickFormatter={v => `${Math.round(v / 1000)}k`} axisLine={false} width={45} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))}
              labelFormatter={l => `${l}% rémunération`}
              contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }} />
            <Area type="monotone" dataKey="net" stroke="#0d9488" fill="#0d948820" strokeWidth={2} name="Net total" />
            <Area type="monotone" dataKey="remuneration" stroke="#0ea5e9" fill="#0ea5e920" strokeWidth={1.5} name="Rémunération nette" />
            <Area type="monotone" dataKey="dividendes" stroke="#8b5cf6" fill="#8b5cf620" strokeWidth={1.5} name="Dividendes nets" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau détaillé */}
      <div className="mt-6 bg-surface border border-border rounded-xl p-4 overflow-x-auto">
        <h3 className="text-sm font-semibold text-foreground mb-3">Détail par palier</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted text-left">
              <th className="py-2 pr-4">% Rému</th>
              <th className="py-2 px-2">Rémunération</th>
              <th className="py-2 px-2">Dividendes</th>
              <th className="py-2 px-2 font-semibold">Net total</th>
            </tr>
          </thead>
          <tbody>
            {chartData.filter((_, i) => i % 2 === 0).map(p => (
              <tr key={p.pct} className={`border-b border-border/50 ${p.pct === bestPct.pct ? 'bg-primary/5 font-semibold' : ''}`}>
                <td className="py-2 pr-4">{p.pct}%</td>
                <td className="py-2 px-2">{formatCurrency(p.remuneration)}</td>
                <td className="py-2 px-2">{formatCurrency(p.dividendes)}</td>
                <td className="py-2 px-2 text-primary-dark">{formatCurrency(p.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
