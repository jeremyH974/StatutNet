'use client';

import { useState } from 'react';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to newsletter provider (Mailchimp, Brevo, etc.)
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
        <p className="text-lg font-semibold text-primary-dark">Merci !</p>
        <p className="text-sm text-muted mt-1">
          Vous recevrez nos conseils pour optimiser votre statut.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground">
        Recevez nos conseils d&apos;optimisation
      </h3>
      <p className="text-sm text-muted mt-1">
        Un email par semaine avec des astuces fiscales pour indépendants. Pas de spam.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          required
          className="flex-1 px-3 py-2.5 border border-border rounded-lg bg-background
                     text-foreground placeholder:text-muted/60
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                     transition-all text-sm"
        />
        <button
          type="submit"
          className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium text-sm
                     hover:bg-accent-dark transition-colors whitespace-nowrap"
        >
          S&apos;inscrire
        </button>
      </form>
    </div>
  );
}
