import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'À propos — StatutNet',
  description: 'StatutNet est un simulateur fiscal gratuit pour indépendants français. Découvrez notre mission et notre méthodologie.',
};

export default function AProposPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground">À propos de StatutNet</h1>

      <section className="mt-8 space-y-4 text-foreground leading-relaxed">
        <h2 className="text-xl font-semibold">Notre mission</h2>
        <p>
          Rendre l&apos;information fiscale accessible aux indépendants français.
          Trop de freelances, micro-entrepreneurs et dirigeants solo prennent des
          décisions de statut juridique sans avoir une vision claire de l&apos;impact
          financier. StatutNet corrige ça.
        </p>

        <h2 className="text-xl font-semibold mt-8">Comment ça fonctionne</h2>
        <p>
          StatutNet est un outil <strong>100% gratuit</strong>, <strong>sans inscription</strong>,
          et <strong>sans collecte de données</strong>. Tous les calculs sont effectués
          directement dans votre navigateur — aucune information n&apos;est envoyée à un serveur.
        </p>
        <p>
          Le simulateur compare trois statuts juridiques : Micro-entreprise, EURL à l&apos;IS
          et SASU à l&apos;IS, en utilisant les paramètres fiscaux officiels de 2025.
        </p>

        <h2 className="text-xl font-semibold mt-8">Qui sommes-nous</h2>
        <p>
          StatutNet est développé par des freelances, pour des freelances. Nous avons
          nous-mêmes été confrontés à la question du choix de statut et avons constaté
          qu&apos;il n&apos;existait pas d&apos;outil simple, transparent et gratuit pour comparer
          les options.
        </p>

        <h2 className="text-xl font-semibold mt-8">Sources et fiabilité</h2>
        <p>Les paramètres utilisés proviennent de sources officielles :</p>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Barème IR 2025 — service-public.fr</li>
          <li>Taux de cotisations URSSAF — urssaf.fr</li>
          <li>IS et flat tax — economie.gouv.fr</li>
          <li>Plafonds micro-entreprise — entreprendre.service-public.fr</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Avertissement</h2>
        <p className="text-muted">
          StatutNet est un outil indicatif. Les résultats sont des estimations basées
          sur des modèles simplifiés (précision ±2 à 3%). Ce simulateur ne constitue
          pas un conseil fiscal ou juridique. Pour une analyse personnalisée de votre
          situation, consultez un expert-comptable.
        </p>
      </section>

      <div className="mt-12">
        <Link href="/simulateur"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
          Lancer une simulation
        </Link>
      </div>
    </div>
  );
}
