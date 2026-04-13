import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Micro-entreprise vs SASU 2025 : le comparatif complet — StatutNet',
  description:
    'Charges sociales, fiscalité, protection sociale, dividendes : découvrez toutes les différences entre micro-entreprise et SASU pour choisir le meilleur statut en 2025.',
  keywords: [
    'micro-entreprise vs SASU',
    'comparatif statut juridique 2025',
    'SASU ou micro-entreprise',
    'charges sociales micro SASU',
    'freelance statut',
  ],
};

export default function MicroVsSasuPage() {
  return (
    <article className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-8">
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Micro-entreprise vs SASU</span>
        </nav>

        <time className="text-sm text-muted">15 mars 2025</time>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Micro-entreprise vs SASU : le comparatif complet 2025
        </h1>

        <div className="mt-8 space-y-6 text-foreground leading-relaxed">
          <p>
            Vous lancez votre activité ou vous envisagez de changer de statut juridique ?
            La micro-entreprise et la SASU sont les deux formes les plus populaires chez
            les indépendants en France. Pourtant, elles s&apos;adressent à des profils
            très différents. Dans ce guide, nous comparons en détail leurs avantages,
            limites et coûts réels pour vous aider à prendre la bonne décision en 2025.
          </p>

          {/* --- Différences fondamentales --- */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Les différences fondamentales
          </h2>

          <p>
            La micro-entreprise est un régime fiscal simplifié rattaché à l&apos;entreprise
            individuelle. Les cotisations sociales sont calculées sur le chiffre d&apos;affaires
            avec un taux forfaitaire (environ 21,1&nbsp;% pour les prestations de services BNC
            en 2025). Il n&apos;y a pas de comptabilité à tenir, pas de bilan annuel et les
            déclarations se font en quelques minutes chaque mois ou trimestre.
          </p>
          <p>
            La SASU (Société par Actions Simplifiée Unipersonnelle) est une société à part
            entière. Le dirigeant est assimilé salarié et bénéficie du régime général de la
            Sécurité sociale. Les cotisations patronales et salariales sur la rémunération
            atteignent environ 75 à 80&nbsp;% du salaire net versé, mais la société permet
            de déduire l&apos;ensemble des charges réelles et d&apos;optimiser via les
            dividendes soumis à la flat tax de 30&nbsp;%.
          </p>
          <p>
            En matière de comptabilité, la SASU impose la tenue d&apos;une comptabilité
            complète (bilan, compte de résultat, liasse fiscale) et le recours quasi
            systématique à un expert-comptable, soit un coût annuel de 1&nbsp;500 à
            3&nbsp;000&nbsp;euros.
          </p>

          {/* --- Micro : pour qui ? --- */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Micro-entreprise : pour qui ?
          </h2>

          <p className="font-medium text-primary">Avantages</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Création gratuite et en ligne en quelques minutes.</li>
            <li>Aucune comptabilité : un simple livre de recettes suffit.</li>
            <li>Cotisations proportionnelles au chiffre d&apos;affaires : pas de CA, pas de charges.</li>
            <li>Versement libératoire de l&apos;impôt sur le revenu possible sous conditions.</li>
            <li>Franchise en base de TVA jusqu&apos;à 37&nbsp;500&nbsp;euros (prestations de services).</li>
          </ul>

          <p className="font-medium text-danger mt-4">Limites</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Plafond de chiffre d&apos;affaires : 77&nbsp;700&nbsp;euros pour les services, 188&nbsp;700&nbsp;euros pour la vente.</li>
            <li>Impossibilité de déduire les charges réelles (loyer, matériel, sous-traitance).</li>
            <li>Protection sociale minimale (indemnités journalières faibles, pas de chômage).</li>
            <li>Patrimoine personnel exposé (sauf résidence principale).</li>
          </ul>

          <p className="mt-4">
            <span className="font-medium">Profil idéal :</span> freelance débutant ou en
            activité complémentaire, avec peu de charges professionnelles et un chiffre
            d&apos;affaires inférieur à 60&nbsp;000&nbsp;euros environ.
          </p>

          {/* --- SASU : pour qui ? --- */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            SASU : pour qui ?
          </h2>

          <p className="font-medium text-primary">Avantages</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Aucun plafond de chiffre d&apos;affaires.</li>
            <li>Déduction de toutes les charges réelles (matériel, déplacements, formations).</li>
            <li>Protection sociale du régime général (maladie, retraite, prévoyance).</li>
            <li>Optimisation rémunération + dividendes : les dividendes de SASU ne supportent que la flat tax de 30&nbsp;%, sans cotisations sociales supplémentaires.</li>
            <li>Crédibilité renforcée auprès des clients et partenaires.</li>
          </ul>

          <p className="font-medium text-danger mt-4">Limites</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Charges sociales élevées sur le salaire du dirigeant (environ 80&nbsp;% du net).</li>
            <li>Comptabilité complète obligatoire, coût d&apos;expert-comptable.</li>
            <li>Formalisme juridique (statuts, PV d&apos;assemblée, dépôt des comptes).</li>
            <li>Coût de création plus élevé (rédaction des statuts, immatriculation).</li>
          </ul>

          <p className="mt-4">
            <span className="font-medium">Profil idéal :</span> consultant ou freelance confirmé
            avec un CA supérieur à 50&nbsp;000&nbsp;euros, des charges déductibles significatives
            ou un besoin de couverture sociale solide.
          </p>

          <p className="mt-2">
            <Link href="/simulateur" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors">
              Compare avec ton CA réel →
            </Link>
          </p>

          {/* --- Comparaison chiffrée --- */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Comparaison chiffrée : 60&nbsp;000&nbsp;euros de CA
          </h2>

          <p>
            Prenons l&apos;exemple d&apos;un consultant en prestations de services BNC qui
            facture 60&nbsp;000&nbsp;euros de chiffre d&apos;affaires annuel, avec
            5&nbsp;000&nbsp;euros de charges professionnelles réelles.
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Poste</th>
                  <th className="text-right p-3 font-semibold text-foreground">Micro-entreprise</th>
                  <th className="text-right p-3 font-semibold text-foreground">SASU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3">Chiffre d&apos;affaires</td>
                  <td className="p-3 text-right">60&nbsp;000&nbsp;&euro;</td>
                  <td className="p-3 text-right">60&nbsp;000&nbsp;&euro;</td>
                </tr>
                <tr>
                  <td className="p-3">Charges réelles déduites</td>
                  <td className="p-3 text-right text-muted">Non déductibles</td>
                  <td className="p-3 text-right">- 5&nbsp;000&nbsp;&euro;</td>
                </tr>
                <tr>
                  <td className="p-3">Cotisations sociales</td>
                  <td className="p-3 text-right">- 12&nbsp;660&nbsp;&euro; (21,1&nbsp;%)</td>
                  <td className="p-3 text-right">~ - 18&nbsp;000&nbsp;&euro;*</td>
                </tr>
                <tr>
                  <td className="p-3">Impôt sur le revenu / IS + flat tax</td>
                  <td className="p-3 text-right">~ - 5&nbsp;500&nbsp;&euro;</td>
                  <td className="p-3 text-right">~ - 5&nbsp;200&nbsp;&euro;</td>
                </tr>
                <tr>
                  <td className="p-3">Comptabilité</td>
                  <td className="p-3 text-right">0&nbsp;&euro;</td>
                  <td className="p-3 text-right">- 2&nbsp;000&nbsp;&euro;</td>
                </tr>
                <tr className="font-semibold bg-surface">
                  <td className="p-3">Revenu net disponible (estimation)</td>
                  <td className="p-3 text-right text-success">~ 41&nbsp;800&nbsp;&euro;</td>
                  <td className="p-3 text-right text-success">~ 29&nbsp;800&nbsp;&euro;</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-2">
            * En SASU, le calcul suppose un mix rémunération + dividendes. Le résultat varie
            fortement selon la stratégie d&apos;optimisation. Utilisez le simulateur pour un
            calcul personnalisé.
          </p>

          <p className="mt-4">
            A ce niveau de CA, la micro-entreprise reste souvent plus avantageuse en revenu
            net, surtout lorsque les charges réelles sont faibles. La SASU devient intéressante
            au-delà de 70&nbsp;000 &ndash; 80&nbsp;000&nbsp;euros de CA ou lorsque les charges
            déductibles sont importantes.
          </p>

          <p className="mt-2">
            <Link href="/simulateur?ca=60000&act=bnc" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors">
              Simule ta situation à 60 000 € →
            </Link>
          </p>

          {/* --- Comment choisir ? --- */}
          <h2 className="text-2xl font-bold text-foreground pt-4">
            Comment choisir ?
          </h2>

          <p>Posez-vous ces questions clés :</p>
          <ul className="list-disc pl-6 space-y-2 text-sm mt-2">
            <li>
              <span className="font-medium">Quel est votre CA prévisionnel ?</span> En dessous
              de 50&nbsp;000&nbsp;euros avec peu de charges, la micro-entreprise est presque
              toujours gagnante.
            </li>
            <li>
              <span className="font-medium">Avez-vous des charges déductibles importantes ?</span> Si
              vos charges dépassent l&apos;abattement forfaitaire (34&nbsp;% en BNC, 50&nbsp;% en BIC
              services), la société devient pertinente.
            </li>
            <li>
              <span className="font-medium">La protection sociale est-elle prioritaire ?</span> Le
              régime général de la SASU offre une couverture bien supérieure, notamment en cas
              d&apos;arrêt maladie.
            </li>
            <li>
              <span className="font-medium">Envisagez-vous de lever des fonds ou d&apos;embaucher ?</span> Seule
              la société permet d&apos;accueillir des associés et de recruter facilement.
            </li>
          </ul>

          <p className="mt-4">
            Le choix n&apos;est jamais définitif. Beaucoup d&apos;indépendants démarrent en
            micro-entreprise pour sa simplicité, puis migrent vers la SASU lorsque leur
            activité se développe. L&apos;important est de prendre une décision éclairée à
            chaque étape.
          </p>

          {/* CTA */}
          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-foreground">
              Vous hésitez encore entre micro-entreprise et SASU ?
            </p>
            <p className="text-sm text-muted mt-1">
              Entrez votre chiffre d&apos;affaires et vos charges pour obtenir une
              comparaison personnalisée en quelques secondes.
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
              <span className="text-xs text-muted">Article suivant</span>
              <span className="block mt-1 font-medium text-foreground">
                Quand quitter la micro-entreprise ? Les 5 signaux
              </span>
            </Link>
            <Link
              href="/blog/seuil-tva"
              className="block bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
            >
              <span className="text-xs text-muted">A lire aussi</span>
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
