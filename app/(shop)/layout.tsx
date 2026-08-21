import '../globals.css';
import Navigation from '../components/Navigation';
import SiteFooter from '../components/site/SiteFooter';
import { LanguageProvider } from '../context/LanguageContext';

// Layout for the boutique section. Tailwind + the boutique providers are scoped
// here so they cannot alter the styling of the original studio-sanch pages.
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <link rel="stylesheet" href="/css/styles.css" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <div className="bg-black text-white min-h-screen">
        <Navigation />
        {children}
        <SiteFooter backgroundColor="#000" />
      </div>
    </LanguageProvider>
  );
}
