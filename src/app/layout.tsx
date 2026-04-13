import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StatutNet — Simulateur fiscal pour indépendants',
  description:
    'Comparez votre revenu net en Micro-entreprise, EURL et SASU. Simulateur fiscal et social gratuit pour freelances et indépendants français.',
  keywords: [
    'simulateur',
    'statut juridique',
    'micro-entreprise',
    'EURL',
    'SASU',
    'freelance',
    'indépendant',
    'fiscal',
    'cotisations sociales',
  ],
  openGraph: {
    title: 'StatutNet — Quel statut pour maximiser votre revenu net ?',
    description:
      'Comparez Micro-entreprise, EURL et SASU en quelques clics. Gratuit.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <script defer data-domain="statut-net.vercel.app" src="https://plausible.io/js/script.js" />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
