'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DesignGallery from '../../components/DesignGallery';

export default function ArtworksPage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(() => router.push('/boutique'), 180);
  };

  return (
    <main className="min-h-screen bg-black">
      <DesignGallery isOpen={isOpen} onClose={handleClose} />
    </main>
  );
}
