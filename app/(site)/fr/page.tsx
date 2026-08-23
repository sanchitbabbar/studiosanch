import type { Metadata } from 'next';
import SiteHeader from '../../components/site/SiteHeader';
import SiteFooter from '../../components/site/SiteFooter';
import CinematicHome from '../../components/site/CinematicHome';

export const metadata: Metadata = {
  title: 'ACCUEIL - STUDIO SANCH',
  openGraph: {
    type: 'website',
    title: 'STUDIO SANCH | Site officiel',
    url: 'https://studiosanch.com/fr/',
    images: ['https://studiosanch.com/images/hero-gala-desktop-wide-updated.jpg'],
  },
};

export default function FrenchHomePage() {
  return (
    <>
      <SiteHeader active="HOME" />
      <CinematicHome />
      <SiteFooter />
    </>
  );
}
