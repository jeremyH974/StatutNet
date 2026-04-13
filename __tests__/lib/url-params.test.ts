import { describe, it, expect } from 'vitest';
import { encodeSimulationToURL, decodeSimulationFromURL } from '@/lib/url-params';
import type { SimulationInputs } from '@/engine/types';

const defaults: SimulationInputs = {
  chiffreAffaires: 80_000,
  activityType: 'BNC',
  partsFiscales: 1,
  chargesReelles: 10_000,
  withACRE: false,
  withVersementLiberatoire: false,
  remunerationPctEURL: 70,
  remunerationPctSASU: 70,
};

describe('encodeSimulationToURL + decodeSimulationFromURL', () => {
  it('round-trip: decode(encode(inputs)) reconstructs same values', () => {
    const inputs: SimulationInputs = {
      chiffreAffaires: 60_000,
      activityType: 'BIC_SERVICES',
      partsFiscales: 2.5,
      chargesReelles: 3_000,
      withACRE: true,
      withVersementLiberatoire: true,
      remunerationPctEURL: 40,
      remunerationPctSASU: 55,
    };

    const encoded = encodeSimulationToURL(inputs);
    const decoded = decodeSimulationFromURL(encoded);
    const merged = { ...defaults, ...decoded };

    expect(merged.chiffreAffaires).toBe(60_000);
    expect(merged.activityType).toBe('BIC_SERVICES');
    expect(merged.partsFiscales).toBe(2.5);
    expect(merged.chargesReelles).toBe(3_000);
    expect(merged.withACRE).toBe(true);
    expect(merged.withVersementLiberatoire).toBe(true);
    expect(merged.remunerationPctEURL).toBe(40);
    expect(merged.remunerationPctSASU).toBe(55);
  });

  it('default values produce empty query string', () => {
    const encoded = encodeSimulationToURL(defaults);
    expect(encoded).toBe('');
  });

  it('only non-default values are encoded', () => {
    const inputs = { ...defaults, chiffreAffaires: 50_000 };
    const encoded = encodeSimulationToURL(inputs);
    expect(encoded).toBe('ca=50000');
  });
});

describe('decodeSimulationFromURL', () => {
  it('empty URL returns empty object', () => {
    expect(decodeSimulationFromURL('')).toEqual({});
  });

  it('unknown parameters are ignored', () => {
    const decoded = decodeSimulationFromURL('foo=bar&xyz=123');
    expect(decoded).toEqual({});
  });

  it('non-numeric ca is ignored', () => {
    const decoded = decodeSimulationFromURL('ca=abc');
    expect(decoded.chiffreAffaires).toBeUndefined();
  });

  it('negative ca is ignored', () => {
    const decoded = decodeSimulationFromURL('ca=-5000');
    expect(decoded.chiffreAffaires).toBeUndefined();
  });

  it('out-of-range pt is ignored', () => {
    const decoded = decodeSimulationFromURL('pt=0.5');
    expect(decoded.partsFiscales).toBeUndefined();
  });

  it('invalid activity type is ignored', () => {
    const decoded = decodeSimulationFromURL('act=invalid');
    expect(decoded.activityType).toBeUndefined();
  });

  it('parses BIC_VENTE correctly', () => {
    const decoded = decodeSimulationFromURL('act=bic-v');
    expect(decoded.activityType).toBe('BIC_VENTE');
  });

  it('parses boolean flags', () => {
    const decoded = decodeSimulationFromURL('ac=1&vl=0');
    expect(decoded.withACRE).toBe(true);
    expect(decoded.withVersementLiberatoire).toBe(false);
  });
});
