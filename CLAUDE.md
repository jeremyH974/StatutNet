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
- **Stripe** pour les paiements (checkout session + webhook)
- **Turbopack** activé en développement
- **100% client-side** sauf les API Routes Stripe (server-side)
- **Paramètres fiscaux 2025** centralisés dans `src/engine/constants.ts`
- **Tests** : Vitest (62 tests passent — ne jamais casser ce chiffre)
- **Déploiement** : Vercel, redéploiement automatique à chaque `git push main`

---

## Toutes les routes disponibles (15 routes)

| Route | Type | Description |
|---|---|---|
| `/` | Page | Landing page + widget mini-simulateur |
| `/simulateur` | Page | Simulateur principal — accepte query params |
| `/blog` | Page | Index des 3 articles SEO |
| `/blog/micro-vs-sasu` | Page | Article + 2 CTAs inline pré-remplis |
| `/blog/quitter-micro` | Page | Article + 2 CTAs inline pré-remplis |
| `/blog/seuil-tva` | Page | Article + 2 CTAs inline pré-remplis |
| `/diagnostic` | Page | Quiz 10 questions → redirect simulateur |
| `/experts` | Page | Affiliation Dougs / Keobiz / Indy |
| `/premium` | Page | Checkout Stripe ou pré-commande Brevo |
| `/remuneration` | Page | Simulateur rémunération dirigeant |
| `/a-propos` | Page | Mission, sources, disclaimer |
| `/comment-ca-marche` | Page | Méthodologie, 3 étapes, limites |
| `/_not-found` | Page | 404 custom |
| `/api/create-checkout-session` | API Route | POST — crée session Stripe Checkout |
| `/api/stripe-webhook` | API Route | POST — reçoit events Stripe signés |

---

## Architecture des fichiers

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          # Landing + MiniSimulator widget
│   ├── globals.css
│   ├── simulateur/page.tsx               # Simulateur principal
│   ├── blog/
│   │   ├── page.tsx
│   │   ├── micro-vs-sasu/page.tsx        # CTAs inline : ?ca=45000 et ?ca=70000
│   │   ├── quitter-micro/page.tsx        # CTAs inline : ?ca=60000 et ?ca=80000
│   │   └── seuil-tva/page.tsx            # CTAs inline : ?ca=38000 et ?ca=55000
│   ├── diagnostic/page.tsx               # Quiz → redirect /simulateur?params
│   ├── experts/page.tsx
│   ├── premium/page.tsx                  # Détecte ?session_id → confirmation
│   │                                     # Si STRIPE configuré → Checkout
│   │                                     # Sinon → pré-commande Brevo (fallback)
│   ├── remuneration/page.tsx
│   ├── a-propos/page.tsx
│   ├── comment-ca-marche/page.tsx
│   ├── not-found.tsx
│   └── api/
│       ├── create-checkout-session/
│       │   └── route.ts                  # POST { email } → { url }
│       │                                 # Mode dégradé si env vars absentes (503)
│       └── stripe-webhook/
│           └── route.ts                  # POST — vérifie signature Stripe
│                                         # checkout.session.completed :
│                                         #   → email confirmation Brevo SMTP
│                                         #   → contact Brevo tagué PREMIUM_PAID
│                                         # Retourne toujours 200 à Stripe
│
├── engine/                               # Moteur calcul — fonctions pures TS
│   ├── types.ts
│   ├── constants.ts                      # TOUS les paramètres fiscaux 2025
│   ├── ir.ts
│   ├── micro.ts
│   ├── eurl.ts                           # TNS itératif, div > 10% capital,
│   │                                     # option barème IR dividendes
│   ├── sasu.ts                           # Option barème IR dividendes
│   ├── social-coverage.ts
│   ├── optimizer.ts
│   └── index.ts                          # computeAll() + optimiseur
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                    # Nav complète, dark mode toggle
│   │   └── Footer.tsx                    # Liens a-propos, comment-ca-marche
│   ├── simulator/
│   │   └── SimulatorForm.tsx
│   ├── results/
│   │   ├── ResultsDashboard.tsx          # id="results-content", animations,
│   │   │                                 # PDF export, URL share, affiliation CTA
│   │   ├── ScoreSummary.tsx              # Phrase de synthèse contextualisée
│   │   ├── ComparisonTable.tsx
│   │   ├── StatusCard.tsx                # Note EURL div > 10% capital
│   │   ├── OptimiserPanel.tsx            # Slider interactif recalcul temps réel
│   │   ├── ComparisonChart.tsx
│   │   ├── WaterfallChart.tsx
│   │   ├── MultiYearChart.tsx            # Projection 5 ans
│   │   └── SocialCoverageTable.tsx
│   ├── landing/
│   │   └── MiniSimulator.tsx             # 2 inputs → 3 nets → lien pré-rempli
│   ├── newsletter/
│   │   └── NewsletterCTA.tsx             # Brevo, classe pdf-hide
│   └── ui/                              # NumberInput, Slider, Tooltip
│
├── hooks/
│   └── useSimulator.ts                   # State + sync URL params
│
└── lib/
    ├── formatters.ts
    ├── validators.ts
    ├── url-params.ts                     # Clés : ca, act, pt, ch, ac, vl, rs
    ├── export-pdf.ts                     # jsPDF + html2canvas
    ├── brevo.ts                          # addContactToBrevo() contacts API
    ├── analytics.ts                      # trackEvent() Plausible
    └── score-summary.ts                  # generateScoreSummary(results) → string
```

---

## Logique de paiement Stripe (critique)

### Flux de paiement complet

```
Utilisateur clique "Acheter" sur /premium
        ↓
POST /api/create-checkout-session { email }
        ↓
Stripe crée une Checkout Session (mode payment, price_id)
        ↓
Retour { url } → redirect vers Stripe Checkout
        ↓
Utilisateur paie sur Stripe
        ↓
Stripe appelle /api/stripe-webhook (event: checkout.session.completed)
        ↓
Webhook vérifie la signature (STRIPE_WEBHOOK_SECRET)
        ↓
Webhook envoie email confirmation via Brevo SMTP /v3/smtp/email
Webhook tague le contact Brevo : PREMIUM_PAID=true + date
        ↓
Stripe redirige vers /premium?session_id=cs_...
        ↓
Page /premium détecte ?session_id → affiche confirmation
"Paiement confirmé ! Votre rapport arrive par email sous 24h."
```

### Mode dégradé (env vars Stripe absentes)
Si `STRIPE_SECRET_KEY` ou `STRIPE_PRICE_ID` absent :
- `/api/create-checkout-session` retourne 503
- `/premium` détecte l'erreur et bascule en mode pré-commande Brevo
- L'utilisateur peut pré-commander sans payer (fallback)

### Points importants pour le webhook
- **Toujours retourner 200 à Stripe** même en cas d'erreur interne
  (sinon Stripe retente indéfiniment)
- **Vérifier la signature** avec `stripe.webhooks.constructEvent()`
  avant tout traitement
- **Idempotence** : vérifier que `session.id` n'a pas déjà été traité
  (éviter les doubles envois d'email si Stripe retente)

---

## Variables d'environnement

### .env.local (ne jamais committer)
```bash
# Brevo
NEXT_PUBLIC_BREVO_API_KEY=xkeysib-...
NEXT_PUBLIC_BREVO_LIST_ID=7

# Stripe (côté serveur uniquement sauf PUBLISHABLE_KEY)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Sur Vercel (Settings → Environment Variables)
Toutes les variables ci-dessus, en Production + Preview + Development.

### Configuration Stripe requise
Dans le dashboard Stripe → Webhooks → Ajouter un endpoint :
- URL : `https://statut-net.vercel.app/api/stripe-webhook`
- Événements à écouter : `checkout.session.completed` uniquement
- Copier le `Signing secret` → `STRIPE_WEBHOOK_SECRET`

---

## Newsletter — La Marge

**Nom** : La Marge
**Provider** : Brevo

Tags Brevo utilisés :
- `SOURCE: "statutnet-simulateur"` — CTA simulateur
- `SOURCE: "diagnostic"` — fin du quiz diagnostic
- `SOURCE: "premium_precommande"` — fallback /premium sans Stripe
- `PREMIUM_PAID: true` + date — confirmé par webhook Stripe

---

## Analytics Plausible

| Événement | Déclencheur |
|---|---|
| `simulation_lancee` | Calcul réussi (props: type_activite, tranche_ca, meilleur_statut) |
| `lien_partage` | Clic "Copier le lien" |
| `pdf_telecharge` | PDF généré |
| `newsletter_inscription` | Inscription Brevo OK |
| `diagnostic_complete` | Fin quiz (props: score, statut_recommande) |
| `expert_clic` | Clic CTA expert (props: partenaire) |
| `premium_clic` | Clic /premium |
| `premium_paiement_initie` | POST create-checkout-session OK |
| `premium_paiement_confirme` | ?session_id détecté sur /premium |
| `mini_simulator_clic` | CTA widget landing (props: ca_range, act) |

---

## Commandes utiles

```bash
npm run dev          # Dev localhost:3000 (Turbopack)
npm run build        # Build production
npm run start        # Serveur production local
npx vitest run       # 62 tests doivent passer
npx vitest --watch   # Watch mode

git add .
git commit -m "type: description"
git push             # Déclenche redéploiement Vercel
```

---

## Ce qui est en place et fonctionne

### Simulateur
- [x] Calcul complet micro / EURL / SASU
- [x] Barème IR 2025 avec QF, plafonnement, décote
- [x] Option barème IR dividendes (toggle PFU/progressif)
- [x] Dividendes EURL > 10% capital social
- [x] Optimiseur split rémunération/dividendes dans l'UI
- [x] Score contextualisé (phrase synthèse dynamique)
- [x] Export PDF (header/footer, pagination, pdf-hide)
- [x] Partage par URL (query params, sync replaceState)
- [x] Graphique comparaison 5 ans (MultiYearChart)
- [x] Animations framer-motion

### Acquisition
- [x] Widget mini-simulateur sur la landing page
- [x] Blog SEO : 3 articles avec CTAs inline pré-remplis
- [x] Diagnostic → redirect simulateur avec params déduits

### Monétisation
- [x] Stripe Checkout Session (API Route POST)
- [x] Webhook Stripe (signature, email Brevo, tag contact)
- [x] Page /premium : mode Stripe + mode fallback Brevo
- [x] Confirmation paiement via ?session_id
- [x] Page /experts : affiliation Dougs / Keobiz / Indy

### Infrastructure
- [x] Newsletter Brevo (La Marge)
- [x] Analytics Plausible (10 événements)
- [x] Mode sombre (toggle, persistence localStorage)
- [x] Pages /a-propos et /comment-ca-marche
- [x] Responsive 375px → 1440px
- [x] SEO : meta, Open Graph, 15 routes
- [x] 62 tests passent
- [x] Build production propre

---

## Prochaines étapes — par priorité

### Priorité 1 — Activer les revenus réels (cette semaine)
1. **Créer le produit Stripe** : dashboard Stripe → Products → créer
   "Rapport StatutNet Premium" à 19€ → copier le Price ID
2. **Configurer toutes les env vars Stripe** sur Vercel
3. **Configurer le webhook** dans le dashboard Stripe
4. **Tester un vrai paiement** en mode test (sk_test_, pk_test_)
   puis basculer en live
5. **Créer le PDF du rapport** : le contenu à livrer par email
   après paiement (actuellement l'email promet le rapport sous 24h
   mais le PDF doit être créé et hébergé ou attaché)

### Priorité 2 — Acquisition (cette semaine)
6. **Publier le premier post LinkedIn** (contenu prêt)
7. **Configurer la séquence email Brevo** : J+0, J+3, J+7
8. **Envoyer l'édition 1 de La Marge** dès 50 abonnés

### Priorité 3 — SEO (mois 1)
9. **sitemap.xml** : `src/app/sitemap.ts`
10. **robots.txt** : `src/app/robots.ts`
11. **JSON-LD Article** sur les 3 articles de blog
12. **4 articles supplémentaires** à fort volume de recherche

### Priorité 4 — Produit (après traction confirmée)
13. **Idempotence webhook** : stocker les session_id traités
    pour éviter doubles envois si Stripe retente
14. **Livraison PDF automatique** : générer et attacher le PDF
    à l'email de confirmation (jsPDF côté serveur)
15. **Vrais liens CPL** Dougs/Keobiz/Indy (contacter les partenaires)
16. **Slider taux croissance** dans MultiYearChart
17. **Taxe PUMa** : calcul et avertissement

---

## Conventions de code

- **API Routes** : `src/app/api/*/route.ts`, export `POST` uniquement
- **Stripe** : toujours vérifier la signature webhook avant traitement
- **Brevo SMTP** : endpoint `/v3/smtp/email` pour les emails transactionnels
  (différent de `/v3/contacts` pour la gestion des contacts)
- **Tailwind v4** : `@theme inline` dans `globals.css`
- **Dark mode** : classe `dark` sur `<html>`
- **Engine** : fonctions pures TS, zéro import React
- **Constantes fiscales** : UNIQUEMENT dans `constants.ts`
- **Formatage** : `Intl.NumberFormat('fr-FR')` via `formatters.ts`
- **Analytics** : `trackEvent()` de `lib/analytics.ts` uniquement
- **TypeScript** : `any` interdit
- **Commentaires** : en français uniquement
- **pdf-hide** : sur tout élément à exclure du PDF

---

## Limites connues

- Cotisations TNS EURL : modèle simplifié ±3%
- Charges SASU : taux moyens ±2%
- Dividendes EURL > 10% capital : calcul approché
- Versement libératoire : condition revenu fiscal non vérifiée
- ACRE : réduction 50% forfaitaire, conditions non vérifiées
- Taxe PUMa : non calculée
- CFE, CVAE, taxe sur les salaires : non prises en compte
- Professions libérales réglementées (CIPAV) : non gérées
- Holding et montages complexes : non gérés
- Idempotence webhook Stripe : à implémenter (risque doublon email)

---

## Débogage fréquent

**Stripe webhook retourne 400 :**
→ La signature est invalide. Vérifier que `STRIPE_WEBHOOK_SECRET`
  correspond bien au secret du webhook configuré dans le dashboard Stripe.
→ En local, utiliser Stripe CLI : `stripe listen --forward-to localhost:3000/api/stripe-webhook`

**Email de confirmation non reçu après paiement :**
→ Vérifier les logs du webhook dans le dashboard Stripe (Events).
→ Vérifier que Brevo SMTP est bien configuré (sender vérifié).
→ Vérifier que `NEXT_PUBLIC_BREVO_API_KEY` a la permission "SMTP".

**Page /premium reste en mode pré-commande malgré Stripe configuré :**
→ Vérifier que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` est bien défini.
→ La page détecte l'absence de cette variable pour basculer en fallback.

**?session_id ne déclenche pas la confirmation :**
→ Vérifier que Stripe Checkout est configuré avec
  `success_url: /premium?session_id={CHECKOUT_SESSION_ID}`

**62 tests ne passent pas :**
→ Les API Routes Stripe ne sont pas testées (mock difficile).
→ Les 62 tests couvrent uniquement le moteur de calcul et lib/*.
→ Ne jamais modifier un test pour le faire passer.

**Build Vercel échoue :**
→ `npm run build` en local d'abord.
→ Vérifier que toutes les variables `STRIPE_*` sont dans Vercel
  (le build échoue si une variable server-side est manquante
  et référencée dans le code).
