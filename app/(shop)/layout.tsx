import '../globals.css';
import Navigation from '../components/Navigation';
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
      <div className="bg-black text-white min-h-screen">
        <Navigation />
        {children}
      </div>
    </LanguageProvider>
  );
}
