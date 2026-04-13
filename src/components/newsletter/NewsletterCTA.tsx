'use client';

import { useState } from 'react';
import { addContactToBrevo } from '@/lib/brevo';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setStatus('error');
      setErrorMsg('Adresse email invalide.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const result = await addContactToBrevo(email);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(result.error ?? 'Une erreur est survenue.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-success">
            <circle cx="11" cy="11" r="11" fill="currentColor" opacity="0.15" />
            <path d="M7 11.5l2.5 2.5L15 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-lg font-semibold text-primary-dark">
            C&apos;est noté !
          </p>
        </div>
        <p className="text-sm text-muted mt-1">
          Tu recevras la prochaine édition directement dans ta boîte.
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
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="votre@email.fr"
            required
            disabled={status === 'loading'}
            className="flex-1 px-3 py-2.5 border border-border rounded-lg bg-background
                       text-foreground placeholder:text-muted/60
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-all text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium text-sm
                       hover:bg-accent-dark transition-colors whitespace-nowrap
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center gap-2"
          >
            {status === 'loading' && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            S&apos;inscrire
          </button>
        </div>
        {status === 'error' && errorMsg && (
          <p className="text-xs text-danger mt-2">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}
