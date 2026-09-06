import { accessoryProducts } from '../../../data/accessories';
import type { Metadata } from 'next';
import { absoluteAsset, productJsonLd, SITE_URL } from '../../../lib/product-seo';

// This function is required for static exports with dynamic routes
// It pre-renders all possible product pages at build time
export function generateStaticParams() {
  // Return all possible product IDs for the [id] parameter
  return accessoryProducts.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = accessoryProducts.find((item) => item.id === id);
  if (!product) return {};
  const url = `${SITE_URL}/product/${product.id}/`;
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: product.description,
      url,
      type: 'website',
      images: [{ url: absoluteAsset(product.image), alt: product.name }],
    },
  };
}

export default function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return <ProductStructuredData params={params}>{children}</ProductStructuredData>;
}

async function ProductStructuredData({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = accessoryProducts.find((item) => item.id === id);
  return <>
    {product && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, '\\u003c') }} />}
    {children}
  </>;
}
