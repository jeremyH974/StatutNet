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

## Toutes les routes disponibles (13 routes)

| Route | Description | Statut |
|---|---|---|
| `/` | Landing page + widget mini-simulateur | ✅ |
| `/simulateur` | Simulateur principal | ✅ |
| `/blog` | Index des 3 articles SEO | ✅ |
| `/blog/micro-vs-sasu` | Article + CTAs inline pré-remplis | ✅ |
| `/blog/quitter-micro` | Article + CTAs inline pré-remplis | ✅ |
| `/blog/seuil-tva` | Article + CTAs inline pré-remplis | ✅ |
| `/diagnostic` | Quiz 10 questions → redirect simulateur params pré-remplis | ✅ |
| `/experts` | Affiliation Dougs / Keobiz / Indy | ✅ |
| `/premium` | Pré-commande Brevo + pricing 19€ + FAQ + garanties | ✅ |
| `/remuneration` | Simulateur rémunération dirigeant | ✅ |
| `/a-propos` | Mission, sources, disclaimer, équipe | ✅ |
| `/comment-ca-marche` | 3 étapes, méthodologie, limites de l'outil | ✅ |
| `/_not-found` | Page 404 custom | ✅ |

---

## Architecture des fichiers

```
src/
├── app/
│   ├── layout.tsx                    # Layout racine — Inter, Header/Footer,
│   │                                 # Plausible analytics, meta SEO
│   ├── page.tsx                      # Landing page — hero + widget mini-sim
│   │                                 # + features + aperçu 3 statuts
│   ├── globals.css                   # Variables CSS custom, dark mode vars,
│   │                                 # .pdf-export-mode, .pdf-hide
│   ├── simulateur/page.tsx           # Simulateur principal — accepte query params
│   │                                 # ca, act, pt, ch, ac, vl, rs
│   ├── blog/
│   │   ├── page.tsx                  # Index blog
│   │   ├── micro-vs-sasu/page.tsx    # Article + 2 CTAs inline pré-remplis
│   │   ├── quitter-micro/page.tsx    # Article + 2 CTAs inline pré-remplis
│   │   └── seuil-tva/page.tsx        # Article + 2 CTAs inline pré-remplis
│   ├── diagnostic/page.tsx           # Quiz 10 questions + scoring
│   │                                 # Redirect vers /simulateur?ca=X&act=Y
│   │                                 # avec params déduits des réponses
│   ├── experts/page.tsx              # Affiliation 3 partenaires
│   ├── premium/page.tsx              # Formulaire pré-commande Brevo
│   │                                 # Pricing 19€, FAQ 3 questions, garanties
│   │                                 # Prêt pour Stripe (placeholder payment)
│   ├── remuneration/page.tsx         # Simulateur dédié dirigeant
│   ├── a-propos/page.tsx             # Mission, sources fiscales, disclaimer,
│   │                                 # limites de l'outil, contact
│   ├── comment-ca-marche/page.tsx    # 3 étapes d'utilisation, méthodologie
│   │                                 # de calcul, limites connues
│   └── not-found.tsx                 # Page 404 custom avec liens utiles
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
│   ├── social-coverage.ts            # Données protection sociale qualitatives
│   ├── optimizer.ts                  # Split rémunération/dividendes optimal
│   └── index.ts                      # computeAll(inputs) => SimulationResults
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Sticky, nav complète (blog, diagnostic,
│   │   │                             # experts, premium, a-propos),
│   │   │                             # mobile hamburger, toggle dark mode
│   │   └── Footer.tsx                # Liens : a-propos, comment-ca-marche,
│   │                                 # experts, premium, blog
│   ├── simulator/
│   │   └── SimulatorForm.tsx         # CA, activité, parts, charges, ACRE, VL,
│   │                                 # capital social EURL, toggle PFU/barème IR
│   ├── results/
│   │   ├── ResultsDashboard.tsx      # Orchestre tous les panneaux résultats
│   │   │                             # id="results-content" sur div principal
│   │   │                             # Score contextualisé sous le banner
│   │   │                             # Animations framer-motion
│   │   │                             # Boutons PDF + partage URL
│   │   │                             # CTA affiliation experts-comptables
│   │   ├── ScoreSummary.tsx          # Phrase de synthèse contextualisée
│   │   │                             # Ex: "La micro reste optimale jusqu'à
│   │   │                             # ~X€. Vous économisez Y€/an vs SASU."
│   │   ├── ComparisonTable.tsx       # Grille 3 colonnes
│   │   ├── StatusCard.tsx            # Carte statut + accordéon détail
│   │   │                             # Note EURL div > 10% capital
│   │   ├── OptimiserPanel.tsx        # Split optimal (si gain > 300€)
│   │   │                             # Slider interactif recalcul temps réel
│   │   ├── ComparisonChart.tsx       # Bar chart revenu net comparé
│   │   ├── WaterfallChart.tsx        # Stacked bar décomposition CA → net
│   │   ├── MultiYearChart.tsx        # Graphique 5 ans Micro/EURL/SASU
│   │   └── SocialCoverageTable.tsx   # Tableau protection sociale 7 critères
│   ├── landing/
│   │   └── MiniSimulator.tsx         # Widget "Estimation rapide" sur la home
│   │                                 # 2 inputs (CA + type activité)
│   │                                 # → 3 chiffres nets estimés
│   │                                 # → lien pré-rempli vers simulateur complet
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
    │                                 # Clés : ca, act, pt, ch, ac, vl, rs
    ├── export-pdf.ts                 # exportResultsToPDF() jsPDF+html2canvas
    ├── brevo.ts                      # addContactToBrevo() API Brevo
    ├── analytics.ts                  # trackEvent() wrapper Plausible
    └── score-summary.ts              # generateScoreSummary(results) → string
                                      # Génère la phrase de synthèse contextualisée
```

---

## Fonctionnalités clés et leur logique

### Widget mini-simulateur (landing page)
`MiniSimulator.tsx` sur `/` :
- 2 inputs uniquement : CA (slider) + type activité (select)
- Calcul partiel temps réel des 3 revenus nets estimés
- Bouton "Voir l'analyse complète" → `/simulateur?ca=X&act=Y`
- Pas de frais pro, pas de situation fiscale (defaults utilisés)
- Objectif : démontrer la valeur en 30 secondes, convertir vers le simulateur

### Diagnostic → Simulateur
`/diagnostic` → redirect vers `/simulateur` avec params déduits :
- Les réponses du quiz déterminent le CA estimé, le type d'activité
  et les charges estimées
- Exemple de redirect : `/simulateur?ca=120000&act=bnc&ch=15000&rs=60`
- Le simulateur se lance automatiquement avec ces valeurs au montage
- `trackEvent('diagnostic_complete', { score, statut_recommande })`

### Score contextualisé
`ScoreSummary.tsx` + `lib/score-summary.ts` :
Affiche une phrase générée dynamiquement sous le banner de résultats.
Exemples de phrases selon les cas :
- "La micro reste le meilleur choix jusqu'à ~X€ de CA. Vous économisez
  X€/an par rapport à la SASU."
- "Passer en EURL vous permettrait de gagner X€/an supplémentaires
  pour le même CA."
- "Votre CA dépasse le plafond micro (77 700€). L'EURL ou la SASU
  sont vos seules options."
La logique est dans `generateScoreSummary(results: SimulationResults)`.

### CTAs blog inline
Chaque article contient 2 liens contextuels avec params pré-remplis :
- `micro-vs-sasu` : liens à 45 000€ et 70 000€ BNC
- `quitter-micro` : liens à 60 000€ et 80 000€ BNC
- `seuil-tva` : liens à 38 000€ et 55 000€ BNC

### Page /premium
Actuellement : formulaire de pré-commande connecté à Brevo
(tag `premium_precommande` dans les attributs contact).
Pricing affiché : 19€.
FAQ 3 questions, section garanties.
**Stripe non encore intégré** — paiement réel à implémenter.

---

## Comment fonctionne le moteur de calcul

Flux : `SimulatorForm` → `useSimulator` → `computeAll(inputs)`
→ `ResultsDashboard` + `ScoreSummary` → composants enfants.

`computeAll()` est une fonction pure synchrone < 1ms.
Appelle aussi `optimizer.ts` pour `optimalEURL` et `optimalSASU`.

### Points techniques importants

- **TNS (EURL)** : calcul itératif 2 passes (CSG/CRDS circulaire).
- **Dividendes EURL > 10% capital** : cotisations TNS ~45% sur la part
  excédant 10% du capital social saisi.
- **Option barème IR dividendes** : abattement 40% puis barème progressif.
- **Optimizer** : brute force 5% puis affinage 1%.
- **URL params** : clés courtes (ca, act, pt, ch, ac, vl, rs).
  `history.replaceState` uniquement (pas pushState).
  Chargement au montage via `decodeSimulationFromURL`.
  Calcul automatique déclenché si params présents.
- **PDF export** : html2canvas scale 2 + jsPDF A4 portrait.
  `.pdf-export-mode` sur body + `.pdf-hide` sur boutons/CTAs.
- **Dark mode** : classe `dark` sur `<html>`, persistence localStorage.
- **Animations** : framer-motion `AnimatePresence` + `motion.div`.
- **Score summary** : généré côté client, jamais côté serveur.

---

## Paramètres fiscaux 2025

Tous dans `src/engine/constants.ts`. Ne jamais hardcoder ailleurs.

| Paramètre | Valeur |
|---|---|
| Cotisations micro BNC | 23,1% |
| Cotisations micro BIC services | 21,2% |
| Cotisations micro BIC vente | 12,3% |
| Abattement IR BNC | 34% |
| Abattement IR BIC services | 50% |
| Abattement IR BIC vente | 71% |
| Plafond micro services | 77 700€ |
| Plafond micro vente | 188 700€ |
| Seuil franchise TVA services | 37 500€ |
| Seuil majoré TVA services | 41 250€ |
| IS taux réduit | 15% ≤ 42 500€ |
| IS taux normal | 25% |
| PFU dividendes | 30% |
| Abattement dividendes barème IR | 40% |
| Cotisations TNS div EURL excédent | ~45% |
| PASS 2025 | 46 368€ |

Barème IR 2025 :
0% → 11 497€ · 11% → 29 315€ · 30% → 83 823€
41% → 180 294€ · 45% au-delà

---

## Variables d'environnement

### .env.local (ne jamais committer)
```
NEXT_PUBLIC_BREVO_API_KEY=xkeysib-...
NEXT_PUBLIC_BREVO_LIST_ID=7
```

### À ajouter pour activer Stripe sur /premium
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
```
Nécessite : `src/app/api/create-checkout-session/route.ts`
+ webhook Stripe pour confirmer paiement + livraison PDF.

---

## Newsletter — La Marge

**Nom** : La Marge (marge bénéficiaire + marge de liberté)
**Provider** : Brevo (plan gratuit 300 contacts/jour)
**List ID** : `NEXT_PUBLIC_BREVO_LIST_ID`

Tags Brevo utilisés :
- `source: "statutnet-simulateur"` — inscription via CTA simulateur
- `source: "diagnostic"` — inscription via diagnostic
- `premium_precommande` — pré-commande page /premium

Comportements `NewsletterCTA.tsx` :
- idle → loading → success | error
- Doublon (400 Brevo) : succès silencieux
- Env vars absentes : console.warn + succès simulé

---

## Analytics Plausible

Domaine : `statut-net.vercel.app`
Script dans `layout.tsx` (ignoré en localhost).

| Événement | Déclencheur | Props |
|---|---|---|
| `simulation_lancee` | Calcul réussi | type_activite, tranche_ca, meilleur_statut |
| `lien_partage` | Clic "Copier le lien" | — |
| `pdf_telecharge` | PDF généré | — |
| `newsletter_inscription` | Inscription Brevo OK | source |
| `diagnostic_complete` | Fin quiz | score, statut_recommande |
| `expert_clic` | Clic CTA expert | partenaire |
| `premium_clic` | Clic /premium | — |
| `mini_simulator_clic` | CTA widget landing | ca_range, act |

---

## Commandes utiles

```bash
npm run dev          # Dev localhost:3000 (Turbopack)
npm run build        # Build production — doit passer sans erreur TypeScript
npm run start        # Serveur production local
npx vitest run       # Tests — doit afficher 62 passed
npx vitest --watch   # Tests en watch

git add .
git commit -m "type: description"
git push             # Déclenche redéploiement Vercel
```

---

## Ce qui est en place et fonctionne

### Moteur et simulateur
- [x] Calcul complet micro / EURL / SASU
- [x] Barème IR 2025 avec QF, plafonnement, décote
- [x] Option barème IR dividendes (toggle PFU/progressif)
- [x] Dividendes EURL > 10% capital social
- [x] Optimiseur split rémunération/dividendes dans l'UI
- [x] Score contextualisé (phrase de synthèse dynamique)
- [x] Export PDF (header/footer, pagination, éléments exclus)
- [x] Partage par URL (query params, sync replaceState)
- [x] Chargement automatique depuis URL (diagnostic redirect)
- [x] Graphique comparaison 5 ans (MultiYearChart)
- [x] Animations framer-motion

### Acquisition et contenu
- [x] Widget mini-simulateur sur la landing page
- [x] Blog SEO : index + 3 articles avec CTAs inline pré-remplis
- [x] Diagnostic → redirect simulateur avec params déduits
- [x] Pages /a-propos et /comment-ca-marche dans le footer

### Monétisation
- [x] Page /premium : pré-commande Brevo + pricing + FAQ + garanties
- [x] Page /experts : affiliation Dougs / Keobiz / Indy
- [x] CTA affiliation dans ResultsDashboard

### Infrastructure
- [x] Newsletter Brevo connectée (La Marge)
- [x] Analytics Plausible (8 événements trackés)
- [x] Mode sombre (toggle Header, persistence localStorage)
- [x] Responsive mobile-first 375px → 1440px
- [x] SEO : meta, Open Graph, 13 routes
- [x] 62 tests passent
- [x] Build production sans erreur TypeScript
- [x] Déployé : statut-net.vercel.app

---

## Prochaines étapes — par priorité business

### Priorité 1 — Activer les revenus (bloquant)
1. **Stripe sur /premium** : API Route `create-checkout-session`,
   webhook confirmation paiement, envoi PDF par email Brevo
   transactionnel ou lien de téléchargement signé (48h d'expiration)
2. **Contacter Dougs/Keobiz/Indy** pour vrais liens d'affiliation CPL
   (remplacer les liens placeholder sur /experts)

### Priorité 2 — Activer l'acquisition (urgent)
3. **Publier 5 posts LinkedIn** (contenu rédigé, prêt à copier)
4. **Envoyer édition 1 de La Marge** dès 50 abonnés
5. **Séquence email bienvenue** : configurer J+0, J+3, J+7 dans Brevo

### Priorité 3 — SEO (moyen terme)
6. **sitemap.xml** : `src/app/sitemap.ts` (Next.js App Router)
7. **robots.txt** : `src/app/robots.ts`
8. **JSON-LD** : schema Article sur les 3 articles de blog
9. **4 articles supplémentaires** : TJM freelance, charges SASU,
   cotisations TNS barème, EURL vs portage salarial

### Priorité 4 — Amélioration produit (après traction)
10. **Slider taux croissance CA** dans MultiYearChart
    (actuellement taux fixe codé en dur)
11. **Taxe PUMa** : calcul et avertissement si salaire SASU < seuil
12. **Cotisations TNS barème exact** : 6 tranches post-réforme 2025
13. **Tests E2E Playwright** : parcours complet simulateur → PDF → newsletter

---

## Conventions de code

- **Tailwind v4** : `@theme inline` dans `globals.css`
- **Dark mode** : classe `dark` sur `<html>`, pas sur `<body>`
- **Composants** : `'use client'` uniquement si hooks ou events
- **Engine** : fonctions pures TS, zéro import React
- **Constantes fiscales** : UNIQUEMENT dans `constants.ts`
- **Formatage** : `Intl.NumberFormat('fr-FR')` via `formatters.ts`
- **Analytics** : `trackEvent()` de `lib/analytics.ts` uniquement
- **Score summary** : `generateScoreSummary()` de `lib/score-summary.ts`
- **TypeScript** : `any` interdit — `unknown` + type guards
- **Commentaires** : en français uniquement
- **pdf-hide** : sur tout élément à exclure du PDF export

---

## Limites connues (afficher dans /a-propos, /comment-ca-marche, PDF)

- Cotisations TNS EURL : modèle simplifié ±3%
- Charges SASU : taux moyens ±2%
- Dividendes EURL > 10% capital : calcul approché des cotisations TNS
- Versement libératoire : condition revenu fiscal non vérifiée
- ACRE : réduction 50% forfaitaire, conditions non vérifiées
- Taxe PUMa : non calculée
- CFE, CVAE, taxe sur les salaires : non prises en compte
- Professions libérales réglementées (CIPAV) : non gérées
- Holding et montages complexes : non gérés

---

## Débogage fréquent

**62 tests ne passent pas :**
Lire le message Vitest exact. Ne jamais modifier un test
pour le faire passer — corriger le code.

**Build Vercel échoue :**
`npm run build` en local d'abord. Les erreurs TypeScript
sont la cause #1. Turbopack masque parfois des erreurs
que le build production révèle.

**Redirect diagnostic → simulateur ne se déclenche pas :**
Vérifier que `router.push('/simulateur?' + params)` est
bien appelé après le dernier `trackEvent`. Vérifier que
`useSimulator` lit bien les params au montage (useEffect []).

**Score contextualisé affiche une phrase générique :**
Vérifier `generateScoreSummary()` dans `lib/score-summary.ts`.
La fonction reçoit `SimulationResults` complet — vérifier
que `bestStatus` et `gainVsDefault` sont bien renseignés.

**Widget mini-simulateur ne redirige pas :**
Vérifier que `encodeSimulationToURL` reçoit bien les valeurs
du mini-formulaire (CA + type activité avec defaults pour le reste).

**Brevo ne reçoit pas les pré-commandes /premium :**
Vérifier que le tag `premium_precommande` est bien passé
dans les `attributes` de l'appel API Brevo.
Vérifier les env vars Vercel.
