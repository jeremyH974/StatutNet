import type { SimulationInputs, SimulationResults, OptimalSplit } from './types';
import { computeMicro } from './micro';
import { computeEURL } from './eurl';
import { computeSASU } from './sasu';
import { findOptimalSplitEURL, findOptimalSplitSASU } from './optimizer';

function buildOptimalEURL(inputs: SimulationInputs, defaultNet: number): OptimalSplit | null {
  if (inputs.chiffreAffaires <= inputs.chargesReelles) return null;

  const optimal = findOptimalSplitEURL(inputs);
  if (optimal.revenuNet <= 0) return null;

  const atOptimal = computeEURL({ ...inputs, remunerationPctEURL: optimal.pct });

  return {
    remunerationPct: optimal.pct,
    remunerationAmount: atOptimal.revenuNetAvantIR - atOptimal.dividendesNets,
    dividendesAmount: atOptimal.dividendesNets,
    netDisponible: optimal.revenuNet,
    gainVsDefault: Math.max(0, optimal.revenuNet - defaultNet),
  };
}

function buildOptimalSASU(inputs: SimulationInputs, defaultNet: number): OptimalSplit | null {
  if (inputs.chiffreAffaires <= inputs.chargesReelles) return null;

  const optimal = findOptimalSplitSASU(inputs);
  if (optimal.revenuNet <= 0) return null;

  const atOptimal = computeSASU({ ...inputs, remunerationPctSASU: optimal.pct });

  return {
    remunerationPct: optimal.pct,
    remunerationAmount: atOptimal.revenuNetAvantIR - atOptimal.dividendesNets,
    dividendesAmount: atOptimal.dividendesNets,
    netDisponible: optimal.revenuNet,
    gainVsDefault: Math.max(0, optimal.revenuNet - defaultNet),
  };
}

export function computeAll(inputs: SimulationInputs): SimulationResults {
  const micro = computeMicro(inputs);
  const eurl = computeEURL(inputs);
  const sasu = computeSASU(inputs);

  const optimalEURL = buildOptimalEURL(inputs, eurl.revenuNetApresIR);
  const optimalSASU = buildOptimalSASU(inputs, sasu.revenuNetApresIR);

  return { inputs, micro, eurl, sasu, optimalEURL, optimalSASU };
}

export { computeMicro } from './micro';
export { computeEURL } from './eurl';
export { computeSASU } from './sasu';
export { calculerIR, calculerIS } from './ir';
export { findOptimalSplitEURL, findOptimalSplitSASU } from './optimizer';
export type { SimulationInputs, SimulationResults, StatusResult, OptimalSplit } from './types';
