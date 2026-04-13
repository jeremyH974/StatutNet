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
} from './constants';
import { calculerIR, calculerIS, calculerAbattement10 } from './ir';

/**
 * Calcule le taux maladie progressif TNS.
 */
function calculerTauxMaladie(revenu: number): number {
  if (revenu <= 0) return 0;

  const seuil1 = 0.4 * PASS;
  const seuil2 = 1.1 * PASS;

  if (revenu <= seuil1) {
    // Progressif de 0.5% à 4.5%
    const ratio = revenu / seuil1;
    return 0.005 + ratio * (0.045 - 0.005);
  } else if (revenu <= seuil2) {
    // Progressif de 4.5% à 8.5%
    const ratio = (revenu - seuil1) / (seuil2 - seuil1);
    return 0.045 + ratio * (0.085 - 0.045);
  } else {
    return 0.065; // Taux fixe au-delà
  }
}

/**
 * Calcule le taux allocations familiales progressif.
 */
function calculerTauxAF(revenu: number): number {
  if (revenu <= TNS_AF_SEUIL_BAS) return TNS_AF_TAUX_BAS;
  if (revenu >= TNS_AF_SEUIL_HAUT) return TNS_AF_TAUX_HAUT;

  // Progressif entre les deux seuils
  const ratio = (revenu - TNS_AF_SEUIL_BAS) / (TNS_AF_SEUIL_HAUT - TNS_AF_SEUIL_BAS);
  return TNS_AF_TAUX_BAS + ratio * (TNS_AF_TAUX_HAUT - TNS_AF_TAUX_BAS);
}

/**
 * Calcule les cotisations TNS détaillées.
 * Utilise une approche itérative car la CSG/CRDS se calcule sur
 * (revenu + cotisations obligatoires hors CSG/CRDS).
 */
function calculerCotisationsTNS(remuneration: number): CotisationsDetail {
  if (remuneration <= 0) {
    return {
      maladie: 0, retraiteBase: 0, retraiteComplementaire: 0,
      invaliditeDeces: 0, allocationsFamiliales: 0, csgCrds: 0,
      formationPro: 0, indemniteJournalieres: 0, total: 0,
    };
  }

  // Cotisations hors CSG/CRDS
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

  // Total cotisations obligatoires (hors CSG/CRDS)
  const cotisationsHorsCSG = maladie + retraiteBase + retraiteComplementaire +
    invaliditeDeces + allocationsFamiliales + indemniteJournalieres;

  // CSG/CRDS : calculée sur revenu + cotisations obligatoires
  // Approche itérative (3 itérations suffisent)
  let baseCsgCrds = remuneration + cotisationsHorsCSG;
  let csgCrds = Math.round(baseCsgCrds * TNS_CSG_CRDS_TOTAL);

  // 2ème itération pour affiner
  baseCsgCrds = remuneration + cotisationsHorsCSG;
  csgCrds = Math.round(baseCsgCrds * TNS_CSG_CRDS_TOTAL);

  const formationPro = Math.round(remuneration * 0.0025); // 0.25% du PASS minimum, simplifié

  const total = cotisationsHorsCSG + csgCrds + formationPro;

  return {
    maladie,
    retraiteBase,
    retraiteComplementaire,
    invaliditeDeces,
    allocationsFamiliales,
    csgCrds,
    formationPro,
    indemniteJournalieres,
    total,
  };
}

export function computeEURL(inputs: SimulationInputs): StatusResult {
  const { chiffreAffaires: ca, partsFiscales, chargesReelles, remunerationPctEURL } = inputs;

  const resultatAvantRemuneration = ca - chargesReelles;
  if (resultatAvantRemuneration <= 0) {
    return createEmptyResult(ca, chargesReelles);
  }

  // La rémunération du gérant est un % du résultat disponible
  const remunerationNetteSouhaitee = resultatAvantRemuneration * (remunerationPctEURL / 100);

  // En TNS, les cotisations s'ajoutent à la rémunération nette pour former le coût
  // Calcul itératif : on estime la rémunération nette, calcule les cotisations,
  // et vérifie que rémunération + cotisations = enveloppe
  let remunerationNette = remunerationNetteSouhaitee;
  let cotisations = calculerCotisationsTNS(remunerationNette);

  // Ajustement : l'enveloppe totale = rémunération nette + cotisations
  // On veut que cette enveloppe = remunerationNetteSouhaitee
  // Donc rémunération nette réelle = enveloppe - cotisations
  const enveloppeTotal = remunerationNetteSouhaitee;
  const coutTotal = remunerationNette + cotisations.total;

  // Si le coût dépasse l'enveloppe, ajuster la rémunération nette
  // Méthode : rémunération nette = enveloppe / (1 + taux_effectif_cotisations)
  const tauxEffectif = cotisations.total / Math.max(1, remunerationNette);
  remunerationNette = Math.round(enveloppeTotal / (1 + tauxEffectif));
  cotisations = calculerCotisationsTNS(remunerationNette);

  // 2ème itération
  const tauxEffectif2 = cotisations.total / Math.max(1, remunerationNette);
  remunerationNette = Math.round(enveloppeTotal / (1 + tauxEffectif2));
  cotisations = calculerCotisationsTNS(remunerationNette);

  const coutTotalRemuneration = remunerationNette + cotisations.total;

  // Résultat fiscal de la société
  const resultatFiscal = Math.max(0, resultatAvantRemuneration - coutTotalRemuneration);

  // IS
  const is = calculerIS(resultatFiscal);

  // Dividendes
  const dividendesBruts = Math.max(0, resultatFiscal - is);
  // En EURL, les dividendes > 10% du capital social sont soumis à cotisations TNS
  // Simplification v1 : on applique la flat tax 30% sur tous les dividendes
  const prelevementsDividendes = Math.round(dividendesBruts * FLAT_TAX);
  const dividendesNets = dividendesBruts - prelevementsDividendes;

  // IR du gérant (avec abattement 10%)
  const csgDeductible = Math.round(
    (remunerationNette + cotisations.total - cotisations.csgCrds) * TNS_CSG_DEDUCTIBLE
  );
  const abattement10 = calculerAbattement10(remunerationNette);
  const revenuImposable = Math.max(0, remunerationNette - abattement10);
  const impotRevenu = calculerIR(revenuImposable, partsFiscales);

  // Revenu net total
  const revenuNetAvantIR = remunerationNette + dividendesNets;
  const revenuNetApresIR = revenuNetAvantIR - impotRevenu;
  const tauxChargesEffectif = ca > 0
    ? (cotisations.total + impotRevenu + is + prelevementsDividendes + chargesReelles) / ca
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
    ca,
    chargesReelles,
    remunerationBrute: remunerationNette + cotisations.total,
    cotisationsSociales: cotisations.total,
    cotisationsDetail: cotisations,
    baseImposableIR: revenuImposable,
    impotRevenu,
    impotSocietes: is,
    dividendesBruts,
    prelevementsDividendes,
    dividendesNets,
    revenuNetAvantIR,
    revenuNetApresIR,
    tauxChargesEffectif,
    protectionSociale,
  };
}

function createEmptyResult(ca: number, chargesReelles: number): StatusResult {
  const emptyCotisations: CotisationsDetail = {
    maladie: 0, retraiteBase: 0, retraiteComplementaire: 0,
    invaliditeDeces: 0, allocationsFamiliales: 0, csgCrds: 0,
    formationPro: 0, indemniteJournalieres: 0, total: 0,
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
