import Link from 'next/link';
import { MiniSimulator } from '@/components/simulator/MiniSimulator';

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: '3 statuts comparés',
    description: 'Micro-entreprise, EURL à l\'IS et SASU à l\'IS côte à côte.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
    title: 'Résultat instantané',
    description: '100% côté navigateur. Aucune donnée envoyée, aucun compte requis.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Paramètres 2025',
    description: 'Barème IR, taux URSSAF, IS, flat tax — à jour pour 2025.',
  },
];

const STATUSES = [
  {
    name: 'Micro-entreprise',
    pros: ['Simplicité maximale', 'Pas de comptabilité', 'Charges forfaitaires'],
    cons: ['Plafond de CA', 'Pas de déduction de charges', 'Protection sociale limitée'],
  },
  {
    name: 'EURL à l\'IS',
    pros: ['Déduction des charges réelles', 'Optimisation rémunération/dividendes', 'Pas de plafond de CA'],
    cons: ['Comptabilité obligatoire', 'Cotisations TNS à calculer', 'Formalisme juridique'],
  },
  {
    name: 'SASU à l\'IS',
    pros: ['Meilleure protection sociale', 'Dividendes sans cotisations sociales', 'Flexibilité statutaire'],
    cons: ['Charges sociales élevées sur salaire', 'Comptabilité obligatoire', 'Coût de gestion'],
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary-light/10 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
            Quel statut pour{' '}
            <span className="text-primary">maximiser</span>
            <br />
            votre revenu net ?
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Comparez votre revenu disponible en Micro-entreprise, EURL et SASU
            en 30 secondes. Gratuit, sans inscription, 100% confidentiel.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/simulateur"
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold text-lg
                         hover:bg-primary-dark active:scale-[0.98] transition-all
                         shadow-lg shadow-primary/20"
            >
              Lancer la simulation
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            Paramètres fiscaux 2025 &middot; Calcul instantané &middot; Aucune donnée stockée
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted mt-1">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini simulator widget */}
      <section className="py-12">
        <div className="max-w-md mx-auto px-4">
          <MiniSimulator />
        </div>
      </section>

      {/* Status comparison preview */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Les 3 statuts en un coup d&apos;oeil
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATUSES.map((s) => (
              <div key={s.name} className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-bold text-lg text-foreground mb-4">{s.name}</h3>
                <div className="space-y-2">
                  {s.pros.map((p) => (
                    <div key={p} className="flex items-start gap-2 text-sm">
                      <span className="text-success mt-0.5">+</span>
                      <span>{p}</span>
                    </div>
                  ))}
                  {s.cons.map((c) => (
                    <div key={c} className="flex items-start gap-2 text-sm">
                      <span className="text-danger mt-0.5">&minus;</span>
                      <span className="text-muted">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/simulateur"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold
                         hover:bg-primary-dark transition-colors"
            >
              Simuler avec vos chiffres
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
