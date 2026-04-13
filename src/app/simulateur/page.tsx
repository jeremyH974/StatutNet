'use client';

import { useRef } from 'react';
import { useSimulator } from '@/hooks/useSimulator';
import { SimulatorForm } from '@/components/simulator/SimulatorForm';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { NewsletterCTA } from '@/components/newsletter/NewsletterCTA';

export default function SimulateurPage() {
  const { inputs, updateInput, results, hasSimulated, runSimulation } = useSimulator();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    runSimulation();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Simulateur de statut juridique
        </h1>
        <p className="text-muted mt-2 max-w-xl mx-auto">
          Comparez votre revenu net en Micro-entreprise, EURL et SASU
          en fonction de votre situation.
        </p>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
        {/* Form */}
        <div className="bg-surface border border-border rounded-xl p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-foreground mb-4">Vos paramètres</h2>
          <SimulatorForm
            inputs={inputs}
            updateInput={updateInput}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Results */}
        <div ref={resultsRef}>
          {hasSimulated && results ? (
            <>
              <ResultsDashboard results={results} />
              <div className="mt-8">
                <NewsletterCTA />
              </div>
            </>
          ) : (
            <div className="bg-surface border border-border rounded-xl p-12 text-center">
              <div className="text-6xl mb-4 opacity-20">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto text-muted">
                  <rect x="8" y="20" width="14" height="36" rx="3" fill="currentColor" opacity="0.3" />
                  <rect x="25" y="12" width="14" height="44" rx="3" fill="currentColor" opacity="0.5" />
                  <rect x="42" y="4" width="14" height="52" rx="3" fill="currentColor" opacity="0.7" />
                </svg>
              </div>
              <p className="text-muted text-lg">
                Remplissez le formulaire et cliquez sur
                <br />
                <span className="font-semibold text-primary">&laquo; Comparer les 3 statuts &raquo;</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-4 bg-surface border border-border rounded-xl text-xs text-muted">
        <strong>Avertissement :</strong> Ce simulateur fournit des estimations basées sur les
        paramètres fiscaux 2025 et des modèles simplifiés. Les cotisations TNS (EURL) et les
        charges salariales (SASU) sont calculées avec des taux moyens. Pour une simulation
        précise adaptée à votre situation, consultez un expert-comptable. Ce simulateur ne
        constitue pas un conseil fiscal ou juridique.
      </div>
    </div>
  );
}
