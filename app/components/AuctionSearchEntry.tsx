'use client';
import { useRouter } from 'next/navigation';
import ArtworksBoutiquePanel from './ArtworksBoutiquePanel';
export default function AuctionSearchEntry({ language, initialArtwork = 0 }: { language: 'en' | 'fr'; initialArtwork?: number }) {
  const router = useRouter();
  const leave = () => router.push('/boutique/');
  return <ArtworksBoutiquePanel language={language} initialAuction initialArtwork={initialArtwork} galleryHref={'/artworks/'} onBack={leave} onClose={leave} />;
}
