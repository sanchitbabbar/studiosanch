import type { Metadata } from 'next';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';

export const metadata: Metadata = {
  title: 'HOME - STUDIO SANCH',
  openGraph: {
    type: 'website',
    title: 'STUDIO SANCH | The Official Website',
    url: 'https://studiosanch.com',
    images: ['https://studiosanch.com/images/hero.jpg'],
  },
};

export default function HomePage() {
  return (
    <>
      <SiteHeader active="HOME" />

      <main>
        <section className="hero-section">
          <div className="responsive-image-container">
            {/* Plain <img> keeps the existing responsive-image CSS behaviour */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero.jpg"
              alt="Studio Sanch Fashion"
              className="responsive-image homepage-hero"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
