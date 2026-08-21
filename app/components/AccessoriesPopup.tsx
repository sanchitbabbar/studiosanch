'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

interface AccessoryCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  linkTo: string;
  hasSubcategories?: boolean;
}

interface SubItem {
  id: string;
  name: string;
  image: string;
  linkTo: string;
}

// Define the main accessory categories
const accessoryCategories: AccessoryCategory[] = [
  {
    id: 'bag',
    name: 'Bag',
    description: 'Statement tote bags that combine fashion and function with Sanchit\'s distinctive designs.',
    image: '/images/Accesories/SanchBagSuede/subcategory-thumbnail.jpg',
    linkTo: '/product/sanch-suede'
  },
  // Mug category hidden
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    description: 'Sophisticated eyewear that embodies Sanchit\'s aesthetic of elegant simplicity.',
    image: '/images/Accesories /Sunglasses/Render 3.jpg',
    linkTo: '/product/sunglasses-black'
  },
  {
    id: 'belt',
    name: 'Belt',
    description: 'Luxurious designer belt with refined minimalist aesthetic.',
    image: '/images/Accesories%20/Sanch%20Belt/belt-main.jpg',
    linkTo: '/product/belt-sanch'
  }
  // Other Accessories category hidden as requested
];

// Define jewelry/other accessory items
const jewelryItems: SubItem[] = [
  {
    id: 'bracelet',
    name: 'Bracelet',
    image: '/images/Accesories /Bracelets/Bracelet_1.jpg',
    linkTo: '/product/bracelet-gold'
  }
  // Necklace option hidden until launch
];

// Define bag items
const bagItems: SubItem[] = [
  {
    id: 'bag-suede',
    name: 'Sanch Suede',
    image: '/images/Accesories/SanchBagSuede/subcategory-thumbnail.jpg',
    linkTo: '/product/sanch-suede'
  }
];

// Define mug items
const mugItems: SubItem[] = [
  {
    id: 'mug-signature',
    name: 'Signature Mug',
    image: '/images/Accesories /Mugs/Cover photo.jpg',
    linkTo: '/product/mug-sketch'
  },
  // Designer Mug hidden
];

const AccessoriesPopup = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSubItems, setShowSubItems] = useState(false);
  const [currentSubItems, setCurrentSubItems] = useState<SubItem[]>([]);
  const [subItemTitle, setSubItemTitle] = useState('');
  const router = useRouter();
  const { language } = useLanguage();
  const fr = language === 'fr';

  // Handle click on a main category
  const handleCategoryClick = (category: AccessoryCategory) => {
    if (category.hasSubcategories) {
      // Show subcategories instead of navigating
      if (category.id === 'mug') {
        setCurrentSubItems(mugItems);
        setSubItemTitle('Designer Mugs');
      } else if (category.id === 'bag') {
        setCurrentSubItems(bagItems);
        setSubItemTitle('SANCH Bags');
      } else if (category.id === 'other') {
        setCurrentSubItems(jewelryItems);
        setSubItemTitle('Other Accessories');
      }
      setShowSubItems(true);
    } else {
      router.push(category.linkTo);
    }
  };

  // Handle click on a sub item
  const handleSubItemClick = (item: SubItem) => {
    router.push(item.linkTo);
  };

  // Back button handler
  const handleBack = () => {
    setShowSubItems(false);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto relative">
      <h2 className="text-2xl tracking-[0.15em] uppercase font-light text-center mb-14 font-syne">{fr ? 'CRÉATIONS SIGNATURE' : 'SIGNATURE DESIGNS'}</h2>
      
      {showSubItems ? (
        <>
          <button 
            onClick={handleBack}
            className="absolute top-0 left-0 text-white/50 hover:text-white/90 transition-colors duration-300"
          >
            ← {fr ? 'Retour aux catégories' : 'Back to Categories'}
          </button>
          
          <motion.div
            key="jewelry-items"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="grid grid-cols-2 md:flex md:justify-center gap-6 md:gap-0 md:space-x-16 mx-auto mt-8"
          >
            {currentSubItems.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.12, 
                  duration: 0.6,
                  ease: [0.19, 1, 0.22, 1]
                }}
                className="w-[120px] group cursor-pointer flex flex-col items-center"
                onClick={() => handleSubItemClick(item)}
              >
                <div className="h-[120px] w-[120px] relative mb-5 overflow-hidden rounded-md">
                  <div className="relative h-full w-full overflow-hidden">
                    <Image 
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transform scale-[1.01] group-hover:scale-[1.08] transition-transform duration-[1.2s] ease-out"
                      style={item.id === 'bag-suede' ? { objectPosition: 'center 100%' } : {}}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" 
                    />
                  </div>
                </div>
                
                <div className="h-[20px] flex items-center justify-center mb-1">
                  <motion.span 
                    className="block text-[11px] tracking-[0.25em] uppercase font-light text-white/80 group-hover:text-white transition-all duration-700" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.12, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  >
                    {item.name}
                  </motion.span>
                </div>
                
                <motion.div 
                  className="h-[1px] w-0 bg-white/40 mt-2 group-hover:w-full transition-all duration-700"
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ delay: 0.2 + index * 0.12, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          key="luxury-categories"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-2 md:flex md:justify-center gap-6 md:gap-0 md:space-x-16 mx-auto"
        >
          {accessoryCategories.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.12, 
                duration: 0.6,
                ease: [0.19, 1, 0.22, 1]
              }}
              className="w-[120px] group cursor-pointer flex flex-col items-center"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="h-[120px] w-[120px] relative mb-5 overflow-hidden rounded-md">
                {/* Added more pronounced rounded corners with rounded-md (6px radius) */}
                {(category.id === 'sunglasses' || category.id === 'mug' || category.id === 'bag' || category.id === 'belt') ? (
                  <div className="relative h-full w-full overflow-hidden">
                    <Image 
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 120px, 120px"
                      className="object-cover transform scale-[1.01] group-hover:scale-[1.08] transition-transform duration-[1.2s] ease-out"
                      style={category.id === 'bag' ? { objectPosition: 'center 70%' } : {}}
                      priority={index < 2} // Only prioritize first two images
                    />
                    <motion.div 
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" 
                    />
                  </div>
                ) : (
                  // Elegant placeholders for other categories
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center rounded-md">
                      <span className="text-xs tracking-[0.15em] uppercase font-light text-white/60 group-hover:text-white/90 transition-all duration-700">{category.id.toUpperCase()}</span>
                    </div>
                    <motion.div 
                      className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-700 rounded-md" 
                    />
                  </div>
                )}
              </div>
              
              <div className="h-[20px] flex items-center justify-center mb-1">
                <motion.span 
                  className="block text-[11px] tracking-[0.25em] uppercase font-light text-white/80 group-hover:text-white transition-all duration-700" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.12, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                >
                  {category.name}
                </motion.span>
              </div>
              
              <motion.div 
                className="h-[1px] w-0 bg-white/40 mt-2 group-hover:w-full transition-all duration-700"
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                transition={{ delay: 0.2 + index * 0.12, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AccessoriesPopup;
