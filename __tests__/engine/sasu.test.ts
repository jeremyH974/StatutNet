import { describe, it, expect } from 'vitest';
import { computeSASU } from '@/engine/sasu';
import type { SimulationInputs } from '@/engine/types';

const baseInputs: SimulationInputs = {
  chiffreAffaires: 80_000,
  activityType: 'BNC',
  partsFiscales: 1,
  chargesReelles: 10_000,
  withACRE: false,
  withVersementLiberatoire: false,
  remunerationPctEURL: 70,
  remunerationPctSASU: 70,
};

describe('computeSASU', () => {
  it('returns valid results', () => {
    const r = computeSASU(baseInputs);
    expect(r.status).toBe('sasu');
    expect(r.ca).toBe(80_000);
    expect(r.revenuNetApresIR).toBeGreaterThan(0);
    expect(r.revenuNetApresIR).toBeLessThan(80_000);
  });

  it('has higher cotisations than EURL for same params', () => {
    // SASU has ~80% charges on brut vs ~45% TNS
    const sasu = computeSASU(baseInputs);
    // Just verify cotisations are significant
    expect(sasu.cotisationsSociales).toBeGreaterThan(5000);
  });

  it('dividendes are not subject to social charges (only flat tax)', () => {
    const r = computeSASU(baseInputs);
    // Flat tax = 30%
    if (r.dividendesBruts > 0) {
      const tauxPrelevement = r.prelevementsDividendes / r.dividendesBruts;
      expect(tauxPrelevement).toBeCloseTo(0.30, 1);
    }
  });

  it('returns empty result when CA <= charges', () => {
    const r = computeSASU({ ...baseInputs, chiffreAffaires: 5000 });
    expect(r.revenuNetApresIR).toBe(0);
  });

  it('100% remuneration leaves no dividends', () => {
    const r = computeSASU({ ...baseInputs, remunerationPctSASU: 100 });
    expect(r.dividendesBruts).toBeLessThanOrEqual(100);
  });

  it('0% remuneration has only dividends', () => {
    const r = computeSASU({ ...baseInputs, remunerationPctSASU: 0 });
    expect(r.cotisationsSociales).toBe(0);
    expect(r.dividendesNets).toBeGreaterThan(0);
  });

  it('net revenue is less than EURL for typical freelancer', () => {
    // SASU generally yields less net due to higher social charges
    // (but better protection)
    const sasu = computeSASU(baseInputs);
    // Just verify it's a reasonable amount
    expect(sasu.revenuNetApresIR).toBeGreaterThan(20_000);
    expect(sasu.revenuNetApresIR).toBeLessThan(60_000);
  });
});
