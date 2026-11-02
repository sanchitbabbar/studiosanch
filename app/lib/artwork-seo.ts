import { designs } from '../data/artworks';
export const artworkOrigin = 'https://studiosanch.com';
export function artworkPaths(id: string) {
  return { en: `${artworkOrigin}/artworks/${id}/`, fr: `${artworkOrigin}/fr/oeuvres-d-art/${id}/` };
}
export function artworkMetadata(id: string, language: 'en' | 'fr') {
  const work = designs.find((item) => item.id === id)!;
  const paths = artworkPaths(id), description = language === 'fr' ? work.descriptionFr : work.descriptionEn;
  const title = `${work.title} — ${language === 'fr' ? 'Art et poésie, éditions signées' : 'Art, poetry and signed editions'} | Sanchit Babbar`;
  return { title: { absolute: title }, description,
    alternates: { canonical: paths[language], languages: { en: paths.en, fr: paths.fr, 'x-default': paths.en } },
    openGraph: { title, description, url: paths[language], type: 'website' as const, locale: language === 'fr' ? 'fr_FR' : 'en_US', images: [{ url: new URL(work.image, artworkOrigin).href, alt: work.title }] },
    twitter: { card: 'summary_large_image' as const, title, description, images: [new URL(work.image, artworkOrigin).href] },
  };
}
export function artworkSchema(id: string, language: 'en' | 'fr') {
  const work = designs.find((item) => item.id === id)!;
  const url = artworkPaths(id)[language];
  return { '@context': 'https://schema.org', '@type': 'VisualArtwork', '@id': `${url}#artwork`, url,
    name: work.title, description: language === 'fr' ? work.descriptionFr : work.descriptionEn,
    image: new URL(work.image, artworkOrigin).href, dateCreated: work.year, inLanguage: language,
    creator: { '@type': 'Person', '@id': 'https://sanchitbabbar.com/#person', name: 'Sanchit Babbar', url: 'https://sanchitbabbar.com/' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}
