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
  ] as const;

  return [
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
