import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — StatutNet',
  description:
    'Guides pratiques et articles pour choisir le bon statut juridique : micro-entreprise, EURL, SASU, TVA, fiscalité des indépendants.',
  keywords: [
    'blog statut juridique',
    'micro-entreprise',
    'SASU',
    'EURL',
    'TVA auto-entrepreneur',
    'freelance France',
  ],
};

const ARTICLES = [
  {
    slug: 'micro-vs-sasu',
    date: '15 mars 2025',
    title: 'Micro-entreprise vs SASU : le comparatif complet 2025',
    excerpt:
      'Charges sociales, fiscalité, protection sociale, dividendes : toutes les différences entre micro-entreprise et SASU pour faire le bon choix.',
  },
  {
    slug: 'quitter-micro',
    date: '20 février 2025',
    title: 'Quand quitter la micro-entreprise ? Les 5 signaux',
    excerpt:
      'Plafonds de CA, charges réelles, protection sociale... Découvrez les 5 signaux qui indiquent qu\'il est temps de changer de statut.',
  },
  {
    slug: 'seuil-tva',
    date: '10 janvier 2025',
    title: 'Seuil TVA auto-entrepreneur 2025 : tout comprendre',
    excerpt:
      'Franchise en base, seuils majorés, obligations déclaratives : le guide complet de la TVA pour les auto-entrepreneurs en 2025.',
  },
];

export default function BlogPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Blog</h1>
        <p className="mt-3 text-lg text-muted max-w-2xl">
          Guides pratiques pour comprendre les statuts juridiques, la fiscalité
          et les cotisations sociales des indépendants en France.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <article
              key={a.slug}
              className="bg-surface border border-border rounded-xl p-6 flex flex-col"
            >
              <time className="text-sm text-muted">{a.date}</time>
              <h2 className="mt-2 text-lg font-semibold text-foreground leading-snug">
                {a.title}
              </h2>
              <p className="mt-2 text-sm text-muted flex-1">{a.excerpt}</p>
              <Link
                href={`/blog/${a.slug}`}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Lire l&apos;article &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
