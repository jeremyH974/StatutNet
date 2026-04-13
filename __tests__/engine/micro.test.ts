import { describe, it, expect } from 'vitest';
import { computeMicro } from '@/engine/micro';
import type { SimulationInputs } from '@/engine/types';

const baseInputs: SimulationInputs = {
  chiffreAffaires: 50_000,
  activityType: 'BNC',
  partsFiscales: 1,
  chargesReelles: 0,
  withACRE: false,
  withVersementLiberatoire: false,
  remunerationPctEURL: 70,
  remunerationPctSASU: 70,
};

describe('computeMicro', () => {
  it('computes BNC correctly', () => {
    const r = computeMicro(baseInputs);
    expect(r.status).toBe('micro');
    expect(r.ca).toBe(50_000);
    // BNC cotisations: 50000 * 0.232 = 11600
    expect(r.cotisationsSociales).toBeGreaterThan(11_000);
    expect(r.cotisationsSociales).toBeLessThan(12_500);
    expect(r.revenuNetApresIR).toBeGreaterThan(0);
    expect(r.revenuNetApresIR).toBeLessThan(50_000);
  });

  it('computes BIC_VENTE with lower rates', () => {
    const r = computeMicro({ ...baseInputs, activityType: 'BIC_VENTE' });
    // BIC vente: 12.3% cotisations vs 23.2% BNC
    expect(r.cotisationsSociales).toBeLessThan(
      computeMicro(baseInputs).cotisationsSociales
    );
  });

  it('applies ACRE reduction', () => {
    const withoutACRE = computeMicro(baseInputs);
    const withACRE = computeMicro({ ...baseInputs, withACRE: true });
    // ACRE = 50% reduction on cotisations
    expect(withACRE.cotisationsSociales).toBeLessThan(withoutACRE.cotisationsSociales);
    expect(withACRE.revenuNetApresIR).toBeGreaterThan(withoutACRE.revenuNetApresIR);
  });

  it('applies versement libératoire', () => {
    const withVL = computeMicro({ ...baseInputs, withVersementLiberatoire: true });
    // VL: IR = CA * 2.2% for BNC = 1100€
    expect(withVL.impotRevenu).toBeGreaterThan(1000);
    expect(withVL.impotRevenu).toBeLessThan(1200);
    expect(withVL.baseImposableIR).toBe(0);
  });

  it('caps CA at micro plafond', () => {
    const r = computeMicro({ ...baseInputs, chiffreAffaires: 100_000 });
    // BNC plafond = 77700
    expect(r.ca).toBe(77_700);
  });

  it('handles zero CA', () => {
    const r = computeMicro({ ...baseInputs, chiffreAffaires: 0 });
    expect(r.revenuNetApresIR).toBe(0);
    expect(r.cotisationsSociales).toBe(0);
    expect(r.impotRevenu).toBe(0);
  });

  it('effective rate is reasonable for BNC', () => {
    const r = computeMicro(baseInputs);
    // BNC at 50k: cotisations ~23% + IR ~few% = roughly 25-35%
    expect(r.tauxChargesEffectif).toBeGreaterThan(0.20);
    expect(r.tauxChargesEffectif).toBeLessThan(0.45);
  });
});
