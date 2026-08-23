import type { Metadata } from 'next';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import CinematicHome from '../components/site/CinematicHome';

export const metadata: Metadata = {
  title: 'HOME - STUDIO SANCH',
  openGraph: {
    type: 'website',
    title: 'STUDIO SANCH | The Official Website',
    url: 'https://studiosanch.com',
    images: ['https://studiosanch.com/images/hero-gala-desktop-wide-updated.jpg'],
  },
};

export default function HomePage() {
  return (
    <>
      <SiteHeader active="HOME" />
      <CinematicHome />
      <SiteFooter />
    </>
  );
}
