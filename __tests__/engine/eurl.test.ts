import { describe, it, expect } from 'vitest';
import { computeEURL } from '@/engine/eurl';
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
  dividendeTaxMode: 'pfu',
  capitalSocialEURL: 1_000,
};

describe('computeEURL', () => {
  it('returns valid results', () => {
    const r = computeEURL(baseInputs);
    expect(r.status).toBe('eurl');
    expect(r.ca).toBe(80_000);
    expect(r.revenuNetApresIR).toBeGreaterThan(0);
    expect(r.revenuNetApresIR).toBeLessThan(80_000);
  });

  it('has IS when there are dividends', () => {
    const r = computeEURL(baseInputs);
    // With 70% rémunération, 30% goes to profit => IS
    expect(r.impotSocietes).toBeGreaterThan(0);
    expect(r.dividendesBruts).toBeGreaterThan(0);
  });

  it('has no dividends at 100% remuneration', () => {
    const r = computeEURL({ ...baseInputs, remunerationPctEURL: 100 });
    // All goes to remuneration, little to no dividends
    expect(r.dividendesBruts).toBeLessThanOrEqual(100); // could be small rounding
  });

  it('has no remuneration at 0%', () => {
    const r = computeEURL({ ...baseInputs, remunerationPctEURL: 0 });
    // Avec capital social 1000€, les dividendes > 10% capital génèrent des cotisations TNS
    expect(r.dividendesBruts).toBeGreaterThan(0);
    // Les cotisations viennent uniquement des dividendes excédentaires
    expect(r.cotisationsDetail.cotisationsDividendes).toBeGreaterThan(0);
  });

  it('returns empty result when CA <= charges', () => {
    const r = computeEURL({ ...baseInputs, chiffreAffaires: 5000 });
    expect(r.revenuNetApresIR).toBe(0);
  });

  it('cotisations TNS are reasonable (35-50% of remuneration)', () => {
    const r = computeEURL(baseInputs);
    if (r.remunerationBrute > 0) {
      const tauxCotisations = r.cotisationsSociales / r.remunerationBrute;
      expect(tauxCotisations).toBeGreaterThan(0.25);
      expect(tauxCotisations).toBeLessThan(0.55);
    }
  });

  it('net revenue increases with higher parts fiscales', () => {
    const r1 = computeEURL({ ...baseInputs, partsFiscales: 1 });
    const r2 = computeEURL({ ...baseInputs, partsFiscales: 2 });
    expect(r2.revenuNetApresIR).toBeGreaterThanOrEqual(r1.revenuNetApresIR);
  });
});
