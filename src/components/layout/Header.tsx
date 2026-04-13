'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-dark">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-primary">
            <rect x="2" y="8" width="7" height="18" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="10.5" y="4" width="7" height="22" rx="1.5" fill="currentColor" opacity="0.7" />
            <rect x="19" y="2" width="7" height="24" rx="1.5" fill="currentColor" />
          </svg>
          StatutNet
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/simulateur" className="text-muted hover:text-foreground transition-colors">
            Simulateur
          </Link>
          <Link
            href="/simulateur"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Comparer les statuts
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-3">
          <Link
            href="/simulateur"
            className="block text-muted hover:text-foreground"
            onClick={() => setMenuOpen(false)}
          >
            Simulateur
          </Link>
          <Link
            href="/simulateur"
            className="block bg-primary text-white px-4 py-2 rounded-lg text-center font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Comparer les statuts
          </Link>
        </div>
      )}
    </header>
  );
}
