import type { SimulationInputs, StatusResult, CotisationsDetail, SocialCoverage } from './types';
import { SASU_TAUX_PATRONAL, SASU_TAUX_SALARIAL, FLAT_TAX, PRELEVEMENTS_SOCIAUX_CAPITAL } from './constants';
import { calculerIR, calculerIS, calculerAbattement10 } from './ir';

export function computeSASU(inputs: SimulationInputs): StatusResult {
  const { chiffreAffaires: ca, partsFiscales, chargesReelles, remunerationPctSASU, dividendeTaxMode } = inputs;

  const resultatAvantRemuneration = ca - chargesReelles;
  if (resultatAvantRemuneration <= 0) {
    return createEmptyResult(ca, chargesReelles);
  }

  const enveloppeRemuneration = resultatAvantRemuneration * (remunerationPctSASU / 100);
  const salaireBrut = enveloppeRemuneration / (1 + SASU_TAUX_PATRONAL);
  const chargesPatronales = Math.round(salaireBrut * SASU_TAUX_PATRONAL);
  const chargesSalariales = Math.round(salaireBrut * SASU_TAUX_SALARIAL);
  const salaireNet = Math.round(salaireBrut - chargesSalariales);
  const coutTotalRemuneration = Math.round(salaireBrut + chargesPatronales);
  const cotisationsSociales = chargesPatronales + chargesSalariales;

  const resultatFiscal = Math.max(0, resultatAvantRemuneration - coutTotalRemuneration);
  const is = calculerIS(resultatFiscal);
  const dividendesBruts = Math.max(0, resultatFiscal - is);

  // Prélèvements dividendes selon mode
  let prelevementsDividendes: number;
  let dividendesImposablesIR = 0;

  if (dividendeTaxMode === 'bareme') {
    const prelevementsSociaux = Math.round(dividendesBruts * PRELEVEMENTS_SOCIAUX_CAPITAL);
    prelevementsDividendes = prelevementsSociaux;
    dividendesImposablesIR = Math.round(dividendesBruts * 0.60); // abattement 40%
  } else {
    prelevementsDividendes = Math.round(dividendesBruts * FLAT_TAX);
  }
  const dividendesNets = dividendesBruts - prelevementsDividendes;

  // IR
  const abattement10 = calculerAbattement10(salaireNet);
  const revenuImposableRemuneration = Math.max(0, salaireNet - abattement10);
  const revenuImposable = revenuImposableRemuneration + dividendesImposablesIR;
  const impotRevenu = calculerIR(revenuImposable, partsFiscales);

  const revenuNetAvantIR = salaireNet + dividendesNets;
  const revenuNetApresIR = revenuNetAvantIR - impotRevenu;
  const tauxChargesEffectif = ca > 0
    ? (cotisationsSociales + impotRevenu + is + prelevementsDividendes + chargesReelles) / ca
    : 0;

  const cotisationsDetail: CotisationsDetail = {
    maladie: Math.round(cotisationsSociales * 0.20),
    retraiteBase: Math.round(cotisationsSociales * 0.28),
    retraiteComplementaire: Math.round(cotisationsSociales * 0.18),
    invaliditeDeces: Math.round(cotisationsSociales * 0.04),
    allocationsFamiliales: Math.round(cotisationsSociales * 0.08),
    csgCrds: Math.round(cotisationsSociales * 0.15),
    formationPro: Math.round(cotisationsSociales * 0.03),
    indemniteJournalieres: Math.round(cotisationsSociales * 0.04),
    total: cotisationsSociales,
  };

  return {
    status: 'sasu',
    label: 'SASU à l\'IS',
    ca, chargesReelles,
    remunerationBrute: Math.round(salaireBrut),
    cotisationsSociales, cotisationsDetail,
    baseImposableIR: revenuImposable,
    impotRevenu, impotSocietes: is,
    dividendesBruts, prelevementsDividendes, dividendesNets,
    revenuNetAvantIR, revenuNetApresIR, tauxChargesEffectif,
    protectionSociale: {
      retraite: 'bonne', maladie: 'complete', prevoyance: 'complete',
      chomage: 'non',
      description: 'Régime général (assimilé salarié). Retraite complète, IJ maladie, prévoyance. Pas de chômage sauf assurance privée.',
    },
  };
}

function createEmptyResult(ca: number, chargesReelles: number): StatusResult {
  const emptyCotisations: CotisationsDetail = {
    maladie: 0, retraiteBase: 0, retraiteComplementaire: 0,
    invaliditeDeces: 0, allocationsFamiliales: 0, csgCrds: 0,
    formationPro: 0, total: 0,
  };
  return {
    status: 'sasu', label: 'SASU à l\'IS', ca, chargesReelles,
    remunerationBrute: 0, cotisationsSociales: 0, cotisationsDetail: emptyCotisations,
    baseImposableIR: 0, impotRevenu: 0, impotSocietes: 0,
    dividendesBruts: 0, prelevementsDividendes: 0, dividendesNets: 0,
    revenuNetAvantIR: 0, revenuNetApresIR: 0, tauxChargesEffectif: 1,
    protectionSociale: {
      retraite: 'bonne', maladie: 'complete', prevoyance: 'complete',
      chomage: 'non', description: 'Aucun revenu disponible avec ces paramètres.',
    },
  };
}
