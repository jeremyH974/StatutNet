'use client';

import Link from 'next/link';

const FEATURES = [
  'Comparaison détaillée des 3 statuts',
  'Simulation sur 5 ans',
  'Recommandation personnalisée',
  "Conseils d'optimisation fiscale",
  'Livré en PDF par email',
];

const TRUST = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10 2l2.5 5.5L18 8.5l-4 4 1 5.5L10 15.5 4.5 18l1-5.5-4-4 5.5-1z" />
      </svg>
    ),
    text: 'Satisfait ou remboursé sous 30 jours',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="8" width="14" height="9" rx="2" />
        <path d="M7 8V5a3 3 0 016 0v3" />
      </svg>
    ),
    text: 'Données confidentielles et sécurisées',
  },
];

export default function PremiumPage() {
  const stripeKey = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : undefined;

  function handleOrder() {
    alert(
      'Stripe sera connecté prochainement. Contactez-nous pour un rapport personnalisé.'
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-center">
          Rapport fiscal personnalisé
        </h1>
        <p className="mt-4 text-lg text-muted text-center max-w-xl mx-auto">
          Recevez une analyse détaillée de votre situation avec des
          recommandations concrètes pour optimiser votre fiscalité.
        </p>

        {/* Pricing card */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 sm:p-10">
          <div className="text-center">
            <p className="text-sm font-medium text-muted uppercase tracking-wide">
              Paiement unique
            </p>
            <p className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold text-foreground">19€</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Sans abonnement, sans engagement
            </p>
          </div>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="text-success shrink-0 mt-0.5"
                >
                  <path
                    d="M3.5 9.5l3.5 3.5 7.5-7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={handleOrder}
            className="mt-8 w-full rounded-lg bg-accent px-4 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            Commander mon rapport
          </button>

          {stripeKey && (
            <p className="mt-3 text-center text-xs text-muted flex items-center justify-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <rect x="2" y="6" width="10" height="6" rx="1.5" />
                <path d="M4.5 6V4a2.5 2.5 0 015 0v2" />
              </svg>
              Paiement sécurisé par Stripe
            </p>
          )}
        </div>

        {/* Trust elements */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          {TRUST.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-sm text-muted"
            >
              <span className="text-primary">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* Free version link */}
        <div className="mt-12 rounded-xl border border-border bg-background p-6 text-center">
          <p className="text-sm text-muted">
            Pas encore prêt ? Essayez d&apos;abord notre simulateur gratuit.
          </p>
          <Link
            href="/simulateur"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M10 2L4 8l6 6" />
            </svg>
            Accéder au simulateur gratuit
          </Link>
        </div>
      </div>
    </section>
  );
}
