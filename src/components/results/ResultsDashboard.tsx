'use client';

import type { SimulationResults } from '@/engine/types';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonChart } from './ComparisonChart';
import { WaterfallChart } from './WaterfallChart';
import { SocialCoverageTable } from './SocialCoverageTable';
import { OptimiserPanel } from './OptimiserPanel';

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
      {/* Winner banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
        <p className="text-sm text-muted">Statut le plus avantageux pour votre situation</p>
        <p className="text-2xl font-bold text-primary-dark mt-1">{bestStatus.label}</p>
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
