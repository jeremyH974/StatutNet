import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Seuil TVA auto-entrepreneur 2025 : tout comprendre en 5 minutes — StatutNet',
  description:
    'Franchise en base de TVA, seuils majorés, obligations déclaratives : le guide complet pour comprendre la TVA en auto-entrepreneur et micro-entreprise en 2025.',
  keywords: [
    'seuil TVA auto-entrepreneur 2025',
    'franchise en base TVA',
    'TVA micro-entreprise',
    'seuil majoré TVA',
    'dépassement seuil TVA',
    'auto-entrepreneur TVA',
  ],
};

export default function SeuilTvaPage() {
  return (
    <article className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-8">
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Seuil TVA auto-entrepreneur</span>
        </nav>

        <time className="text-sm text-muted">10 janvier 2025</time>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Seuil TVA auto-entrepreneur 2025 : tout comprendre en 5 minutes
        </h1>

        <div className="mt-8 space-y-6 text-foreground leading-relaxed">
          <p>
            En tant qu&apos;auto-entrepreneur (ou micro-entrepreneur), vous bénéficiez
            de la franchise en base de TVA : vous ne facturez pas la TVA à vos clients
            et vous ne la récupérez pas sur vos achats. Mais cette exonération a des
            limites. Dès que votre chiffre d&apos;affaires dépasse certains seuils, vous
            devez collecter et reverser la TVA. Voici tout ce qu&apos;il faut savoir sur
            les seuils 2025.
          </p>

          {/* Seuils de franchise */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Les seuils de franchise en base de TVA 2025
          </h2>

          <p>
            La franchise en base de TVA s&apos;applique automatiquement tant que votre
            chiffre d&apos;affaires annuel ne dépasse pas les seuils suivants :
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Type d&apos;activité</th>
                  <th className="text-right p-3 font-semibold text-foreground">Seuil de base</th>
                  <th className="text-right p-3 font-semibold text-foreground">Seuil majoré</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3">Prestations de services (BIC/BNC)</td>
                  <td className="p-3 text-right font-medium">37&nbsp;500&nbsp;&euro;</td>
                  <td className="p-3 text-right font-medium">41&nbsp;250&nbsp;&euro;</td>
                </tr>
                <tr>
                  <td className="p-3">Vente de marchandises</td>
                  <td className="p-3 text-right font-medium">85&nbsp;000&nbsp;&euro;</td>
                  <td className="p-3 text-right font-medium">93&nbsp;500&nbsp;&euro;</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            Le <strong>seuil de base</strong> est le plafond en dessous duquel vous
            bénéficiez de la franchise sans condition. Le <strong>seuil majoré</strong> est
            le plafond absolu : si vous le dépassez en cours d&apos;année, vous devez
            facturer la TVA dès le premier jour du mois de dépassement.
          </p>

          <p className="mt-2">
            <Link href="/simulateur?ca=45000&act=bnc" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors">
              Calcule ton résultat pour 45 000 € de CA →
            </Link>
          </p>
          <p>
            Entre les deux seuils, la règle est la suivante : si votre CA dépasse le seuil
            de base mais reste sous le seuil majoré, vous conservez la franchise pour
            l&apos;année en cours. En revanche, si vous dépassez le seuil de base deux
            années consécutives, vous perdez la franchise au 1er janvier de la troisième
            année.
          </p>

          {/* Que se passe-t-il au dépassement ? */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Que se passe-t-il quand vous dépassez le seuil ?
          </h2>

          <p>
            Le dépassement du seuil majoré entraîne une obligation immédiate. Vous devez :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              Demander un numéro de TVA intracommunautaire auprès de votre Service des
              Impôts des Entreprises (SIE).
            </li>
            <li>
              Facturer la TVA sur toutes vos prestations à compter du premier jour du mois
              de dépassement (taux de 20&nbsp;% en général, 10&nbsp;% ou 5,5&nbsp;% selon
              les activités).
            </li>
            <li>
              Déclarer et reverser la TVA collectée, soit mensuellement, soit
              trimestriellement selon votre régime (réel simplifié ou réel normal).
            </li>
            <li>
              Mettre à jour vos factures : mentions obligatoires du numéro de TVA, montant
              HT, taux et montant de TVA, montant TTC.
            </li>
          </ul>

          <p className="mt-4">
            En pratique, le passage à la TVA se fait souvent en milieu d&apos;année. Vous
            devrez émettre des factures rectificatives pour les prestations du mois de
            dépassement si elles ont été facturées sans TVA.
          </p>

          {/* Avantage ou inconvénient ? */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            TVA : un avantage ou un inconvénient ?
          </h2>

          <p>
            La TVA est souvent perçue comme une contrainte, mais elle peut aussi être un
            atout selon votre situation.
          </p>

          <p className="font-medium text-primary mt-4">Les avantages de la TVA</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <strong>Récupération de la TVA sur vos achats :</strong> matériel informatique,
              logiciels, déplacements, fournitures... vous récupérez 20&nbsp;% sur la plupart
              de vos dépenses professionnelles. Si vous avez des investissements importants,
              c&apos;est un gain réel.
            </li>
            <li>
              <strong>Compétitivité en B2B :</strong> vos clients professionnels déduisent la
              TVA de vos factures. Pour eux, votre prix HT est le vrai coût. Etre assujetti
              à la TVA n&apos;augmente donc pas votre tarif réel auprès des entreprises.
            </li>
            <li>
              <strong>Image professionnelle :</strong> certains clients considèrent
              l&apos;absence de TVA comme un signe d&apos;activité modeste. Facturer la TVA
              renforce votre crédibilité.
            </li>
          </ul>

          <p className="font-medium text-danger mt-4">Les inconvénients de la TVA</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <strong>Impact sur les clients particuliers :</strong> si vous travaillez en
              B2C, vos clients ne récupèrent pas la TVA. Votre tarif TTC augmente de
              20&nbsp;%, ce qui peut vous rendre moins compétitif.
            </li>
            <li>
              <strong>Charge administrative :</strong> déclarations de TVA régulières,
              gestion de la trésorerie (la TVA collectée n&apos;est pas votre argent), mise
              à jour des factures.
            </li>
            <li>
              <strong>Risque de trésorerie :</strong> vous devez reverser la TVA collectée
              même si vos clients n&apos;ont pas encore payé leurs factures.
            </li>
          </ul>

          {/* Anticiper le dépassement */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Comment anticiper le dépassement ?
          </h2>

          <p>Voici les bonnes pratiques pour ne pas être pris au dépourvu :</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Suivez votre CA en temps réel.</strong> Utilisez un tableur ou un
              outil de facturation qui affiche votre CA cumulé par rapport aux seuils.
            </li>
            <li>
              <strong>Provisionnez la TVA dès que vous approchez du seuil.</strong> Mettez
              de côté 20&nbsp;% de votre CA mensuel sur un compte dédié pour ne pas avoir
              de mauvaise surprise.
            </li>
            <li>
              <strong>Anticipez la demande de numéro de TVA.</strong> La démarche auprès du
              SIE peut prendre quelques jours. Ne la faites pas au dernier moment.
            </li>
            <li>
              <strong>Adaptez vos tarifs.</strong> Prévenez vos clients B2C que vos prix
              incluront la TVA et, si nécessaire, ajustez vos tarifs HT pour rester
              compétitif.
            </li>
            <li>
              <strong>Envisagez le passage en société.</strong> Si vous dépassez à la fois
              les seuils de TVA et les plafonds de la micro-entreprise, c&apos;est le moment
              de réfléchir à la création d&apos;une EURL ou d&apos;une SASU.
            </li>
          </ul>

          <p className="mt-2">
            <Link href="/simulateur?ca=80000&act=bic-s" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors">
              Simule à 80 000 € pour voir l&apos;impact →
            </Link>
          </p>

          {/* CTA */}
          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-foreground">
              Besoin de comparer micro-entreprise, EURL et SASU ?
            </p>
            <p className="text-sm text-muted mt-1">
              Simulez votre revenu net selon votre chiffre d&apos;affaires et vos charges
              réelles en quelques secondes.
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
              href="/blog/quitter-micro"
              className="block bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
            >
              <span className="text-xs text-muted">Article précédent</span>
              <span className="block mt-1 font-medium text-foreground">
                Quand quitter la micro-entreprise ? Les 5 signaux
              </span>
            </Link>
            <Link
              href="/blog/micro-vs-sasu"
              className="block bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
            >
              <span className="text-xs text-muted">A lire aussi</span>
              <span className="block mt-1 font-medium text-foreground">
                Micro-entreprise vs SASU : le comparatif complet 2025
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
