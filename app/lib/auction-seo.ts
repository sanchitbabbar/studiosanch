import type { Metadata } from 'next';
import { designs } from '../data/artworks';
const base = 'https://studiosanch.com';
export const auctionWork = designs.find(work => work.title === 'Celle qui se connaît')!;
export const auctionPaths = { en: `${base}/auctions/celle-qui-se-connait/`, fr: `${base}/fr/auctions/celle-qui-se-connait/` };
export function auctionMetadata(language: 'en' | 'fr'): Metadata {
  const french = language === 'fr';
  const title = french ? 'Celle qui se connaît — Vente aux enchères de l’œuvre originale | Sanchit Babbar' : 'Celle qui se connaît — Original artwork auction | Sanchit Babbar';
  const description = french ? 'Œuvre originale de Sanchit Babbar, 2025. Paris, France. Découvrez l’œuvre et sa poésie, et exprimez votre intérêt pour assister à la prochaine vente aux enchères.' : 'Original artwork by Sanchit Babbar, 2025. Paris, France. Discover the artwork and its poetry, and express interest in attending the upcoming auction.';
  const image = `${base}/images/auctions/celle-qui-se-connait-original.webp`;
  return {
    title: { absolute: title }, description,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    alternates: { canonical: auctionPaths[language], languages: { ...auctionPaths, 'x-default': auctionPaths.en } },
    openGraph: { type: 'website', url: auctionPaths[language], title, description, locale: french ? 'fr_FR' : 'en_GB', alternateLocale: french ? ['en_GB'] : ['fr_FR'], images: [{ url: image, alt: auctionWork.title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
export function auctionSchema(language: 'en' | 'fr') {
  const url = auctionPaths[language];
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': url, url, name: language === 'fr' ? 'Celle qui se connaît — Vente aux enchères à venir' : 'Celle qui se connaît — Upcoming auction', inLanguage: language, mainEntity: { '@id': `${base}/#celle-original` }, contentLocation: { '@type': 'Place', name: 'Paris, France' } },
    { '@type': 'VisualArtwork', '@id': `${base}/#celle-original`, name: auctionWork.title, dateCreated: auctionWork.year, description: language === 'fr' ? auctionWork.descriptionFr : auctionWork.descriptionEn, image: `${base}/images/auctions/celle-qui-se-connait-original.webp`, creator: { '@type': 'Person', name: 'Sanchit Babbar', url: 'https://sanchitbabbar.com/' }, mainEntityOfPage: url }
  ] };
}
