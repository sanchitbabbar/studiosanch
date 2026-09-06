import { accessoryProducts } from '../../data/accessories';
import { absoluteAsset, numericPrice, productAvailability, SITE_URL } from '../../lib/product-seo';

export const dynamic = 'force-static';

const xml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]!));

export function GET() {
  const products = accessoryProducts.filter((product) => !product.hidden && Number.isFinite(numericPrice(product.price))).map((product) => `<item>
    <g:id>${xml(product.id)}</g:id><title>${xml(product.name)}</title><description>${xml(product.longDescription || product.description)}</description>
    <link>${SITE_URL}/product/${product.id}/</link><g:image_link>${xml(absoluteAsset(product.image))}</g:image_link>
    <g:availability>${productAvailability(product).endsWith('OutOfStock') ? 'out_of_stock' : productAvailability(product).endsWith('PreOrder') ? 'preorder' : 'in_stock'}</g:availability>
    <g:price>${numericPrice(product.price).toFixed(2)} EUR</g:price><g:condition>new</g:condition><g:brand>SANCH</g:brand>
  </item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"><channel><title>Studio Sanch</title><link>${SITE_URL}</link><description>Studio Sanch collection</description>${products}</channel></rss>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
