import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quand quitter la micro-entreprise ? Les 5 signaux d\'alerte — StatutNet',
  description:
    'Plafonds de CA, charges réelles, protection sociale, fiscalité : découvrez les 5 signaux qui indiquent qu\'il est temps de quitter la micro-entreprise pour une EURL ou SASU.',
  keywords: [
    'quitter micro-entreprise',
    'changer statut juridique',
    'passer en SASU',
    'passer en EURL',
    'plafond micro-entreprise 2025',
    'sortie micro-entreprise',
  ],
};

export default function QuitterMicroPage() {
  return (
    <article className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-8">
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Quitter la micro-entreprise</span>
        </nav>

        <time className="text-sm text-muted">20 février 2025</time>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Quand quitter la micro-entreprise ? Les 5 signaux d&apos;alerte
        </h1>

        <div className="mt-8 space-y-6 text-foreground leading-relaxed">
          <p>
            La micro-entreprise est le régime idéal pour démarrer une activité indépendante.
            Mais à mesure que votre chiffre d&apos;affaires progresse et que vos besoins
            évoluent, ce cadre simplifié peut devenir un frein. Voici les cinq signaux
            concrets qui indiquent qu&apos;il est temps de passer à une société (EURL ou SASU).
          </p>

          {/* Signal 1 */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Signal 1 : Vous approchez des plafonds de CA
          </h2>
          <p>
            En 2025, les plafonds de la micro-entreprise sont fixés à
            <strong> 77&nbsp;700&nbsp;euros</strong> pour les prestations de services (BIC et BNC)
            et <strong>188&nbsp;700&nbsp;euros</strong> pour les activités de vente de
            marchandises. Si vous dépassez ces seuils deux années consécutives, vous basculez
            automatiquement au régime réel d&apos;imposition.
          </p>
          <p>
            Anticiper ce dépassement est essentiel. Un passage subi au régime réel sans avoir
            créé de société signifie une imposition en entreprise individuelle classique, sans
            les avantages de la SASU ou de l&apos;EURL (pas d&apos;optimisation
            rémunération/dividendes, responsabilité illimitée). Si votre CA dépasse
            60&nbsp;000&nbsp;euros en services et continue de croître, il est temps de
            préparer la transition.
          </p>

          <p className="mt-2">
            <Link href="/simulateur?ca=75000&act=bnc" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors">
              Simule à 75 000 € →
            </Link>
          </p>

          {/* Signal 2 */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Signal 2 : Vos charges réelles dépassent l&apos;abattement forfaitaire
          </h2>
          <p>
            En micro-entreprise, l&apos;administration applique un abattement forfaitaire sur
            votre CA pour calculer votre revenu imposable : 34&nbsp;% pour les BNC, 50&nbsp;%
            pour les BIC services et 71&nbsp;% pour la vente. Cet abattement est censé
            représenter vos charges professionnelles.
          </p>
          <p>
            Si vos charges réelles (loyer de bureau, matériel, logiciels, sous-traitance,
            déplacements) dépassent ce forfait, vous payez des impôts et des cotisations
            sur un revenu fictif supérieur à votre revenu réel. Par exemple, un consultant BNC
            avec 60&nbsp;000&nbsp;euros de CA et 25&nbsp;000&nbsp;euros de charges réelles est
            imposé sur 39&nbsp;600&nbsp;euros en micro (abattement de 34&nbsp;%), alors que son
            bénéfice réel n&apos;est que de 35&nbsp;000&nbsp;euros. En société, il pourrait
            déduire l&apos;intégralité de ses charges.
          </p>

          {/* Signal 3 */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Signal 3 : Vous avez besoin d&apos;une meilleure protection sociale
          </h2>
          <p>
            Le micro-entrepreneur relève du régime des indépendants. Les indemnités
            journalières en cas d&apos;arrêt maladie sont faibles et calculées sur les
            revenus déclarés. Il n&apos;y a pas de droit au chômage, et la retraite de base
            reste modeste.
          </p>
          <p>
            En SASU, le dirigeant est assimilé salarié et bénéficie du régime général de la
            Sécurité sociale : meilleures indemnités maladie, couverture prévoyance plus
            complète et validation de trimestres de retraite dans les mêmes conditions
            qu&apos;un salarié. Si vous avez une famille à charge, un crédit immobilier ou
            simplement un besoin de sécurité financière, cette protection peut justifier à
            elle seule le passage en société.
          </p>

          {/* Signal 4 */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Signal 4 : Vous souhaitez optimiser votre fiscalité via les dividendes
          </h2>
          <p>
            En micro-entreprise, la totalité de votre revenu est soumise aux cotisations
            sociales. Il n&apos;existe aucun levier d&apos;optimisation : vous ne pouvez pas
            choisir de vous verser une partie en dividendes.
          </p>
          <p>
            En SASU à l&apos;IS, vous pouvez arbitrer entre rémunération (soumise aux
            cotisations sociales d&apos;environ 80&nbsp;%) et dividendes (soumis uniquement
            à la flat tax de 30&nbsp;%, sans cotisations sociales). Cet arbitrage permet de
            réduire significativement le coût total des prélèvements obligatoires, surtout
            lorsque le bénéfice de la société est élevé. L&apos;EURL à l&apos;IS offre
            également cette possibilité, mais attention : les dividendes dépassant 10&nbsp;%
            du capital social sont soumis aux cotisations sociales TNS.
          </p>

          <p className="mt-2">
            <Link href="/simulateur?ca=90000&act=bnc&ch=10000" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors">
              Compare micro vs EURL à 90 000 € →
            </Link>
          </p>

          {/* Signal 5 */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Signal 5 : Vous voulez embaucher ou lever des fonds
          </h2>
          <p>
            La micro-entreprise est par nature une activité individuelle. Vous pouvez faire
            appel à des sous-traitants, mais embaucher un salarié en micro est
            administrativement lourd et rarement recommandé.
          </p>
          <p>
            Si vous envisagez de recruter, d&apos;accueillir un associé ou de lever des
            fonds auprès d&apos;investisseurs, la création d&apos;une société est
            indispensable. La SASU offre la plus grande flexibilité statutaire : vous pouvez
            émettre des actions, créer différentes catégories de titres et faire entrer des
            investisseurs sans modifier la structure de la société.
          </p>

          {/* Vers quel statut migrer ? */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Vers quel statut migrer ?
          </h2>
          <p>
            Le choix entre EURL et SASU dépend de votre situation personnelle et de vos
            priorités. Voici un arbre de décision simplifié :
          </p>

          <div className="bg-surface border border-border rounded-xl p-6 mt-4 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-foreground">Votre priorité est la protection sociale ?</p>
              <p className="text-muted mt-1">
                &rarr; Privilégiez la <strong>SASU</strong>. Le dirigeant assimilé salarié
                bénéficie du régime général.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Votre priorité est de minimiser les charges sociales ?</p>
              <p className="text-muted mt-1">
                &rarr; Privilégiez l&apos;<strong>EURL</strong>. Les cotisations TNS sont
                globalement moins élevées que les cotisations du régime général.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Vous souhaitez des dividendes sans cotisations sociales ?</p>
              <p className="text-muted mt-1">
                &rarr; Privilégiez la <strong>SASU</strong>. Les dividendes ne supportent que
                la flat tax de 30&nbsp;%.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Vous voulez embaucher ou lever des fonds ?</p>
              <p className="text-muted mt-1">
                &rarr; La <strong>SASU</strong> offre plus de flexibilité pour accueillir des
                investisseurs.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Vous cherchez le coût de gestion le plus bas ?</p>
              <p className="text-muted mt-1">
                &rarr; L&apos;<strong>EURL</strong> est souvent moins coûteuse en formalisme
                et en charges de fonctionnement.
              </p>
            </div>
          </div>

          <p className="mt-4">
            Dans tous les cas, ne tardez pas trop. La transition prend plusieurs semaines
            (rédaction des statuts, immatriculation, transfert de clientèle) et il vaut mieux
            l&apos;anticiper que la subir lorsque vous dépasserez les plafonds.
          </p>

          {/* CTA */}
          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-foreground">
              Quel serait votre revenu net en EURL ou en SASU ?
            </p>
            <p className="text-sm text-muted mt-1">
              Comparez les trois statuts avec vos propres chiffres en quelques secondes.
            </p>
            <Link
              href="/simulateur"
              className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold
                         hover:bg-primary-dark transition-colors"
            >
              Simulez votre situation exacte
            </Link>
          </div>

          {/* Navigation inter-articles */}
          <nav className="mt-12 border-t border-border pt-8 grid sm:grid-cols-2 gap-4">
            <Link
              href="/blog/micro-vs-sasu"
              className="block bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
            >
              <span className="text-xs text-muted">Article précédent</span>
              <span className="block mt-1 font-medium text-foreground">
                Micro-entreprise vs SASU : le comparatif complet 2025
              </span>
            </Link>
            <Link
              href="/blog/seuil-tva"
              className="block bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
            >
              <span className="text-xs text-muted">Article suivant</span>
              <span className="block mt-1 font-medium text-foreground">
                Seuil TVA auto-entrepreneur 2025 : tout comprendre
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
