import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BasKita - Origami 2D School Bus Fleet Platform | TTDI Jaya',
  description:
    'Tactile origami 2D school bus fleet tracking and management platform for TTDI Jaya, Seksyen U2, Shah Alam.',
  keywords: ['BasKita', 'School Bus', 'TTDI Jaya', 'Shah Alam', 'Origami', 'Fleet Tracker'],
  authors: [{ name: 'BasKita TTDI Jaya' }],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FAF8F5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms" className="h-full">
      <body className="min-h-full flex flex-col antialiased selection:bg-origami-yellow selection:text-origami-slate">
        {children}
      </body>
    </html>
  );
}
