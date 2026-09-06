import type { AccessoryProduct } from '../data/accessories';

export const SITE_URL = 'https://studiosanch.com';

export function absoluteAsset(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function numericPrice(price: string) {
  const value = price.replace(/[^0-9.,]/g, '').replace(',', '.');
  return Number.parseFloat(value);
}

export function productAvailability(product: AccessoryProduct) {
  if (product.comingSoon || product.stockStatus === 'out-of-stock') return 'https://schema.org/OutOfStock';
  if (product.stockStatus === 'pre-order') return 'https://schema.org/PreOrder';
  return 'https://schema.org/InStock';
}

export function productJsonLd(product: AccessoryProduct) {
  const url = `${SITE_URL}/product/${product.id}/`;
  const images = [product.image, ...(product.additionalImages ?? [])].map(absoluteAsset);
  const price = numericPrice(product.price);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.longDescription || product.description,
    url,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'SANCH' },
    image: images.map((contentUrl, index) => ({
      '@type': 'ImageObject',
      contentUrl,
      representativeOfPage: index === 0,
      creditText: 'Studio Sanch',
      creator: { '@type': 'Person', name: 'Sanchit Babbar' },
      copyrightNotice: 'Studio Sanch',
    })),
    ...(Number.isFinite(price) ? {
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'EUR',
        price: price.toFixed(2),
        availability: productAvailability(product),
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@type': 'Organization', name: 'Studio Sanch', url: SITE_URL },
      },
    } : {}),
  };
}
