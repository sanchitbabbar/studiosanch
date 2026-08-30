// Define accessory product types

export interface AccessoryProduct {
  id: string;
  name: string;
  description: string;
  descriptionFr?: string;
  longDescription: string;
  longDescriptionFr?: string;
  price: string;
  image: string;
  additionalImages?: string[];
  comingSoon: boolean;
  categoryId: string;
  stockStatus?: 'in-stock' | 'out-of-stock' | 'pre-order' | 'limited';
  features?: string[];
  featuresFr?: string[];
  hidden?: boolean;
}

// Define the main accessory products
export const accessoryProducts: AccessoryProduct[] = [
  {
    id: 'sunglasses-black',
    name: 'Designer Sunglasses',
    description: 'Crafted from premium black acetate, these oversized frames offer a classic aesthetic with a comfortable fit and 100% UV protection.',
    descriptionFr: 'Réalisée en acétate noir haut de gamme, cette monture oversize offre une esthétique intemporelle, un port confortable et une protection UV à 100 %.',
    longDescription: 'A subtle soft silver SANCH logo and signature emblem are discreetly incorporated on the temple.',
    longDescriptionFr: 'Un délicat logo SANCH argenté et son emblème signature sont discrètement intégrés sur la branche.',
    price: '€375',
    image: '/images/Accesories /Sunglasses/Render 2.jpg',
    additionalImages: [
      '/images/Accesories /Sunglasses/Render 3.jpg',
      '/images/Accesories /Sunglasses/Render 4.jpg',
      '/images/Accesories /Sunglasses/Render 5.jpg',
      '/images/Accesories /Sunglasses/Render 7.jpg'
    ],
    comingSoon: false,
    categoryId: 'sunglasses',
    stockStatus: 'out-of-stock',
    features: [
      'Matte finish black acetate frames',
      '100% UV protection lenses',
      'Polarized lenses to reduce glare',
      'SANCH on temple'
    ]
  },
  {
    id: 'mug-sketch',
    name: 'Signature Mug',
    hidden: true,
    description: 'The signature SANCH mug. Handcrafted porcelain, a minimalist design. A quiet luxury for those who sense.',
    longDescription: 'Each mug is carefully crafted with attention to detail, featuring the elegant SANCH logo in a refined black and white aesthetic.',
    price: '€45',
    image: '/images/Accesories /Mugs/Cover photo.jpg',
    comingSoon: false,
    categoryId: 'mugs',
    stockStatus: 'out-of-stock'
  },
  {
    id: 'mug-black',
    name: 'Designer Mug',
    hidden: true,
    description: 'Sophisticated matte black mug featuring a lady carrying the petally dress which feels like whispers of petals.',
    longDescription: 'The design comes from Sanchit\'s original artwork "Murmure des petales". The refined contrast between the deep black finish and the delicate illustration creates a striking piece that brings artistic elegance to your daily ritual.',
    price: '€45',
    image: '/images/Accesories /Mugs/Designer mug Sanch_photo.jpg?v=2',
    comingSoon: false,
    categoryId: 'mugs',
    stockStatus: 'out-of-stock'
  },
  {
    id: 'sanch-suede',
    name: 'Sanch Suede',
    description: 'Suede Leather Bag',
    descriptionFr: 'Sac en cuir suédé',
    longDescription: "Crafted in fine suede with a micron gold-plated SANCH logo — an expression of quiet elegance and refined design.",
    longDescriptionFr: "Réalisé en daim fin avec un logo SANCH plaqué or micron — une expression d’élégance discrète et de design raffiné.",
    price: '€4250', // Updated Feb 2026
    image: '/images/Accesories/SanchBagSuede/9.jpg',
    additionalImages: [
      '/images/Accesories/SanchBagSuede/10.jpg',
      '/images/Accesories/SanchBagSuede/7.jpg'
    ],
    comingSoon: false,
    categoryId: 'bags',
    stockStatus: 'limited'
  },
  {
    id: 'bracelet-gold',
    name: 'Artisan Onyx Bead Bracelet',
    description: 'Each black onyx bead in this bracelet showcases a distinct, handcrafted quality.',
    longDescription: 'Each black onyx bead in this bracelet showcases a distinct, handcrafted quality, giving the piece a unique and tactile appeal. The deep, rich black of the onyx creates a sophisticated and versatile accessory.',
    price: '€120',
    image: '/images/Accesories /Bracelets/Bracelet_1.webp',
    comingSoon: false,
    categoryId: 'jewelry',
    stockStatus: 'limited',
    additionalImages: [
      '/images/Accesories /Bracelets/Bracelet_2.webp?v=1',
      '/images/Accesories /Bracelets/Bracelet_3.webp?v=1'
    ]
  },
  {
    id: 'necklace-black',
    name: 'Black Beaded Necklace',
    description: 'Sophisticated black beaded necklace with an elegant, timeless appeal.',
    longDescription: 'This black beaded necklace combines contemporary design with timeless sophistication. Each bead is meticulously selected for its texture and finish, creating a versatile piece that elevates any outfit with its subtle luxury.',
    price: '€5',
    image: '/images/Accesories%20/Necklaces/main photo.webp?v=1',
    comingSoon: false,
    categoryId: 'necklaces',
    stockStatus: 'limited'
  },
  {
    id: 'necklace-spiral',
    name: 'Black Matte Spiral Necklace',
    description: 'Distinctive matte black spiral necklace with contemporary architectural design.',
    longDescription: 'This statement spiral necklace features a modern architectural design in sophisticated matte black. The fluid spiral form creates a bold yet elegant piece that embodies Sanchit\'s minimalist aesthetic while making a distinctive style statement.',
    price: '€125',
    image: '/images/Accesories%20/Necklaces/main photo.webp?v=1',
    comingSoon: false,
    categoryId: 'necklaces',
    stockStatus: 'limited'
  },
  {
    id: 'artbook-main',
    name: 'Art Book',
    description: 'SANCH : De la couleur au noir et blanc',
    descriptionFr: 'SANCH : De la couleur au noir et blanc',
    longDescription: 'This limited edition art book highlights Sanchit\'s artistic journey, moving from the ancient wisdom of colors to the refined elegance of black and white. Tracing his origins in New Delhi, India, Sanchit\'s creative path has led him across continents—from New York, San Francisco, and Los Angeles to his base in Paris, France. The volume features Sanchit\'s own poetic memoir, written in French, chronicling his artistic evolution.',
    longDescriptionFr: "Ciselée en édition limitée, la monographie recueille le sillage artistique de Sanchit Babbar, où se dessine une évolution subtile, de la sagesse des couleurs vers l'élégance épurée du noir et blanc. Enracinée dans ses origines à New Delhi, en Inde, son odyssée créative trace les horizons de New York, San Francisco et Los Angeles, jusqu'à son ancrage actuel à Paris. Cet ouvrage intègre le mémoire poétique conçu et écrit par l'artiste, où sa créativité se déploie à travers danse, poésie, design et mode.",
    price: '€295',
    image: '/images/boutique/artbook-gallery/cover.jpg',
    additionalImages: [
      '/images/boutique/artbook-gallery/portrait-spread.jpg',
      '/images/boutique/artbook-gallery/atelier-spread.jpg',
      '/images/boutique/artbook-gallery/sketch-spread.jpg',
      '/images/boutique/artbook-gallery/binding-detail.jpg'
    ],
    comingSoon: false,
    categoryId: 'books',
    stockStatus: 'limited',
    features: [
      'Interior Dimensions : 24 × 34 cm',
      'Impressions of original works by Sanchit',
      'Matte Finish Black Hardcover',
      'Textures :',
      '~Arctic Volume blanc 170 g/m²',
      '~Olin Colours noir 170 g/m²',
      'Impression offset HR-UV',
      'Designed and Conceived in Paris',
      'Imprimerie : Escourbiac'
    ],
    featuresFr: [
      'Dimensions intérieures : 24 × 34 cm',
      'Impressions d\'œuvres originales de Sanchit',
      'Reliure noire finition mate',
      'Textures :',
      '~Arctic Volume blanc 170 g/m²',
      '~Olin Colours noir 170 g/m²',
      'Impression offset HR-UV',
      'Conçu et réalisé à Paris',
      'Imprimerie : Escourbiac'
    ]
  },
  {
    id: 'belt-sanch',
    name: 'The SANCH Belt',
    description: 'Signature Sanch buckle with thin belt in smooth leather',
    descriptionFr: 'Boucle Sanch signature sur une fine ceinture en cuir lisse',
    longDescription: '',
    price: '€375',
    image: '/images/Accesories%20/Sanch%20Belt/belt-main.jpg',
    additionalImages: [
      '/images/Accesories%20/Sanch%20Belt/belt-portrait-optimized.jpg',
      '/images/Accesories%20/Sanch%20Belt/belt-4.jpg'
    ],
    comingSoon: false,
    categoryId: 'accessories',
    stockStatus: 'limited',
    features: [
      'Micron gold plating',
      'Base material: Brass'
    ]
  },
  {
    id: 'artwork-featured',
    name: 'Œuvres d\'Art',
    description: 'Original artworks by Sanchit Babbar',
    descriptionFr: 'Œuvres originales de Sanchit Babbar',
    longDescription: 'Explore the original art collection by Sanchit Babbar.',
    longDescriptionFr: 'Découvrez la collection d’œuvres originales de Sanchit Babbar.',
    price: 'Explore',
    image: '/images/boutique/prints.jpg',
    comingSoon: false,
    categoryId: 'artworks',
    stockStatus: 'in-stock'
  }
];
