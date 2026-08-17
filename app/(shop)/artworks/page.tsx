'use client';

import { useState } from 'react';
import DesignGallery from '../../components/DesignGallery';

export default function ArtworksPage() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      window.location.href = '/boutique';
    }, 300);
  };

  return (
    <main className="min-h-screen bg-black">
      <DesignGallery isOpen={isOpen} onClose={handleClose} />
    </main>
  );
}
