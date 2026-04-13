'use client';

import { useState, useCallback } from 'react';
import type { SimulationResults } from '@/engine/types';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonChart } from './ComparisonChart';
import { WaterfallChart } from './WaterfallChart';
import { SocialCoverageTable } from './SocialCoverageTable';
import { OptimiserPanel } from './OptimiserPanel';

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ma simulation StatutNet', url });
        setCopied(true);
      } catch {
        // User cancelled share dialog — do nothing
        return;
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Clipboard API unavailable — still show feedback
      }
      setCopied(true);
    }

    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground
                 border border-border rounded-lg px-3 py-1.5 transition-colors"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-success">
            <path d="M3 7.5l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Lien copié !
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 1.5h4v4" />
            <path d="M12.5 1.5L7 7" />
            <path d="M11 8v4.5a1 1 0 01-1 1H1.5a1 1 0 01-1-1V4a1 1 0 011-1H6" />
          </svg>
          Partager cette simulation
        </>
      )}
    </button>
  );
}

interface ResultsDashboardProps {
  results: SimulationResults;
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  const statuses = [results.micro, results.eurl, results.sasu];
  const bestStatus = statuses.reduce((a, b) =>
    a.revenuNetApresIR > b.revenuNetApresIR ? a : b
  );

  const eurlInfeasible = results.eurl.revenuNetApresIR === 0;
  const sasuInfeasible = results.sasu.revenuNetApresIR === 0;

  return (
    <div className="space-y-8">
      {/* Winner banner + share */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
        <p className="text-sm text-muted">Statut le plus avantageux pour votre situation</p>
        <p className="text-2xl font-bold text-primary-dark mt-1">{bestStatus.label}</p>
        <div className="mt-3 flex justify-center">
          <ShareButton />
        </div>
      </div>

      {/* Comparison cards */}
      <ComparisonTable statuses={statuses} bestStatus={bestStatus.status} />

      {/* Optimizer */}
      <OptimiserPanel
        optimalEURL={results.optimalEURL}
        optimalSASU={results.optimalSASU}
        eurlInfeasible={eurlInfeasible}
        sasuInfeasible={sasuInfeasible}
        inputs={results.inputs}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenu net comparé</h3>
          <ComparisonChart statuses={statuses} />
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Décomposition du CA</h3>
          <WaterfallChart statuses={statuses} />
        </div>
      </div>

      {/* Social coverage */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Protection sociale comparée</h3>
        <SocialCoverageTable />
      </div>
    </div>
  );
}
