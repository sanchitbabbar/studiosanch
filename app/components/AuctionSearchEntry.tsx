'use client';
import { useRouter } from 'next/navigation';
import ArtworksBoutiquePanel from './ArtworksBoutiquePanel';
export default function AuctionSearchEntry({ language }: { language: 'en' | 'fr' }) {
  const router = useRouter();
  const leave = () => router.push('/boutique/');
  return <ArtworksBoutiquePanel language={language} initialAuction galleryHref={'/artworks/'} onBack={leave} onClose={leave} />;
}
