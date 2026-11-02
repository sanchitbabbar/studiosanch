 'use client';
import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'next/navigation';
import DesignGallery from './DesignGallery';
export default function ArtworkSearchEntry({ id, language }: { id: string; language: 'en' | 'fr' }) {
  const router = useRouter();
  const { language: currentLanguage, setLanguage } = useLanguage();
  useEffect(() => { if (currentLanguage !== language) setLanguage(language); }, [language, currentLanguage, setLanguage]);
  return <DesignGallery isOpen initialDesignId={id} initialLanguage={language} onClose={() => router.push('/artworks/')} />;
}
