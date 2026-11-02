import { auctionPaths } from './lib/auction-seo';
import { designs } from './data/artworks';
import { artworkPaths } from './lib/artwork-seo';
import type { MetadataRoute } from 'next';
import { accessoryProducts } from './data/accessories';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://studiosanch.com';
  const pages = [
    ['', 1],
    ['/fr/', 0.9],
    ['/productions/', 0.8],
    ['/artworks/', 0.9],
    ['/boutique/', 0.9],
    ['/terms/', 0.3],
    ['/haute-couture.html', 0.9],
    ['/atelier.html', 0.8],
    ['/fr/atelier.html', 0.8],
    ['/about.html', 0.7],
    ['/fr/about.html', 0.7],
  ] as const;

  return [
    ...Object.values(auctionPaths).map(url => ({ url, lastModified: new Date('2026-11-02T00:00:00+01:00'), changeFrequency: 'weekly' as const, priority: 0.9, images: [`https://studiosanch.com/images/auctions/celle-qui-se-connait-original.webp`], alternates: { languages: { ...auctionPaths, 'x-default': auctionPaths.en } } })),
    ...designs.flatMap((work) => {
      const paths = artworkPaths(work.id);
      return [paths.en, paths.fr].map((url) => ({ url, changeFrequency: 'monthly' as const, priority: 0.8,
        alternates: { languages: { ...paths, 'x-default': paths.en } } }));
    }),
    ...pages.map(([path, priority]) => ({
      url: `${base}${path}`,
      changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
      priority,
      ...(path === '' || path === '/fr/'
        ? {
            alternates: {
              languages: {
                en: `${base}/`,
                fr: `${base}/fr/`,
                'x-default': `${base}/`,
              },
            },
          }
        : {}),
    })),
    ...accessoryProducts
      .filter((product) => !product.hidden)
      .map((product) => ({
        url: `${base}/product/${product.id}/`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
  ];
}
