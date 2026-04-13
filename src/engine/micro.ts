import type { SimulationInputs, StatusResult, CotisationsDetail, SocialCoverage } from './types';
import {
  MICRO_COTISATIONS,
  MICRO_ABATTEMENT,
  VERSEMENT_LIBERATOIRE,
  CFP_RATES,
  MICRO_PLAFONDS,
  ACRE_REDUCTION,
} from './constants';
import { calculerIR } from './ir';

export function computeMicro(inputs: SimulationInputs): StatusResult {
  const { chiffreAffaires: ca, activityType, partsFiscales, withACRE, withVersementLiberatoire } = inputs;

  const plafond = MICRO_PLAFONDS[activityType];
  const caEffectif = Math.min(ca, plafond);

  // Cotisations sociales
  let tauxCotisations = MICRO_COTISATIONS[activityType];
  if (withACRE) {
    tauxCotisations *= ACRE_REDUCTION;
  }
  const cotisationsSociales = Math.round(caEffectif * tauxCotisations);

  // CFP (Contribution Formation Professionnelle)
  const cfp = Math.round(caEffectif * CFP_RATES[activityType]);

  // Abattement forfaitaire pour calcul IR
  const tauxAbattement = MICRO_ABATTEMENT[activityType];
  const abattement = caEffectif * tauxAbattement;
  const revenuImposableMicro = Math.max(0, caEffectif - abattement);

  // IR
  let impotRevenu: number;
  let vlAmount = 0;

  if (withVersementLiberatoire) {
    vlAmount = Math.round(caEffectif * VERSEMENT_LIBERATOIRE[activityType]);
    impotRevenu = vlAmount;
  } else {
    impotRevenu = calculerIR(revenuImposableMicro, partsFiscales);
  }

  // Revenu net
  const totalCharges = cotisationsSociales + cfp;
  const revenuNetAvantIR = caEffectif - totalCharges;
  const revenuNetApresIR = revenuNetAvantIR - impotRevenu;
  const tauxChargesEffectif = caEffectif > 0
    ? (totalCharges + impotRevenu) / caEffectif
    : 0;

  const cotisationsDetail: CotisationsDetail = {
    maladie: Math.round(cotisationsSociales * 0.35),
    retraiteBase: Math.round(cotisationsSociales * 0.40),
    retraiteComplementaire: Math.round(cotisationsSociales * 0.10),
    invaliditeDeces: Math.round(cotisationsSociales * 0.05),
    allocationsFamiliales: 0,
    csgCrds: Math.round(cotisationsSociales * 0.10),
    formationPro: cfp,
    total: totalCharges,
  };

  const protectionSociale: SocialCoverage = {
    retraite: 'faible',
    maladie: 'base',
    prevoyance: 'aucune',
    chomage: 'non',
    description: 'Couverture minimale. Droits retraite limités. Pas d\'indemnités journalières élevées. Pas de chômage.',
  };

  return {
    status: 'micro',
    label: 'Micro-entreprise',
    ca: caEffectif,
    chargesReelles: 0,
    remunerationBrute: caEffectif,
    cotisationsSociales: totalCharges,
    cotisationsDetail,
    baseImposableIR: withVersementLiberatoire ? 0 : revenuImposableMicro,
    impotRevenu,
    impotSocietes: 0,
    dividendesBruts: 0,
    prelevementsDividendes: 0,
    dividendesNets: 0,
    revenuNetAvantIR,
    revenuNetApresIR,
    tauxChargesEffectif,
    protectionSociale,
  };
}
