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

  // Support deep links such as /boutique?category=accessories
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const sectionParam = searchParams.get('section');
    if (categoryParam) setCategory(categoryParam);
    if (sectionParam) setSection(sectionParam);
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(() => router.push('/'), 520);
  };

  return (
    <main className="min-h-screen bg-black">
      <BoutiqueOptions
        isOpen={isOpen}
        onClose={handleClose}
        initialCategory={category}
        initialSection={section}
        pageMode
      />
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
