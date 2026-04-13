# StatutNet — Contexte projet pour Claude

## Ce qu'est ce projet

Simulateur fiscal et social web pour indépendants français. Compare le revenu net disponible selon 3 statuts juridiques : **Micro-entreprise**, **EURL à l'IS**, **SASU à l'IS**. Objectif business : outil de décision gratuit + aimant à prospects (newsletter).

## Stack technique

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Recharts** pour les graphiques (bar chart comparatif, stacked bar décomposition CA)
- **100% client-side** — aucun backend, aucune donnée stockée, aucune API
- **Paramètres fiscaux 2025** centralisés dans `src/engine/constants.ts`
- Tests avec **Vitest** (41 tests passent)

## Architecture des fichiers

```
src/
├── app/
│   ├── layout.tsx              # Layout racine (Inter font, Header/Footer, meta SEO)
│   ├── page.tsx                # Landing page (hero + features + aperçu 3 statuts)
│   ├── globals.css             # Variables CSS custom (--primary, --accent, etc.)
│   └── simulateur/page.tsx     # Page principale du simulateur (form + results)
│
├── engine/                     # Moteur de calcul fiscal (pur TypeScript, sans dépendance React)
│   ├── types.ts                # Interfaces : SimulationInputs, StatusResult, SimulationResults
│   ├── constants.ts            # TOUS les paramètres fiscaux 2025 (barème IR, taux URSSAF, IS, PASS, etc.)
│   ├── ir.ts                   # Impôt sur le revenu : barème progressif, quotient familial, décote, plafonnement QF
│   ├── micro.ts                # Micro-entreprise : cotisations forfaitaires, abattement, VL, ACRE, CFP
│   ├── eurl.ts                 # EURL IS : rémunération gérant, cotisations TNS (itératif), IS, dividendes flat tax
│   ├── sasu.ts                 # SASU IS : salaire président (charges ~42%/22%), IS, dividendes flat tax
│   ├── social-coverage.ts      # Données qualitatives protection sociale (tableau comparatif)
│   ├── optimizer.ts            # Recherche du split rémunération/dividendes optimal (brute force par pas de 1%)
│   └── index.ts                # computeAll(inputs) => { micro, eurl, sasu }
│
├── components/
│   ├── layout/                 # Header (sticky, mobile hamburger), Footer
│   ├── simulator/
│   │   └── SimulatorForm.tsx   # Formulaire complet (CA, activité, parts, charges, options avancées)
│   ├── results/
│   │   ├── ResultsDashboard.tsx    # Orchestre tous les panneaux de résultats
│   │   ├── ComparisonTable.tsx     # Grille 3 colonnes
│   │   ├── StatusCard.tsx          # Carte par statut (résumé + détail accordéon)
│   │   ├── ComparisonChart.tsx     # Bar chart Recharts (revenu net comparé)
│   │   ├── WaterfallChart.tsx      # Stacked bar (décomposition CA → net)
│   │   └── SocialCoverageTable.tsx # Tableau protection sociale avec code couleur
│   ├── newsletter/
│   │   └── NewsletterCTA.tsx   # Formulaire email opt-in (soft, pas de gating)
│   └── ui/                     # NumberInput, Slider, Tooltip (composants réutilisables)
│
├── hooks/
│   └── useSimulator.ts         # Hook principal : state inputs + results + runSimulation()
│
└── lib/
    ├── formatters.ts           # formatCurrency(), formatPercent(), formatNumber() via Intl
    └── validators.ts           # Schema Zod pour validation du formulaire
```

## Comment fonctionne le moteur de calcul

Le flux est : `SimulatorForm` → `useSimulator` hook → `computeAll(inputs)` → `ResultsDashboard`.

`computeAll()` est une fonction pure qui prend un objet `SimulationInputs` et retourne un `SimulationResults` contenant les résultats pour les 3 statuts. Le calcul est synchrone et prend < 1ms.

### Points techniques notables

- **TNS (EURL)** : les cotisations TNS utilisent un calcul itératif (2 passes) car la CSG/CRDS se calcule sur (revenu + cotisations hors CSG), créant une dépendance circulaire. La convergence est atteinte en 2 itérations.
- **Maladie TNS** : taux progressif sur 3 tranches (0.5%→4.5%→8.5%→6.5% fixe) par rapport au PASS.
- **SASU** : modèle simplifié avec taux moyens (patronal 42%, salarial 22% du brut). Précision ±2%.
- **Micro** : le CA est plafonné automatiquement (77 700€ BNC/BIC services, 188 700€ BIC vente).
- **IR** : implémente le barème complet 2025 avec quotient familial, plafonnement du QF (1 791€/demi-part), et décote.
- **Optimizer** : brute force le split rémunération/dividendes par pas de 5% puis affine par pas de 1% autour du meilleur.

## Commandes utiles

```bash
npm run dev          # Serveur de développement (localhost:3000)
npm run build        # Build production
npx vitest run       # Lancer les 41 tests
npx vitest --watch   # Tests en mode watch
```

## Ce qui est en place et fonctionne

- [x] Moteur de calcul complet pour les 3 statuts
- [x] Barème IR 2025, IS, flat tax, cotisations URSSAF
- [x] Formulaire avec tous les paramètres (CA, activité, parts, charges, ACRE, VL, sliders rému/div)
- [x] Résultats : 3 cartes comparatives avec détail accordéon
- [x] Graphiques : bar chart comparatif + stacked bar décomposition
- [x] Tableau protection sociale (7 catégories)
- [x] Landing page avec hero, features, aperçu des 3 statuts
- [x] Newsletter CTA (soft, frontend-only, pas connecté à un provider)
- [x] Responsive mobile-first (testé 375px → 1440px)
- [x] SEO : meta title/description/keywords, Open Graph
- [x] 41 tests unitaires + intégration passent
- [x] Build Next.js production réussit sans erreur
- [x] Guide de démo complet (GUIDE_DEMO.md)

## Pistes d'amélioration (par priorité)

### Priorité haute — Fonctionnalités métier
1. **Export PDF** des résultats (jsPDF ou html2canvas) — gate email ou téléchargement libre
2. **Optimiseur automatique** : afficher le split rémunération/dividendes optimal dans les résultats (le code `optimizer.ts` existe, il faut l'intégrer à l'UI)
3. **Option barème IR pour dividendes** (au lieu de flat tax uniquement) — pertinent pour les foyers à faible TMI
4. **Cotisations TNS détaillées** : remplacer le modèle simplifié par le barème exact post-réforme 2025 (6 tranches maladie, assiette unifiée avec abattement 26%)
5. **Dividendes EURL > 10% capital** : appliquer les cotisations TNS sur la part excédant 10% du capital social

### Priorité moyenne — UX et engagement
6. **Partage des résultats** via URL avec paramètres encodés (query string ou hash)
7. **Mode sombre**
8. **Animations** sur les transitions résultats (framer-motion)
9. **Graphique interactif** : cliquer sur un statut pour voir le détail
10. **Connecter la newsletter** à un provider (Brevo, Mailchimp, ConvertKit)

### Priorité basse — Expansion
11. **Comparaison pluriannuelle** (simuler sur 3-5 ans avec progression du CA)
12. **Déploiement Vercel/Netlify** avec domaine custom
13. **Analytics** (Plausible ou Umami pour rester RGPD-friendly)
14. **Tests end-to-end** avec Playwright
15. **i18n** (version anglaise pour freelances expatriés)

## Conventions de code

- Tailwind CSS v4 avec variables CSS custom dans `globals.css` (utiliser `@theme inline`, pas `tailwind.config.ts` pour les couleurs)
- Composants React : un fichier par composant, PascalCase, `'use client'` uniquement quand nécessaire
- Engine : fonctions pures TypeScript, aucune dépendance React, testables unitairement
- Tous les paramètres fiscaux dans `constants.ts` — mise à jour annuelle = modifier ce seul fichier
- Formatage monétaire via `Intl.NumberFormat('fr-FR')` dans `lib/formatters.ts`
- Tests dans `__tests__/engine/` avec Vitest

## Limites connues

- Les cotisations TNS (EURL) utilisent un modèle simplifié (précision ±3%)
- Les charges SASU sont des taux moyens (±2%), pas un bulletin de paie exact
- Le versement libératoire ne vérifie pas la condition de revenu fiscal de référence
- L'ACRE est modélisée comme réduction forfaitaire de 50%, sans conditions d'éligibilité détaillées
- Les dividendes EURL ne distinguent pas la part > 10% du capital social (soumise à cotisations TNS en réalité)
- Pas de prise en compte de la CVAE, CFE, ou taxe sur les salaires
