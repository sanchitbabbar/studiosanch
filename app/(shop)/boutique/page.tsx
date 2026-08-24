'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BoutiqueOptions from '../../components/BoutiqueOptions';

function BoutiqueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState('');
  const [section, setSection] = useState('');
  const [originPath, setOriginPath] = useState('/');

  // Support deep links such as /boutique?category=accessories
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const sectionParam = searchParams.get('section');
    if (categoryParam) setCategory(categoryParam);
    if (sectionParam) setSection(sectionParam);

    try {
      const storedOrigin = window.sessionStorage.getItem('studio-sanch-boutique-origin');
      if (storedOrigin && !storedOrigin.startsWith('/boutique')) {
        setOriginPath(storedOrigin);
      }
    } catch {
      // The homepage remains a safe visual fallback when storage is unavailable.
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    // Keep the close motion brief and use the client router so this remains
    // one continuous transition rather than a delayed document reload.
    window.setTimeout(() => router.push(originPath), 220);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="relative z-10 min-h-screen">
        <BoutiqueOptions
          isOpen={isOpen}
          onClose={handleClose}
          initialCategory={category}
          initialSection={section}
          pageMode
        />
      </div>
    </main>
  );
}

export default function BoutiquePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <BoutiqueContent />
    </Suspense>
  );
}
