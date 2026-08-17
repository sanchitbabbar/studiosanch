import { accessoryProducts } from '../../../data/accessories';

// This function is required for static exports with dynamic routes
// It pre-renders all possible product pages at build time
export function generateStaticParams() {
  // Return all possible product IDs for the [id] parameter
  return accessoryProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
