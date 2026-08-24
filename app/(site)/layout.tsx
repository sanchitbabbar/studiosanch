import type { Metadata } from 'next';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata: Metadata = {
  icons: {
    icon: '/images/Address bar image.jpg',
    apple: '/images/Address bar image.jpg',
  },
};

// Layout for the original studio-sanch pages. It loads the existing
// css/styles.css (served from /public/css) rather than Tailwind, so these pages
// keep rendering exactly as they do today.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/css/styles.css" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </>
  );
}
