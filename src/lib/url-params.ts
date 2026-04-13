import type { SimulationInputs, ActivityType } from '@/engine/types';

const DEFAULTS: SimulationInputs = {
  chiffreAffaires: 80_000,
  activityType: 'BNC',
  partsFiscales: 1,
  chargesReelles: 10_000,
  withACRE: false,
  withVersementLiberatoire: false,
  remunerationPctEURL: 70,
  remunerationPctSASU: 70,
};

const ACT_TO_SHORT: Record<ActivityType, string> = {
  BNC: 'bnc',
  BIC_SERVICES: 'bic-s',
  BIC_VENTE: 'bic-v',
};

const SHORT_TO_ACT: Record<string, ActivityType> = {
  bnc: 'BNC',
  'bic-s': 'BIC_SERVICES',
  'bic-v': 'BIC_VENTE',
};

export function encodeSimulationToURL(inputs: SimulationInputs): string {
  const params = new URLSearchParams();

  if (inputs.chiffreAffaires !== DEFAULTS.chiffreAffaires) {
    params.set('ca', String(inputs.chiffreAffaires));
  }
  if (inputs.activityType !== DEFAULTS.activityType) {
    params.set('act', ACT_TO_SHORT[inputs.activityType]);
  }
  if (inputs.partsFiscales !== DEFAULTS.partsFiscales) {
    params.set('pt', String(inputs.partsFiscales));
  }
  if (inputs.chargesReelles !== DEFAULTS.chargesReelles) {
    params.set('ch', String(inputs.chargesReelles));
  }
  if (inputs.withACRE !== DEFAULTS.withACRE) {
    params.set('ac', inputs.withACRE ? '1' : '0');
  }
  if (inputs.withVersementLiberatoire !== DEFAULTS.withVersementLiberatoire) {
    params.set('vl', inputs.withVersementLiberatoire ? '1' : '0');
  }
  if (inputs.remunerationPctEURL !== DEFAULTS.remunerationPctEURL) {
    params.set('re', String(inputs.remunerationPctEURL));
  }
  if (inputs.remunerationPctSASU !== DEFAULTS.remunerationPctSASU) {
    params.set('rs', String(inputs.remunerationPctSASU));
  }

  return params.toString();
}

export function decodeSimulationFromURL(search: string): Partial<SimulationInputs> {
  const params = new URLSearchParams(search);
  const result: Partial<SimulationInputs> = {};

  const ca = Number(params.get('ca'));
  if (params.has('ca') && !isNaN(ca) && ca >= 0 && ca <= 10_000_000) {
    result.chiffreAffaires = ca;
  }

  const act = params.get('act');
  if (act && act in SHORT_TO_ACT) {
    result.activityType = SHORT_TO_ACT[act];
  }

  const pt = Number(params.get('pt'));
  if (params.has('pt') && !isNaN(pt) && pt >= 1 && pt <= 10) {
    result.partsFiscales = pt;
  }

  const ch = Number(params.get('ch'));
  if (params.has('ch') && !isNaN(ch) && ch >= 0) {
    result.chargesReelles = ch;
  }

  const ac = params.get('ac');
  if (ac === '1') result.withACRE = true;
  if (ac === '0') result.withACRE = false;

  const vl = params.get('vl');
  if (vl === '1') result.withVersementLiberatoire = true;
  if (vl === '0') result.withVersementLiberatoire = false;

  const re = Number(params.get('re'));
  if (params.has('re') && !isNaN(re) && re >= 0 && re <= 100) {
    result.remunerationPctEURL = re;
  }

  const rs = Number(params.get('rs'));
  if (params.has('rs') && !isNaN(rs) && rs >= 0 && rs <= 100) {
    result.remunerationPctSASU = rs;
  }

  return result;
}
