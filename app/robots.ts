import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/client/'],
    },
    sitemap: ['https://studiosanch.com/sitemap.xml', 'https://studiosanch.com/image-sitemap.xml'],
    host: 'https://studiosanch.com',
  };
}
