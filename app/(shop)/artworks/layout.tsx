import type { Metadata } from 'next';
import { designs } from '../../data/artworks';
import { artworkPaths } from '../../lib/artwork-seo';
export const metadata: Metadata = { title: { absolute: "Artworks, Poetry & Signed Fine Art Editions | Sanchit Babbar" }, description: "Explore artworks by Sanchit Babbar, their original poetic descriptions, and signed fine art editions.", alternates: { canonical: 'https://studiosanch.com/artworks/' } };
export default function Layout({ children }: { children: React.ReactNode }) {
 const schema={ '@context':'https://schema.org','@type':'CollectionPage',url:'https://studiosanch.com/artworks/',name:"Artworks, Poetry & Signed Fine Art Editions | Sanchit Babbar",mainEntity:{'@type':'ItemList',itemListElement:designs.map((work,index)=>({'@type':'ListItem',position:index+1,url:artworkPaths(work.id).en,name:work.title}))}};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html:JSON.stringify(schema).replace(/</g,'\\u003c') }} />{children}</>;
}
