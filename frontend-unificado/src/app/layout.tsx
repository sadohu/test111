import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Sistema Educativo - Ejercicios Personalizados',
    template: '%s | Sistema Educativo',
  },
  description:
    'Plataforma educativa con ejercicios personalizados basados en perfiles de aprendizaje',
  keywords: [
    'educación',
    'ejercicios',
    'aprendizaje personalizado',
    'matemáticas',
    'lectura',
    'ciencias',
  ],
  authors: [{ name: 'Sistema Educativo' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
