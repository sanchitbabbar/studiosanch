import type { Metadata, Viewport } from 'next';
import CookieConsent from './components/site/CookieConsent';

// Deliberately carries no stylesheet: the boutique (Tailwind) and the original
// studio-sanch pages (css/styles.css) each load their own CSS in their route
// group, so neither design system can bleed into the other.
export const metadata: Metadata = {
  title: 'Studio Sanch',
  description:
    "Sanchit Babbar's creative studio, based in Paris, specializing in high fashion and digital films.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
