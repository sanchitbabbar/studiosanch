'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

interface DesignGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PrintSize {
  id: string;
  dimensions: string;
  price: number;
  recommended: string;
  availability?: 'in-stock' | 'sold-out' | 'limited';
}

interface PrintQuality {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
}

interface Design {
  id: string;
  title: string;
  descriptionFr: string;
  descriptionEn: string;
  basePrice: number;
  image: string;
  year: string;
  technique: string;
  sizes: PrintSize[];
  qualities: PrintQuality[];
  availablePieces?: number;
}

const printSizes: PrintSize[] = [
  {
    id: 'small',
    dimensions: '50 × 70 cm',
    price: 4850,
    recommended: 'Perfect for intimate spaces and private collections'
  },
  {
    id: 'medium',
    dimensions: '70 × 100 cm',
    price: 8062,
    recommended: 'Ideal for living rooms and galleries'
  },
  {
    id: 'large',
    dimensions: '100 × 140 cm',
    price: 15427,
    recommended: 'Statement piece for grand spaces'
  },
  {
    id: 'grand',
    dimensions: '120 × 160 cm',
    price: 21663,
    recommended: 'Masterpiece scale for luxury residences'
  }
];

const printQualities: PrintQuality[] = [
  {
    id: 'premium',
    name: 'Premium Archival',
    description: 'Museum-quality Hahnemühle Photo Rag 308gsm, 100+ years longevity',
    priceMultiplier: 1
  },
  {
    id: 'platinum',
    name: 'Platinum Edition',
    description: 'Exceptional Hahnemühle German Etching 310gsm, hand-finished with protective coating',
    priceMultiplier: 1.5
  }
];

const designs: Design[] = [
  {
    id: '1',
    title: "Murmure des Pétales",
    descriptionFr: "Une composition fluide et délicate qui saisit l'essence éphémère des pétales murmurants en mouvement. Les nuances douces et les formes organiques évoquent une atmosphère d'élégance intemporelle où chaque regard découvre une nouvelle impression de sérénité.",
    descriptionEn: "A fluid and delicate composition capturing the ephemeral essence of whispering petals in motion. The soft tones and organic forms create an atmosphere of timeless elegance and serenity.",
    image: "/images/art-prints/murmure-des-petals.jpg",
    year: "2024",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    // Custom sizes with first size (small) unavailable
    sizes: [
      {
        id: 'xs',
        dimensions: '40 × 60 cm',
        price: 4850,
        recommended: 'Perfect for intimate spaces and private collections',
        availability: 'in-stock' as const
      },
      { ...printSizes[0], availability: 'sold-out' as const },
      { ...printSizes[1], availability: 'sold-out' as const },
      { ...printSizes[2], availability: 'sold-out' as const },
      { ...printSizes[3], availability: 'sold-out' as const },
    ],
    qualities: printQualities,
    availablePieces: 1,
  },
  {
    id: '2',
    title: "La première onde",
    descriptionFr: "Une expression fluide du souffle et du mouvement, où les gestes dansent en harmonie perpétuelle. Cette œuvre capture l'essence du flot continu de la vie, un rythme qui fait écho à la caresse discrète des vagues, au passage éternel du temps, et au pouls de l'existence même. Une ondulation qui résonne avec le battement du cœur, source de tout. Les formes ne s'effacent jamais, mais se transforment sans fin au cours de leur voyage à travers l'espace.",
    descriptionEn: "A flowing expression of breath and movement, where gestures dance in perpetual harmony. This work captures the essence of life's continuous flow, a rhythm mirroring the quiet caress of waves, the eternal passage of time, and the pulse of existence itself. A pulse echoing the very rhythm of the heart, the source of all. The forms never truly end, but transform endlessly on their journey through space.",
    image: "/images/art-prints/murmure-de-sanch.jpg",
    year: "2024",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    // Custom sizes with third size (large) unavailable
    sizes: [
      {
        id: 'xs',
        dimensions: '40 × 60 cm',
        price: 4850,
        recommended: 'Perfect for intimate spaces and private collections',
        availability: 'in-stock' as const
      },
      { ...printSizes[0], availability: 'sold-out' as const },
      { ...printSizes[1], availability: 'sold-out' as const },
      { ...printSizes[2], availability: 'sold-out' as const },
      { ...printSizes[3], availability: 'sold-out' as const },
    ],
    qualities: printQualities,
    availablePieces: 1,
  },
  {
    id: '3',
    title: "Pétale de Sanch",
    descriptionFr: "Une expression d'élégance naturelle où les pétales dansent ensemble dans un instant de grâce parfaite. Cette œuvre révèle la beauté intrinsèque des formes organiques qui flottent telles des silhouettes délicates à travers une palette de tons subtils et de traits fluides.",
    descriptionEn: "An expression of natural elegance where petals dance with one another in a moment of perfect grace. This work explores the intrinsic beauty of organic forms as they float like delicate silhouettes through a palette of subtle tones and fluid strokes.",
    image: "/images/art-prints/petale-de-sanch.jpg",
    year: "2024",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    // Custom sizes with first two sizes (small & medium) unavailable
    sizes: [
      {
        id: 'xs',
        dimensions: '40 × 60 cm',
        price: 4850,
        recommended: 'Perfect for intimate spaces and private collections',
        availability: 'in-stock' as const
      },
      { ...printSizes[0], availability: 'sold-out' as const },
      { ...printSizes[1], availability: 'sold-out' as const },
      { ...printSizes[2], availability: 'sold-out' as const },
      { ...printSizes[3], availability: 'sold-out' as const },
    ],
    qualities: printQualities,
    availablePieces: 1,
  },
  {
    id: '4',
    title: "L'Onde Intérieure",
    descriptionFr: "Une onde douce de sensations, où chaque expression s'écoule du cœur avec une aisance délicate. Les émotions se déploient et ondulent — tendres, libérées, révélant la richesse de son monde intérieur. Elle habite pleinement sa sensibilité, s'exprimant librement, sans chercher l'approbation d'autrui. Embrassant sa propre essence, caressant tout ce qu'elle traverse.",
    descriptionEn: "A gentle wave of feeling, where each expression flows from the heart with quiet ease. Emotions unfurl and ripple — tender, liberated, revealing the richness of her inner world. She inhabits her sensitivity fully, expressing herself freely, without seeking approval. Embracing her own essence, caressing all she moves through.",
    image: "/images/art-prints/londe-interieure.jpg",
    year: "2025",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    sizes: printSizes,
    qualities: printQualities,
    availablePieces: 3,
  },
  {
    id: '5',
    title: "The Silent Secret",
    descriptionFr: "Un secret silencieux qui raconte, sans mot, la grâce et la délicatesse de celle qui la porte.",
    descriptionEn: "A whispered secret that reveals, without words, the elegance and the sensitivity of the one who treads in it.",
    image: "/images/art-prints/le-secret-silencieux.jpg",
    year: "2024",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    // Custom sizes with first size (small) unavailable
    sizes: [
      {
        ...printSizes[0], // small
        availability: 'sold-out'
      },
      printSizes[1], // medium
      printSizes[2], // large
      printSizes[3], // grand
    ],
    qualities: printQualities,
    availablePieces: 2,
  },
  {
    id: '6',
    title: "Le Souffle de Sanch",
    descriptionFr: "Avant l'aurore et la tendresse de l'aube — la première onde du cœur à l'inspiration, l'écho à l'expiration. Entre retenir et lâcher prise, masculin ou féminin s'épanouissent au cœur : doux mais ferme, sensible, élégamment neutre. C'est la sensation qui sculpte perception et réaction, jusqu'à l'intimité d'un souffle — le souffle de Sanch.",
    descriptionEn: "Before dawn and in the tenderness of first light — the heart's first breath rises with the inhale, echoing softly with the exhale. Between holding on and letting go, masculine and feminine blossom within the heart: gentle yet firm, sensitive, elegantly neutral. It is sensation that shapes perception and response, leading to the intimacy of a delicate breath — the breath of Sanch.",
    image: "/images/art-prints/le-souffle-de-sanch.jpg",
    year: "2025",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    sizes: printSizes,
    qualities: printQualities,
    availablePieces: 2,
  },
  {
    id: '7',
    title: "Celle qui se connaît",
    descriptionFr: "Au creux d'elle-même, elle vit. Elle ne cherche pas de miroir, car son reflet est le vent, le soleil qui caresse les collines de son corps. Elle est la source, celle qui se nourrit de sa propre lumière, et son cœur, une fleur sauvage, s'ouvre sans bruit, sans attente, juste l'éclat pur de l'existence. Elle est un secret susurré par l'écho de ses propres sensations, celle qui se connaît.",
    descriptionEn: "Within her very heart, she lives an honest life. No looking glass she seeks, for her true visage is the very wind, the sun that does but kiss the gentle curves of her own form. She is the spring, the one who is nourished from her own inner light. And her heart, a wild bloom, does open, free of clamor or of need, a simple, pure, and glorious flash of being. She is a secret, whispered by the echo of her own body's softest voices, the one who knows herself.",
    image: "/images/art-prints/celle-qui-se-connait.webp",
    year: "2025",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    // Custom sizes with first size (small) unavailable
    sizes: [
      {
        ...printSizes[0], // small
        availability: 'sold-out'
      },
      printSizes[1], // medium
      printSizes[2], // large
      printSizes[3], // grand
    ],
    qualities: printQualities,
    availablePieces: 2,
  },
  {
    id: '8',
    title: "Deepa",
    descriptionEn: "Deepa comes from the Sanskrit word Diˉˉpa, meaning \"lamp,\" \"light,\" or \"radiance.\" More profoundly, it carries the name of the quiet strength—the very source of light—who kindled me into this world, gifting me the chance to embrace the sheer wonder of existence. For me, this artwork offers a glimpse of the fact that there is nothing more illuminating than the authentic light and blossoming of the feminine that comes entirely from the inside. This radiance—the true warmth, strength, and beauty of a human—is a self-sustaining source, never granted or defined by external forces.",
    descriptionFr: "Deepa vient du mot sanskrit Dipa, qui signifie « lampe », « lumière », ou « éclat ». C'est aussi le nom d'une force douce et courageuse — celle qui m'a allumé au monde, offrant la chance d'en goûter la beauté. Pour moi, cette œuvre évoque une vérité simple : rien n'éclaire plus que la lumière authentique, celle qui naît du cœur même du féminin. Cette clarté — chaleur, force et beauté d'un être humain — brille d'elle-même, sans jamais dépendre de ce qui vient de l'extérieur.",
    image: "/images/art-prints/Deepa.webp",
    year: "2025",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    sizes: printSizes,
    qualities: printQualities,
    availablePieces: 4,
  },
  {
    id: '9',
    title: "Le Regard Du Cœur",
    descriptionEn: "This work is an expression of the anchored and centered gaze that emerges directly from one's own loving heart. It is the natural result of being profoundly connected to this inner core. This connection instantly aligns the human living within their body, allowing them to flow through the world without a trace of doubt. Their certainty is not derived from external validation, but rather from the unwavering awareness of their own worth, which enables them to be fully and confidently connected to the world around them.",
    descriptionFr: "Cette œuvre est l'expression du regard—stable et compatissant—qui émerge directement du propre cœur aimant d'une personne. C'est le résultat naturel d'être profondément connectée à cette source intérieure. Cette connexion aligne instantanément la personne vivant dans son corps, lui permettant d'évoluer dans le monde sans aucun doute. Sa certitude ne provient pas d'une validation externe, mais de la connaissance inébranlable de sa propre valeur, ce qui lui permet d'être pleinement et en toute confiance reliée au monde qui l'entoure.",
    image: "/images/art-prints/le-regard-du-coeur.webp",
    year: "2025",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    sizes: printSizes,
    qualities: printQualities,
    availablePieces: 4,
  }
];

export default function DesignGallery({ isOpen, onClose }: DesignGalleryProps) {
  const { language, setLanguage } = useLanguage();
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [selectedSize, setSelectedSize] = useState<PrintSize | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<PrintQuality | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [showArtworkSuccess, setShowArtworkSuccess] = useState(false);
  const [artworkSubmissionError, setArtworkSubmissionError] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'about'>('gallery');

  const calculatePrice = useCallback(() => {
    if (!selectedDesign || !selectedSize || !selectedQuality) return null;
    return selectedSize.price * selectedQuality.priceMultiplier;
  }, [selectedDesign, selectedSize, selectedQuality]);

  const resetSelections = useCallback(() => {
    setSelectedDesign(null);
    setSelectedSize(null);
    setSelectedQuality(null);
    setIsCheckout(false);
  }, []);

  const handleCheckoutSuccess = useCallback((details: any) => {
    // Handle successful payment
    console.log('Payment successful', details);
    resetSelections();
  }, [resetSelections]);

  const handleCheckoutError = useCallback((error: any) => {
    // Handle payment error
    console.error('Payment error', error);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] overflow-hidden"
      >
        {/* Backdrop with luxury blur effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Main gallery container */}
        <div className="relative h-screen max-h-screen flex flex-col overflow-auto">
          {/* Elegant header with gold accent */}
          <div className="relative border-b border-white/10 z-20">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="px-8 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between"
            >
              <div className="space-y-1 text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-white/90 text-2xl md:text-3xl font-light tracking-[0.1em] mb-1">
                  {language === 'en' ? 'Artworks' : "Œuvres d'art"}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-6 bg-white/30"></div>
                  <p className="text-white/60 font-light tracking-wider text-xs uppercase">
                    {language === 'en' ? 'Limited Edition • 5 Pieces' : 'Édition Limitée • 5 Œuvres'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-8 items-center">
                <div className="hidden md:flex space-x-6 items-center">
                  {/* Language Switcher */}
                  <div className="flex items-center space-x-3 mr-6 border-r border-white/10 pr-6">
                    <button
                      onClick={() => setLanguage('en')} 
                      className={`text-sm tracking-wide uppercase ${language === 'en' ? 'text-white/90' : 'text-white/40 hover:text-white/60'} transition-colors`}
                    >
                      <div className="flex flex-col items-center">
                        <span>EN</span>
                        {language === 'en' && <div className="h-[1px] w-4 bg-white/60 mt-1"></div>}
                      </div>
                    </button>
                    <div className="text-white/20 text-xs">|</div>
                    <button
                      onClick={() => setLanguage('fr')}
                      className={`text-sm tracking-wide uppercase ${language === 'fr' ? 'text-white/90' : 'text-white/40 hover:text-white/60'} transition-colors`}
                    >
                      <div className="flex flex-col items-center">
                        <span>FR</span>
                        {language === 'fr' && <div className="h-[1px] w-4 bg-white/60 mt-1"></div>}
                      </div>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('gallery')}
                    className={`text-sm tracking-wide uppercase ${activeTab === 'gallery' ? 'text-white/90' : 'text-white/40 hover:text-white/60'} transition-colors`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{language === 'en' ? 'Works' : 'Œuvres'}</span>
                      {activeTab === 'gallery' && <div className="h-[1px] w-8 bg-white/60 mt-1"></div>}
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('about')}
                    className={`text-sm tracking-wide uppercase ${activeTab === 'about' ? 'text-white/90' : 'text-white/40 hover:text-white/60'} transition-colors`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{language === 'en' ? 'About' : 'À Propos'}</span>
                      {activeTab === 'about' && <div className="h-[1px] w-8 bg-white/60 mt-1"></div>}
                    </div>
                  </button>
                </div>
                <button
                  onClick={() => activeTab === 'about' ? setActiveTab('gallery') : onClose()}
                  className="text-white/40 hover:text-white/70 transition-colors p-2 border border-white/10 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Mobile navigation - only visible on small screens */}
          <div className="md:hidden px-4 py-4 border-b border-white/10">
            <div className="flex justify-between items-center">
              {/* Mobile language switcher */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setLanguage('en')} 
                  className={`text-sm tracking-wide uppercase ${language === 'en' ? 'text-white/90' : 'text-white/40 hover:text-white/60'} transition-colors`}
                >
                  <div className="flex flex-col items-center">
                    <span>EN</span>
                    {language === 'en' && <div className="h-[1px] w-4 bg-white/60 mt-1"></div>}
                  </div>
                </button>
                <div className="text-white/20 text-xs">|</div>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`text-sm tracking-wide uppercase ${language === 'fr' ? 'text-white/90' : 'text-white/40 hover:text-white/60'} transition-colors`}
                >
                  <div className="flex flex-col items-center">
                    <span>FR</span>
                    {language === 'fr' && <div className="h-[1px] w-4 bg-white/60 mt-1"></div>}
                  </div>
                </button>
              </div>
              
              {/* Mobile tab navigation */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => setActiveTab('gallery')}
                  className={`text-sm tracking-wide uppercase ${activeTab === 'gallery' ? 'text-white/90' : 'text-white/40 hover:text-white/60'} transition-colors`}
                >
                  <div className="flex flex-col items-center">
                    <span>{language === 'en' ? 'Works' : 'Œuvres'}</span>
                    {activeTab === 'gallery' && <div className="h-[1px] w-8 bg-white/60 mt-1"></div>}
                  </div>
                </button>
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`text-sm tracking-wide uppercase ${activeTab === 'about' ? 'text-white/90' : 'text-white/40 hover:text-white/60'} transition-colors`}
                >
                  <div className="flex flex-col items-center">
                    <span>{language === 'en' ? 'About' : 'À Propos'}</span>
                    {activeTab === 'about' && <div className="h-[1px] w-8 bg-white/60 mt-1"></div>}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'gallery' ? (
              <div className="px-4 md:px-8 py-6">
                {/* Gallery grid with elegant spacing and luxury aesthetic */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 auto-rows-auto max-w-5xl mx-auto">
                  {designs.map((design, index) => (
                    <motion.div
                      key={design.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                      className="group cursor-pointer"
                      onClick={() => setSelectedDesign(design)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden border border-white/5 mb-4 shadow-md shadow-black/40 hover:shadow-lg hover:shadow-black/30 transition-shadow duration-300">
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
                        <Image
                          src={design.image}
                          alt={design.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 3} // Prioritize first 3 designs
                          loading={index < 3 ? 'eager' : 'lazy'} // Lazy load designs below the fold
                          className={`object-cover transition-all duration-700 group-hover:scale-105 ${design.id === '1' ? 'scale-[1.07]' : ''}`}
                          style={design.id === '1' ? {objectPosition: 'center'} : {}}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <span className="text-white/80 text-sm tracking-wider">{language === 'en' ? 'Details' : 'Détails'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 px-1">
                        <h3 className="text-white/90 text-lg font-light">{design.title}</h3>
                        <div className="flex justify-between items-center">
                          <p className="text-white/40 text-sm">{language === 'en' ? 'Artwork' : 'Œuvre d\'art'}, {design.year}</p>
                          <p className="text-white/70 text-sm">{language === 'en' ? `From €${design.basePrice}` : `À partir de €${design.basePrice}`}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-4 md:px-12 py-12 max-w-4xl mx-auto text-center">
                <h3 className="text-white/80 text-xl tracking-wider mb-8 font-light">
                  {language === 'en' ? 'Artistic Approach' : 'Démarche artistique'}
                </h3>
                {language === 'en' ? (
                  <>
                    <p className="text-white/70 leading-relaxed mb-6">
                      Through his art, Sanchit explores the dimensions of masculine and feminine beyond social conventions and gender assignments. His work questions identity constructs and the freedom to exist outside societal frameworks. Guided by a vision where the heart takes precedence over labels, he invites us to perceive the world not through rigid cultural filters, but from a space of sensitivity and purity. Inspired by his journey around the globe, he questions how human beings define themselves and interact, proposing an approach where the individual, in their entirety, becomes the expression of a culture in motion.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-6">
                      His creative process relies on the body as the primary medium, a space where masculine and feminine energies intertwine. Classical dance, movement, and the activation of the senses are at the heart of his practice, allowing him to feel, transcribe, and bring his sensations to life. Each gesture, each line drawn on paper becomes an extension of this search for harmony, where visual art and movement blend in the expression of intimacy and sensuality. This exploration enables him to transform his heartfelt expressions into a living work of art in constant evolution.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-8">
                      Through his art, Sanchit invites the audience to move beyond traditional frameworks and reconnect with a more fluid perception of ideologies. He shares a vision where feminine energy, essential to the experience of beauty and sensitivity, transcends gender and cultural expectations. His work encourages seeing bodies not as gendered entities, but as reflections of our own inner perceptions. The viewer is thus led to question their filters, to open themselves to a new reading of the living, and to explore their own capacity to welcome others from a space of heart rather than social conditioning.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-white/70 leading-relaxed mb-6">
                      Sanchit Babbar explore, à travers son art, les dimensions du masculin et du féminin au-delà des conventions sociales et des assignations de genre. Son travail interroge les constructions identitaires et la liberté d'être en dehors des cadres imposés par la société. Porté par une vision où le cœur prime sur les étiquettes, il invite à percevoir le monde non plus à travers des filtres culturels rigides, mais à partir d'un espace de sensibilité et pureté. Inspiré par son parcours entre l'Inde et le monde, il questionne la manière dont les êtres humains se définissent et interagissent, proposant une approche où l'individu, dans sa totalité, devient l'expression d'une culture en mouvement.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-6">
                      Son processus de création s'appuie sur le corps comme médium principal, un espace où s'entrelacent énergies masculines et féminines. La danse classique, le mouvement et l'activation des sens sont au cœur de sa pratique, lui permettant de ressentir, de transcrire et de donner vie à son ressenti. Chaque geste, chaque trait de crayon sur le papier devient une extension de cette recherche d'harmonie, où l'art visuel et le mouvement s'harmonisent dans l'expression de l'intimité et de la sensualité. Cette exploration lui permet de transformer son corps en une œuvre vivante, en constante évolution.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-8">
                      À travers son art, Sanchit Babbar invite le public à dépasser les cadres traditionnels et à se reconnecter à une perception plus fluide de l'identité. Il partage une vision où l'énergie féminine, essentielle à l'expérience de la beauté et de la sensibilité, transcende les genres et les attentes culturelles. Son œuvre incite à voir les corps non pas comme des entités genrées, mais comme des reflets de nos propres perceptions intérieures. Le spectateur est ainsi amené à questionner ses filtres, à s'ouvrir à une nouvelle lecture du vivant et à explorer sa propre capacité à accueillir l'autre depuis un espace de cœur plutôt que de conditionnement social.
                    </p>
                  </>
                )}
                
                <div className="h-px w-12 bg-white/30 mx-auto mb-8"></div>
                
                <h3 className="text-white/80 text-xl tracking-wider mb-8 font-light">
                  {language === 'en' ? 'The Collection' : 'La Collection'}
                </h3>
                {language === 'en' ? (
                  <>
                    <p className="text-white/70 leading-relaxed mb-8">
                      Each piece in this exclusive collection is drawn from Sanchit Babbar's original creations. Limited to only 5 copies per design, these art prints are produced on the highest quality papers with archival inks guaranteeing exceptional longevity.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-8">
                      A certificate of authenticity signed by the artist accompanies each print, attesting to its origin and rarity. The works are delivered unframed, allowing you to choose the frame that will best harmonize with your interior.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-white/70 leading-relaxed mb-8">
                      Chaque œuvre de cette collection exclusive est tirée des créations originales de Sanchit Babbar. Limitée à seulement 5 exemplaires par design, ces impressions d'art sont produites sur des papiers de la plus haute qualité avec des encres archivistiques garantissant une longévité exceptionnelle.
                    </p>
                    <p className="text-white/70 leading-relaxed mb-8">
                      Un certificat d'authenticité signé par l'artiste accompagne chaque tirage, attestant de son origine et de sa rareté. Les œuvres sont livrées non encadrées, vous permettant de choisir le cadre qui s'harmonisera le mieux avec votre intérieur.
                    </p>
                  </>
                )}
                <div className="h-px w-12 bg-white/30 mx-auto mb-8"></div>
                <p className="text-white/50 italic">
                  {language === 'en' 
                    ? 'For any questions regarding prints or for a custom order, please contact us directly.'
                    : 'Pour toute question concernant les impressions ou pour une commande personnalisée, veuillez nous contacter directement.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Modal with luxury aesthetics */}
        <AnimatePresence>
          {selectedDesign && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[200] flex items-start md:items-center justify-center overflow-auto pt-0 md:pt-0"
                onClick={(e) => e.target === e.currentTarget && setSelectedDesign(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="w-full max-w-5xl bg-black/95 backdrop-blur-sm border border-white/10 mx-4 my-4 md:my-0 overflow-hidden"
                >
                  <div className="relative grid grid-cols-1 md:grid-cols-2 h-full">
                    {/* Left: Image with elegant overlay */}
                    <div className="relative h-[30vh] md:h-auto">
                      <div className="relative h-full w-full bg-transparent overflow-hidden">
                        <Image
                          src={selectedDesign.image}
                          alt={selectedDesign.title}
                          fill
                          sizes="(max-width: 768px) 95vw, 50vw"
                          className="object-contain"
                          priority
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4="
                        />
                      </div>
                      <button
                        onClick={() => setSelectedDesign(null)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 border border-white/10 rounded-full bg-black/30 backdrop-blur-sm z-20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Right: Product details with luxury styling */}
                    <div className="p-6 md:p-10 space-y-6 md:space-y-8 overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
                      {/* Product header */}
                      <div className="space-y-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="h-[1px] w-8 bg-white/60"></div>
                          <h5 className="text-white/80 uppercase tracking-widest text-xs font-light">
                            {language === 'en' ? 'Limited Edition' : 'Édition Limitée'}
                          </h5>
                        </div>
                        <h3 className="text-white/95 text-2xl md:text-3xl font-light tracking-wide">{selectedDesign.title}</h3>
                        <p className="text-white/60 tracking-wide leading-relaxed">{language === 'en' ? selectedDesign.descriptionEn : selectedDesign.descriptionFr}</p>
                      </div>

                      {/* Product specs */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-white/40 uppercase tracking-wider text-xs">{language === 'en' ? 'Technique' : 'Technique'}</p>
                            <p className="text-white/80">{language === 'en' ? 'Tactile Monochromes' : 'Monochrome texturé'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-white/40 uppercase tracking-wider text-xs">{language === 'en' ? 'Year' : 'Année'}</p>
                            <p className="text-white/80">{selectedDesign.year}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-white/40 uppercase tracking-wider text-xs">{language === 'en' ? 'Edition' : 'Édition'}</p>
                            <p className="text-white/80">{language === 'en' ? 'Limited to 5' : 'Limitée à 5'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Size Selection */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white/80 text-xs uppercase tracking-[0.2em]">
                            {language === 'en' ? 'Select Size' : 'Choisir la Taille'}
                          </h4>
                          
                          {/* Limited Edition Status Indicator */}
                          <div className="flex items-center">
                            <div className="h-[3px] w-[3px] rounded-full mr-2 bg-teal-400" />
                            {selectedDesign.availablePieces === 0 ? (
                              <span className="text-[10px] tracking-[0.2em] uppercase font-light text-rose-400/90">
                                {language === 'en' ? 'No longer available' : "N'est plus disponible"}
                              </span>
                            ) : selectedDesign.availablePieces === 1 ? (
                              <span className="text-[10px] tracking-[0.2em] uppercase font-light text-amber-400/90">
                                {language === 'en' ? 'Only one left' : 'Plus qu\'un seul'}
                              </span>
                            ) : (
                              <span className="text-[10px] tracking-[0.2em] uppercase font-light text-teal-400/80">
                                {language === 'en' 
                                  ? `${selectedDesign.availablePieces} of 5 Left`
                                  : `${selectedDesign.availablePieces} sur 5 Restants`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedDesign.sizes.map((size) => {
                            const isSoldOut = size.availability === 'sold-out' || selectedDesign.availablePieces === 0;
                            return (
                              <button
                                key={size.id}
                                onClick={() => !isSoldOut && setSelectedSize(size)}
                                disabled={isSoldOut}
                                className={`p-4 border ${selectedSize?.id === size.id ? 'border-white/30 bg-black/40' : 'border-white/10'} 
                                  ${isSoldOut ? 'opacity-40 cursor-not-allowed' : 'hover:border-white/30'} transition-all duration-300 text-left flex justify-between`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white/90 font-light">{size.dimensions}</span>
                                    {isSoldOut && (
                                      <span className="text-[10px] tracking-[0.2em] uppercase font-light text-rose-400/90">
                                        {language === 'en' ? 'Unavailable' : 'Indisponible'}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-white/40 text-xs">
                                    {language === 'en' ? (
                                      size.recommended
                                    ) : (
                                      size.id === 'xs' ? 'Encadrée en noir' :
                                      size.id === 'small' ? 'Parfait pour les espaces intimes et collections privées' :
                                      size.id === 'medium' ? 'Idéal pour les salons et galeries' :
                                      size.id === 'large' ? 'Pièce d\'exception pour grands espaces' :
                                      'Format magistral pour résidences de luxe'
                                    )}
                                  </p>
                                </div>
                                <span className="text-white/70 font-light">€{size.price}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quality Selection */}
                      <div className="space-y-3">
                        <h4 className="text-white/80 text-xs uppercase tracking-[0.2em] mb-3">
                          {language === 'en' ? 'Select Paper Quality' : 'Choisir la Qualité du Papier'}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedDesign.qualities.map((quality) => (
                            <button
                              key={quality.id}
                              onClick={() => selectedDesign.availablePieces > 0 && setSelectedQuality(quality)}
                              className={`p-4 border ${selectedQuality?.id === quality.id ? 'border-white/30 bg-black/40' : 'border-white/10'} ${selectedDesign.availablePieces > 0 ? 'hover:border-white/30' : 'opacity-40 cursor-not-allowed'} transition-all duration-300 text-left`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-white/90 font-light">{language === 'en' ? quality.name : (quality.id === 'premium' ? 'Premium Archival' : 'Édition Platinum')}</span>
                                <span className="text-white/80 text-xs">
                                  {quality.priceMultiplier > 1 ? `+${(quality.priceMultiplier - 1) * 100}%` : (language === 'en' ? 'Standard' : 'Standard')}
                                </span>
                              </div>
                              <p className="text-white/40 text-xs">
                                {language === 'en' ? 
                                  quality.description : 
                                  (quality.id === 'premium' ? 
                                    'Qualité muséale Hahnemühle Photo Rag 308gsm, longévité de plus de 100 ans' : 
                                    'Exceptionnel Hahnemühle German Etching 310gsm, finition à la main avec revêtement protecteur'
                                  )
                                }
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Purchase section */}
                      <div className="pt-6 border-t border-white/10 space-y-6">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                              {language === 'en' ? 'Total Price' : 'Prix Total'}
                            </p>
                            <p className="text-white text-2xl font-light">
                              {calculatePrice() ? `€${calculatePrice()}` : '—'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-white/40 text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 21l9.618-13.016z" />
                            </svg>
                            <span>{language === 'en' ? 'Certificate of authenticity' : "Certificat d'authenticité"}</span>
                          </div>
                        </div>
                        
                        {isCheckout ? (
                          <div className="space-y-6">
                            {showArtworkSuccess ? (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-6 flex flex-col items-center justify-center space-y-4"
                              >
                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                                  <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <div className="text-center">
                                  <p className="text-white/80 text-sm tracking-wide font-light">Message sent successfully.</p>
                                  <p className="text-white/50 text-xs mt-1">We will contact you shortly to confirm your purchase.</p>
                                </div>
                              </motion.div>
                            ) : (
                              <form
                                action="https://formspree.io/f/mrpgkojw"
                                method="POST"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  setArtworkSubmissionError(false);
                                  const form = e.target as HTMLFormElement;
                                  const formData = new FormData(form);
                                  formData.append('artwork', `${selectedDesign?.title} - ${selectedSize?.dimensions || ''} - ${selectedQuality?.name || ''}`);
                                  formData.append('price', `€${calculatePrice()}`);
                                  formData.append('_subject', `Artwork Purchase Request: ${selectedDesign?.title}`);
                                  const emailValue = formData.get('email');
                                  if (emailValue && !formData.get('_replyto')) {
                                    formData.append('_replyto', emailValue.toString());
                                  }
                                  fetch(form.action, {
                                    method: 'POST',
                                    body: formData,
                                    headers: { Accept: 'application/json' },
                                  })
                                    .then((response) => {
                                      if (!response.ok) throw new Error('Submission failed');
                                      setShowArtworkSuccess(true);
                                      setTimeout(() => {
                                        setIsCheckout(false);
                                        setShowArtworkSuccess(false);
                                      }, 5000);
                                    })
                                    .catch(() => setArtworkSubmissionError(true));
                                }}
                                className="space-y-4"
                              >
                                <div className="space-y-5">
                                  <div className="flex flex-col border-b border-white/10 px-0 py-3">
                                    <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{language === 'en' ? 'Full Name' : 'Nom Complet'}</span>
                                    <input
                                      type="text"
                                      name="name"
                                      required
                                      className="text-white/90 text-xs tracking-[0.2em] bg-transparent border-none focus:outline-none w-full mt-1 caret-white"
                                    />
                                  </div>
                                  <div className="flex flex-col border-b border-white/10 px-0 py-3">
                                    <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{language === 'en' ? 'Email Address' : 'Adresse Email'}</span>
                                    <input
                                      type="email"
                                      name="email"
                                      required
                                      className="text-white/90 text-xs tracking-[0.2em] bg-transparent border-none focus:outline-none w-full mt-1 caret-white"
                                    />
                                  </div>
                                  <div className="flex flex-col border-b border-white/10 px-0 py-3">
                                    <span className="text-white/40 text-xs tracking-[0.2em] mb-2">{language === 'en' ? 'Your Message' : 'Votre Message'}</span>
                                    <textarea
                                      name="message"
                                      required
                                      rows={2}
                                      defaultValue={language === 'en' ? `I'm interested in purchasing ${selectedDesign?.title} (${selectedSize?.dimensions || ''}, ${selectedQuality?.name || ''}) — €${calculatePrice()}.` : `Je souhaite acquérir ${selectedDesign?.title} (${selectedSize?.dimensions || ''}, ${selectedQuality?.name || ''}) — €${calculatePrice()}.`}
                                      className="text-white/90 text-xs leading-relaxed tracking-[0.05em] bg-transparent border-none focus:outline-none w-full resize-none mt-1"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  className="w-full px-4 py-1.5 relative group bg-transparent text-white/80 hover:text-white font-extralight text-[10px] tracking-[0.25em] uppercase transition-all duration-300 overflow-hidden focus:outline-none focus:ring-0 ring-0 no-ring"
                                  style={{ outline: 'none !important', boxShadow: 'none !important' }}
                                >
                                  <span className="relative z-10">{language === 'en' ? 'PLACE YOUR REQUEST' : 'ENVOYER MA DEMANDE'}</span>
                                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-transparent" />
                                  <div
                                    className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ animation: 'artworkGradientSlide 2s linear infinite' }}
                                  />
                                  <style jsx>{`
                                    @keyframes artworkGradientSlide {
                                      0% { transform: translateX(-100%); }
                                      100% { transform: translateX(100%); }
                                    }
                                  `}</style>
                                </button>
                              </form>
                            )}
                            {artworkSubmissionError && <p role="status" className="text-[10px] text-center text-red-300/80">{language === 'en' ? 'Your request could not be sent. Please contact contact@studiosanch.com.' : 'Votre demande n’a pas pu être envoyée. Contactez contact@studiosanch.com.'}</p>}
                            <button 
                              onClick={() => { setIsCheckout(false); setShowArtworkSuccess(false); }}
                              className="w-full py-2 border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs tracking-wider uppercase transition-colors"
                            >
                              {language === 'en' ? 'Back to selection' : 'Retour à la sélection'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsCheckout(true)}
                            disabled={!selectedSize || !selectedQuality || selectedDesign.availablePieces === 0}
                            className={`w-full py-4 transition-all duration-300 ${selectedDesign.availablePieces === 0 ? 'bg-white/10 text-rose-400/70 cursor-not-allowed' : selectedSize && selectedQuality ? 'bg-white text-black hover:bg-white/90' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                          >
                            <span className="text-sm tracking-[0.2em] uppercase font-light">
                              {selectedDesign.availablePieces === 0 ?
                                (language === 'en' ? 'No longer available' : "N'est plus disponible") :
                                selectedSize && selectedQuality ? 
                                  (language === 'en' ? 'Purchase Print' : 'Acheter le Tirage') : 
                                  (language === 'en' ? 'Select Options Above' : 'Sélectionner les Options')}
                            </span>
                          </button>
                        )}
                        
                        <p className="text-center text-white/40 text-xs">
                          {language === 'en' ? 'All prints are shipped unframed and include a certificate of authenticity' : 'Tous les tirages sont livrés sans cadre et incluent un certificat d\'authenticité'}
                        </p>
                        <p className="text-center text-white/40 text-xs mt-1">
                          {language === 'en' ? 'Archival-Grade Framing is available upon request.' : "L'encadrement de qualité musée est disponible sur mesure."}
                        </p>
                        <p className="text-center text-white/40 text-xs mt-3 italic">
                          {language === 'en' ? 'As artworks, artistic services, and personalized creations are unique, no refunds or exchanges will be possible.' : "Les œuvres d'art, les services artistiques et les créations personnalisées étant uniques, aucun remboursement ni échange ne pourra être effectué."}
                        </p>
                        <p className="text-center text-white/40 text-xs mt-3 italic">
                          {language === 'en' ? 'Shipments outside France will incur additional delivery charges based on current FedEx rates.' : "L'expédition vers des pays étrangers entraînera des frais de livraison additionnels selon les tarifs actuels de FedEx."}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
