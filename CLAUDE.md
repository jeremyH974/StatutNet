# StatutNet — Contexte projet pour Claude Code

## Ce qu'est ce projet

Simulateur fiscal et social web pour indépendants français.
Compare le revenu net disponible selon 3 statuts juridiques :
**Micro-entreprise**, **EURL à l'IS**, **SASU à l'IS**.

Objectif business : outil de décision gratuit + acquisition newsletter
(La Marge) + monétisation par rapport PDF premium (19€) et affiliation
experts-comptables (CPL 30-80€/lead).

**Site en production** : https://statut-net.vercel.app
**Repo GitHub** : https://github.com/jeremyH974/StatutNet
**Branch principale** : main (auto-déployée sur Vercel à chaque push)

---

## Stack technique

- **Next.js 16.2.3** (App Router) + **TypeScript** strict + **Tailwind CSS v4**
- **Recharts** pour les graphiques (bar chart, stacked bar, multi-year lines)
- **Framer Motion** pour les animations (fade-in + scale sur les résultats)
- **jsPDF + html2canvas** pour l'export PDF
- **Turbopack** activé en développement
- **100% client-side** — aucun backend, aucune donnée stockée, aucune API
- **Paramètres fiscaux 2025** centralisés dans `src/engine/constants.ts`
- **Tests** : Vitest (62 tests passent — ne jamais casser ce chiffre)
- **Déploiement** : Vercel, redéploiement automatique à chaque `git push main`

---

## Architecture des fichiers

```
src/
├── app/
│   ├── layout.tsx                    # Layout racine (Inter, Header/Footer,
│   │                                 # Plausible analytics, meta SEO)
│   ├── page.tsx                      # Landing page hero + features + aperçu
│   ├── globals.css                   # Variables CSS custom, dark mode vars,
│   │                                 # .pdf-export-mode, .pdf-hide
│   ├── simulateur/page.tsx           # Simulateur principal
│   ├── blog/
│   │   ├── page.tsx                  # Index blog (3 articles)
│   │   ├── micro-vs-sasu/page.tsx    # Article : Micro vs SASU
│   │   ├── quitter-micro/page.tsx    # Article : Quand quitter la micro
│   │   └── seuil-tva/page.tsx        # Article : Seuil TVA auto-entrepreneur
│   ├── diagnostic/page.tsx           # Quiz 10 questions → score statut
│   ├── experts/page.tsx              # Affiliation Dougs / Keobiz / Indy
│   ├── premium/page.tsx              # Page rapport PDF premium (19€, Stripe)
│   └── remuneration/page.tsx         # Simulateur rémunération dirigeant
│
├── engine/                           # Moteur de calcul — fonctions pures TS
│   ├── types.ts                      # SimulationInputs, StatusResult,
│   │                                 # SimulationResults, OptimalSplit
│   ├── constants.ts                  # TOUS les paramètres fiscaux 2025
│   ├── ir.ts                         # Barème IR progressif, QF, décote
│   ├── micro.ts                      # Micro : cotisations, abattement, ACRE
│   ├── eurl.ts                       # EURL IS : TNS itératif, IS, dividendes,
│   │                                 # cotisations TNS sur div > 10% capital,
│   │                                 # option barème IR dividendes
│   ├── sasu.ts                       # SASU IS : salaire, IS, dividendes,
│   │                                 # option barème IR dividendes
│   ├── social-coverage.ts            # Données qualitatives protection sociale
│   ├── optimizer.ts                  # Split rémunération/dividendes optimal
│   └── index.ts                      # computeAll(inputs) => SimulationResults
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Sticky, mobile hamburger,
│   │   │                             # toggle mode sombre, nav vers /blog
│   │   │                             # /diagnostic /experts /premium
│   │   └── Footer.tsx
│   ├── simulator/
│   │   └── SimulatorForm.tsx         # CA, activité, parts, charges, ACRE, VL,
│   │                                 # capital social EURL, toggle PFU/barème IR
│   ├── results/
│   │   ├── ResultsDashboard.tsx      # Orchestre tous les panneaux
│   │   │                             # id="results-content" sur div principal
│   │   │                             # Animations framer-motion fade-in/scale
│   │   │                             # Boutons PDF export + partage URL
│   │   │                             # CTA affiliation experts-comptables
│   │   ├── ComparisonTable.tsx       # Grille 3 colonnes
│   │   ├── StatusCard.tsx            # Carte statut + accordéon détail
│   │   │                             # Note EURL div > 10% capital
│   │   ├── OptimiserPanel.tsx        # Split optimal (affiché si gain > 300€)
│   │   │                             # Slider interactif recalcul temps réel
│   │   ├── ComparisonChart.tsx       # Bar chart revenu net comparé
│   │   ├── WaterfallChart.tsx        # Stacked bar décomposition CA → net
│   │   ├── MultiYearChart.tsx        # Graphique 5 ans Micro/EURL/SASU
│   │   │                             # Courbes Recharts + tableau comparatif
│   │   └── SocialCoverageTable.tsx   # Tableau protection sociale 7 catégories
│   ├── newsletter/
│   │   └── NewsletterCTA.tsx         # Opt-in email → Brevo (La Marge)
│   │                                 # Classe pdf-hide
│   └── ui/                           # NumberInput, Slider, Tooltip
│
├── hooks/
│   └── useSimulator.ts               # State inputs + results + runSimulation()
│                                     # Sync URL params (replaceState)
│                                     # Chargement params au montage
│
└── lib/
    ├── formatters.ts                 # formatCurrency(), formatPercent() fr-FR
    ├── validators.ts                 # Schema Zod formulaire
    ├── url-params.ts                 # encode/decodeSimulationToURL()
    ├── export-pdf.ts                 # exportResultsToPDF() jsPDF+html2canvas
    ├── brevo.ts                      # addContactToBrevo() API Brevo
    └── analytics.ts                  # trackEvent() wrapper Plausible
```

---

## Toutes les routes disponibles

| Route | Description |
|---|---|
| `/` | Landing page |
| `/simulateur` | Simulateur principal (page cœur du projet) |
| `/blog` | Index des 3 articles SEO |
| `/blog/micro-vs-sasu` | Article : Micro vs SASU comparatif complet |
| `/blog/quitter-micro` | Article : Quand et comment quitter la micro |
| `/blog/seuil-tva` | Article : Seuil TVA auto-entrepreneur |
| `/diagnostic` | Quiz 10 questions → score de santé statutaire |
| `/experts` | Page affiliation experts-comptables (Dougs, Keobiz, Indy) |
| `/premium` | Page rapport PDF premium à 19€ (intégration Stripe à finaliser) |
| `/remuneration` | Simulateur rémunération dirigeant SASU/EURL |

---

## Comment fonctionne le moteur de calcul

Flux : `SimulatorForm` → `useSimulator` → `computeAll(inputs)`
→ `ResultsDashboard` → composants enfants.

`computeAll()` est une fonction pure synchrone < 1ms.
Appelle aussi `optimizer.ts` pour `optimalEURL` et `optimalSASU`.

### Points techniques importants

- **TNS (EURL)** : calcul itératif 2 passes (CSG/CRDS circulaire).
- **Dividendes EURL > 10% capital** : cotisations TNS ~45% sur la part
  excédant 10% du capital social saisi. Capital social = input utilisateur.
- **Option barème IR dividendes** : toggle dans le formulaire.
  Si activé : dividendes imposés au barème progressif avec abattement 40%
  au lieu de flat tax 30%. Pertinent pour les TMI < 30%.
- **Optimizer** : brute force 5% puis affinage 1%.
- **URL params** : clés courtes (ca, act, pt, ch, ac, vl).
  `history.replaceState` uniquement (pas pushState).
- **PDF export** : html2canvas scale 2 + jsPDF A4 portrait.
  `.pdf-export-mode` sur body pendant capture.
  `.pdf-hide` sur boutons, CTA newsletter, affiliation.
- **Dark mode** : toggle Header → classe `dark` sur `<html>`,
  persistence localStorage, variables CSS Tailwind dark:.
- **Multi-year chart** : projections 5 ans avec taux de croissance
  CA paramétrable. Recharts LineChart avec 3 séries.
- **Animations** : framer-motion `AnimatePresence` + `motion.div`
  sur l'apparition des résultats (fade-in + scale 0.95→1).

---

## Paramètres fiscaux 2025

Tous les détails dans `src/engine/constants.ts`.
Ne jamais hardcoder ces valeurs ailleurs.

| Paramètre | Valeur |
|---|---|
| Cotisations micro BNC | 23,1% |
| Cotisations micro BIC services | 21,2% |
| Cotisations micro BIC vente | 12,3% |
| Abattement IR BNC | 34% |
| Abattement IR BIC services | 50% |
| Abattement IR BIC vente | 71% |
| Plafond micro BNC/BIC services | 77 700€ |
| Plafond micro BIC vente | 188 700€ |
| Seuil franchise TVA services | 37 500€ |
| Seuil majoré TVA services | 41 250€ |
| Seuil franchise TVA vente | 85 000€ |
| IS taux réduit | 15% ≤ 42 500€ |
| IS taux normal | 25% |
| PFU dividendes | 30% |
| Abattement dividendes barème IR | 40% |
| PASS 2025 | 46 368€ |
| Cotisations TNS div EURL excédent | ~45% |

Barème IR 2025 :
- 0% → 11 497€ · 11% → 29 315€ · 30% → 83 823€
- 41% → 180 294€ · 45% au-delà

---

## Variables d'environnement

### .env.local (ne jamais committer)
```
NEXT_PUBLIC_BREVO_API_KEY=xkeysib-...
NEXT_PUBLIC_BREVO_LIST_ID=7
```

### Vercel (Settings → Environment Variables)
Mêmes clés configurées dans le dashboard.
À vérifier en priorité si la newsletter ne fonctionne pas.

### Stripe (à configurer pour activer /premium)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...           ← côté serveur uniquement
STRIPE_PRICE_ID=price_...               ← ID du produit 19€
```
La page `/premium` est actuellement en placeholder.
L'intégration Stripe réelle nécessite une API Route Next.js
(`src/app/api/create-checkout-session/route.ts`).

---

## Newsletter — La Marge

**Nom** : La Marge
Double sens : marge bénéficiaire + marge de liberté (indépendance).

**Provider** : Brevo (plan gratuit 300 contacts/jour)
**List ID** : `NEXT_PUBLIC_BREVO_LIST_ID`
**Source** : `"statutnet-simulateur"` dans les attributs contact

Comportements de `NewsletterCTA.tsx` :
- États : idle → loading → success | error
- Succès : "C'est noté ! Tu recevras La Marge directement dans ta boîte."
- Doublon email (code 400) : succès silencieux
- Env vars absentes : console.warn + succès simulé (mode dégradé)

---

## Analytics Plausible

Domaine : `statut-net.vercel.app`
Script dans `layout.tsx` (ignoré en localhost automatiquement).

Événements trackés via `trackEvent()` de `lib/analytics.ts` :

| Événement | Déclencheur |
|---|---|
| `simulation_lancee` | Après chaque calcul réussi |
| `lien_partage` | Clic bouton "Copier le lien" |
| `pdf_telecharge` | Après génération PDF réussie |
| `newsletter_inscription` | Après inscription Brevo réussie |
| `diagnostic_complete` | Fin du quiz diagnostic |
| `expert_clic` | Clic CTA expert-comptable |
| `premium_clic` | Clic sur la page /premium |

Props de `simulation_lancee` :
- `type_activite` : 'bnc' | 'bic_services' | 'bic_vente'
- `tranche_ca` : 'moins_30k' | '30k_60k' | '60k_77k' | 'plus_77k'
- `meilleur_statut` : 'micro' | 'eurl' | 'sasu' | 'indetermine'

---

## Commandes utiles

```bash
npm run dev          # Dev localhost:3000 (Turbopack)
npm run build        # Build production — doit passer sans erreur
npm run start        # Serveur production local
npx vitest run       # Tests (doit afficher 62 passed)
npx vitest --watch   # Tests en watch pendant le dev

# Déployer
git add .
git commit -m "type: description"
git push             # Déclenche redéploiement Vercel automatiquement
```

---

## Ce qui est en place et fonctionne (62 tests)

### Simulateur principal
- [x] Moteur calcul complet micro / EURL / SASU
- [x] Barème IR 2025 avec QF, plafonnement, décote
- [x] Option barème IR pour dividendes (toggle PFU/progressif)
- [x] Dividendes EURL > 10% capital social (cotisations TNS sur excédent)
- [x] Optimiseur split rémunération/dividendes dans l'UI
- [x] Slider interactif recalcul temps réel dans OptimiserPanel
- [x] Export PDF (header/footer, pagination, éléments exclus)
- [x] Partage par URL (query params, sync replaceState)
- [x] Animations framer-motion sur apparition des résultats
- [x] Graphique comparaison 5 ans (MultiYearChart)
- [x] CTA affiliation experts-comptables dans les résultats
- [x] Note transparence EURL dividendes > 10% capital

### Pages additionnelles
- [x] Blog SEO : index + 3 articles complets
- [x] Diagnostic : quiz 10 questions + scoring + barres résultat
- [x] Experts : page affiliation Dougs / Keobiz / Indy
- [x] Premium : page pricing 19€ (Stripe placeholder)
- [x] Remuneration : simulateur dédié dirigeant avec graphique

### Infrastructure
- [x] Mode sombre (toggle Header, persistence localStorage)
- [x] Analytics Plausible (tracking simulation, PDF, partage, newsletter)
- [x] Newsletter Brevo connectée (La Marge)
- [x] Responsive mobile-first 375px → 1440px
- [x] SEO : meta, Open Graph, toutes les routes
- [x] 62 tests passent
- [x] Build production sans erreur TypeScript
- [x] Déployé : statut-net.vercel.app

---

## Pistes d'amélioration restantes

### Priorité haute — Revenus directs
1. **Stripe réel sur /premium** : API Route `create-checkout-session`,
   webhook Stripe pour confirmer le paiement, envoi du PDF par email
   (Brevo transactionnel) ou lien de téléchargement sécurisé
2. **Partenariats CPL actifs** : contacter Dougs, Keobiz, Indy pour
   obtenir des liens d'affiliation réels avec tracking

### Priorité haute — Acquisition
3. **SEO technique** : sitemap.xml, robots.txt, structured data
   JSON-LD sur les articles de blog (Article schema)
4. **4 articles SEO supplémentaires** : "SASU ou EURL pour freelance IT",
   "Charges SASU calcul exact", "Dividendes EURL fiscalité complète",
   "Cotisations TNS barème 2025"

### Priorité moyenne — Produit
5. **Comparaison pluriannuelle interactive** : slider taux croissance CA
   dans MultiYearChart (actuellement taux fixe)
6. **Cotisations TNS barème exact** : 6 tranches maladie post-réforme 2025
7. **Taxe PUMa** : calcul et avertissement si salaire SASU < seuil
8. **Stripe webhook** : confirmation paiement + livraison PDF premium

### Priorité basse
9. **Tests E2E Playwright** : parcours complet simulateur → PDF → newsletter
10. **i18n** : version anglaise pour freelances expatriés
11. **PWA** : manifest + service worker pour usage offline

---

## Conventions de code

- **Tailwind CSS v4** : `@theme inline` dans `globals.css`,
  pas de `tailwind.config.ts` pour les couleurs custom
- **Dark mode** : variables CSS avec sélecteur `html.dark`,
  toujours tester les deux modes visuellement
- **Composants** : un fichier par composant, PascalCase,
  `'use client'` uniquement si hooks ou événements
- **Engine** : fonctions pures TS, zéro dépendance React,
  toujours testables unitairement
- **Constantes fiscales** : UNIQUEMENT dans `constants.ts`
- **Formatage** : toujours `Intl.NumberFormat('fr-FR')` via `formatters.ts`
- **Analytics** : toujours `trackEvent()` de `lib/analytics.ts`
- **TypeScript** : `any` interdit — `unknown` + type guards
- **Commentaires** : en français uniquement
- **Classes pdf-hide** : sur tout élément à exclure du PDF export

---

## Limites connues (afficher dans footer + exports PDF)

- Cotisations TNS EURL : modèle simplifié ±3%
- Charges SASU : taux moyens ±2%
- Dividendes EURL > 10% capital : calcul approché des cotisations TNS
- Versement libératoire : condition revenu fiscal non vérifiée
- ACRE : réduction 50% forfaitaire, conditions non vérifiées
- Taxe PUMa (SASU sans salaire suffisant) : non calculée
- CFE, CVAE, taxe sur les salaires : non prises en compte
- Professions libérales réglementées (CIPAV spécifique) : non gérées
- Holding et montages complexes : non gérés

---

## Débogage fréquent

**Build Vercel échoue :**
→ Reproduire avec `npm run build` en local.
Les erreurs TypeScript sont la cause #1.
Turbopack en dev peut masquer des erreurs que le build production révèle.

**62 tests passent pas :**
→ Lire le message exact Vitest.
Ne jamais modifier un test pour le faire passer — corriger le code.

**Brevo ne reçoit pas :**
→ Vérifier env vars Vercel → Network tab → POST api.brevo.com
→ Vérifier que la clé API a la permission "Contacts" uniquement.

**PDF vide ou mal rendu :**
→ Vérifier id="results-content" dans le DOM.
→ Augmenter délai avant capture si DOM pas encore hydraté.
→ `backgroundColor: '#ffffff'` obligatoire dans html2canvas.

**Dark mode ne persiste pas :**
→ Vérifier que `localStorage.getItem('theme')` est lu au montage Header.
→ La classe `dark` doit être sur `<html>`, pas sur `<body>`.

**URL params non chargés :**
→ Vérifier `typeof window !== 'undefined'` avant `window.location`.
→ Le `setTimeout(runSimulation, 0)` après merge params est obligatoire
  pour laisser le state React se mettre à jour.
