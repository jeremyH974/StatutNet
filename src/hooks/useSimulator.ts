'use client';

import { useState, useCallback } from 'react';
import type { SimulationInputs, SimulationResults } from '@/engine/types';
import { computeAll } from '@/engine';

const defaultInputs: SimulationInputs = {
  chiffreAffaires: 80_000,
  activityType: 'BNC',
  partsFiscales: 1,
  chargesReelles: 10_000,
  withACRE: false,
  withVersementLiberatoire: false,
  remunerationPctEURL: 70,
  remunerationPctSASU: 70,
};

export function useSimulator() {
  const [inputs, setInputs] = useState<SimulationInputs>(defaultInputs);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [hasSimulated, setHasSimulated] = useState(false);

  const updateInput = useCallback(<K extends keyof SimulationInputs>(
    key: K,
    value: SimulationInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const runSimulation = useCallback(() => {
    const r = computeAll(inputs);
    setResults(r);
    setHasSimulated(true);
  }, [inputs]);

  const resetInputs = useCallback(() => {
    setInputs(defaultInputs);
    setResults(null);
    setHasSimulated(false);
  }, []);

  return {
    inputs,
    setInputs,
    updateInput,
    results,
    hasSimulated,
    runSimulation,
    resetInputs,
  };
}
