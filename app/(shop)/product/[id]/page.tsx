'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import { accessoryProducts, AccessoryProduct } from '../../../data/accessories';
import ProductCheckoutModal from '../../../components/ProductCheckoutModal';
import { useLanguage } from '../../../context/LanguageContext';

// Using imported AccessoryProduct type and accessoryProducts array from data/accessories.ts

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<AccessoryProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<AccessoryProduct[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const { language } = useLanguage();
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [allProductImages, setAllProductImages] = useState<string[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [artbookMediaMode, setArtbookMediaMode] = useState<'film' | 'object'>('film');
  const [isFilmPlaying, setIsFilmPlaying] = useState(true);
  const artbookFilmRef = useRef<HTMLVideoElement>(null);
  
  // Find the product and related products
  useEffect(() => {
    const foundProduct = accessoryProducts.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Prepare all product images for gallery
      const productImages = [foundProduct.image];
      if (foundProduct.additionalImages) {
        productImages.push(...foundProduct.additionalImages);
      }
      setAllProductImages(productImages);
      setSelectedImage(productImages[0]);
      setArtbookMediaMode(foundProduct.id === 'artbook-main' ? 'film' : 'object');
      
      // Always include the belt product unless current product is the belt
      const beltProduct = accessoryProducts.find(p => p.id === 'belt-sanch');

      // Get related products from the same category, excluding the current product
      const related = accessoryProducts
        .filter(p => p.categoryId === foundProduct.categoryId && p.id !== foundProduct.id)
        .filter(p => !p.id.includes('bracelet') && !p.id.includes('necklace') && !p.hidden)
        .slice(0, 3);
        
      // Add products from other categories if needed
      const otherProducts = accessoryProducts
        .filter(p => p.categoryId !== foundProduct.categoryId && p.id !== foundProduct.id && p.categoryId !== 'artworks')
        .filter(p => !p.id.includes('bracelet') && !p.id.includes('necklace') && !p.hidden)
        .slice(0, 2);

      const artworkItem = accessoryProducts.find(p => p.id === 'artwork-featured');
      
      // Combine related products, prioritizing the belt
      let allRelated = [];
      if (beltProduct && foundProduct.id !== 'belt-sanch') {
        allRelated = [beltProduct, ...related.filter(p => p.id !== 'belt-sanch'), ...otherProducts.filter(p => p.id !== 'belt-sanch')].slice(0, 3);
      } else {
        allRelated = [...related, ...otherProducts].slice(0, 3);
      }
      if (artworkItem) allRelated = [...allRelated, artworkItem];
      setRelatedProducts(allRelated);
    } else {
      // Handle case where product isn't found
      router.push('/');
    }
  }, [productId, router]);
  
  // Automate the slow scroll effect for related products
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => prev + 0.035); // Even slower motion (reduced from 0.08 to 0.035)
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <main className="bg-black text-white min-h-screen">
        <Navigation />
      
      <motion.section 
        className="py-32 px-8 md:px-24 lg:px-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-12 flex items-center space-x-2 text-sm text-white/60">
            <Link 
              href="/"
              className="hover:text-white transition-colors"
            >
              {language === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <span>/</span>
            <Link 
              href="/boutique/"
              className="hover:text-white transition-colors"
            >
              Boutique
            </Link>
            <span>/</span>
            <Link 
              href="/boutique/?category=accessories"
              className="hover:text-white transition-colors"
            >
              {language === 'fr' ? 'Collection' : 'Collection'}
            </Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </div>

          {/* Back to Collection Link - Ultra Elegant version */}
          <div className="flex justify-end mb-12">
            <Link 
              href="/boutique/?category=accessories"
              className="text-white/60 hover:text-white text-[10px] uppercase tracking-[0.25em] transition-all duration-500 font-light flex items-center gap-2 group"
            >
              <span className="text-[8px] opacity-60 transform group-hover:translate-x-[-4px] transition-all duration-500 ease-in-out">←</span>
              <span className="group-hover:tracking-[0.3em] transition-all duration-500 ease-in-out">{language === 'fr' ? 'RETOUR À LA COLLECTION' : 'RETURN TO COLLECTION'}</span>
            </Link>
          </div>

          {/* Product Detail - Luxury Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-32">
            {/* Left column - Product Images */}
            <motion.div 
              className="md:col-span-6 flex flex-col space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Main Product Image / Artbook Editorial Film */}
              <div 
                className={`${product?.id === 'artbook-main' ? `aspect-video max-w-2xl ${artbookMediaMode === 'film' ? 'rounded-md' : ''}` : 'aspect-square max-w-md rounded-md'} group relative overflow-hidden bg-transparent w-full mx-auto`}
                style={product?.id === 'artbook-main' && artbookMediaMode === 'object' ? { borderRadius: '6px', clipPath: 'inset(0 round 6px)', backgroundColor: selectedImage === product.image ? '#000' : '#f7f7f6' } : undefined}
                onMouseMove={(e) => {
                  if (!isZoomed) return;
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - bounds.left) / bounds.width) * 100;
                  const y = ((e.clientY - bounds.top) / bounds.height) * 100;
                  setZoomPosition({ x, y });
                }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                {product?.id === 'artbook-main' && artbookMediaMode === 'film' ? (
                  <div className="relative w-full h-full bg-[#080808]">
                    <video
                      ref={artbookFilmRef}
                      src="/Videos/sanch-artbook-editorial-film.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      onPlay={() => setIsFilmPlaying(true)}
                      onPause={() => setIsFilmPlaying(false)}
                      className="w-full h-full object-cover"
                      aria-label={language === 'fr' ? "Film éditorial du livre d’art SANCH" : 'SANCH artbook editorial film'}
                    />

                    <div className="pointer-events-none absolute inset-[1px] border border-white/[0.08] rounded-[5px]" />

                    <button
                      type="button"
                      aria-label={isFilmPlaying ? (language === 'fr' ? 'Mettre le film en pause' : 'Pause film') : (language === 'fr' ? 'Lire le film' : 'Play film')}
                      onClick={() => {
                        const film = artbookFilmRef.current;
                        if (!film) return;
                        if (film.paused) void film.play();
                        else film.pause();
                      }}
                      className="absolute z-10 inset-0 cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-4px] focus-visible:outline-white/60"
                    >
                      <span className="sr-only">{isFilmPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>
                ) : selectedImage ? (
                  <div
                    className="relative w-full h-full overflow-hidden rounded-md"
                    style={{ backgroundColor: selectedImage === product.image ? '#000' : '#f7f7f6' }}
                  >
                    <Image 
                      src={selectedImage}
                      alt={product?.name || 'Product image'}
                      fill
                      style={{
                        objectFit: product?.id === 'artbook-main' ? 'contain' : 'cover',
                        objectPosition: (() => {
                          // Custom positioning for sanch-suede product images to show model faces
                          if (product?.id === 'sanch-suede') {
                            // For specific images where we need to show the model's face/head
                            const imageName = selectedImage?.split('/').pop();
                            if (imageName === '2.jpg') {
                              return 'center 15%'; // Show model's face with more margin at the top
                            } else if (imageName === '3.jpg' || imageName === '5.jpg') {
                              return 'center 20%'; // Show model's face
                            } else if (imageName === '8.jpg') {
                              return 'center 40%'; // Adjusted to show just the model and the bag
                            }
                            return 'center 60%'; // Default for other suede bag images
                          }
                          // For canvas bag or previous tote-sketch product
                          else if (product?.id === 'sanch-canvas') {
                            return 'center 60%';
                          }
                          // Default positioning for all other products
                          return 'center bottom';
                        })(),
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: product?.id !== 'artbook-main' && isZoomed ? 'scale(2)' : 'scale(1)',
                        transition: product?.id !== 'artbook-main' && isZoomed ? 'transform 0.2s ease-out' : 'transform 0.5s ease',
                      }}
                      priority
                      className="transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  // Placeholder for missing image
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                    <span className="text-2xl font-syne tracking-wider">{product?.name}</span>
                  </div>
                )}
                
                {/* Subtle instruction for zoom */}
                {product?.id !== 'artbook-main' && (
                  <div className={`absolute bottom-4 right-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-[10px] uppercase tracking-wider transition-opacity duration-500 ${isZoomed ? 'opacity-0' : 'opacity-70'}`}>
                    {language === 'fr' ? 'Survoler pour zoomer' : 'Hover to zoom'}
                  </div>
                )}
              </div>

              {product?.id === 'artbook-main' && (
                <div className="flex justify-center items-center gap-5 text-[8px] uppercase tracking-[0.34em] font-light">
                  <button
                    type="button"
                    onClick={() => setArtbookMediaMode('film')}
                    className={`pb-2 border-b transition-all duration-500 ${artbookMediaMode === 'film' ? 'text-white border-white/70' : 'text-white/35 border-transparent hover:text-white/70'}`}
                  >
                    Motion
                  </button>
                  <span className="h-3 w-px bg-white/15" />
                  <button
                    type="button"
                    onClick={() => {
                      artbookFilmRef.current?.pause();
                      setArtbookMediaMode('object');
                    }}
                    className={`pb-2 border-b transition-all duration-500 ${artbookMediaMode === 'object' ? 'text-white border-white/70' : 'text-white/35 border-transparent hover:text-white/70'}`}
                  >
                    {language === 'fr' ? 'Objet' : 'Object'}
                  </button>
                </div>
              )}
              
              {/* Discreet artbook object navigation */}
              {product?.id === 'artbook-main' && artbookMediaMode === 'object' && allProductImages.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-1 text-white/45">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = Math.max(0, allProductImages.indexOf(selectedImage || ''));
                      setSelectedImage(allProductImages[(currentIndex - 1 + allProductImages.length) % allProductImages.length]);
                    }}
                    className="h-6 w-6 flex items-center justify-center text-[11px] hover:text-white transition-colors duration-500"
                    aria-label={language === 'fr' ? 'Image précédente' : 'Previous image'}
                  >
                    ←
                  </button>
                  <div className="flex items-center gap-[7px]" aria-label={language === 'fr' ? 'Sélection d’image' : 'Image selection'}>
                    {allProductImages.map((imageSrc, index) => (
                      <button
                        key={imageSrc}
                        type="button"
                        onClick={() => setSelectedImage(imageSrc)}
                        className={`h-[3px] rounded-full transition-all duration-500 ${selectedImage === imageSrc ? 'w-4 bg-white/80' : 'w-[3px] bg-white/25 hover:bg-white/55'}`}
                        aria-label={`${language === 'fr' ? 'Voir l’image' : 'View image'} ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = Math.max(0, allProductImages.indexOf(selectedImage || ''));
                      setSelectedImage(allProductImages[(currentIndex + 1) % allProductImages.length]);
                    }}
                    className="h-6 w-6 flex items-center justify-center text-[11px] hover:text-white transition-colors duration-500"
                    aria-label={language === 'fr' ? 'Image suivante' : 'Next image'}
                  >
                    →
                  </button>
                </div>
              )}

              {/* Thumbnail Gallery */}
              {product?.id !== 'artbook-main' && allProductImages.length > 1 && (
                <motion.div 
                  className="flex justify-center gap-6 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {allProductImages.map((imageSrc, index) => (
                    <button 
                      key={index}
                      className={`w-12 h-12 relative overflow-hidden rounded-md transition-all duration-300 ${selectedImage === imageSrc ? 'opacity-100 border-b border-white' : 'opacity-50 hover:opacity-90 border-b border-transparent'}`}
                      onClick={() => setSelectedImage(imageSrc)}
                      aria-label={`${language === 'fr' ? 'Voir l’image' : 'View image'} ${index + 1}`}
                    >
                      <Image 
                        src={imageSrc}
                        alt={`${product?.name} - View ${index + 1}`}
                        fill
                        sizes="80px"
                        style={{ 
                          objectFit: 'cover', 
                          objectPosition: (() => {
                            // Special positioning for thumbnail images that need to show the model's face
                            if (product?.id === 'sanch-suede') {
                              const imageName = imageSrc.split('/').pop();
                              if (imageName === '2.jpg') {
                                return 'center 15%'; // Show model's face with more margin at the top in thumbnails
                              } else if (imageName === '3.jpg' || imageName === '5.jpg') {
                                return 'center 20%'; // Show model's face in thumbnails
                              } else if (imageName === '8.jpg') {
                                return 'center 40%'; // Adjusted to show just the model and the bag in thumbnails
                              }
                              return 'center 60%'; // Default for other suede bag images
                            }
                            // For canvas bag
                            else if (product?.id === 'sanch-canvas') {
                              return 'center 60%';
                            }
                            // Default
                            return 'center center';
                          })()
                        }}
                      />
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Right column - Product Details */}
            <motion.div
              className="md:col-span-6 flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {/* Product Name with Elegant Styling */}
              <h1 className="text-3xl font-light mb-1 font-syne tracking-wide">{product?.name}</h1>
              <div className="h-px w-16 bg-white/20 mb-6"></div>
              
              {/* Price with refined typography */}
              <p className="text-xl font-light tracking-wider text-white/90 mb-8">{product?.price}</p>
              
              {/* Description with luxury typography */}
              <div className="prose prose-invert max-w-none opacity-90 mb-10 font-light leading-relaxed tracking-wide text-white/80 text-sm">
                <p className="mb-6">{language === 'fr' && product?.descriptionFr ? product.descriptionFr : product?.description}</p>
                <p className="text-white/70">{language === 'fr' && product?.longDescriptionFr ? product?.longDescriptionFr : product?.longDescription}</p>
              </div>
              
              {/* Product Features Section */}
              <div className="mt-auto space-y-6">
                {/* Elegant Stock Status Indicator */}
                {product.stockStatus && (
                  <div className="flex items-center mb-6">
                    <div 
                      className={`h-[3px] w-[3px] rounded-full mr-2 ${product.stockStatus === 'in-stock' ? 'bg-emerald-400' : 
                                        product.stockStatus === 'limited' ? 'bg-amber-400' : 
                                        product.stockStatus === 'pre-order' ? 'bg-indigo-400' : 'bg-rose-400'}`} 
                    />
                    <span 
                      className={`text-[10px] tracking-[0.2em] uppercase font-light ${product.stockStatus === 'in-stock' ? 'text-emerald-400/90' : 
                                      product.stockStatus === 'limited' ? 'text-amber-400/90' : 
                                      product.stockStatus === 'pre-order' ? 'text-indigo-400/90' : 'text-rose-400/90'}`}
                    >
                      {language === 'fr'
                        ? (product.id === 'sunglasses-black' ? 'Liste privée' : product.stockStatus === 'in-stock' ? 'En stock' : product.stockStatus === 'limited' ? 'Stock limité' : product.stockStatus === 'pre-order' ? 'Précommande' : 'Épuisé')
                        : (product.id === 'sunglasses-black' ? 'Private Waitlist' : product.stockStatus === 'in-stock' ? 'In Stock' : product.stockStatus === 'limited' ? 'Limited Stock' : product.stockStatus === 'pre-order' ? 'Pre-Order' : 'Out of Stock')}
                    </span>
                  </div>
                )}
                                
                {/* Elegant Accordion for Product Details */}
                <div className="border-t border-b border-white/10 py-4">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="text-xs tracking-[0.2em] uppercase font-light">{language === 'fr' ? 'Détails et caractéristiques' : 'Details & Features'}</span>
                      <span className="text-xs opacity-60 transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <div className="pt-4 pb-2 text-sm text-white/70 font-light space-y-2">
                      {product?.id === 'sanch-canvas' && (
                        <>
                          <p>• {language === 'fr' ? 'Toile 100 % coton' : '100% cotton canvas'}</p>
                          <p>• {language === 'fr' ? 'Conçu et fabriqué à la main à Paris' : 'Designed and hand-crafted in Paris'}</p>
                        </>
                      )}
                      {product?.id === 'mug-sketch' && (
                        <>
                          <p>• Black matte finish ceramic inside and out</p>
                          <p>• Features SANCH logo</p>
                          <p>• Minimalist elegant design</p>
                          <p>• Handcrafted quality</p>
                        </>
                      )}
                      {product?.id === 'mug-black' && (
                        <>
                          <p>• Black matte finish ceramic inside and out</p>
                          <p>• Features Sanchit's art work 'Murmure des Pétales'</p>
                          <p>• Sophisticated minimalist design</p>
                          <p>• Handcrafted quality</p>
                        </>
                      )}
                      {(product?.id === 'artbook-main' || product?.id === 'belt-sanch' || product?.id === 'sunglasses-black') && product?.features && (
                        <>
                          {(language === 'fr' && product?.featuresFr ? product.featuresFr : product.features).map((feature, index) => (
                            feature.startsWith('~')
                              ? <p key={index} className="pl-8 text-white/70">{feature.slice(1)}</p>
                              : <p key={index}>• {feature}</p>
                          ))}
                        </>
                      )}
                      {product?.id === 'sanch-suede' && (
                        <>
                          <p>• {language === 'fr' ? 'Cuir suédé 100 %' : '100% suede leather'}</p>
                          <p>• {language === 'fr' ? 'Logo en laiton plaqué or micron' : 'Micron gold plated brass logo'}</p>
                          <p>• {language === 'fr' ? 'Design minimaliste sophistiqué' : 'Sophisticated minimalist design'}</p>
                          <p>• {language === 'fr' ? 'Doublure intérieure en daim et poche raffinée' : 'Interior suede lining with refined pocket detail'}</p>
                          <p>• {language === 'fr' ? 'Conçu et fabriqué à la main à Paris' : 'Designed and hand-crafted in Paris'}</p>
                          <p>• {language === 'fr' ? 'Exclusivement réalisé sur commande (livraison sous 6 à 8 semaines)' : 'Exclusively made-to-order (6-8 weeks delivery)'}</p>
                          <p>
                            • {language === 'fr'
                              ? "Sac de luxe : Pièce sur mesure fabriquée exclusivement sur commande selon les spécifications du client. Conformément à l'article L.221-28 du Code de la consommation, ce bien confectionné sur mesure est exclu du droit de rétractation, d'échange ou de remboursement une fois la production commencée."
                              : "Luxury designer bag: Custom-made piece manufactured exclusively per order to the client's specifications. Pursuant to Article L.221-28 of the French Consumer Code, this custom-manufactured good is excluded from the right of withdrawal, exchange, or refund once production has started."}
                          </p>
                        </>
                      )}
                      {product?.id !== 'sanch-canvas' && product?.id !== 'sanch-suede' && product?.id !== 'mug-sketch' && product?.id !== 'mug-black' && product?.id !== 'artbook-main' && product?.id !== 'belt-sanch' && product?.id !== 'sunglasses-black' && (
                        <p>• {language === 'fr' ? 'Savoir-faire de qualité supérieure' : 'Premium quality craftsmanship'}</p>
                      )}
                    </div>
                  </details>
                </div>
                
                {/* No refund policy */}
                <div className="mt-6 mb-6">
                  <p className="text-xs italic text-white/60">{language === 'fr' ? 'Les œuvres, services artistiques et créations personnalisées étant uniques, aucun remboursement ni échange ne sera possible.' : 'As artworks, artistic services, and personalized creations are unique, no refunds or exchanges will be possible.'}</p>
                </div>

                {/* Purchase Options with Elevated Styling */}
                {product?.comingSoon ? (
                  <div className="space-y-4">
                    <p className="text-xs tracking-[0.15em] uppercase font-light mb-4 text-white/80">{language === 'fr' ? 'AVANT-PREMIÈRE EXCLUSIVE' : 'EXCLUSIVE PRE-RELEASE'}</p>
                    <button className="w-full py-3 px-1 border border-white/40 hover:border-white tracking-[0.2em] text-[11px] uppercase bg-transparent hover:bg-white/5 transition-all duration-300 font-light">
                      {language === 'fr' ? "S’INSCRIRE À LA LISTE PRIORITAIRE" : 'JOIN PRIORITY WAITLIST'}
                    </button>
                  </div>
                ) : product?.id === 'sunglasses-black' ? (
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-3.5 border border-white/35 bg-white/[0.04] text-white/85 hover:bg-white hover:text-black hover:border-white transition-all duration-500 tracking-[0.2em] text-[11px] uppercase font-light"
                  >
                    {language === 'fr' ? 'S’INSCRIRE' : 'JOIN'}
                  </button>
                ) : product?.stockStatus === 'out-of-stock' ? (
                  /* Elegantly faded out button for out of stock items */
                  <div className="block w-full relative">
                    <button 
                      disabled
                      className="w-full py-3.5 bg-white/20 text-black/40 cursor-not-allowed tracking-[0.2em] text-[11px] uppercase font-light transition-all duration-500"
                    >
                      {language === 'fr' ? 'COMMANDER' : 'PURCHASE'}
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 bg-black/40 px-3 py-1 rounded-full">{language === 'fr' ? 'Épuisé' : 'Out of Stock'}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-3.5 bg-white text-black hover:bg-white/90 transition-colors tracking-[0.2em] text-[11px] uppercase font-light"
                  >
                    {language === 'fr'
                      ? (product?.stockStatus === 'in-stock' || product?.stockStatus === 'limited' ? 'COMMANDER' : 'PRÉCOMMANDER')
                      : (product?.stockStatus === 'in-stock' || product?.stockStatus === 'limited' ? 'PURCHASE' : 'PRE-ORDER NOW')}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Related Products Slow Motion Slideshow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <div className="mb-16">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-px w-12 bg-white/20"></div>
                <h2 className="uppercase text-[9px] tracking-[0.38em] font-light text-white/60">{language === 'fr' ? 'AU-DELÀ DU DÉSIR' : 'DESIRE BEYOND'}</h2>
              </div>
              <h2 className="text-lg font-extralight tracking-wide text-white/90">{language === 'fr' ? 'Luxe murmuré' : 'Whispered Luxury'}</h2>
            </div>
            
            <div className="relative overflow-hidden" style={{ height: '300px' }}>
              <div 
                className="flex space-x-8 absolute"
                style={{ 
                  transform: `translateX(${-scrollPosition}%)`,
                  width: `${relatedProducts.length * 300}px`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                {/* Duplicate the array to create an infinite loop effect */}
                {[...relatedProducts, ...relatedProducts, ...relatedProducts].map((relatedProduct, index) => (
                  <Link
                    href={relatedProduct.id === 'artwork-featured' ? '/artworks' : `/product/${relatedProduct.id}`}
                    key={`${relatedProduct.id}-${index}`}
                    className="group cursor-pointer"
                    style={{ width: '280px', flex: 'none' }}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-zinc-900 mb-4 rounded-md">
                      {/* Actual product image */}
                      <Image 
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        sizes="280px"
                        style={{ objectFit: 'cover', objectPosition: (() => {
                          // Adjust positioning for different bag products
                          if (relatedProduct.id === 'sanch-canvas') {
                            return 'center 60%';
                          } else {
                            return 'center center';
                          }
                        })() }}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <span className="text-sm tracking-[0.2em] uppercase font-light">{language === 'fr' ? 'Voir les détails' : 'View Details'}</span>
                      </div>
                    </div>
                    <h3 className="text-md mb-1">{relatedProduct.name}</h3>
                    <p className="text-white/60 text-sm">{relatedProduct.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {product && (
        <ProductCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          product={{ name: product.name, price: product.price, id: product.id }}
        />
      )}

      </main>
    </>
  );
}
