import type { SimulationInputs, StatusResult, CotisationsDetail, SocialCoverage } from './types';
import {
  PASS,
  TNS_RETRAITE_BASE_PLAFONNEE,
  TNS_RETRAITE_BASE_DEPLAFONNEE,
  TNS_RETRAITE_COMPL_T1,
  TNS_RETRAITE_COMPL_T2,
  TNS_INVALIDITE_DECES,
  TNS_IJ,
  TNS_AF_SEUIL_BAS,
  TNS_AF_SEUIL_HAUT,
  TNS_AF_TAUX_BAS,
  TNS_AF_TAUX_HAUT,
  TNS_CSG_CRDS_TOTAL,
  TNS_CSG_DEDUCTIBLE,
  FLAT_TAX,
  PRELEVEMENTS_SOCIAUX_CAPITAL,
} from './constants';
import { calculerIR, calculerIS, calculerAbattement10 } from './ir';

/**
 * Calcule le taux maladie progressif TNS (barème détaillé 2025).
 */
function calculerTauxMaladie(revenu: number): number {
  if (revenu <= 0) return 0;
  const seuil1 = 0.4 * PASS;
  const seuil2 = 1.1 * PASS;
  if (revenu <= seuil1) {
    return 0.005 + (revenu / seuil1) * (0.045 - 0.005);
  } else if (revenu <= seuil2) {
    return 0.045 + ((revenu - seuil1) / (seuil2 - seuil1)) * (0.085 - 0.045);
  }
  return 0.065;
}

function calculerTauxAF(revenu: number): number {
  if (revenu <= TNS_AF_SEUIL_BAS) return TNS_AF_TAUX_BAS;
  if (revenu >= TNS_AF_SEUIL_HAUT) return TNS_AF_TAUX_HAUT;
  const ratio = (revenu - TNS_AF_SEUIL_BAS) / (TNS_AF_SEUIL_HAUT - TNS_AF_SEUIL_BAS);
  return TNS_AF_TAUX_BAS + ratio * (TNS_AF_TAUX_HAUT - TNS_AF_TAUX_BAS);
}

/**
 * Calcule les cotisations TNS détaillées avec approche itérative pour CSG/CRDS.
 */
function calculerCotisationsTNS(remuneration: number): CotisationsDetail {
  if (remuneration <= 0) {
    return {
      maladie: 0, retraiteBase: 0, retraiteComplementaire: 0,
      invaliditeDeces: 0, allocationsFamiliales: 0, csgCrds: 0,
      formationPro: 0, indemniteJournalieres: 0, cotisationsDividendes: 0, total: 0,
    };
  }

  const tauxMaladie = calculerTauxMaladie(remuneration);
  const maladie = Math.round(remuneration * tauxMaladie);

  const retraiteBasePlafonnee = Math.round(Math.min(remuneration, PASS) * TNS_RETRAITE_BASE_PLAFONNEE);
  const retraiteBaseDeplafonnee = Math.round(remuneration * TNS_RETRAITE_BASE_DEPLAFONNEE);
  const retraiteBase = retraiteBasePlafonnee + retraiteBaseDeplafonnee;

  const retraiteComplT1 = Math.round(Math.min(remuneration, PASS) * TNS_RETRAITE_COMPL_T1);
  const retraiteComplT2 = Math.round(
    Math.max(0, Math.min(remuneration, 4 * PASS) - PASS) * TNS_RETRAITE_COMPL_T2
  );
  const retraiteComplementaire = retraiteComplT1 + retraiteComplT2;

  const invaliditeDeces = Math.round(Math.min(remuneration, PASS) * TNS_INVALIDITE_DECES);
  const tauxAF = calculerTauxAF(remuneration);
  const allocationsFamiliales = Math.round(remuneration * tauxAF);
  const indemniteJournalieres = Math.round(Math.min(remuneration, 5 * PASS) * TNS_IJ);

  const cotisationsHorsCSG = maladie + retraiteBase + retraiteComplementaire +
    invaliditeDeces + allocationsFamiliales + indemniteJournalieres;

  // CSG/CRDS itératif (2 passes)
  let baseCsgCrds = remuneration + cotisationsHorsCSG;
  let csgCrds = Math.round(baseCsgCrds * TNS_CSG_CRDS_TOTAL);
  baseCsgCrds = remuneration + cotisationsHorsCSG;
  csgCrds = Math.round(baseCsgCrds * TNS_CSG_CRDS_TOTAL);

  const formationPro = Math.round(remuneration * 0.0025);
  const total = cotisationsHorsCSG + csgCrds + formationPro;

  return {
    maladie, retraiteBase, retraiteComplementaire,
    invaliditeDeces, allocationsFamiliales, csgCrds,
    formationPro, indemniteJournalieres, cotisationsDividendes: 0, total,
  };
}

/**
 * Calcule les cotisations TNS sur les dividendes excédant 10% du capital social.
 * Taux effectif simplifié à ~45% (cotisations TNS sur la part excédentaire).
 */
function calculerCotisationsDividendesEURL(
  dividendesBruts: number,
  capitalSocial: number
): number {
  const seuil = capitalSocial * 0.10;
  const partExcedentaire = Math.max(0, dividendesBruts - seuil);
  if (partExcedentaire <= 0) return 0;
  // Taux effectif TNS sur dividendes excédentaires ≈ 45%
  return Math.round(partExcedentaire * 0.45);
}

export function computeEURL(inputs: SimulationInputs): StatusResult {
  const {
    chiffreAffaires: ca, partsFiscales, chargesReelles,
    remunerationPctEURL, dividendeTaxMode, capitalSocialEURL,
  } = inputs;

  const resultatAvantRemuneration = ca - chargesReelles;
  if (resultatAvantRemuneration <= 0) {
    return createEmptyResult(ca, chargesReelles);
  }

  const remunerationNetteSouhaitee = resultatAvantRemuneration * (remunerationPctEURL / 100);

  // Calcul itératif de la rémunération nette
  let remunerationNette = remunerationNetteSouhaitee;
  let cotisations = calculerCotisationsTNS(remunerationNette);

  const enveloppeTotal = remunerationNetteSouhaitee;
  const tauxEffectif = cotisations.total / Math.max(1, remunerationNette);
  remunerationNette = Math.round(enveloppeTotal / (1 + tauxEffectif));
  cotisations = calculerCotisationsTNS(remunerationNette);

  const tauxEffectif2 = cotisations.total / Math.max(1, remunerationNette);
  remunerationNette = Math.round(enveloppeTotal / (1 + tauxEffectif2));
  cotisations = calculerCotisationsTNS(remunerationNette);

  const coutTotalRemuneration = remunerationNette + cotisations.total;
  const resultatFiscal = Math.max(0, resultatAvantRemuneration - coutTotalRemuneration);
  const is = calculerIS(resultatFiscal);
  const dividendesBruts = Math.max(0, resultatFiscal - is);

  // Cotisations TNS sur dividendes > 10% capital social
  const cotisationsDividendes = calculerCotisationsDividendesEURL(dividendesBruts, capitalSocialEURL);

  // Prélèvements sur dividendes selon le mode choisi
  let prelevementsDividendes: number;
  let dividendesImposablesIR = 0;

  if (dividendeTaxMode === 'bareme') {
    // Barème IR : prélèvements sociaux 17.2% + IR au barème (avec abattement 40%)
    const prelevementsSociaux = Math.round(dividendesBruts * PRELEVEMENTS_SOCIAUX_CAPITAL);
    prelevementsDividendes = prelevementsSociaux + cotisationsDividendes;
    // Les dividendes imposables au barème bénéficient de l'abattement de 40%
    dividendesImposablesIR = Math.round(dividendesBruts * 0.60);
  } else {
    // PFU 30% (12.8% IR + 17.2% PS)
    prelevementsDividendes = Math.round(dividendesBruts * FLAT_TAX) + cotisationsDividendes;
  }

  const dividendesNets = dividendesBruts - prelevementsDividendes;

  // IR du gérant
  const abattement10 = calculerAbattement10(remunerationNette);
  const revenuImposableRemuneration = Math.max(0, remunerationNette - abattement10);
  const revenuImposable = revenuImposableRemuneration + dividendesImposablesIR;
  const impotRevenu = calculerIR(revenuImposable, partsFiscales);

  // Mettre à jour le détail des cotisations
  cotisations.cotisationsDividendes = cotisationsDividendes;
  cotisations.total += cotisationsDividendes;

  const revenuNetAvantIR = remunerationNette + dividendesNets;
  const revenuNetApresIR = revenuNetAvantIR - impotRevenu;
  const tauxChargesEffectif = ca > 0
    ? (cotisations.total + impotRevenu + is + prelevementsDividendes - cotisationsDividendes + chargesReelles) / ca
    : 0;

  const protectionSociale: SocialCoverage = {
    retraite: 'moyenne',
    maladie: 'base',
    prevoyance: 'base',
    chomage: 'non',
    description: 'Régime TNS. Retraite correcte mais inférieure au régime général. IJ maladie limitées. Pas de chômage.',
  };

  return {
    status: 'eurl',
    label: 'EURL à l\'IS',
    ca, chargesReelles,
    remunerationBrute: remunerationNette + cotisations.total - cotisationsDividendes,
    cotisationsSociales: cotisations.total,
    cotisationsDetail: cotisations,
    baseImposableIR: revenuImposable,
    impotRevenu, impotSocietes: is,
    dividendesBruts, prelevementsDividendes, dividendesNets,
    revenuNetAvantIR, revenuNetApresIR, tauxChargesEffectif,
    protectionSociale,
  };
}

function createEmptyResult(ca: number, chargesReelles: number): StatusResult {
  const emptyCotisations: CotisationsDetail = {
    maladie: 0, retraiteBase: 0, retraiteComplementaire: 0,
    invaliditeDeces: 0, allocationsFamiliales: 0, csgCrds: 0,
    formationPro: 0, indemniteJournalieres: 0, cotisationsDividendes: 0, total: 0,
  };
  return {
    status: 'eurl', label: 'EURL à l\'IS', ca, chargesReelles,
    remunerationBrute: 0, cotisationsSociales: 0, cotisationsDetail: emptyCotisations,
    baseImposableIR: 0, impotRevenu: 0, impotSocietes: 0,
    dividendesBruts: 0, prelevementsDividendes: 0, dividendesNets: 0,
    revenuNetAvantIR: 0, revenuNetApresIR: 0, tauxChargesEffectif: 1,
    protectionSociale: {
      retraite: 'moyenne', maladie: 'base', prevoyance: 'base',
      chomage: 'non', description: 'Aucun revenu disponible avec ces paramètres.',
    },
  };
}
