export type ActivityType = 'BNC' | 'BIC_SERVICES' | 'BIC_VENTE';

export interface SimulationInputs {
  chiffreAffaires: number;
  activityType: ActivityType;
  partsFiscales: number;
  chargesReelles: number;
  withACRE: boolean;
  withVersementLiberatoire: boolean;
  remunerationPctEURL: number;
  remunerationPctSASU: number;
}

export interface CotisationsDetail {
  maladie: number;
  retraiteBase: number;
  retraiteComplementaire: number;
  invaliditeDeces: number;
  allocationsFamiliales: number;
  csgCrds: number;
  formationPro: number;
  indemniteJournalieres?: number;
  total: number;
}

export interface SocialCoverage {
  retraite: 'faible' | 'moyenne' | 'bonne';
  maladie: 'base' | 'complete';
  prevoyance: 'aucune' | 'base' | 'complete';
  chomage: 'non' | 'oui';
  description: string;
}

export type StatusType = 'micro' | 'eurl' | 'sasu';

export interface StatusResult {
  status: StatusType;
  label: string;
  ca: number;
  chargesReelles: number;
  remunerationBrute: number;
  cotisationsSociales: number;
  cotisationsDetail: CotisationsDetail;
  baseImposableIR: number;
  impotRevenu: number;
  impotSocietes: number;
  dividendesBruts: number;
  prelevementsDividendes: number;
  dividendesNets: number;
  revenuNetAvantIR: number;
  revenuNetApresIR: number;
  tauxChargesEffectif: number;
  protectionSociale: SocialCoverage;
}

export interface SimulationResults {
  inputs: SimulationInputs;
  micro: StatusResult;
  eurl: StatusResult;
  sasu: StatusResult;
}
