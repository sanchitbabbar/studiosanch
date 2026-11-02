import { designs } from '../data/artworks';
import { artworkPaths } from '../lib/artwork-seo';
import { accessoryProducts } from '../data/accessories';
import { absoluteAsset, SITE_URL } from '../lib/product-seo';

export const dynamic = 'force-static';

const xml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]!));

export function GET() {
  const artworkUrls = designs.flatMap((work) => {
    const paths = artworkPaths(work.id);
    return (['en', 'fr'] as const).map((lang) => `<url><loc>${xml(paths[lang])}</loc><image:image><image:loc>${xml(absoluteAsset(work.image))}</image:loc><image:title>${xml(work.title)}</image:title></image:image></url>`);
  }).join('');
  const urls = accessoryProducts.filter((product) => !product.hidden).map((product) => {
    const images = [product.image, ...(product.additionalImages ?? [])].map((image) => `
    <image:image><image:loc>${xml(absoluteAsset(image))}</image:loc><image:title>${xml(product.name)}</image:title><image:caption>${xml(product.description)}</image:caption></image:image>`).join('');
    return `<url><loc>${SITE_URL}/product/${product.id}/</loc>${images}</url>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}${artworkUrls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
