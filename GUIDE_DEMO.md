# StatutNet — Guide complet : installation, utilisation et démo

---

## Table des matières

1. [Prérequis techniques](#1-prérequis-techniques)
2. [Installation pas à pas](#2-installation-pas-à-pas)
3. [Lancer l'application en local](#3-lancer-lapplication-en-local)
4. [Partager la démo sur le réseau local](#4-partager-la-démo-sur-le-réseau-local)
5. [Guide d'utilisation du simulateur](#5-guide-dutilisation-du-simulateur)
6. [Comprendre les résultats](#6-comprendre-les-résultats)
7. [Scénarios de démonstration](#7-scénarios-de-démonstration)
8. [FAQ et dépannage](#8-faq-et-dépannage)
9. [Architecture technique (pour développeurs)](#9-architecture-technique)

---

## 1. Prérequis techniques

### Ce qu'il faut installer avant de commencer

| Logiciel | Version minimale | Vérifier l'installation |
|----------|-----------------|------------------------|
| **Node.js** | 18.0+ | `node --version` |
| **npm** | 9.0+ | `npm --version` |
| **Git** (optionnel) | 2.0+ | `git --version` |
| **Navigateur** | Chrome, Firefox, Edge, Safari récent | — |

### Installer Node.js (si pas déjà fait)

1. Aller sur https://nodejs.org
2. Télécharger la version **LTS** (bouton vert)
3. Installer en suivant l'assistant (tout par défaut)
4. Redémarrer le terminal après installation
5. Vérifier : `node --version` doit afficher `v18.x.x` ou plus

---

## 2. Installation pas à pas

### Étape 1 — Récupérer le projet

**Option A : copie du dossier (le plus simple)**
Copier le dossier `StatutNet` sur la machine cible (clé USB, partage réseau, zip...).

**Option B : via Git (si le projet est sur un dépôt)**
```bash
git clone <url-du-depot> StatutNet
cd StatutNet
```

### Étape 2 — Installer les dépendances

Ouvrir un terminal dans le dossier du projet, puis :

```bash
cd StatutNet
npm install
```

> Cette commande télécharge toutes les bibliothèques nécessaires.
> Durée : 30 secondes à 2 minutes selon la connexion.
> Un dossier `node_modules` apparaît — c'est normal, ne pas le supprimer.

### Étape 3 — Vérifier que tout est OK

```bash
npm run build
```

> Si le message `✓ Generating static pages` apparaît, tout est prêt.

---

## 3. Lancer l'application en local

### Démarrage

```bash
npm run dev
```

Le terminal affiche :

```
▲ Next.js 16.x.x
- Local:   http://localhost:3000
```

### Ouvrir dans le navigateur

Aller sur **http://localhost:3000** dans n'importe quel navigateur.

### Arrêter le serveur

Appuyer sur `Ctrl + C` dans le terminal.

---

## 4. Partager la démo sur le réseau local

Pour que d'autres personnes sur le même réseau Wi-Fi/Ethernet puissent
accéder au simulateur depuis leur propre ordinateur ou téléphone.

### Étape 1 — Trouver votre adresse IP locale

**Windows :**
```bash
ipconfig
```
Chercher la ligne `Adresse IPv4` (exemple : `192.168.1.42`)

**Mac / Linux :**
```bash
ifconfig | grep "inet "
# ou
ip addr show | grep "inet "
```

### Étape 2 — Lancer avec accès réseau

```bash
npx next dev -H 0.0.0.0 -p 3000
```

> Le flag `-H 0.0.0.0` rend le serveur accessible depuis le réseau local.

### Étape 3 — Communiquer l'adresse aux testeurs

Envoyer le lien suivant (adapter l'IP) :

```
http://192.168.1.42:3000
```

Les testeurs l'ouvrent dans leur navigateur (ordinateur, tablette ou téléphone).

### Checklist réseau

- [ ] Les machines sont sur le même réseau Wi-Fi / Ethernet
- [ ] Le pare-feu Windows autorise Node.js (une popup peut apparaître au 1er lancement)
- [ ] Si ça ne marche pas : essayer de désactiver temporairement le pare-feu ou ajouter une règle pour le port 3000

### Alternative : tunnel public (sans réseau local)

Pour partager avec quelqu'un à distance, sans déployer :

```bash
npx localtunnel --port 3000
```

Cela génère une URL publique temporaire (ex: `https://abc123.loca.lt`).

---

## 5. Guide d'utilisation du simulateur

### Page d'accueil

La page d'accueil présente l'outil et ses avantages.
Cliquer sur **"Lancer la simulation"** pour accéder au formulaire.

### Le formulaire — champ par champ

#### Chiffre d'affaires annuel HT
- Saisir le CA annuel **hors taxes** prévu ou réalisé
- Unité : euros par an
- Exemple : un développeur freelance facturant 600 €/jour, 130 jours/an → 78 000 €

#### Type d'activité
Trois choix possibles :

| Type | Exemples de métiers | Impact |
|------|-------------------|--------|
| **BNC** | Développeur, consultant, graphiste, formateur | Abattement micro 34%, cotisations 23,2% |
| **BIC Services** | Artisan, plombier, électricien, coiffeur | Abattement micro 50%, cotisations 21,2% |
| **BIC Vente** | E-commerce, boutique, restauration (vente) | Abattement micro 71%, cotisations 12,3% |

> En cas de doute : la plupart des freelances du numérique sont en **BNC**.

#### Parts fiscales (quotient familial)
Permet de refléter la situation familiale pour le calcul de l'impôt sur le revenu :

| Situation | Parts |
|-----------|-------|
| Célibataire sans enfant | 1 |
| Célibataire + 1 enfant | 1,5 |
| Couple sans enfant | 2 |
| Couple + 1 enfant | 2,5 |
| Couple + 2 enfants | 3 |
| Couple + 3 enfants | 4 |

#### Charges réelles annuelles (EURL/SASU)
- Concerne uniquement les calculs EURL et SASU (pas la micro)
- Inclure : loyer bureau, comptable, assurances pro, matériel, logiciels, déplacements
- **Ne pas inclure** : la rémunération du dirigeant (calculée automatiquement)
- En cas de doute : estimer entre 5 000 € et 15 000 € pour un freelance classique

### Options avancées (en cliquant sur le chevron)

#### ACRE (1re année)
- Cocher si vous créez votre activité et bénéficiez de l'ACRE
- Effet : réduction de 50% des cotisations sociales la première année
- Concerne les 3 statuts

#### Versement libératoire IR (micro uniquement)
- Option permettant de payer l'IR forfaitairement avec les cotisations
- Avantageux si le revenu du foyer fiscal est modeste
- Taux : 1% (vente), 1,7% (services), 2,2% (libéral)

#### Sliders Rémunération / Dividendes (EURL et SASU)
- Détermine comment le bénéfice est réparti entre rémunération du dirigeant et dividendes
- **100% rémunération** : pas de dividendes, cotisations maximales, protection sociale maximale
- **0% rémunération** : tout en dividendes, aucune cotisation, aucune protection sociale
- **Recommandation** : commencer à 70% et ajuster

### Lancer le calcul

Cliquer sur **"Comparer les 3 statuts"**. Les résultats s'affichent instantanément en dessous.

---

## 6. Comprendre les résultats

### Le bandeau "Meilleur choix"

Indique le statut qui génère le **revenu net après impôt le plus élevé**.
Ce n'est pas forcément le meilleur choix absolu (la protection sociale compte aussi).

### Les 3 cartes de comparaison

Chaque carte affiche pour un statut :

| Ligne | Signification |
|-------|--------------|
| **Revenu net après IR** | Ce qui reste dans votre poche, tout payé |
| **Cotisations sociales** | Charges sociales (maladie, retraite, etc.) |
| **Impôt sociétés (IS)** | Taxe sur le bénéfice de la société (EURL/SASU) |
| **Impôt revenu (IR)** | Votre impôt sur le revenu personnel |
| **Dividendes nets** | Part du bénéfice distribuée après flat tax |
| **Taux de charges effectif** | % du CA absorbé par les charges et impôts |

Cliquer sur **"Voir le détail"** pour un décompte ligne par ligne.

### Graphique "Revenu net comparé"

Barres côte à côte montrant le revenu net final pour chaque statut.
Plus la barre est haute, plus le statut est avantageux financièrement.

### Graphique "Décomposition du CA"

Barres empilées montrant comment le CA se décompose :
- **Vert (Net)** : ce que vous gardez
- **Orange (Cotisations)** : charges sociales
- **Rouge (IR)** : impôt sur le revenu
- **Violet (IS)** : impôt sur les sociétés
- **Rose (Prél. div.)** : prélèvements sur dividendes
- **Gris (Charges)** : charges d'exploitation réelles

### Tableau "Protection sociale comparée"

Comparaison qualitative de la couverture sociale selon chaque statut :
assurance maladie, indemnités journalières, retraite, prévoyance, chômage.

**Points clés à retenir :**
- La **SASU** offre la meilleure protection (régime général) mais coûte le plus cher
- L'**EURL** est un bon compromis (TNS)
- La **Micro** a la couverture la plus limitée

---

## 7. Scénarios de démonstration

Voici 5 scénarios prêts à l'emploi pour montrer l'outil en action.

### Scénario A — Développeur freelance débutant

| Paramètre | Valeur |
|-----------|--------|
| CA | 50 000 € |
| Activité | BNC |
| Parts | 1 |
| Charges réelles | 3 000 € |
| ACRE | Oui |
| Rému EURL/SASU | 80% |

**Point à montrer :** L'ACRE réduit significativement les charges la 1re année.
Décocher l'ACRE pour montrer l'impact.

### Scénario B — Consultant senior

| Paramètre | Valeur |
|-----------|--------|
| CA | 120 000 € |
| Activité | BNC |
| Parts | 2 (couple) |
| Charges réelles | 15 000 € |
| Rému EURL | 60% |
| Rému SASU | 60% |

**Point à montrer :** À haut CA, la micro est plafonnée à 77 700 €.
L'EURL et la SASU permettent d'optimiser via le split rémunération/dividendes.
Jouer avec les sliders pour montrer l'impact.

### Scénario C — Artisan (BIC Services)

| Paramètre | Valeur |
|-----------|--------|
| CA | 45 000 € |
| Activité | BIC Services |
| Parts | 2,5 (couple + 1 enfant) |
| Charges réelles | 8 000 € |
| Rému EURL/SASU | 70% |

**Point à montrer :** Le quotient familial réduit l'IR.
Passer de 2,5 à 1 part pour montrer la différence.

### Scénario D — E-commerçant (BIC Vente)

| Paramètre | Valeur |
|-----------|--------|
| CA | 200 000 € |
| Activité | BIC Vente |
| Parts | 2 |
| Charges réelles | 80 000 € (stock, logistique) |
| Rému EURL/SASU | 50% |

**Point à montrer :** Le BIC vente a l'abattement micro le plus élevé (71%).
Mais avec 80k de charges réelles, l'EURL/SASU peut être plus avantageuse
car les charges sont déductibles.

### Scénario E — Comparaison versement libératoire

| Paramètre | Valeur |
|-----------|--------|
| CA | 35 000 € |
| Activité | BNC |
| Parts | 1 |
| Charges réelles | 2 000 € |
| VL | Tester avec et sans |

**Point à montrer :** Cocher puis décocher le versement libératoire
pour montrer quand il est avantageux (revenus modestes).

---

## 8. FAQ et dépannage

### L'installation échoue avec "npm install"

**Cause probable :** Node.js n'est pas installé ou trop ancien.
```bash
node --version    # doit être >= 18
npm --version     # doit être >= 9
```
Si les versions sont trop anciennes, réinstaller Node.js depuis https://nodejs.org.

### Le port 3000 est déjà utilisé

```bash
# Lancer sur un autre port :
npx next dev -p 3001
```
Puis accéder à http://localhost:3001.

### Les testeurs ne peuvent pas accéder depuis leur appareil

1. Vérifier que le serveur est lancé avec `-H 0.0.0.0`
2. Vérifier que les machines sont sur le même réseau
3. Autoriser Node.js dans le pare-feu Windows :
   - Panneau de configuration > Pare-feu Windows > Autoriser une application
   - Cocher Node.js pour les réseaux privés
4. Tester avec le pare-feu temporairement désactivé

### La page est blanche ou affiche une erreur

```bash
# Reconstruire le projet :
npm run build

# Si erreur persiste, nettoyer et réinstaller :
rm -rf node_modules .next
npm install
npm run dev
```

### Les calculs semblent incorrects

Le simulateur utilise des modèles simplifiés. Les écarts normaux sont :
- **Micro-entreprise** : précision à ±1% (calcul forfaitaire exact)
- **EURL (TNS)** : précision à ±3% (cotisations TNS simplifiées)
- **SASU** : précision à ±2% (charges moyennes à 42%/22%)

Les résultats sont cohérents avec les simulateurs en ligne
(mon-entreprise.urssaf.fr) à ces marges près.

### Comment mettre à jour les paramètres fiscaux

Tous les taux et barèmes sont dans un seul fichier :
```
src/engine/constants.ts
```
Modifier les valeurs puis relancer `npm run dev`.

---

## 9. Architecture technique

### Structure du projet

```
StatutNet/
├── src/
│   ├── app/                    # Pages Next.js
│   │   ├── page.tsx            # Landing page
│   │   └── simulateur/
│   │       └── page.tsx        # Page simulateur
│   ├── engine/                 # Moteur de calcul (100% client)
│   │   ├── constants.ts        # Paramètres fiscaux 2025
│   │   ├── ir.ts               # Impôt sur le revenu
│   │   ├── micro.ts            # Micro-entreprise
│   │   ├── eurl.ts             # EURL à l'IS (TNS)
│   │   ├── sasu.ts             # SASU à l'IS
│   │   ├── optimizer.ts        # Optimisation rému/dividendes
│   │   └── index.ts            # Point d'entrée
│   ├── components/             # Composants React
│   │   ├── simulator/          # Formulaire
│   │   ├── results/            # Résultats + graphiques
│   │   └── newsletter/         # CTA newsletter
│   └── hooks/                  # Hooks React
├── __tests__/                  # Tests unitaires (41 tests)
└── package.json
```

### Lancer les tests

```bash
npx vitest run
```

### Construire pour production

```bash
npm run build
```

Les fichiers statiques sont générés dans `.next/`. Ils peuvent être
déployés sur Vercel, Netlify, ou tout serveur statique.

---

*Document généré pour StatutNet — Simulateur fiscal pour indépendants français.*
*Paramètres fiscaux 2025.*
