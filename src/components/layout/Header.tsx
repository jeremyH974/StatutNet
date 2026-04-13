'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button onClick={toggle} aria-label="Basculer le thème" className="p-2 text-muted hover:text-foreground transition-colors">
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="9" cy="9" r="4" /><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M15.5 9.5A7 7 0 118.5 2.5a5.5 5.5 0 007 7z" />
        </svg>
      )}
    </button>
  );
}

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

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/simulateur" className="text-muted hover:text-foreground transition-colors">Simulateur</Link>
          <Link href="/remuneration" className="text-muted hover:text-foreground transition-colors">Rémunération</Link>
          <Link href="/blog" className="text-muted hover:text-foreground transition-colors">Blog</Link>
          <Link href="/diagnostic" className="text-muted hover:text-foreground transition-colors">Diagnostic</Link>
          <DarkModeToggle />
          <Link href="/simulateur" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium">
            Comparer les statuts
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <DarkModeToggle />
          <button className="p-2 text-muted" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-3">
          <Link href="/simulateur" className="block text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>Simulateur</Link>
          <Link href="/remuneration" className="block text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>Rémunération</Link>
          <Link href="/blog" className="block text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/diagnostic" className="block text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>Diagnostic</Link>
          <Link href="/simulateur" className="block bg-primary text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setMenuOpen(false)}>Comparer les statuts</Link>
        </div>
      )}
    </header>
  );
}
