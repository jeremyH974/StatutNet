'use client';

import Link from 'next/link';

const PARTNERS = [
  {
    name: 'Dougs',
    description: 'Expert-comptable 100% en ligne pour indépendants',
    price: 'À partir de 49€/mois',
    features: ['Comptabilité', 'Déclarations', 'Conseil juridique'],
    cta: 'Découvrir Dougs',
    href: '#',
  },
  {
    name: 'Keobiz',
    description: 'Cabinet digital pour freelances et TPE',
    price: 'À partir de 69€/mois',
    features: ['Bilan', 'Liasses fiscales', 'Conseil fiscal'],
    cta: 'Découvrir Keobiz',
    href: '#',
  },
  {
    name: 'Indy',
    description: 'Comptabilité automatisée pour indépendants',
    price: 'À partir de 22€/mois',
    features: ['Saisie automatique', 'Déclarations', 'TVA'],
    cta: 'Découvrir Indy',
    href: '#',
  },
];

// metadata doit être dans un layout.tsx (server component)
// title géré via la balise <title> directement si besoin

export default function ExpertsPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-center">
          Trouvez l&apos;expert-comptable qui vous correspond
        </h1>
        <p className="mt-4 text-lg text-muted text-center max-w-2xl mx-auto">
          Une sélection de partenaires spécialisés en création d&apos;entreprise
          et en accompagnement des indépendants. Comparez leurs offres et
          choisissez celui qui correspond à vos besoins.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="rounded-2xl border border-border bg-surface p-6 flex flex-col"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {partner.name}
              </h2>
              <p className="mt-2 text-muted text-sm leading-relaxed">
                {partner.description}
              </p>
              <p className="mt-4 text-lg font-bold text-primary">
                {partner.price}
              </p>

              <ul className="mt-4 space-y-2 flex-1">
                {partner.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-success shrink-0"
                    >
                      <path
                        d="M3 8.5l3 3 7-7"
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

              <a
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
              >
                {partner.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted max-w-xl mx-auto">
          Ces partenariats nous permettent de financer StatutNet. Nous ne
          recommandons que des services que nous avons vérifiés.
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/simulateur"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
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
            Retour au simulateur
          </Link>
        </div>
      </div>
    </section>
  );
}
