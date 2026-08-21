import type { Metadata } from 'next';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';

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

      <main>
        <section className="hero-section">
          <div className="responsive-image-container">
            {/* Portrait artwork is used through iPad widths; desktop gets the expanded set. */}
            <picture className="homepage-hero-picture">
              <source
                media="(min-width: 1201px)"
                srcSet="/images/hero-gala-desktop-wide-updated.jpg"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-gala-mobile-tablet-updated.jpg"
                alt="Studio Sanch couture portrait"
                className="responsive-image homepage-hero"
              />
            </picture>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
