# StatutNet — Contexte projet pour Claude Code

## Ce qu'est ce projet

Simulateur fiscal et social web pour indépendants français.
Compare le revenu net disponible selon 3 statuts juridiques :
**Micro-entreprise**, **EURL à l'IS**, **SASU à l'IS**.

Objectif business : outil de décision gratuit + acquisition newsletter
(La Marge) + monétisation par affiliation experts-comptables et rapport PDF premium.

**Site en production** : https://statut-net.vercel.app
**Repo GitHub** : https://github.com/jeremyH974/StatutNet
**Branch principale** : main (auto-déployée sur Vercel à chaque push)

---

## Stack technique

- **Next.js 16.2.3** (App Router) + **TypeScript** strict + **Tailwind CSS v4**
- **Recharts** pour les graphiques (bar chart comparatif, stacked bar décomposition CA)
- **Turbopack** activé en développement
- **100% client-side** — aucun backend, aucune donnée stockée, aucune API
- **Paramètres fiscaux 2025** centralisés dans `src/engine/constants.ts`
- **Tests** : Vitest (41 tests passent — ne jamais casser ce chiffre)
- **Déploiement** : Vercel, redéploiement automatique à chaque `git push main`

---

## Architecture des fichiers

```
src/
├── app/
│   ├── layout.tsx              # Layout racine (Inter font, Header/Footer, meta SEO)
│   ├── page.tsx                # Landing page (hero + features + aperçu 3 statuts)
│   ├── globals.css             # Variables CSS custom + classe .pdf-export-mode
│   └── simulateur/page.tsx     # Page principale du simulateur (form + results)
│
├── engine/                     # Moteur de calcul fiscal — fonctions pures TypeScript
│   ├── types.ts                # Interfaces : SimulationInputs, StatusResult,
│   │                           # SimulationResults, OptimalSplit
│   ├── constants.ts            # TOUS les paramètres fiscaux 2025
│   │                           # (barème IR, taux URSSAF, IS, PASS, etc.)
│   ├── ir.ts                   # Barème IR progressif, quotient familial,
│   │                           # décote, plafonnement QF
│   ├── micro.ts                # Micro-entreprise : cotisations forfaitaires,
│   │                           # abattement, VL, ACRE, CFP
│   ├── eurl.ts                 # EURL IS : rémunération gérant, cotisations TNS
│   │                           # (itératif 2 passes), IS, dividendes flat tax
│   ├── sasu.ts                 # SASU IS : salaire président (42%/22%),
│   │                           # IS, dividendes flat tax
│   ├── social-coverage.ts      # Données qualitatives protection sociale
│   ├── optimizer.ts            # Recherche split rémunération/dividendes optimal
│   │                           # (brute force 5% puis affinage 1%)
│   └── index.ts                # computeAll(inputs) => SimulationResults
│                               # (appelle aussi l'optimiseur pour EURL et SASU)
│
├── components/
│   ├── layout/                 # Header (sticky, mobile hamburger), Footer
│   ├── simulator/
│   │   └── SimulatorForm.tsx   # Formulaire complet (CA, activité, parts,
│   │                           # charges, options avancées)
│   ├── results/
│   │   ├── ResultsDashboard.tsx    # Orchestre tous les panneaux de résultats
│   │   │                           # id="results-content" sur le div principal
│   │   ├── ComparisonTable.tsx     # Grille 3 colonnes
│   │   ├── StatusCard.tsx          # Carte par statut (résumé + détail accordéon)
│   │   │                           # Note EURL dividendes > 10% capital visible
│   │   ├── OptimiserPanel.tsx      # Panel split optimal rémunération/dividendes
│   │   │                           # (affiché si gain > 300€)
│   │   ├── ComparisonChart.tsx     # Bar chart Recharts (revenu net comparé)
│   │   ├── WaterfallChart.tsx      # Stacked bar (décomposition CA → net)
│   │   └── SocialCoverageTable.tsx # Tableau protection sociale avec code couleur
│   ├── newsletter/
│   │   └── NewsletterCTA.tsx   # Formulaire email opt-in connecté à Brevo
│   │                           # Classe pdf-hide (exclu du PDF export)
│   └── ui/                     # NumberInput, Slider, Tooltip (réutilisables)
│
├── hooks/
│   └── useSimulator.ts         # Hook principal : state inputs + results +
│                               # runSimulation() + sync URL params
│
└── lib/
    ├── formatters.ts           # formatCurrency(), formatPercent() via Intl fr-FR
    ├── validators.ts           # Schema Zod pour validation formulaire
    ├── url-params.ts           # encodeSimulationToURL() + decodeSimulationFromURL()
    ├── export-pdf.ts           # exportResultsToPDF() via jsPDF + html2canvas
    ├── brevo.ts                # addContactToBrevo() — intégration API Brevo
    └── analytics.ts            # trackEvent() — wrapper Plausible
```

---

## Comment fonctionne le moteur de calcul

Flux : `SimulatorForm` → `useSimulator` hook → `computeAll(inputs)`
→ `ResultsDashboard` → composants enfants.

`computeAll()` est une fonction pure synchrone < 1ms.
Elle appelle également `optimizer.ts` pour calculer le split optimal
EURL et SASU et les expose via `optimalEURL` et `optimalSASU`.

### Points techniques importants

- **TNS (EURL)** : calcul itératif 2 passes (CSG/CRDS dépend de
  cotisations, créant une circularité). Convergence en 2 itérations.
- **Maladie TNS** : taux progressif sur 3 tranches par rapport au PASS.
- **SASU** : taux moyens (patronal 42%, salarial 22%). Précision ±2%.
- **Micro** : CA plafonné automatiquement (77 700€ BNC/BIC services,
  188 700€ BIC vente).
- **IR** : barème 2025 complet avec quotient familial, plafonnement QF
  (1 791€/demi-part), décote.
- **Optimizer** : brute force par pas de 5% puis affinage par pas de 1%
  autour du meilleur split.
- **URL params** : clés courtes (ca, act, pt, ch, ac, vl).
  Sync via `history.replaceState` (pas pushState).
  Chargement au montage via `decodeSimulationFromURL`.
- **PDF export** : html2canvas scale 2 + jsPDF A4 portrait.
  Classe `.pdf-export-mode` sur body pendant la capture.
  Classe `.pdf-hide` sur les éléments à exclure (boutons, CTA).

---

## Paramètres fiscaux 2025 (résumé)

Tous les détails dans `src/engine/constants.ts`.
Ne jamais hardcoder ces valeurs ailleurs.

| Paramètre | Valeur |
|---|---|
| Cotisations micro BNC | 23,1% du CA |
| Cotisations micro BIC services | 21,2% du CA |
| Cotisations micro BIC vente | 12,3% du CA |
| Abattement IR micro BNC | 34% |
| Abattement IR micro BIC services | 50% |
| Abattement IR micro BIC vente | 71% |
| Plafond micro BNC/BIC services | 77 700€ |
| Plafond micro BIC vente | 188 700€ |
| Seuil franchise TVA services | 37 500€ |
| Seuil majoré TVA services | 41 250€ |
| Seuil franchise TVA vente | 85 000€ |
| IS taux réduit | 15% ≤ 42 500€ |
| IS taux normal | 25% |
| PFU dividendes | 30% |
| PASS 2025 | 46 368€ |

Barème IR 2025 :
- 0% jusqu'à 11 497€
- 11% jusqu'à 29 315€
- 30% jusqu'à 83 823€
- 41% jusqu'à 180 294€
- 45% au-delà

---

## Variables d'environnement

### En local (.env.local — ne jamais committer)
```
NEXT_PUBLIC_BREVO_API_KEY=xkeysib-...
NEXT_PUBLIC_BREVO_LIST_ID=7
```

### Sur Vercel (Settings → Environment Variables)
Mêmes variables, configurées dans le dashboard Vercel.
Vérifier leur présence avant tout debug lié à la newsletter.

### Plausible Analytics
Domaine tracké : `statut-net.vercel.app`
Script dans `layout.tsx` (chargé uniquement en production).
Événements trackés :
- `simulation_lancee` (props : type_activite, tranche_ca, meilleur_statut)
- `lien_partage`
- `pdf_telecharge`
- `newsletter_inscription`

---

## Newsletter — La Marge

Nom retenu : **La Marge**
Double sens : marge bénéficiaire (profit) + marge de liberté (indépendance).

Provider : **Brevo** (ex-Sendinblue)
- Plan gratuit : 300 contacts/jour, contacts illimités
- Liste ID : configurable via env var `NEXT_PUBLIC_BREVO_LIST_ID`
- Source trackée : `"statutnet-simulateur"` dans les attributs contact

Le CTA newsletter (`NewsletterCTA.tsx`) :
- États : idle → loading → success | error
- Succès : "C'est noté ! Tu recevras La Marge directement dans ta boîte."
- Doublon email (code 400 Brevo) : traité comme succès silencieux
- Env vars absentes : mode dégradé silencieux (console.warn + succès simulé)
- Classe `pdf-hide` : exclu des exports PDF

---

## Commandes utiles

```bash
npm run dev          # Serveur de développement localhost:3000 (Turbopack)
npm run build        # Build production — doit passer sans erreur
npm run start        # Serveur production local
npx vitest run       # Lancer les tests (doit afficher 41+ passed)
npx vitest --watch   # Tests en mode watch pendant le développement

# Déployer
git add .
git commit -m "feat: description"
git push             # Déclenche le redéploiement Vercel automatiquement
```

---

## Ce qui est en place et fonctionne

- [x] Moteur de calcul complet pour les 3 statuts (micro, EURL, SASU)
- [x] Barème IR 2025, IS, flat tax, cotisations URSSAF
- [x] Optimiseur split rémunération/dividendes (optimizer.ts)
- [x] Formulaire complet (CA, activité, parts, charges, ACRE, VL)
- [x] OptimiserPanel dans l'UI (gain affiché si > 300€, slider interactif)
- [x] Résultats : 3 cartes comparatives avec détail accordéon
- [x] Note de transparence EURL dividendes > 10% capital
- [x] Export PDF (jsPDF + html2canvas, header/footer, pagination)
- [x] Partage par URL (query params encodés, sync automatique)
- [x] Graphiques : bar chart comparatif + stacked bar décomposition
- [x] Tableau protection sociale (7 catégories)
- [x] Landing page avec hero, features, aperçu des 3 statuts
- [x] Newsletter CTA connecté à Brevo (La Marge)
- [x] Analytics Plausible (tracking simulation, PDF, partage, newsletter)
- [x] Responsive mobile-first (testé 375px → 1440px)
- [x] SEO : meta title/description/keywords, Open Graph
- [x] 41+ tests unitaires + intégration passent
- [x] Build Next.js production réussit sans erreur TypeScript
- [x] Déployé sur Vercel : statut-net.vercel.app

---

## Pistes d'amélioration restantes (par priorité)

### Priorité haute — Impact business direct
1. **Blog SEO** : page `/blog` avec 3 articles cibles
   ("Micro vs SASU", "Quand quitter la micro", "Seuil TVA auto-entrepreneur")
   → trafic organique sur requêtes à forte intention
2. **Rapport PDF premium** : version payante (9-19€) via Stripe
   → premier revenu direct
3. **Affiliation experts-comptables** : bouton "Parler à un expert"
   après les résultats → CPL avec Dougs, Keobiz ou Indy (30-80€/lead)
4. **Option barème IR pour dividendes** (au lieu de flat tax uniquement)
   → pertinent pour les foyers à faible TMI

### Priorité moyenne — Amélioration produit
5. **Dividendes EURL > 10% capital** : calcul exact des cotisations TNS
   sur la part excédentaire (champ capital social dans options avancées)
6. **Comparaison pluriannuelle** : simuler sur 3-5 ans avec progression CA
7. **Simulateur rémunération dirigeant** : outil dédié split salaire/dividendes
   pour dirigeants déjà en société
8. **Cotisations TNS détaillées** : remplacer modèle simplifié par barème
   exact post-réforme 2025 (6 tranches maladie, assiette unifiée -26%)

### Priorité basse — Nice to have
9. **Mode sombre**
10. **Animations** sur les transitions résultats (framer-motion)
11. **Tests end-to-end** avec Playwright
12. **i18n** (version anglaise pour freelances expatriés)
13. **Diagnostic statut** : quiz 10 questions → score de santé statutaire

---

## Conventions de code

- **Tailwind CSS v4** : variables CSS custom dans `globals.css`
  avec `@theme inline` — pas de `tailwind.config.ts` pour les couleurs
- **Composants React** : un fichier par composant, PascalCase,
  `'use client'` uniquement quand nécessaire (interactivité ou hooks)
- **Engine** : fonctions pures TypeScript, aucune dépendance React,
  testables unitairement — ne jamais importer React dans engine/
- **Paramètres fiscaux** : UNIQUEMENT dans `constants.ts`
  — mise à jour annuelle = modifier ce seul fichier
- **Formatage monétaire** : toujours via `Intl.NumberFormat('fr-FR')`
  dans `lib/formatters.ts` — jamais hardcoder "€" ou séparateurs
- **Tests** : dans `__tests__/` avec Vitest
  — chaque nouvelle fonction métier doit avoir ses tests
- **Analytics** : toujours via `trackEvent()` de `lib/analytics.ts`
  — jamais appeler `window.plausible` directement
- **TypeScript** : `any` interdit — utiliser `unknown` + type guards
- **Commentaires** : en français uniquement

---

## Limites connues et disclaimers

Ces limites doivent toujours être affichées à l'utilisateur
dans le bas de page et dans les exports PDF.

- Cotisations TNS (EURL) : modèle simplifié, précision ±3%
- Charges SASU : taux moyens (±2%), pas un bulletin de paie exact
- Dividendes EURL : la part > 10% du capital social soumise aux
  cotisations TNS n'est pas calculée (note affichée dans la carte EURL)
- Versement libératoire : ne vérifie pas la condition de revenu fiscal
- ACRE : modélisée comme réduction forfaitaire 50%, sans vérification
  des conditions d'éligibilité détaillées
- Taxe PUMa (SASU sans salaire) : non calculée
- CFE, CVAE, taxe sur les salaires : non pris en compte
- Professions libérales réglementées (CIPAV spécifique) : non gérées
- Situations mixtes ou holding : non gérées

---

## Débogage fréquent

**Build Vercel qui échoue :**
Lire les logs dans Vercel → Deployments → Build Logs.
Les erreurs TypeScript sont la cause #1.
Corriger localement avec `npm run build` avant de push.

**Brevo ne reçoit pas les contacts :**
1. Vérifier les env vars sur Vercel (Settings → Environment Variables)
2. Inspecter la requête réseau dans le navigateur (onglet Network)
   → l'appel POST vers `api.brevo.com` doit retourner 200 ou 204
3. Vérifier que la clé API a bien la permission "Contacts"

**Tests qui cassent après modification du moteur :**
Lire le message d'erreur Vitest exact.
Ne corriger que le test concerné.
Ne jamais modifier un test pour le faire passer — corriger le code.

**URL params qui ne se chargent pas :**
Vérifier que `typeof window !== 'undefined'` est bien vérifié
avant tout accès à `window.location` (SSR Next.js).

**PDF vide ou mal rendu :**
Vérifier que l'id `results-content` existe bien dans le DOM.
Augmenter le délai avant capture si le DOM n'est pas encore rendu.
html2canvas a besoin que les images soient chargées (useCORS: true).
