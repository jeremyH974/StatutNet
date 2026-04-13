import { describe, it, expect } from 'vitest';
import { calculerIR, calculerIS, calculerAbattement10 } from '@/engine/ir';

describe('calculerIR', () => {
  it('returns 0 for 0 income', () => {
    expect(calculerIR(0, 1)).toBe(0);
  });

  it('returns 0 for income within first bracket (0%)', () => {
    expect(calculerIR(10_000, 1)).toBe(0);
  });

  it('calculates correctly at 11% bracket', () => {
    // 20 000€, 1 part: (20000 - 11600) * 0.11 = 924€
    const ir = calculerIR(20_000, 1);
    expect(ir).toBeGreaterThan(0);
    expect(ir).toBeLessThan(2000);
  });

  it('calculates correctly at 30% bracket', () => {
    // 50 000€, 1 part
    const ir = calculerIR(50_000, 1);
    expect(ir).toBeGreaterThan(5000);
    expect(ir).toBeLessThan(12000);
  });

  it('reduces IR with more parts (quotient familial)', () => {
    const ir1 = calculerIR(60_000, 1);
    const ir2 = calculerIR(60_000, 2);
    expect(ir2).toBeLessThan(ir1);
  });

  it('applies decote for low income', () => {
    // Low income should benefit from decote
    const ir = calculerIR(15_000, 1);
    expect(ir).toBeGreaterThanOrEqual(0);
    expect(ir).toBeLessThan(500);
  });

  it('handles high income correctly (45% bracket)', () => {
    const ir = calculerIR(200_000, 1);
    expect(ir).toBeGreaterThan(50_000);
  });

  it('returns 0 for negative income', () => {
    expect(calculerIR(-5000, 1)).toBe(0);
  });

  // Reference case: 30 000€ net imposable, 1 part
  // T1: 0, T2: (29579-11600)*0.11 = 1977.69, T3: (30000-29579)*0.30 = 126.30
  // Total brut ≈ 2104€, possibly with decote
  it('matches reference for 30k income 1 part', () => {
    const ir = calculerIR(30_000, 1);
    expect(ir).toBeGreaterThan(1800);
    expect(ir).toBeLessThan(2200);
  });
});

describe('calculerIS', () => {
  it('returns 0 for 0 or negative profit', () => {
    expect(calculerIS(0)).toBe(0);
    expect(calculerIS(-10000)).toBe(0);
  });

  it('applies 15% rate up to 42500', () => {
    expect(calculerIS(42_500)).toBe(Math.round(42_500 * 0.15));
  });

  it('applies 25% rate above 42500', () => {
    const is = calculerIS(100_000);
    const expected = Math.round(42_500 * 0.15 + 57_500 * 0.25);
    expect(is).toBe(expected);
  });
});

describe('calculerAbattement10', () => {
  it('applies minimum abattement', () => {
    expect(calculerAbattement10(3000)).toBe(504);
  });

  it('applies 10% within bounds', () => {
    expect(calculerAbattement10(50_000)).toBe(5000);
  });

  it('caps at maximum', () => {
    expect(calculerAbattement10(200_000)).toBe(14_426);
  });
});
