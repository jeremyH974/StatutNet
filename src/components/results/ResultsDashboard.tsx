'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { SimulationResults } from '@/engine/types';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonChart } from './ComparisonChart';
import { WaterfallChart } from './WaterfallChart';
import { SocialCoverageTable } from './SocialCoverageTable';
import { OptimiserPanel } from './OptimiserPanel';
import { MultiYearChart } from './MultiYearChart';
import { ResultSummary } from './ResultSummary';
import { trackEvent } from '@/lib/analytics';

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    trackEvent('lien_partage');
    if (navigator.share) {
      try { await navigator.share({ title: 'Ma simulation StatutNet', url }); setCopied(true); } catch { return; }
    } else {
      try { await navigator.clipboard.writeText(url); } catch { /* noop */ }
      setCopied(true);
    }
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button onClick={handleShare}
      className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors">
      {copied ? (
        <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-success">
          <path d="M3 7.5l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Lien copié !</>
      ) : (
        <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 1.5h4v4" /><path d="M12.5 1.5L7 7" /><path d="M11 8v4.5a1 1 0 01-1 1H1.5a1 1 0 01-1-1V4a1 1 0 011-1H6" /></svg>Partager</>
      )}
    </button>
  );
}

function PDFExportButton() {
  const [loading, setLoading] = useState(false);
  const handleExport = useCallback(async () => {
    setLoading(true);
    trackEvent('pdf_telecharge');
    try {
      const { exportResultsToPDF } = await import('@/lib/export-pdf');
      await exportResultsToPDF();
    } catch (err) {
      console.error('Erreur export PDF:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <button onClick={handleExport} disabled={loading}
      className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50">
      {loading ? (
        <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>Export...</>
      ) : (
        <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 1v8M4 6l3 3 3-3" /><path d="M1 10v2a1 1 0 001 1h10a1 1 0 001-1v-2" /></svg>PDF</>
      )}
    </button>
  );
}

function AffiliationCTA() {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-border rounded-xl p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Besoin d&apos;un accompagnement personnalisé ?</h3>
          <p className="text-xs text-muted mt-1">
            Un expert-comptable spécialisé en création d&apos;entreprise peut affiner ces estimations
            et vous guider dans le choix du bon statut.
          </p>
        </div>
        <a href="/experts" onClick={() => trackEvent('affiliation_clic')}
          className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors whitespace-nowrap">
          Parler à un expert
        </a>
      </div>
    </div>
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
    <motion.div id="results-content" className="space-y-8"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      {/* Winner banner + actions */}
      <motion.div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center"
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
        <p className="text-sm text-muted">Statut le plus avantageux pour votre situation</p>
        <p className="text-2xl font-bold text-primary-dark mt-1">{bestStatus.label}</p>
        <div className="mt-3 flex justify-center gap-2 pdf-hide">
          <ShareButton />
          <PDFExportButton />
        </div>
      </motion.div>

      {/* Phrase de synthèse contextualisée */}
      <ResultSummary results={results} />

      <ComparisonTable statuses={statuses} bestStatus={bestStatus.status} />

      <OptimiserPanel
        optimalEURL={results.optimalEURL}
        optimalSASU={results.optimalSASU}
        eurlInfeasible={eurlInfeasible}
        sasuInfeasible={sasuInfeasible}
        inputs={results.inputs}
      />

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

      <div className="bg-surface border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Protection sociale comparée</h3>
        <SocialCoverageTable />
      </div>

      {/* Multi-year projection */}
      <MultiYearChart inputs={results.inputs} />

      {/* Affiliation CTA */}
      <div className="pdf-hide">
        <AffiliationCTA />
      </div>
    </motion.div>
  );
}
