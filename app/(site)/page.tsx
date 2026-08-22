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
          <div
            className="responsive-image-container homepage-hero-stage"
            style={{ position: 'relative' }}
          >
            {/* Portrait artwork is used through iPad widths; desktop gets the expanded set. */}
            <picture
              className="homepage-hero-picture homepage-hero-picture--colour"
              style={{ position: 'absolute', inset: 0, zIndex: 1 }}
            >
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
            <picture
              className="homepage-hero-picture homepage-hero-picture--monochrome"
              style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 1 }}
              aria-hidden="true"
            >
              <source
                media="(min-width: 1201px)"
                srcSet="/images/archive/homepage-black-white-2026-08-21-desktop-wide.png"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/archive/homepage-black-white-2026-08-21-mobile-tablet.png"
                alt=""
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
