export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
          <div>
            <span className="font-semibold text-foreground">StatutNet</span>
            {' '}— Simulateur fiscal pour indépendants
          </div>
          <div className="flex gap-6">
            <a href="/mentions-legales" className="hover:text-foreground transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
        <p className="text-xs text-muted mt-4 text-center md:text-left">
          Les résultats sont fournis à titre indicatif et ne constituent pas un conseil fiscal.
          Consultez un expert-comptable pour votre situation personnelle.
          Paramètres fiscaux 2025.
        </p>
      </div>
    </footer>
  );
}
