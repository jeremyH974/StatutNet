import { describe, it, expect } from 'vitest';
import { computeAll } from '@/engine';
import { computeEURL } from '@/engine/eurl';
import { computeSASU } from '@/engine/sasu';
import { findOptimalSplitEURL, findOptimalSplitSASU } from '@/engine/optimizer';
import type { SimulationInputs } from '@/engine/types';

const baseInputs: SimulationInputs = {
  chiffreAffaires: 80_000,
  activityType: 'BNC',
  partsFiscales: 1,
  chargesReelles: 10_000,
  withACRE: false,
  withVersementLiberatoire: false,
  remunerationPctEURL: 50,
  remunerationPctSASU: 50,
  dividendeTaxMode: 'pfu',
  capitalSocialEURL: 1_000,
};

describe('findOptimalSplitEURL', () => {
  it('optimal net >= net at 50/50 split', () => {
    const optimal = findOptimalSplitEURL(baseInputs);
    const at50 = computeEURL({ ...baseInputs, remunerationPctEURL: 50 });
    expect(optimal.revenuNet).toBeGreaterThanOrEqual(at50.revenuNetApresIR);
  });

  it('does not crash at 0% remuneration', () => {
    const result = computeEURL({ ...baseInputs, remunerationPctEURL: 0 });
    expect(result.revenuNetApresIR).toBeGreaterThanOrEqual(0);
  });

  it('does not crash at 100% remuneration', () => {
    const result = computeEURL({ ...baseInputs, remunerationPctEURL: 100 });
    expect(result.revenuNetApresIR).toBeGreaterThanOrEqual(0);
  });
});

describe('findOptimalSplitSASU', () => {
  it('optimal net >= net at 50/50 split', () => {
    const optimal = findOptimalSplitSASU(baseInputs);
    const at50 = computeSASU({ ...baseInputs, remunerationPctSASU: 50 });
    expect(optimal.revenuNet).toBeGreaterThanOrEqual(at50.revenuNetApresIR);
  });

  it('does not crash at 0% remuneration', () => {
    const result = computeSASU({ ...baseInputs, remunerationPctSASU: 0 });
    expect(result.revenuNetApresIR).toBeGreaterThanOrEqual(0);
  });

  it('does not crash at 100% remuneration', () => {
    const result = computeSASU({ ...baseInputs, remunerationPctSASU: 100 });
    expect(result.revenuNetApresIR).toBeGreaterThanOrEqual(0);
  });
});

describe('computeAll with OptimalSplit', () => {
  it('gainVsDefault is always >= 0 for EURL', () => {
    const r = computeAll(baseInputs);
    expect(r.optimalEURL).not.toBeNull();
    expect(r.optimalEURL!.gainVsDefault).toBeGreaterThanOrEqual(0);
  });

  it('gainVsDefault is always >= 0 for SASU', () => {
    const r = computeAll(baseInputs);
    expect(r.optimalSASU).not.toBeNull();
    expect(r.optimalSASU!.gainVsDefault).toBeGreaterThanOrEqual(0);
  });

  it('returns null when infeasible (CA <= charges)', () => {
    const r = computeAll({ ...baseInputs, chiffreAffaires: 5_000 });
    expect(r.optimalEURL).toBeNull();
    expect(r.optimalSASU).toBeNull();
  });

  it('optimal netDisponible >= default net', () => {
    const r = computeAll(baseInputs);
    expect(r.optimalEURL!.netDisponible).toBeGreaterThanOrEqual(r.eurl.revenuNetApresIR);
    expect(r.optimalSASU!.netDisponible).toBeGreaterThanOrEqual(r.sasu.revenuNetApresIR);
  });
});
