# StatutNet — Contexte projet pour Claude

## Ce qu'est ce projet

Simulateur fiscal et social web pour indépendants français. Compare le revenu net disponible selon 3 statuts juridiques : **Micro-entreprise**, **EURL à l'IS**, **SASU à l'IS**. Objectif business : outil de décision gratuit + aimant à prospects (newsletter Brevo).

## Stack technique

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Recharts** pour les graphiques (bar chart comparatif, stacked bar décomposition CA)
- **100% client-side** — aucun backend, aucune donnée stockée, aucune API (sauf appel Brevo pour la newsletter)
- **Paramètres fiscaux 2025** centralisés dans `src/engine/constants.ts`
- Tests avec **Vitest** (51 tests passent)

## Architecture des fichiers

```
src/
├── app/
│   ├── layout.tsx              # Layout racine (Inter font, Header/Footer, meta SEO fr_FR)
│   ├── page.tsx                # Landing page (hero + features + aperçu 3 statuts)
│   ├── globals.css             # Variables CSS custom (@theme inline : --primary, --accent, etc.)
│   └── simulateur/page.tsx     # Page principale du simulateur (form + results)
│
├── engine/                     # Moteur de calcul fiscal (pur TypeScript, sans dépendance React)
│   ├── types.ts                # SimulationInputs, StatusResult, SimulationResults, OptimalSplit
│   ├── constants.ts            # TOUS les paramètres fiscaux 2025 (barème IR, taux URSSAF, IS, PASS, etc.)
│   ├── ir.ts                   # IR : barème progressif 5 tranches, quotient familial, plafonnement QF, décote
│   ├── micro.ts                # Micro-entreprise : cotisations forfaitaires, abattement, VL, ACRE, CFP
│   ├── eurl.ts                 # EURL IS : rémunération gérant, cotisations TNS (itératif 2 passes), IS, dividendes flat tax
│   ├── sasu.ts                 # SASU IS : salaire président (charges ~42%/22%), IS, dividendes flat tax
│   ├── social-coverage.ts      # Données qualitatives protection sociale (tableau comparatif 7 catégories)
│   ├── optimizer.ts            # Recherche du split rémunération/dividendes optimal (brute force 5% → affinage 1%)
│   │                           #   Exporte findOptimalSplitEURL(inputs) et findOptimalSplitSASU(inputs)
│   │                           #   Retourne { pct: number, revenuNet: number }
│   └── index.ts                # computeAll(inputs) => { micro, eurl, sasu, optimalEURL, optimalSASU }
│                               #   Appelle l'optimiseur automatiquement, retourne null si infaisable (CA <= charges)
│
├── components/
│   ├── layout/                 # Header (sticky, mobile hamburger), Footer
│   ├── simulator/
│   │   └── SimulatorForm.tsx   # Formulaire complet (CA, activité, parts, charges, options avancées avec sliders)
│   ├── results/
│   │   ├── ResultsDashboard.tsx    # Orchestre : banner best → cards → OptimiserPanel → charts → social → newsletter
│   │   ├── ComparisonTable.tsx     # Grille 3 colonnes (StatusCard × 3)
│   │   ├── StatusCard.tsx          # Carte par statut (résumé + détail accordéon)
│   │   ├── OptimiserPanel.tsx      # Panneau d'optimisation rémunération/dividendes (EURL + SASU)
│   │   │                           #   Badge vert si gain > 500€, slider interactif recalcule le net en temps réel
│   │   │                           #   via computeEURL/computeSASU directement (pas computeAll complet)
│   │   │                           #   Masqué si aucun gain ou statuts infaisables
│   │   ├── ComparisonChart.tsx     # Bar chart Recharts (revenu net comparé)
│   │   ├── WaterfallChart.tsx      # Stacked bar (décomposition CA → net)
│   │   └── SocialCoverageTable.tsx # Tableau protection sociale avec code couleur
│   ├── newsletter/
│   │   └── NewsletterCTA.tsx   # Formulaire email connecté à Brevo (idle/loading/success/error)
│   │                           #   Validation @ côté client, spinner SVG animé, mode dégradé sans clé API
│   └── ui/                     # NumberInput, Slider, Tooltip (composants réutilisables)
│
├── hooks/
│   └── useSimulator.ts         # Hook principal : state inputs + results + runSimulation()
│
└── lib/
    ├── brevo.ts                # addContactToBrevo(email) → POST api.brevo.com/v3/contacts
    │                           #   Gestion doublons (retourne success), mode dégradé si pas de clé API
    ├── formatters.ts           # formatCurrency(), formatPercent(), formatNumber() via Intl.NumberFormat('fr-FR')
    └── validators.ts           # Schema Zod pour validation du formulaire
```

## Comment fonctionne le moteur de calcul

**Flux** : `SimulatorForm` → `useSimulator` hook → `computeAll(inputs)` → `ResultsDashboard`

`computeAll()` est une fonction pure synchrone (< 5ms avec optimizer). Elle :
1. Calcule les 3 statuts via `computeMicro`, `computeEURL`, `computeSASU`
2. Lance l'optimiseur pour EURL et SASU (`findOptimalSplitEURL`/`findOptimalSplitSASU`)
3. Construit les objets `OptimalSplit` avec `gainVsDefault` (écart vs le split choisi par l'utilisateur)
4. Retourne `{ micro, eurl, sasu, optimalEURL, optimalSASU }`

### L'optimiseur (`optimizer.ts`)

Algorithme en 2 passes :
- **Passe 1** : brute force de 0% à 100% par pas de 5%, retient le meilleur `revenuNetApresIR`
- **Passe 2** : affinage ±5% autour du meilleur par pas de 1%

Retourne `{ pct, revenuNet }`. L'interface `OptimalSplit` dans `types.ts` enrichit ce résultat avec :
- `remunerationAmount` / `dividendesAmount` — montants nets au split optimal
- `gainVsDefault` — gain en € par rapport au split choisi par l'utilisateur (toujours >= 0)

Le composant `OptimiserPanel` utilise directement `computeEURL`/`computeSASU` (pas `computeAll`) pour recalculer le net en temps réel quand l'utilisateur bouge le slider d'exploration.

### Points techniques notables

- **TNS (EURL)** : calcul itératif 2 passes car la CSG/CRDS se calcule sur (revenu + cotisations hors CSG)
- **Maladie TNS** : taux progressif sur 3 tranches (0.5%→4.5%→8.5%→6.5% fixe) par rapport au PASS
- **SASU** : modèle simplifié avec taux moyens (patronal 42%, salarial 22% du brut). Précision ±2%
- **Micro** : CA plafonné automatiquement (77 700€ BNC/BIC services, 188 700€ BIC vente)
- **IR** : barème complet 2025 avec quotient familial, plafonnement QF (1 791€/demi-part), décote

### Newsletter Brevo (`lib/brevo.ts`)

- Appel POST `https://api.brevo.com/v3/contacts` avec header `api-key`
- Gestion des doublons : code 400 "Contact already exist" → `{ success: true }`
- Mode dégradé : si `NEXT_PUBLIC_BREVO_API_KEY` absent → `console.warn` + `{ success: true }`
- Le composant `NewsletterCTA` gère 4 états : `idle | loading | success | error`

Config dans `.env.local` :
```
NEXT_PUBLIC_BREVO_API_KEY=xkeysib-...
NEXT_PUBLIC_BREVO_LIST_ID=3
```

## Commandes utiles

```bash
npm run dev          # Serveur de développement (localhost:3000)
npm run build        # Build production (vérifie TypeScript)
npx vitest run       # Lancer les 51 tests
npx vitest --watch   # Tests en mode watch
```

## Ce qui est en place et fonctionne

- [x] Moteur de calcul complet pour les 3 statuts (micro, EURL, SASU)
- [x] Barème IR 2025, IS, flat tax, cotisations URSSAF 2025
- [x] Formulaire avec tous les paramètres (CA, activité, parts, charges, ACRE, VL, sliders rému/div)
- [x] Résultats : 3 cartes comparatives avec détail accordéon
- [x] **Optimiseur rémunération/dividendes** intégré dans les résultats (EURL + SASU)
  - Split optimal calculé automatiquement
  - Badge vert "+X €/an" si gain > 500€
  - Slider interactif pour explorer d'autres splits en temps réel
- [x] Graphiques : bar chart comparatif + stacked bar décomposition CA
- [x] Tableau protection sociale (7 catégories, code couleur)
- [x] Landing page avec hero, features, aperçu des 3 statuts
- [x] **Newsletter Brevo** connectée (idle/loading/success/error, mode dégradé sans clé)
- [x] Responsive mobile-first (testé 375px → 1440px)
- [x] SEO : meta title/description/keywords, Open Graph fr_FR
- [x] 51 tests unitaires + intégration passent
- [x] Build Next.js production réussit sans erreur TypeScript
- [x] Guide de démo complet (GUIDE_DEMO.md avec 5 scénarios)

## Pistes d'amélioration (par priorité)

### Priorité haute — Fonctionnalités métier
1. **Export PDF** des résultats (jsPDF ou html2canvas) — gate email ou téléchargement libre
2. **Option barème IR pour dividendes** (au lieu de flat tax uniquement) — pertinent pour foyers à faible TMI
3. **Cotisations TNS détaillées** : remplacer le modèle simplifié par le barème exact post-réforme 2025 (6 tranches maladie, assiette unifiée avec abattement 26%)
4. **Dividendes EURL > 10% capital** : appliquer les cotisations TNS sur la part excédant 10% du capital social
5. **CFE / CVAE** : ajouter ces taxes locales au calcul (montant paramétrable)

### Priorité moyenne — UX et engagement
6. **Partage des résultats** via URL avec paramètres encodés (query string ou hash)
7. **Mode sombre** (les variables CSS sont prêtes dans globals.css, il manque le toggle + media query)
8. **Animations** sur les transitions résultats (framer-motion)
9. **Graphique interactif** dans l'OptimiserPanel : courbe net = f(% rému) pour visualiser le sweet spot
10. **Webhook Brevo** : ajouter les tags dynamiques (CA, statut optimal) au contact pour segmentation

### Priorité basse — Expansion
11. **Comparaison pluriannuelle** (simuler sur 3-5 ans avec progression du CA)
12. **Déploiement Vercel/Netlify** avec domaine custom
13. **Analytics** (Plausible ou Umami pour rester RGPD-friendly)
14. **Tests end-to-end** avec Playwright
15. **i18n** (version anglaise pour freelances expatriés)

## Conventions de code

- Tailwind CSS v4 avec variables CSS custom dans `globals.css` (utiliser `@theme inline`, pas `tailwind.config.ts`)
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
- L'optimiseur explore par pas de 1% (pas continu), le vrai optimum peut être entre deux pas
