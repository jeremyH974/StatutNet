import { describe, it, expect } from 'vitest';
import { computeAll } from '@/engine';
import type { SimulationInputs } from '@/engine/types';

describe('Integration: computeAll', () => {
  // Scenario 1: Dev freelance, 80k CA BNC, 1 part, 10k charges
  it('Scenario 1: Dev freelance BNC 80k', () => {
    const inputs: SimulationInputs = {
      chiffreAffaires: 80_000,
      activityType: 'BNC',
      partsFiscales: 1,
      chargesReelles: 10_000,
      withACRE: false,
      withVersementLiberatoire: false,
      remunerationPctEURL: 70,
      remunerationPctSASU: 70,
    };
    const r = computeAll(inputs);

    // Micro should be capped at 77700 (BNC plafond)
    expect(r.micro.ca).toBe(77_700);

    // All three should have positive net
    expect(r.micro.revenuNetApresIR).toBeGreaterThan(0);
    expect(r.eurl.revenuNetApresIR).toBeGreaterThan(0);
    expect(r.sasu.revenuNetApresIR).toBeGreaterThan(0);

    // Micro should be highest for BNC at this level (typical)
    // (micro is often best for lower CA in BNC)
    expect(r.micro.revenuNetApresIR).toBeGreaterThan(40_000);

    // SASU should have highest charges due to social charges
    expect(r.sasu.tauxChargesEffectif).toBeGreaterThan(r.eurl.tauxChargesEffectif);
  });

  // Scenario 2: E-commerce, 150k CA BIC vente, 2 parts, 30k charges
  it('Scenario 2: E-commerce BIC vente 150k', () => {
    const inputs: SimulationInputs = {
      chiffreAffaires: 150_000,
      activityType: 'BIC_VENTE',
      partsFiscales: 2,
      chargesReelles: 30_000,
      withACRE: false,
      withVersementLiberatoire: false,
      remunerationPctEURL: 60,
      remunerationPctSASU: 60,
    };
    const r = computeAll(inputs);

    // Micro capped at 188 700 (BIC vente), 150k is under
    expect(r.micro.ca).toBe(150_000);

    // BIC vente has lowest micro cotisations (12.3%)
    const microCotisRate = r.micro.cotisationsSociales / r.micro.ca;
    expect(microCotisRate).toBeLessThan(0.15);

    // EURL and SASU should produce reasonable results
    expect(r.eurl.revenuNetApresIR).toBeGreaterThan(50_000);
    expect(r.sasu.revenuNetApresIR).toBeGreaterThan(40_000);
  });

  // Scenario 3: Consultant, 50k CA BIC services, 1.5 parts, 5k charges
  it('Scenario 3: Consultant BIC services 50k', () => {
    const inputs: SimulationInputs = {
      chiffreAffaires: 50_000,
      activityType: 'BIC_SERVICES',
      partsFiscales: 1.5,
      chargesReelles: 5_000,
      withACRE: false,
      withVersementLiberatoire: false,
      remunerationPctEURL: 80,
      remunerationPctSASU: 80,
    };
    const r = computeAll(inputs);

    // All three should be positive
    expect(r.micro.revenuNetApresIR).toBeGreaterThan(0);
    expect(r.eurl.revenuNetApresIR).toBeGreaterThan(0);
    expect(r.sasu.revenuNetApresIR).toBeGreaterThan(0);

    // At 50k BIC services, micro is typically favorable
    expect(r.micro.revenuNetApresIR).toBeGreaterThan(30_000);
  });

  // Edge case: very low CA
  it('Edge: very low CA (5000€)', () => {
    const inputs: SimulationInputs = {
      chiffreAffaires: 5_000,
      activityType: 'BNC',
      partsFiscales: 1,
      chargesReelles: 2_000,
      withACRE: false,
      withVersementLiberatoire: false,
      remunerationPctEURL: 100,
      remunerationPctSASU: 100,
    };
    const r = computeAll(inputs);

    expect(r.micro.revenuNetApresIR).toBeGreaterThanOrEqual(0);
    expect(r.eurl.revenuNetApresIR).toBeGreaterThanOrEqual(0);
    expect(r.sasu.revenuNetApresIR).toBeGreaterThanOrEqual(0);
  });

  // Edge case: very high CA
  it('Edge: high CA (300k)', () => {
    const inputs: SimulationInputs = {
      chiffreAffaires: 300_000,
      activityType: 'BNC',
      partsFiscales: 2.5,
      chargesReelles: 50_000,
      withACRE: false,
      withVersementLiberatoire: false,
      remunerationPctEURL: 50,
      remunerationPctSASU: 50,
    };
    const r = computeAll(inputs);

    // Micro capped at 77700
    expect(r.micro.ca).toBe(77_700);

    // EURL/SASU should handle high CA
    expect(r.eurl.revenuNetApresIR).toBeGreaterThan(100_000);
    expect(r.sasu.revenuNetApresIR).toBeGreaterThan(80_000);
  });
});
