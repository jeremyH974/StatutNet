'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { SimulationInputs, SimulationResults } from '@/engine/types';
import { computeAll } from '@/engine';
import { encodeSimulationToURL, decodeSimulationFromURL } from '@/lib/url-params';

const defaultInputs: SimulationInputs = {
  chiffreAffaires: 80_000,
  activityType: 'BNC',
  partsFiscales: 1,
  chargesReelles: 10_000,
  withACRE: false,
  withVersementLiberatoire: false,
  remunerationPctEURL: 70,
  remunerationPctSASU: 70,
  dividendeTaxMode: 'pfu',
  capitalSocialEURL: 1_000,
};

export function useSimulator() {
  const [inputs, setInputs] = useState<SimulationInputs>(defaultInputs);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [hasSimulated, setHasSimulated] = useState(false);
  const initializedFromURL = useRef(false);

  useEffect(() => {
    if (initializedFromURL.current) return;
    initializedFromURL.current = true;

    const search = window.location.search;
    if (!search) return;

    const fromURL = decodeSimulationFromURL(search);
    if (Object.keys(fromURL).length === 0) return;

    const merged = { ...defaultInputs, ...fromURL };
    setInputs(merged);

    const r = computeAll(merged);
    setResults(r);
    setHasSimulated(true);
  }, []);

  useEffect(() => {
    if (!initializedFromURL.current) return;

    const encoded = encodeSimulationToURL(inputs);
    const newURL = encoded
      ? `${window.location.pathname}?${encoded}`
      : window.location.pathname;
    history.replaceState(null, '', newURL);
  }, [inputs]);

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

  return { inputs, setInputs, updateInput, results, hasSimulated, runSimulation, resetInputs };
}
