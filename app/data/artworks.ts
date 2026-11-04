export interface PrintSize {
  id: string;
  dimensions: string;
  price: number;
  recommended: string;
  availability?: 'in-stock' | 'sold-out' | 'limited';
}

export interface PrintQuality {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
}

export interface Design {
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

export const designs: Design[] = [
  {
    "id": "le-sillage-epure",
    "title": "Le Sillage Épuré",
    "descriptionFr": "Le masque tombe, le regard se dénude. Un souffle exhalé jusqu’à l'essence pure, où tout se fond en une seule onde harmonieuse.",
    "descriptionEn": "The mask shed, the gaze bare. Exhaled to absolute essence, forming a cohesive wave.",
    "image": "/images/art-prints/le-sillage-epure.webp",
    "year": "2026",
    "technique": "Œuvre d'art limitée",
    "basePrice": 4850,
    "availablePieces": 5,
    sizes: printSizes,
    qualities: printQualities
  },
  {
    "id": "lombre-de-la-rose",
    "title": "L’Ombre de la Rose",
    "descriptionFr": "Une traversée silencieuse où l'encre cherche la grâce du geste. Même dans l’ombre, le féminin trouve sa lumière. Éclos sous le souffle d'un contour, l'éphémère se dépose au cœur de la matière pour offrir une sérénité intemporelle.",
    "descriptionEn": "A silent journey where ink seeks the grace of gesture. Even in shadow, the feminine finds her light. Unfolding under the breath of a contour, the ephemeral rests within the heart of matter to offer timeless serenity.",
    "image": "/images/art-prints/lombre-de-la-rose.webp",
    "year": "2024",
    "technique": "Œuvre d'art limitée",
    "basePrice": 4850,
    "availablePieces": 5,
    sizes: printSizes,
    qualities: printQualities
  },
  {
    id: 'leffluve',
    title: 'L’Effluve',
    descriptionFr: 'Le Sillage de la sensibilité',
    descriptionEn: 'The whisper of sensitivity',
    image: '/images/art-prints/leffluve.webp',
    year: '2026',
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    availablePieces: 5,
    sizes: printSizes,
    qualities: printQualities
  },
  {
    id: '2',
    title: "La première onde",
    descriptionFr: "Une expression fluide du souffle et du mouvement, où les gestes dansent en harmonie perpétuelle. Cette œuvre capture l'essence du flot continu de la vie, un rythme qui fait écho à la caresse discrète des vagues, au passage éternel du temps, et au pouls de l'existence même. Une ondulation qui résonne avec le battement du cœur, source de tout. Les formes ne s'effacent jamais, mais se transforment sans fin au cours de leur voyage à travers l'espace.",
    descriptionEn: "A flowing expression of breath and movement, where gestures dance in perpetual harmony. This work captures the essence of life's continuous flow, a rhythm mirroring the quiet caress of waves, the eternal passage of time, and the pulse of existence itself. A pulse echoing the very rhythm of the heart, the source of all. The forms never truly end, but transform endlessly on their journey through space.",
    image: "/images/art-prints/la-premiere-onde-signed-v2.webp",
    year: "2024",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    // Custom sizes with third size (large) unavailable
    sizes: [
      {
        id: 'xs',
        dimensions: '40 × 60 cm',
        price: 4850,
        recommended: 'Framed in black · 70% UV anti-reflective glass',
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
    id: '1',
    title: "Murmure des Pétales",
    descriptionFr: "Une composition fluide et délicate qui saisit l'essence éphémère des pétales murmurants en mouvement. Les nuances douces et les formes organiques évoquent une atmosphère d'élégance intemporelle où chaque regard découvre une nouvelle impression de sérénité.",
    descriptionEn: "A fluid and delicate composition capturing the ephemeral essence of whispering petals in motion. The soft tones and organic forms create an atmosphere of timeless elegance and serenity.",
    image: "/images/art-prints/murmure-des-petales-final-signed.webp",
    year: "2024",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    // Custom sizes with first size (small) unavailable
    sizes: [
      {
        id: 'xs',
        dimensions: '40 × 60 cm',
        price: 4850,
        recommended: 'Framed in black · 70% UV anti-reflective glass',
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
    "id": "leden",
    "title": "L'Éden",
    "descriptionFr": "Au milieu d’un monde en fracture, rien ne parlait au cœur. Par habitude, s'éloignant du tumulte, l'encre s'est déposée sur le papier—pour faire frémir des roses plutôt que des tempêtes.",
    "descriptionEn": "Amidst the fracturing of the world, nothing spoke to the heart. As ever, turning away from the noise, one surrendered ink upon paper—hoping to sough roses, rather than storms.",
    "image": "/images/art-prints/leden.webp",
    "year": "2026",
    "technique": "Œuvre d'art limitée",
    "basePrice": 4850,
    "availablePieces": 5,
    sizes: printSizes,
    qualities: printQualities
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
        recommended: 'Framed in black · 70% UV anti-reflective glass',
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
    sizes: [
      {
        id: 'framed-60x80',
        dimensions: '60 × 80 cm',
        price: 7250,
        recommended: 'Framed in black · 70% UV anti-reflective glass',
        availability: 'limited' as const
      },
      ...printSizes,
    ],
    qualities: printQualities,
    availablePieces: 2,
  },
  {
    id: '7',
    title: "Celle qui se connaît",
    descriptionFr: "Au creux d'elle-même, elle vit. Elle ne cherche pas de miroir, car son reflet est le vent, le soleil qui caresse les collines de son corps. Elle est la source, celle qui se nourrit de sa propre lumière, et son cœur, une fleur sauvage, s'ouvre sans bruit, sans attente, juste l'éclat pur de l'existence. Elle est un secret susurré par l'écho de ses propres sensations, celle qui se connaît.",
    descriptionEn: "Within her very heart, she lives an honest life. No looking glass she seeks, for her true visage is the very wind, the sun that does but kiss the gentle curves of her own form. She is the spring, the one who is nourished from her own inner light. And her heart, a wild bloom, does open, free of clamor or of need, a simple, pure, and glorious flash of being. She is a secret, whispered by the echo of her own body's softest voices, the one who knows herself.",
    image: "/images/art-prints/celle-qui-se-connait-final.webp",
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
  },
  {
    id: 'instar',
    title: "Instar",
    descriptionEn: "Present now in this moment—breathing, vulnerable, efflorescing like a flower, sharing life... Is what is shared felt deep within, yet what makes a sudden fog appear, luring towards past or future to compare or define? Does yielding to that sway mean crushing the blossoming rose right in front, or admiring a fallen leaf which is not even here? The curiosity in the source remains open, continuing for the feminine to be.",
    descriptionFr: "Présente ici, en cet instant—respirante, vulnérable, s’épanouissant comme une fleur, offrant la vie… Ce qui est partagé est-il ressenti au plus profond, et pourtant, qu’est-ce qui fait apparaître une brume soudaine, attirant vers le passé ou l’avenir pour comparer ou définir ? Glisser dans ce penchant signifie-t-il écraser la rose en fleur juste devant soi, ou admirer une feuille morte qui n’est même pas là ? Demeure au cœur la curiosité ouverte, pour que le féminin continue d’être.",
    image: "/images/art-prints/instar.webp",
    year: "2025",
    technique: "Œuvre d'art limitée",
    basePrice: 4850,
    sizes: printSizes,
    qualities: printQualities,
    availablePieces: 5,
  }
];
