import type { SimulationInputs, SimulationResults } from './types';
import { computeMicro } from './micro';
import { computeEURL } from './eurl';
import { computeSASU } from './sasu';

export function computeAll(inputs: SimulationInputs): SimulationResults {
  return {
    inputs,
    micro: computeMicro(inputs),
    eurl: computeEURL(inputs),
    sasu: computeSASU(inputs),
  };
}

export { computeMicro } from './micro';
export { computeEURL } from './eurl';
export { computeSASU } from './sasu';
export { calculerIR, calculerIS } from './ir';
export { findOptimalSplitEURL, findOptimalSplitSASU } from './optimizer';
export type { SimulationInputs, SimulationResults, StatusResult } from './types';
