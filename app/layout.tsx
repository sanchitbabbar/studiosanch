import type { Metadata, Viewport } from 'next';
import CookieConsent from './components/site/CookieConsent';

// Deliberately carries no stylesheet: the boutique (Tailwind) and the original
// studio-sanch pages (css/styles.css) each load their own CSS in their route
// group, so neither design system can bleed into the other.
export const metadata: Metadata = {
  metadataBase: new URL('https://studiosanch.com'),
  title: 'Studio Sanch',
  description:
    "Sanchit Babbar's creative studio, based in Paris, specializing in high fashion and digital films.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Studio Sanch',
              url: 'https://studiosanch.com',
              logo: 'https://studiosanch.com/icons/sanch-favicon-192.png',
              founder: {
                '@type': 'Person',
                name: 'Sanchit Babbar',
                url: 'https://sanchitbabbar.com',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Paris',
                addressCountry: 'FR',
              },
            }),
          }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
