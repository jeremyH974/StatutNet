import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Comment ça marche — StatutNet',
  description: 'Découvrez la méthodologie du simulateur StatutNet : barème IR, cotisations sociales, IS et comparaison des 3 statuts juridiques.',
};

const STEPS = [
  {
    number: '1',
    title: 'Saisissez votre CA',
    description: 'Indiquez votre chiffre d\'affaires annuel HT, votre type d\'activité (BNC, BIC services, BIC vente) et votre situation familiale.',
  },
  {
    number: '2',
    title: 'Comparez les 3 statuts',
    description: 'Le simulateur calcule instantanément votre revenu net disponible en Micro-entreprise, EURL à l\'IS et SASU à l\'IS.',
  },
  {
    number: '3',
    title: 'Décidez en connaissance de cause',
    description: 'Visualisez les écarts, explorez le split rémunération/dividendes optimal, et comparez la protection sociale.',
  },
];

export default function CommentCaMarchePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground">Comment ça marche</h1>
      <p className="mt-3 text-muted">
        StatutNet compare votre revenu net disponible selon 3 statuts juridiques,
        en 3 étapes simples.
      </p>

      {/* 3 étapes */}
      <div className="mt-10 space-y-6">
        {STEPS.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
              {step.number}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Méthodologie */}
      <section className="mt-12 space-y-4 text-foreground leading-relaxed">
        <h2 className="text-xl font-semibold">Méthodologie de calcul</h2>

        <h3 className="font-semibold mt-4">Micro-entreprise</h3>
        <p className="text-sm text-muted">
          Cotisations sociales forfaitaires sur le CA (23,2% BNC, 21,2% BIC services, 12,3% BIC vente).
          Impôt sur le revenu calculé après abattement forfaitaire (34%, 50% ou 71% selon l&apos;activité).
          Option versement libératoire disponible.
        </p>

        <h3 className="font-semibold mt-4">EURL à l&apos;IS</h3>
        <p className="text-sm text-muted">
          Rémunération du gérant soumise aux cotisations TNS (calcul détaillé avec taux progressifs :
          maladie, retraite de base et complémentaire, invalidité-décès, allocations familiales, CSG/CRDS).
          IS sur le bénéfice (15% jusqu&apos;à 42 500€, 25% au-delà). Dividendes soumis à la flat tax 30%
          ou au barème IR avec abattement 40%. Cotisations TNS sur les dividendes excédant 10% du capital social.
        </p>

        <h3 className="font-semibold mt-4">SASU à l&apos;IS</h3>
        <p className="text-sm text-muted">
          Salaire du président soumis aux charges patronales (~42%) et salariales (~22%).
          IS identique à l&apos;EURL. Dividendes non soumis aux cotisations sociales (uniquement flat tax ou barème IR).
          Meilleure protection sociale (régime général).
        </p>

        <h3 className="font-semibold mt-4">Impôt sur le revenu</h3>
        <p className="text-sm text-muted">
          Barème progressif 2025 en 5 tranches (0% à 45%). Application du quotient familial
          avec plafonnement (1 791€ par demi-part supplémentaire). Décote pour les revenus modestes.
          Abattement de 10% sur les salaires et rémunérations.
        </p>
      </section>

      {/* Limites */}
      <section className="mt-10 bg-surface border border-border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">Limites du simulateur</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>Les cotisations TNS (EURL) utilisent un modèle simplifié — précision ±3%</li>
          <li>Les charges SASU sont des taux moyens — précision ±2%</li>
          <li>La CFE, CVAE et taxe sur les salaires ne sont pas prises en compte</li>
          <li>Les professions libérales réglementées (CIPAV) ne sont pas gérées</li>
          <li>Ce simulateur ne constitue pas un conseil fiscal — consultez un expert-comptable</li>
        </ul>
      </section>

      <div className="mt-10">
        <Link href="/simulateur"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
          Lancer une simulation
        </Link>
      </div>
    </div>
  );
}
