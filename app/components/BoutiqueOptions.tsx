'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import DesignGallery from './DesignGallery';
import AccessoriesPopup from './AccessoriesPopup';
import { useLanguage } from '../context/LanguageContext';

interface BoutiqueOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  initialSection?: string;
  pageMode?: boolean;
}

interface BoutiqueCategory {
  id: string;
  title: string;
  description: string;
  image: string;
}

const boutiqueCategories: BoutiqueCategory[] = [
  {
    id: 'artbook',
    title: 'Art Book',
    description: 'De la couleur au noir et blanc - This limited edition showcases Sanchit\'s journey from the land of colors to the land of black and white.',
    image: '/images/boutique/book-cover-french-optimized.jpg'
  },
  {
    id: 'accessories',
    title: 'Merchandise',
    description: 'Exclusive lifestyle accessories, including mugs, bags, and apparel, all designed by Sanchit.',
    image: '/images/Accesories%20/Sunglasses/Render%202.jpg'
  },
  {
    id: 'prints',
    title: 'Artworks',
    description: 'Œuvres d\'art featuring Sanchit\'s captivating sketches and photographs.',
    image: '/images/boutique/prints.jpg'
  }
];

const getCategoryTitle = (id: string, lang: string) => {
  const titles: Record<string, Record<string, string>> = {
    artbook: { fr: "Livre d'Art", en: 'Art Book' },
    accessories: { fr: 'Merchandise', en: 'Merchandise' },
    prints: { fr: "Œuvres d'art", en: 'Artworks' }
  };
  return titles[id]?.[lang] || titles[id]?.fr || id;
};

const getCategoryDescription = (id: string, lang: string) => {
  const descriptions: Record<string, Record<string, string>> = {
    artbook: {
      fr: "De la couleur au noir et blanc -\nUn voyage de l'héritage des couleurs vers la quintessence du noir et blanc.",
      en: "From color to black and white - This limited edition showcases Sanchit's journey from the land of colors to the land of black and white."
    },
    accessories: {
      fr: "Fragments d'un univers — Une collection d'œuvres à vivre, émanations de l'esthétique Sanchit",
      en: "Exclusive lifestyle accessories, including mugs, bags, and apparel, all designed by Sanchit."
    },
    prints: {
      fr: "Œuvres d'art mettant en vedette les esquisses et photographies captivantes de Sanchit.",
      en: "Artworks featuring Sanchit's captivating sketches and photographs."
    }
  };
  return descriptions[id]?.[lang] || descriptions[id]?.fr || '';
};

const BoutiqueOptions = ({ isOpen, onClose, initialCategory, initialSection, pageMode = false }: BoutiqueOptionsProps) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [showDesignGallery, setShowDesignGallery] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(initialSection || null);
  
  // Reset design gallery visibility when parent modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowDesignGallery(false);
    }
  }, [isOpen]);
  
  // Handle initial category and section when the component mounts or props change
  useEffect(() => {
    if (isOpen && initialCategory) {
      setSelectedCategory(initialCategory);
      
      if (initialSection) {
        setActiveSection(initialSection);
      }
    }
  }, [isOpen, initialCategory, initialSection]);
  
  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {!pageMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              onClick={onClose}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={pageMode ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={pageMode ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={pageMode ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={pageMode
              ? { duration: 0.5, ease: [0.77, 0, 0.175, 1] }
              : { duration: 0.2, ease: 'easeOut' }}
            className={pageMode
              ? 'relative z-50 min-h-screen flex items-start justify-center px-5 pb-16 pt-24 md:items-center md:px-8'
              : 'fixed inset-0 z-50 overflow-auto flex items-start md:items-center justify-center pt-[180px] md:pt-0'}
          >
            <div className={pageMode
              ? 'flex w-full max-w-4xl flex-col items-start justify-start'
              : 'mt-0 md:mt-0 max-h-[80vh] overflow-y-auto flex flex-col items-start justify-start p-0 md:p-8 w-full md:w-auto'}>
              <div className="max-w-4xl w-full bg-zinc-900/80 rounded-lg p-5 md:p-8 relative transform scale-100 origin-top">
                <button
                  onClick={() => {
                    if (selectedCategory) {
                      // If there's a category selected, go back to main categories
                      handleBack();
                    } else {
                      // If we're already on the main categories screen, close the popup
                      onClose();
                    }
                  }}
                  className="absolute top-4 left-4 text-white/60 hover:text-white transition-colors"
                >
                  ← {language === 'fr' ? 'Retour' : 'Back'}
                </button>
                <button
                  onClick={() => {
                    handleBack();
                    onClose();
                  }}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>

                {/* Selected Category Content */}
                {selectedCategory && (
                  <div className="py-8">
                    <h2 className="text-3xl font-light text-center mb-8">
                      {selectedCategory ? getCategoryTitle(selectedCategory, language) : ''}
                    </h2>
                    
                    <div className="text-center max-w-2xl mx-auto">
                      {selectedCategory === 'prints' ? (
                        <div className="space-y-6">
                          <div className="text-white/80 text-sm font-light leading-relaxed max-w-xl mx-auto mb-4">
                            {language === 'en' ? (
                              <>
                                <p className="mb-3">Each print is produced on museum-grade archival paper, ensuring exceptional longevity and color preservation.</p>
                                <p className="text-white/60 text-xs">Note: Prints are sold unframed. Professional archival framing is recommended for optimal preservation and display.</p>
                              </>
                            ) : (
                              <>
                                <p className="mb-3">Chaque tirage est réalisé sur papier d'archives de qualité musée, garantissant une longévité exceptionnelle et la préservation des couleurs.</p>
                                <p className="text-white/60 text-xs">Les œuvres sont vendues sans cadre. Un encadrement professionnel d'archives est recommandé pour une conservation et une mise en valeur optimales.</p>
                              </>
                            )}
                          </div>
                          
                          <div className="inline-block">
                            <div 
                              className="inline-block cursor-pointer px-8 py-2 border-b border-white/40 hover:border-white transition-all duration-500"
                              onClick={() => {
                                // Set a navigation flag first
                                if (typeof window !== 'undefined') {
                                  // This flag helps ensure navigation happens properly
                                  sessionStorage.setItem('navigate_to_artworks', 'true');
                                }
                                
                                // Close this modal first
                                onClose();
                                
                                // Immediate navigation seems more reliable than setTimeout
                                // Use a small timeout just to ensure modal closing has started
                                setTimeout(() => {
                                  if (typeof window !== 'undefined') {
                                    // Navigate to clean artworks route
                                    window.location.href = '/artworks';
                                  }
                                }, 50); // Reduced delay for more responsive feel
                              }}
                            >
                              <span className="tracking-[0.25em] uppercase text-xs font-light hover:tracking-[0.3em] inline-block pr-6 transition-all duration-500">
                              {language === 'en' ? 'View Collection' : 'Voir la Collection'}
                              <span className="ml-2 opacity-60 text-sm transition-all duration-500">→</span>
                            </span>
                            </div>
                          </div>
                        </div>
                      ) : selectedCategory === 'accessories' ? (
                        <AccessoriesPopup />
                      ) : selectedCategory === 'artbook' ? (
                        <div className="inline-block">
                          <div 
                            className="inline-block cursor-pointer px-8 py-2 border-b border-white/40 hover:border-white transition-all duration-500"
                            onClick={() => {
                              // Close this modal first
                              onClose();
                              
                              // Navigate to the Art Book product page
                              setTimeout(() => {
                                if (typeof window !== 'undefined') {
                                  window.location.href = '/product/artbook-main';
                                }
                              }, 400); 
                            }}
                          >
                            <span className="tracking-[0.25em] uppercase text-xs font-light hover:tracking-[0.3em] inline-block pr-6 transition-all duration-500">
                              {language === 'en' ? 'DISCOVER' : 'DÉCOUVRIR'}
                              <span className="ml-2 opacity-60 text-sm transition-all duration-500">→</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-white/70 mb-12">
                            {language === 'en' 
                              ? 'Coming soon. Subscribe to be notified when this product becomes available.' 
                              : "Bientôt disponible. Abonnez-vous pour être notifié lorsque ce produit sera disponible."}
                          </p>
                          <button className="inline-block px-8 py-3 border border-white/30 hover:border-white transition-colors">
                            {language === 'en' ? 'Subscribe' : "S'abonner"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Categories Selection */}
                {!selectedCategory && (
                  <div className="pt-8">
                    <h2 className="text-3xl font-light text-center mb-16">{language === 'en' ? 'Boutique' : 'Boutique'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {boutiqueCategories.map(category => (
                        <div 
                          key={category.id}
                          className="bg-zinc-900/60 rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <div className="aspect-[4/3] relative">
                            <Image
                              src={category.image}
                              alt={category.title}
                              fill
                              priority={true}
                              loading="eager"
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: 'cover', objectPosition: 'center 83%' }}
                              className="transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl mb-2">{getCategoryTitle(category.id, language)}</h3>
                            <p className="text-white/70 text-sm">{getCategoryDescription(category.id, language)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Standalone Mode - Removed to prevent display on landing page */}
    </AnimatePresence>
  );
};

export default BoutiqueOptions;
