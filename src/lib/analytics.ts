// Wrapper Plausible Analytics — ne jamais appeler window.plausible directement

interface PlausibleWindow extends Window {
  plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
}

export function trackEvent(event: string, props?: Record<string, string | number>): void {
  try {
    const w = window as PlausibleWindow;
    if (w.plausible) {
      w.plausible(event, props ? { props } : undefined);
    }
  } catch {
    // Analytics indisponible — silencieux
  }
}
