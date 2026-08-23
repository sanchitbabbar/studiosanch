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
    // Let the Boutique finish its fade while its current content remains
    // frozen, then navigate. This prevents the category grid flashing during
    // the closing frame.
    window.setTimeout(() => router.push(originPath), 650);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <iframe
        src={originPath}
        title="Previous page"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none fixed inset-0 h-full w-full border-0 scale-[1.025] opacity-70 blur-[7px] brightness-[0.48] saturate-[0.75]"
      />
      <div className="pointer-events-none fixed inset-0 bg-black/30" />
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
