// ============================================================
// Paramètres fiscaux et sociaux — Année 2025
// Source: service-public.fr, urssaf.fr, economie.gouv.fr
// ============================================================

// Plafond Annuel de la Sécurité Sociale
export const PASS = 47_100;

// ----- Impôt sur le Revenu (barème 2025 sur revenus 2025) -----
export const IR_TRANCHES = [
  { min: 0, max: 11_600, rate: 0 },
  { min: 11_600, max: 29_579, rate: 0.11 },
  { min: 29_579, max: 84_577, rate: 0.30 },
  { min: 84_577, max: 181_917, rate: 0.41 },
  { min: 181_917, max: Infinity, rate: 0.45 },
] as const;

// Décote
export const DECOTE_SEUIL_CELIBATAIRE = 1_982;
export const DECOTE_SEUIL_COUPLE = 3_277;
export const DECOTE_MONTANT_CELIBATAIRE = 897;
export const DECOTE_MONTANT_COUPLE = 1_483;
export const DECOTE_TAUX = 0.4525;

// Plafonnement du quotient familial (par demi-part supplémentaire)
export const PLAFOND_QF_DEMI_PART = 1_791;

// Abattement 10% sur salaires/rémunération pour IR
export const ABATTEMENT_10_MIN = 504;
export const ABATTEMENT_10_MAX = 14_426;

// ----- Micro-entreprise -----
export const MICRO_COTISATIONS = {
  BIC_VENTE: 0.123,
  BIC_SERVICES: 0.212,
  BNC: 0.232,
} as const;

export const MICRO_ABATTEMENT = {
  BIC_VENTE: 0.71,
  BIC_SERVICES: 0.50,
  BNC: 0.34,
} as const;

export const VERSEMENT_LIBERATOIRE = {
  BIC_VENTE: 0.01,
  BIC_SERVICES: 0.017,
  BNC: 0.022,
} as const;

export const CFP_RATES = {
  BIC_VENTE: 0.001,
  BIC_SERVICES: 0.003,
  BNC: 0.002,
} as const;

export const MICRO_PLAFONDS = {
  BIC_VENTE: 188_700,
  BIC_SERVICES: 77_700,
  BNC: 77_700,
} as const;

// ACRE : réduction 50% des cotisations la 1ère année
export const ACRE_REDUCTION = 0.5;

// ----- Impôt sur les Sociétés (EURL / SASU) -----
export const IS_TRANCHES = [
  { min: 0, max: 42_500, rate: 0.15 },
  { min: 42_500, max: Infinity, rate: 0.25 },
] as const;

// ----- Dividendes -----
export const FLAT_TAX = 0.30;
export const PRELEVEMENTS_SOCIAUX_CAPITAL = 0.172;
export const IR_DIVIDENDES_PFU = 0.128; // Part IR du PFU (12.8%)

// ----- TNS — Cotisations gérant EURL (2025) -----
// Maladie : taux progressif
export const TNS_MALADIE_TRANCHES = [
  { min: 0, max: 0.4 * PASS, tauxMin: 0.005, tauxMax: 0.045 }, // progressif
  { min: 0.4 * PASS, max: 1.1 * PASS, tauxMin: 0.045, tauxMax: 0.085 }, // progressif
  { min: 1.1 * PASS, max: 5 * PASS, taux: 0.065 }, // fixe
  { min: 5 * PASS, max: Infinity, taux: 0.065 }, // fixe
] as const;

// Retraite de base
export const TNS_RETRAITE_BASE_PLAFONNEE = 0.1775; // jusqu'à 1 PASS
export const TNS_RETRAITE_BASE_DEPLAFONNEE = 0.0072; // totalité du revenu

// Retraite complémentaire
export const TNS_RETRAITE_COMPL_T1 = 0.081; // jusqu'à 1 PASS
export const TNS_RETRAITE_COMPL_T2 = 0.091; // 1 PASS à 4 PASS

// Invalidité-décès
export const TNS_INVALIDITE_DECES = 0.013; // jusqu'à 1 PASS

// Indemnités journalières
export const TNS_IJ = 0.0085; // jusqu'à 5 PASS

// Allocations familiales : taux progressif
export const TNS_AF_SEUIL_BAS = 1.1 * PASS;
export const TNS_AF_SEUIL_HAUT = 1.4 * PASS;
export const TNS_AF_TAUX_BAS = 0; // en dessous de 1.1 PASS
export const TNS_AF_TAUX_HAUT = 0.031; // au-dessus de 1.4 PASS

// CSG-CRDS
export const TNS_CSG_DEDUCTIBLE = 0.068;
export const TNS_CSG_NON_DEDUCTIBLE = 0.024;
export const TNS_CRDS = 0.005;
export const TNS_CSG_CRDS_TOTAL = 0.097;

// ----- SASU — Charges simplifiées -----
export const SASU_TAUX_PATRONAL = 0.42; // ~42% du brut
export const SASU_TAUX_SALARIAL = 0.22; // ~22% du brut
