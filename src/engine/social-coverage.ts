import type { SocialCoverage, StatusType } from './types';

interface CoverageDetail {
  categorie: string;
  micro: string;
  eurl: string;
  sasu: string;
}

export const COVERAGE_COMPARISON: CoverageDetail[] = [
  {
    categorie: 'Assurance maladie',
    micro: 'Couverture de base (CPAM)',
    eurl: 'Couverture de base (SSI)',
    sasu: 'Régime général (CPAM)',
  },
  {
    categorie: 'Indemnités journalières',
    micro: 'Limitées (après 3 jours carence)',
    eurl: 'Limitées (après 3 jours carence)',
    sasu: 'Complètes (comme salarié)',
  },
  {
    categorie: 'Retraite de base',
    micro: 'Trimestres validés selon CA',
    eurl: 'Trimestres selon rémunération',
    sasu: 'Trimestres selon salaire',
  },
  {
    categorie: 'Retraite complémentaire',
    micro: 'Points limités',
    eurl: 'Points RCI (moyen)',
    sasu: 'AGIRC-ARRCO (élevé)',
  },
  {
    categorie: 'Prévoyance / Invalidité',
    micro: 'Très limitée',
    eurl: 'Protection de base',
    sasu: 'Complète (régime général)',
  },
  {
    categorie: 'Assurance chômage',
    micro: 'Non éligible',
    eurl: 'Non éligible (TNS)',
    sasu: 'Non éligible (dirigeant)',
  },
  {
    categorie: 'Mutuelle obligatoire',
    micro: 'Non',
    eurl: 'Non',
    sasu: 'Non (pas de salarié)',
  },
];

export function getSocialCoverage(status: StatusType): SocialCoverage {
  switch (status) {
    case 'micro':
      return {
        retraite: 'faible',
        maladie: 'base',
        prevoyance: 'aucune',
        chomage: 'non',
        description: 'Couverture minimale. Droits retraite limités selon le CA. Pas d\'indemnités journalières élevées.',
      };
    case 'eurl':
      return {
        retraite: 'moyenne',
        maladie: 'base',
        prevoyance: 'base',
        chomage: 'non',
        description: 'Régime TNS. Retraite correcte mais inférieure au régime général. IJ maladie limitées.',
      };
    case 'sasu':
      return {
        retraite: 'bonne',
        maladie: 'complete',
        prevoyance: 'complete',
        chomage: 'non',
        description: 'Régime général (assimilé salarié). Meilleure couverture sociale mais cotisations plus élevées.',
      };
  }
}
