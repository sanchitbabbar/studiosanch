import { notFound } from 'next/navigation';
import { designs } from '../../../data/artworks';
import { artworkMetadata, artworkSchema } from '../../../lib/artwork-seo';
import ArtworkSearchEntry from '../../../components/ArtworkSearchEntry';
export const dynamicParams = false;
export function generateStaticParams() { return designs.map((work) => ({ id: work.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params; if (!designs.some((work) => work.id === id)) return {};
 return artworkMetadata(id, 'en');
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params; if (!designs.some((work) => work.id === id)) notFound();
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artworkSchema(id, 'en')).replace(/</g, '\\u003c') }} /><ArtworkSearchEntry id={id} language="en" /></>;
}
