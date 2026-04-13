import type { SimulationInputs } from './types';
import { computeEURL } from './eurl';
import { computeSASU } from './sasu';

export interface OptimalSplit {
  pct: number;
  revenuNet: number;
}

export function findOptimalSplitEURL(inputs: SimulationInputs): OptimalSplit {
  let best: OptimalSplit = { pct: 50, revenuNet: 0 };

  for (let pct = 0; pct <= 100; pct += 5) {
    const result = computeEURL({ ...inputs, remunerationPctEURL: pct });
    if (result.revenuNetApresIR > best.revenuNet) {
      best = { pct, revenuNet: result.revenuNetApresIR };
    }
  }

  // Affiner autour du meilleur ±5%
  const min = Math.max(0, best.pct - 5);
  const max = Math.min(100, best.pct + 5);
  for (let pct = min; pct <= max; pct += 1) {
    const result = computeEURL({ ...inputs, remunerationPctEURL: pct });
    if (result.revenuNetApresIR > best.revenuNet) {
      best = { pct, revenuNet: result.revenuNetApresIR };
    }
  }

  return best;
}

export function findOptimalSplitSASU(inputs: SimulationInputs): OptimalSplit {
  let best: OptimalSplit = { pct: 50, revenuNet: 0 };

  for (let pct = 0; pct <= 100; pct += 5) {
    const result = computeSASU({ ...inputs, remunerationPctSASU: pct });
    if (result.revenuNetApresIR > best.revenuNet) {
      best = { pct, revenuNet: result.revenuNetApresIR };
    }
  }

  const min = Math.max(0, best.pct - 5);
  const max = Math.min(100, best.pct + 5);
  for (let pct = min; pct <= max; pct += 1) {
    const result = computeSASU({ ...inputs, remunerationPctSASU: pct });
    if (result.revenuNetApresIR > best.revenuNet) {
      best = { pct, revenuNet: result.revenuNetApresIR };
    }
  }

  return best;
}
