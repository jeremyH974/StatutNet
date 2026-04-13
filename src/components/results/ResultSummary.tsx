'use client';

import { useMemo } from 'react';
import type { SimulationInputs, SimulationResults } from '@/engine/types';
import { computeAll } from '@/engine';
import { formatCurrency } from '@/lib/formatters';

interface ResultSummaryProps {
  results: SimulationResults;
}

function findSeuilBascule(inputs: SimulationInputs, currentBest: string): number | null {
  // Itérer sur le CA pour trouver où le classement change
  for (let ca = 10_000; ca <= 200_000; ca += 5_000) {
    const r = computeAll({ ...inputs, chiffreAffaires: ca });
    const statuses = [r.micro, r.eurl, r.sasu];
    const best = statuses.reduce((a, b) => a.revenuNetApresIR > b.revenuNetApresIR ? a : b);
    if (best.status !== currentBest) {
      return ca;
    }
  }
  return null;
}

export function ResultSummary({ results }: ResultSummaryProps) {
  const summary = useMemo(() => {
    const statuses = [results.micro, results.eurl, results.sasu];
    const sorted = [...statuses].sort((a, b) => b.revenuNetApresIR - a.revenuNetApresIR);
    const best = sorted[0];
    const worst = sorted[2];
    const second = sorted[1];
    const ecart = best.revenuNetApresIR - worst.revenuNetApresIR;
    const ecartSecond = best.revenuNetApresIR - second.revenuNetApresIR;
    const ca = results.inputs.chiffreAffaires;

    // Les 3 sont proches
    if (ecart < 2_000) {
      return `Les 3 statuts donnent des résultats proches (écart < ${formatCurrency(ecart)}). La simplicité de la micro peut primer si votre CA le permet.`;
    }

    // Trouver le seuil de bascule
    const seuil = findSeuilBascule(results.inputs, best.status);

    if (best.status === 'micro') {
      if (seuil) {
        return `La micro reste le meilleur choix jusqu'à environ ${formatCurrency(seuil)} de CA pour votre profil. Au-delà, ${second.label} prend le relais. Vous économisez ${formatCurrency(ecartSecond)}/an par rapport à ${second.label}.`;
      }
      return `À ${formatCurrency(ca)} de CA, la micro-entreprise est clairement optimale. Vous gagnez ${formatCurrency(ecart)}/an de plus qu'en ${worst.label}.`;
    }

    if (best.status === 'eurl') {
      return `À ${formatCurrency(ca)} de CA, vous gagnez environ ${formatCurrency(ecart)}/an de plus en EURL qu'en ${worst.label}.${seuil ? ` La bascule vers l'EURL devient pertinente au-dessus de ${formatCurrency(seuil)} dans votre situation.` : ''}`;
    }

    // SASU
    return `À ${formatCurrency(ca)} de CA, la SASU vous rapporte ${formatCurrency(ecart)}/an de plus que ${worst.label}, avec en bonus la meilleure protection sociale.${seuil ? ` Ce statut devient avantageux au-dessus de ${formatCurrency(seuil)}.` : ''}`;
  }, [results]);

  return (
    <p className="text-sm text-foreground leading-relaxed bg-surface border border-border rounded-lg px-4 py-3">
      {summary}
    </p>
  );
}
