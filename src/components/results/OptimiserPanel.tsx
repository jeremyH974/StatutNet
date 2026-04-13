'use client';

import { useState, useCallback } from 'react';
import type { OptimalSplit, SimulationInputs } from '@/engine/types';
import { computeEURL } from '@/engine/eurl';
import { computeSASU } from '@/engine/sasu';
import { Slider } from '@/components/ui/Slider';
import { formatCurrency } from '@/lib/formatters';

interface OptimiserPanelProps {
  optimalEURL: OptimalSplit | null;
  optimalSASU: OptimalSplit | null;
  eurlInfeasible: boolean;
  sasuInfeasible: boolean;
  inputs: SimulationInputs;
}

interface StatusPanelProps {
  label: string;
  optimal: OptimalSplit;
  inputs: SimulationInputs;
  computeNet: (inputs: SimulationInputs, pct: number) => number;
  pctKey: 'remunerationPctEURL' | 'remunerationPctSASU';
}

function StatusPanel({ label, optimal, inputs, computeNet, pctKey }: StatusPanelProps) {
  const defaultPct = inputs[pctKey];
  const [explorePct, setExplorePct] = useState(optimal.remunerationPct);
  const [exploreNet, setExploreNet] = useState(optimal.netDisponible);

  const handleSliderChange = useCallback(
    (pct: number) => {
      setExplorePct(pct);
      const net = computeNet(inputs, pct);
      setExploreNet(net);
    },
    [inputs, computeNet]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
        {optimal.gainVsDefault > 500 && (
          <span className="text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
            +{formatCurrency(optimal.gainVsDefault)}/an vs config actuelle
          </span>
        )}
      </div>

      <div className="text-sm text-muted">
        <span className="font-medium text-foreground">
          {optimal.remunerationPct}% rémunération / {100 - optimal.remunerationPct}% dividendes
        </span>
      </div>

      <div className="flex gap-4 text-sm">
        <div>
          <span className="text-muted">Rémunération : </span>
          <span className="font-medium text-foreground">{formatCurrency(optimal.remunerationAmount)}</span>
        </div>
        <span className="text-border">·</span>
        <div>
          <span className="text-muted">Dividendes : </span>
          <span className="font-medium text-foreground">{formatCurrency(optimal.dividendesAmount)}</span>
        </div>
      </div>

      {/* Explorer slider */}
      <div className="pt-3 border-t border-border/50">
        <Slider
          label="Explorer un autre split"
          value={explorePct}
          onChange={handleSliderChange}
          min={0}
          max={100}
          step={5}
          leftLabel="100% dividendes"
          rightLabel="100% rémunération"
        />
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted">
            Net avec {explorePct}% rému :
          </span>
          <span className={`font-semibold ${
            exploreNet >= optimal.netDisponible ? 'text-primary-dark' : 'text-foreground'
          }`}>
            {formatCurrency(exploreNet)}
          </span>
        </div>
      </div>
    </div>
  );
}

function computeNetEURL(inputs: SimulationInputs, pct: number): number {
  return computeEURL({ ...inputs, remunerationPctEURL: pct }).revenuNetApresIR;
}

function computeNetSASU(inputs: SimulationInputs, pct: number): number {
  return computeSASU({ ...inputs, remunerationPctSASU: pct }).revenuNetApresIR;
}

export function OptimiserPanel({
  optimalEURL,
  optimalSASU,
  eurlInfeasible,
  sasuInfeasible,
  inputs,
}: OptimiserPanelProps) {
  const showEURL = !eurlInfeasible && optimalEURL !== null;
  const showSASU = !sasuInfeasible && optimalSASU !== null;

  if (!showEURL && !showSASU) return null;

  const anyGain =
    (optimalEURL?.gainVsDefault ?? 0) > 0 ||
    (optimalSASU?.gainVsDefault ?? 0) > 0;

  if (!anyGain) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary">
          <path
            d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z"
            fill="currentColor"
            opacity="0.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="text-sm font-semibold text-foreground">
          Optimisation rémunération / dividendes
        </h3>
      </div>

      <div className={`grid gap-6 ${showEURL && showSASU ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {showEURL && optimalEURL && (
          <StatusPanel
            label="Split optimal EURL"
            optimal={optimalEURL}
            inputs={inputs}
            computeNet={computeNetEURL}
            pctKey="remunerationPctEURL"
          />
        )}
        {showSASU && optimalSASU && (
          <StatusPanel
            label="Split optimal SASU"
            optimal={optimalSASU}
            inputs={inputs}
            computeNet={computeNetSASU}
            pctKey="remunerationPctSASU"
          />
        )}
      </div>
    </div>
  );
}
