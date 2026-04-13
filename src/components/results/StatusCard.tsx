'use client';

import { useState } from 'react';
import type { StatusResult } from '@/engine/types';
import { formatCurrency, formatPercent } from '@/lib/formatters';

interface StatusCardProps {
  result: StatusResult;
  isBest: boolean;
}

export function StatusCard({ result, isBest }: StatusCardProps) {
  const [expanded, setExpanded] = useState(false);
  const r = result;

  return (
    <div
      className={`relative bg-surface border rounded-xl p-5 transition-all ${
        isBest
          ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10'
          : 'border-border'
      }`}
    >
      {isBest && (
        <span className="absolute -top-3 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
          Meilleur choix
        </span>
      )}

      <h3 className="font-bold text-lg text-foreground mt-1">{r.label}</h3>

      {/* Key metric */}
      <div className="mt-4">
        <p className="text-xs text-muted uppercase tracking-wide">Revenu net après IR</p>
        <p className="text-3xl font-bold text-primary-dark">{formatCurrency(r.revenuNetApresIR)}</p>
      </div>

      {/* Summary rows */}
      <div className="mt-4 space-y-2 text-sm">
        <Row label="Cotisations sociales" value={formatCurrency(r.cotisationsSociales)} negative />
        {r.impotSocietes > 0 && (
          <Row label="Impôt sociétés (IS)" value={formatCurrency(r.impotSocietes)} negative />
        )}
        <Row label="Impôt revenu (IR)" value={formatCurrency(r.impotRevenu)} negative />
        {r.dividendesNets > 0 && (
          <Row label="Dividendes nets" value={formatCurrency(r.dividendesNets)} />
        )}
        <div className="pt-2 border-t border-border">
          <Row
            label="Taux de charges effectif"
            value={formatPercent(r.tauxChargesEffectif)}
            bold
          />
        </div>
      </div>

      {/* Expand for details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
        >
          <path d="M4 2l4 4-4 4" />
        </svg>
        {expanded ? 'Masquer le détail' : 'Voir le détail'}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs">
          <DetailRow label="CA" value={formatCurrency(r.ca)} />
          {r.chargesReelles > 0 && (
            <DetailRow label="Charges réelles" value={`-${formatCurrency(r.chargesReelles)}`} />
          )}
          {r.remunerationBrute > 0 && r.status !== 'micro' && (
            <DetailRow label="Rémunération brute" value={formatCurrency(r.remunerationBrute)} />
          )}
          <DetailRow label="Maladie" value={formatCurrency(r.cotisationsDetail.maladie)} />
          <DetailRow label="Retraite base" value={formatCurrency(r.cotisationsDetail.retraiteBase)} />
          <DetailRow label="Retraite compl." value={formatCurrency(r.cotisationsDetail.retraiteComplementaire)} />
          <DetailRow label="CSG/CRDS" value={formatCurrency(r.cotisationsDetail.csgCrds)} />
          {r.cotisationsDetail.formationPro > 0 && (
            <DetailRow label="Formation pro" value={formatCurrency(r.cotisationsDetail.formationPro)} />
          )}
          {r.impotSocietes > 0 && (
            <DetailRow label="IS" value={formatCurrency(r.impotSocietes)} />
          )}
          {r.dividendesBruts > 0 && (
            <>
              <DetailRow label="Dividendes bruts" value={formatCurrency(r.dividendesBruts)} />
              <DetailRow label="Prélèvements div." value={`-${formatCurrency(r.prelevementsDividendes)}`} />
            </>
          )}
          <DetailRow label="Base imposable IR" value={formatCurrency(r.baseImposableIR)} />
          <DetailRow label="IR" value={`-${formatCurrency(r.impotRevenu)}`} />
          <div className="pt-1 border-t border-border font-semibold">
            <DetailRow label="Net disponible" value={formatCurrency(r.revenuNetApresIR)} />
          </div>
          <p className="text-muted mt-2 italic">{r.protectionSociale.description}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, negative, bold }: {
  label: string;
  value: string;
  negative?: boolean;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold' : ''}`}>
      <span className="text-muted">{label}</span>
      <span className={negative ? 'text-danger' : 'text-foreground'}>{negative ? `-${value}` : value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
