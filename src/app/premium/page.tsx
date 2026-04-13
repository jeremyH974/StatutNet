'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { addContactToBrevo } from '@/lib/brevo';

const FEATURES = [
  'Comparaison détaillée des 3 statuts personnalisée à votre situation',
  'Simulation sur 5 ans avec projection de croissance',
  'Recommandation argumentée du statut optimal',
  'Conseils d\'optimisation fiscale (split rémunération/dividendes)',
  'Analyse de la protection sociale et des risques',
  'Livré en PDF par email sous 24h',
];

const FAQ = [
  {
    q: 'En quoi le rapport est-il différent du simulateur gratuit ?',
    a: 'Le simulateur donne une estimation instantanée. Le rapport premium inclut une projection sur 5 ans, des scénarios de croissance personnalisés, et des recommandations contextualisées que l\'algorithme seul ne peut pas fournir.',
  },
  {
    q: 'Qui rédige le rapport ?',
    a: 'Le rapport est généré automatiquement à partir de vos données, puis vérifié par notre équipe. Il ne remplace pas un avis d\'expert-comptable mais constitue une base solide pour votre réflexion.',
  },
  {
    q: 'Puis-je être remboursé ?',
    a: 'Oui, satisfait ou remboursé sous 30 jours, sans condition. Envoyez un simple email.',
  },
];

export default function PremiumPageWrapper() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted">Chargement...</div>}>
      <PremiumPage />
    </Suspense>
  );
}

function PremiumPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const searchParams = useSearchParams();

  const hasStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  // Détecter le retour de Stripe Checkout
  useEffect(() => {
    if (searchParams.get('session_id')) {
      setStatus('success');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;

    setStatus('loading');

    if (hasStripe) {
      // Appeler l'API Route pour créer une session Stripe Checkout
      try {
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        setStatus('error');
      } catch {
        setStatus('error');
      }
      return;
    }

    // Mode pré-commande (Stripe non configuré) : enregistrer l'email via Brevo
    const result = await addContactToBrevo(email);
    setStatus(result.success ? 'success' : 'error');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Rapport fiscal personnalisé
        </h1>
        <p className="mt-3 text-lg text-muted max-w-xl mx-auto">
          Recevez une analyse détaillée de votre situation avec des recommandations concrètes.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pricing card */}
        <div className="bg-surface border border-primary/20 rounded-2xl p-8 ring-2 ring-primary/10">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">19 €</span>
            <span className="text-muted">paiement unique</span>
          </div>

          <ul className="mt-6 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-success mt-0.5 flex-shrink-0">
                  <path d="M4 8.5l2.5 2.5L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Formulaire */}
          {status === 'success' ? (
            <div className="mt-6 bg-success/10 border border-success/20 rounded-lg p-4 text-center">
              {searchParams.get('session_id') ? (
                <>
                  <p className="text-sm font-semibold text-success">Paiement confirmé !</p>
                  <p className="text-xs text-muted mt-1">
                    Votre rapport fiscal personnalisé arrive par email sous 24h.
                    Vérifiez vos spams si nécessaire.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-success">Pré-commande enregistrée !</p>
                  <p className="text-xs text-muted mt-1">
                    Nous vous contacterons dès que le service sera disponible.
                  </p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground
                           focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm
                           hover:bg-primary-dark transition-colors disabled:opacity-50
                           flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>Traitement...</>
                ) : hasStripe ? 'Commander mon rapport' : 'Pré-commander (bientôt disponible)'}
              </button>
              {status === 'error' && (
                <p className="text-xs text-danger text-center">Une erreur est survenue. Réessayez.</p>
              )}
            </form>
          )}

          {hasStripe && (
            <p className="mt-3 text-xs text-muted text-center">Paiement sécurisé par Stripe</p>
          )}
        </div>

        {/* Trust + FAQ */}
        <div className="space-y-6">
          {/* Trust elements */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Garanties</h3>
            {[
              { icon: '🔒', text: 'Données confidentielles — rien n\'est partagé' },
              { icon: '↩️', text: 'Satisfait ou remboursé sous 30 jours' },
              { icon: '📧', text: 'Support par email en moins de 24h' },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2 text-sm text-muted">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Questions fréquentes</h3>
            {FAQ.map((item) => (
              <details key={item.q} className="group">
                <summary className="cursor-pointer text-sm font-medium text-foreground list-none flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"
                    className="transition-transform group-open:rotate-90 text-muted flex-shrink-0">
                    <path d="M5 3l4 4-4 4" />
                  </svg>
                  {item.q}
                </summary>
                <p className="mt-2 pl-5 text-xs text-muted leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Link back */}
      <div className="mt-12 text-center">
        <Link href="/simulateur" className="text-sm text-primary hover:text-primary-dark transition-colors">
          ← Retour au simulateur gratuit
        </Link>
      </div>
    </div>
  );
}
