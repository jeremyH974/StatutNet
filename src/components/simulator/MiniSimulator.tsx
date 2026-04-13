'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { ActivityType } from '@/engine/types';
import { computeAll } from '@/engine';
import { formatCurrency } from '@/lib/formatters';

const ACTIVITIES: { value: ActivityType; label: string }[] = [
  { value: 'BNC', label: 'Libéral' },
  { value: 'BIC_SERVICES', label: 'Services' },
  { value: 'BIC_VENTE', label: 'Vente' },
];

const ACT_URL: Record<ActivityType, string> = {
  BNC: 'bnc',
  BIC_SERVICES: 'bic-s',
  BIC_VENTE: 'bic-v',
};

export function MiniSimulator() {
  const [ca, setCa] = useState(60_000);
  const [act, setAct] = useState<ActivityType>('BNC');

  const results = useMemo(() => {
    if (ca <= 0) return null;
    return computeAll({
      chiffreAffaires: ca,
      activityType: act,
      partsFiscales: 1,
      chargesReelles: Math.round(ca * 0.1),
      withACRE: false,
      withVersementLiberatoire: false,
      remunerationPctEURL: 70,
      remunerationPctSASU: 70,
      dividendeTaxMode: 'pfu',
      capitalSocialEURL: 1_000,
    });
  }, [ca, act]);

  const best = results
    ? [results.micro, results.eurl, results.sasu].reduce((a, b) =>
        a.revenuNetApresIR > b.revenuNetApresIR ? a : b
      )
    : null;

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Estimation rapide
      </h3>

      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-xs text-muted mb-1">CA annuel HT</label>
          <div className="relative">
            <input
              type="number"
              value={ca}
              onChange={(e) => setCa(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground
                         text-right pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">€</span>
          </div>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Activité</label>
          <div className="flex gap-1">
            {ACTIVITIES.map((a) => (
              <button key={a.value} onClick={() => setAct(a.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  act === a.value
                    ? 'bg-primary text-white'
                    : 'bg-background border border-border text-muted hover:text-foreground'
                }`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Micro', net: results.micro.revenuNetApresIR, color: 'text-primary' },
              { label: 'EURL', net: results.eurl.revenuNetApresIR, color: 'text-[#0ea5e9]' },
              { label: 'SASU', net: results.sasu.revenuNetApresIR, color: 'text-[#8b5cf6]' },
            ].map((s) => (
              <div key={s.label}
                className={`text-center p-2.5 rounded-lg bg-background border border-border ${
                  best && s.net === best.revenuNetApresIR ? 'ring-2 ring-primary/30' : ''
                }`}>
                <p className="text-xs text-muted">{s.label}</p>
                <p className={`text-sm font-bold ${s.color}`}>{formatCurrency(s.net)}</p>
              </div>
            ))}
          </div>

          <Link
            href={`/simulateur?ca=${ca}&act=${ACT_URL[act]}`}
            className="block text-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Voir le détail complet →
          </Link>
        </>
      )}
    </div>
  );
}
