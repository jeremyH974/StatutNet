import {
  IR_TRANCHES,
  DECOTE_SEUIL_CELIBATAIRE,
  DECOTE_SEUIL_COUPLE,
  DECOTE_MONTANT_CELIBATAIRE,
  DECOTE_MONTANT_COUPLE,
  DECOTE_TAUX,
  PLAFOND_QF_DEMI_PART,
  ABATTEMENT_10_MIN,
  ABATTEMENT_10_MAX,
} from './constants';

/**
 * Calcule l'IR brut pour un revenu imposable par part (quotient familial).
 */
function calculerIRBrutParPart(revenuParPart: number): number {
  let impot = 0;
  for (const tranche of IR_TRANCHES) {
    if (revenuParPart <= tranche.min) break;
    const base = Math.min(revenuParPart, tranche.max) - tranche.min;
    impot += base * tranche.rate;
  }
  return impot;
}

/**
 * Applique le plafonnement du quotient familial.
 * Compare l'IR avec N parts vs l'IR avec 1 part (ou 2 pour couple) - plafond.
 */
function appliquerPlafonnementQF(
  revenuImposable: number,
  parts: number
): number {
  // IR avec le nombre de parts réel
  const irAvecParts = calculerIRBrutParPart(revenuImposable / parts) * parts;

  // Nombre de parts de référence (1 pour célibataire, 2 pour couple)
  const partsRef = parts >= 2 ? 2 : 1;
  const demiPartsSupp = (parts - partsRef) * 2; // nombre de demi-parts supplémentaires

  if (demiPartsSupp <= 0) return irAvecParts;

  // IR avec les parts de référence
  const irRef = calculerIRBrutParPart(revenuImposable / partsRef) * partsRef;

  // Avantage maximum du QF
  const avantageMax = demiPartsSupp * PLAFOND_QF_DEMI_PART;
  const avantageReel = irRef - irAvecParts;

  if (avantageReel > avantageMax) {
    return irRef - avantageMax;
  }

  return irAvecParts;
}

/**
 * Applique la décote si l'impôt brut est inférieur au seuil.
 */
function appliquerDecote(impotBrut: number, parts: number): number {
  const isCouple = parts >= 2;
  const seuil = isCouple ? DECOTE_SEUIL_COUPLE : DECOTE_SEUIL_CELIBATAIRE;

  if (impotBrut >= seuil) return impotBrut;
  if (impotBrut <= 0) return 0;

  const montantDecote = isCouple ? DECOTE_MONTANT_COUPLE : DECOTE_MONTANT_CELIBATAIRE;
  const decote = montantDecote - impotBrut * DECOTE_TAUX;

  if (decote <= 0) return impotBrut;

  return Math.max(0, impotBrut - decote);
}

/**
 * Calcule l'abattement de 10% sur les salaires/rémunérations.
 */
export function calculerAbattement10(revenuBrut: number): number {
  const abattement = revenuBrut * 0.10;
  return Math.max(ABATTEMENT_10_MIN, Math.min(abattement, ABATTEMENT_10_MAX));
}

/**
 * Calcule l'impôt sur le revenu final.
 * @param revenuImposable - Revenu net imposable (après abattements)
 * @param parts - Nombre de parts fiscales (quotient familial)
 * @returns Montant de l'IR à payer
 */
export function calculerIR(revenuImposable: number, parts: number): number {
  if (revenuImposable <= 0) return 0;
  if (parts <= 0) parts = 1;

  // 1. Calculer l'IR brut avec plafonnement QF
  let impot = appliquerPlafonnementQF(revenuImposable, parts);

  // 2. Appliquer la décote
  impot = appliquerDecote(impot, parts);

  // 3. L'IR ne peut pas être négatif
  return Math.max(0, Math.round(impot));
}

/**
 * Calcule l'IS (Impôt sur les Sociétés).
 */
export function calculerIS(benefice: number): number {
  if (benefice <= 0) return 0;

  const tranche1 = Math.min(benefice, 42_500);
  const tranche2 = Math.max(0, benefice - 42_500);

  return Math.round(tranche1 * 0.15 + tranche2 * 0.25);
}
