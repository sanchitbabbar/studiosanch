'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export const languages = [
  { code: 'en', label: 'ENGLISH' },
  { code: 'fr', label: 'FRANÇAIS' },
];

// English translations
const en = {
  nav: {
    about: 'ABOUT',
    work: 'FRAMES',
    studioSanch: 'STUDIO SANCH',
    reviews: 'REVIEWS',
    press: 'PRESS',
    boutique: 'BOUTIQUE',
    bookSession: 'BOOK A SESSION',
    contact: 'CONTACT',
    language: 'LANGUAGE'
  },
  home: {
    tagline: 'ACTOR · DANCER · CREATIVE DIRECTOR',
    secondaryTagline: 'Actor · Dancer · Creative Director',
    discoverMore: 'Discover more',
    scrollDown: 'Scroll down',
    experience: 'Experience',
    movementResearch: 'Movement Research',
    bookNow: 'Book now',
    collection: 'Collection',
    discover: 'Discover',
    featuredWork: 'Featured Work',
    sensualExpressionTitle: 'A Human, Quite Clear.',
    sensualExpression: 'They whisper, \'Alien, you,\' a soul sensitive...\nSo rare, they claim, a heart held ever near.\n\'What do you mean?\' I echo, thoughts unclear...\nTwo arms, two legs, a human, it\'s quite clear.\nA beautiful mystery, I\'m told I hold...\nAn innocence in every gesture, delicate and bold.',
    eleganceLabel: 'The Elegance :',
    eleganceTitle: 'Perception or projection?',
    eleganceText: 'Sanchit\'s work transcends the boundaries between dance, film, and fashion. As a dancer, actor, and creative director, he explores themes of elegance, sensuality, femininity, and authenticity. His approach, both refined and deeply human, reveals an intimate understanding of the sensate self, movement, and aesthetics. He believes that "feminine energy is the most beautiful energy available in all living beings," adding that he loves to see it blossoming in others, regardless of gender or species, "because we are all born through it." This conviction guides his art and his commitment to honoring sensitivity and vulnerability, expressions of his ideal of elegance and sensuality, which he calls "Sanchualité."',
    feminityTitle: 'An Ode to Femininity',
    feminityText: 'Revealing the delicate interplay between masculine and feminine, defined by style and elegance.',
  },
  footer: {
    privacy: 'Privacy',
    terms: 'Terms',
    legalIdentity: 'Legal Identity',
    credits: 'Credits',
    copyright: '2026 Sanchit Babbar. All Rights Reserved.',
  },
  contact: {
    title: 'Contact',
    basedIn: 'Based In',
    byEmail: 'By E-mail',
    yourName: 'Your Name',
    emailAddress: 'Email Address',
    yourMessage: 'Your Message',
    send: 'Send',
    sending: 'Sending...',
    messageSent: 'Message Sent',
    thankYou: 'Your message has been received. We will be in touch shortly regarding your inquiry.',
  },
  booking: {
    title: 'Book a Session',
    steps: {
      experience: 'The Experience',
      journey: 'Your Artistic Journey',
      transformation: 'The Transformation',
      liberation: 'The Sensitive Body',
    },
    selectPayment: 'Select payment method',
    expressCheckout: 'Express checkout',
    cardPayment: 'Card payment',
    chooseExpressMethod: 'Choose express method',
    paypal: 'PayPal',
    card: 'Card',
    completePurchase: 'Complete Purchase',
    payNow: 'Pay Now',
    processing: 'Processing...',
    nameOnCard: 'Name on Card',
    cardNumber: 'Card Number',
    expiration: 'Expiration (MM / YY)',
    cvc: 'CVC',
    shippingNotice: 'Shipments outside France will incur additional delivery charges based on current FedEx rates.',
  },
  boutique: {
    title: 'Boutique',
    collections: 'Collections',
    accessories: 'Accessories',
    limited: 'Limited edition',
    signatureDesigns: 'Signature Designs',
    addToCart: 'Add to Cart',
    comingSoon: 'Coming Soon',
    price: 'Price',
    category: 'Category',
    relatedProducts: 'You may also like',
  },
  about: {
    title: 'About',
    bio: 'Artistic Journey',
    philosophy: 'Philosophy',
    education: 'Education',
    experience: 'Experience',
    discover: 'DISCOVER',
    isA: 'is a',
    parisBased: 'Paris-based',
    artist: 'artist',
    whoseWork: 'whose work',
    transcendsBoundaries: 'transcends the boundaries',
    betweenArts: 'between dance, film, and fashion. As a dancer, actor, and creative director, he explores themes of',
    asArtist: '',
    elegance: 'elegance',
    sensuality: 'sensuality',
    femininity: 'femininity',
    and: 'and',
    authenticity: 'authenticity',
    hisApproach: 'His approach, both refined and deeply human, reveals an intimate understanding of the sensate self, movement, and aesthetics.',
    revealsUnderstanding: '',
    heBelievesThat: 'He believes that',
    feminineEnergyQuote: '\'feminine energy is the most beautiful energy available in all living beings,\'',
    addingThatHe: 'adding that he loves to see it rise in others, regardless of gender or species,',
    lovesToSeeItRise: '',
    becauseWeAreAllBorn: '\'because we are all born through it.\'',
    thisConviction: 'This conviction guides his art and his commitment to celebrating',
    sensitivityAndVulnerability: 'sensitivity and vulnerability',
    expressionsOf: 'expressions of his ideal of elegance and sensuality, which he calls',
    sanchuality: 'Sanchualité.',
    inHisOwnWords: 'In his own words',
    whenAskedAbout: 'when asked about his relationship with elegance and sensuality, he responds gracefully:',
    iToMyFirstBreath: '\'I took my first breath in a physical body on a planet that defined its gender as male and masculine. Strength, toughness, and solidity were considered positive and therefore approved, but within me, I always questioned,',
    whatIsThisQuote: '« What is this? Why do humans define and expect each other by their own perceptions or intellect?',
    doesHeartKnowGender: 'Does a heart really know gender?',
    orDoesItKnowLove: 'Or does it know love and fear',
    orFreedomAndControl: 'or freedom and control?',
    masculineAndFeminine: 'Masculine and feminine',
    arentJust: 'aren\'t just',
    genders: 'genders—',
    theyAreDimensions: 'they are dimensions.',
    whenWillWeSee: 'When will we see both with softness and gentleness that come from one\'s own loving heart, that has nothing to do with sex or gender?',
    thisVoiceAlways: '» This voice always led me towards my sensations, dance, and creativity, where freedom is the foundation of my security. My creations result from the belief that',
    sensitivityVulnerability: 'sensitivity, vulnerability,',
    softness: 'softness',
    authenticSigns: 'are the most authentic signs of elegance and sensuality.',
  },
  press: {
    title: 'Press',
    interviews: 'Interviews',
    features: 'Features',
    publications: 'Publications',
    readMore: 'Read more',
  },
  reviews: {
    title: 'Reviews',
    clientTestimonials: 'Client Testimonials',
    readMore: 'Read more',
    showLess: 'Show less',
  },
  studioSanch: {
    description: "Sanchit Babbar's creative studio, based in Paris, specializing in high fashion and digital films.",
    trademark: "Sanch and Studio Sanch are French trademarks, officially registered with the Director General of the National Institute of Industrial Property.",
    visitWebsite: "VISIT OFFICIAL WEBSITE"
  }
};

// French translations
const fr = {
  nav: {
    about: 'À PROPOS',
    work: 'FRAMES',
    studioSanch: 'STUDIO SANCH',
    reviews: 'TÉMOIGNAGES',
    press: 'PRESSE',
    boutique: 'BOUTIQUE',
    bookSession: 'RÉSERVER',
    contact: 'CONTACT',
    language: 'LANGUE'
  },
  home: {
    tagline: 'ACTEUR . DANSEUR . DIRECTEUR CRÉATIF',
    secondaryTagline: 'Acteur . Danseur . Directeur Créatif',
    discoverMore: 'Découvrir plus',
    scrollDown: 'Défiler vers le bas',
    experience: 'Expérience',
    movementResearch: 'Recherche de Mouvement',
    bookNow: 'Réserver maintenant',
    collection: 'Collection',
    discover: 'Découvrir',
    featuredWork: 'Créations en Vedette',
    sensualExpressionTitle: 'Brut et naïf, un océan calme',
    sensualExpression: 'Depuis ma naissance et jusqu\'à aujourd\'hui, j\'ai vécu et voyagé tout autour du monde, apprenant à parler, à m\'exprimer et à travailler dans différentes cultures et langues. Au fil de mes voyages, autour de la terre, des studios à la scène, des caméras aux films, j\'ai toujours reçu des opinions de mes amis, de ma famille, de mes collègues et du public, qui me disaient : « Sanchit, tu es comme ci » ou « Sanchit, tu es comme ça ». Ceux qui m\'ont vraiment connu m\'ont dit : « Sanchit, ça fait du bien d\'être auprès de toi, je t\'aime ! ». Mon enfant intérieur, naïf, a toujours accueilli tout cela à cœur ouvert, mais il s\'est aussi demandé : « Ces opinions se réfèrent-elles vraiment à moi ou ne reflètent-elles que la perception de ces observateurs ? ». Ainsi, je reste toujours ouvert et silencieux comme un océan de quiétude.',
    eleganceLabel: 'L\'ÉLÉGANCE :',
    eleganceTitle: 'Perception ou projection ?',
    eleganceText: 'Le travail de Sanchit transcende les frontières entre la danse, le cinéma et la mode. En tant que danseur, acteur et directeur artistique, il explore les thèmes de l\'élégance, de la sensualité, de la féminité et de l\'authenticité. Son approche, à la fois raffinée et profondément humaine, révèle une compréhension intime de soi, du mouvement et de l\'esthétique. Il croit que "l\'énergie féminine est la plus belle énergie disponible chez tous les êtres vivants", ajoutant qu\'il aime la voir s\'épanouir chez les autres, indépendamment du genre ou de l\'espèce, "car nous sommes tous nés à travers elle." Cette conviction guide son art et son engagement à honorer la sensibilité et la vulnérabilité, expressions de son idéal d\'élégance et de sensualité, qu\'il appelle "Sanchualité."',
    feminityTitle: 'Une Ode à la Féminité',
    feminityText: 'Où se révèle la délicate interaction entre le masculin et le féminin, dans une grâce auréolée d\'\u00e9légance.',
  },
  footer: {
    privacy: 'Confidentialité',
    privacyMobile: 'Privé',
    terms: 'Conditions',
    legalIdentity: 'Identité Légale',
    credits: 'Crédits',
    copyright: '© 2026 Sanchit Babbar. Tous droits réservés.',
  },
  contact: {
    title: 'Contact',
    basedIn: 'Situé À',
    byEmail: 'Par E-mail',
    yourName: 'Votre Nom',
    emailAddress: 'Adresse E-mail',
    yourMessage: 'Votre Message',
    send: 'Envoyer',
    sending: 'Envoi en cours...',
    messageSent: 'Message Envoyé',
    thankYou: 'Votre message a été reçu. Nous vous contacterons prochainement concernant votre demande.',
  },
  booking: {
    title: 'Réserver une Séance',
    steps: {
      experience: 'L\'Expérience',
      journey: 'Votre Voyage Artistique',
      transformation: 'La Transformation',
      liberation: 'La Libération Personnelle',
    },
    selectPayment: 'Sélectionner le mode de paiement',
    expressCheckout: 'Paiement express',
    cardPayment: 'Paiement par carte',
    chooseExpressMethod: 'Choisir la méthode express',
    paypal: 'PayPal',
    card: 'Carte',
    completePurchase: 'Finaliser l\'achat',
    payNow: 'Payer Maintenant',
    processing: 'Traitement en cours...',
    nameOnCard: 'Nom sur la carte',
    cardNumber: 'Numéro de carte',
    expiration: 'Expiration (MM / AA)',
    cvc: 'CVC',
    shippingNotice: "L'expédition vers des pays étrangers peut engendrer des frais de livraison additionnels.",
  },
  boutique: {
    title: 'Boutique',
    collections: 'Collections',
    accessories: 'Accessoires',
    limited: 'Édition limitée',
    signatureDesigns: 'Designs Signature',
    addToCart: 'Ajouter au panier',
    comingSoon: 'Bientôt disponible',
    price: 'Prix',
    category: 'Catégorie',
    relatedProducts: 'Vous aimerez aussi',
  },
  about: {
    title: 'À Propos',
    bio: 'Parcours Artistique',
    philosophy: 'Philosophie',
    education: 'Formation',
    experience: 'Expérience',
    discover: 'DÉCOUVRIR',
    isA: 'est un',
    parisBased: 'artiste basé à Paris',
    artist: '',
    whoseWork: 'dont le travail',
    transcendsBoundaries: 'transcende les frontières',
    betweenArts: 'entre la danse, le cinéma et la mode. Dancer, acteur et directeur créatif, il explore avec une sensibilité aiguë les thèmes de',
    asArtist: '',
    elegance: 'l\'élégance',
    sensuality: 'la sensualité',
    femininity: 'la féminité',
    and: 'et',
    authenticity: 'l\'authenticité',
    originAndJourney: 'Origine et Parcours',
    born: 'Né',
    inIndia: 'en Inde',
    raised: 'A grandi',
    inNewDelhi: 'à New Delhi',
    moved: 'Déménagé',
    toNewYorkAt22: 'à New York à 22 ans',
    currently: 'Actuellement',
    basedInParis: 'basé à Paris',
    firstLetterJourney: 'N',
    bornInIndiaParagraph: 'é en Inde, il a grandi à New Delhi avant de s\'envoler pour New York à l\'âge de 22 ans. Pendant six ans, il y a développé son talent artistique et acquis une expérience précieuse sur de grandes scènes, avant de voyager et de travailler à',
    citiesWorked: 'San Francisco, en Allemagne, à Belgrade et à Los Angeles',
    duringShootInLA: 'C\'est sur un tournage à Los Angeles qu\'une révélation se produit :',
    innerVoiceWhispered: 'une voix intérieure lui murmure son désir de jouer et de chanter dans une autre langue.',
    signPromptedParis: 'Ce signe le pousse à s\'installer à Paris, où il se plonge dans la culture française de la musique, de la poésie et du cinéma.',
    hisJourney: 'Son parcours, des studios de danse aux scènes internationales, des plateaux de cinéma à la création de on propre studio créatif, Studio Sanch, est une quête constante d\'',
    expression: 'expression',
    femininityWord: 'féminité',
    andWord: 'et d\'',
    authenticityWord: 'authenticité',
    creativeGenesis: 'Genèse Créative',
    firstLetterGenesis: 'D',
    fromVeryYoungAge: 'ès son plus jeune âge, Sanchit a ressenti, lors d\'une visite dans une boutique avec ses parents, une émotion particulière au contact d\'un tissu,',
    particularSensation: 'sensation',
    uponContact: 'qu\'il allait retrouver des années plus tard, en montant sur scène.',
    whileThoseAround: 'Alors que son entourage s\'attendait à ce qu\'il fasse des études, son',
    sensitiveSpirit: 'esprit sensible',
    ledHimTowards: 'le pousse vers la danse, le théâtre et le cinéma.',
    atTheAgeOf20: 'À vingt ans, il prend son premier cours de danse, une révélation.',
    itWasLike: '\'C\'était comme rentrer à la maison,\'',
    heSays: 'dit-il',
    thisPassionLed: 'Cette passion le mène à New York, où il intègre la prestigieuse',
    alvinAileySchool: 'Alvin Ailey School',
    onFullScholarship: 'grâce à une bourse complète.',
    career: 'Carrière',
    collaborations: 'Collaborations',
    firstLetterCareer: 'S',
    hisDanceCareer: 'a carrière de danseur prend son essor, riche de collaborations prestigieuses et d\'expériences variées. Il danse pour des compagnies de renom, interprétant des œuvres emblématiques telles que',
    revelations: '\'Revelations\'',
    onTheBiggestStages: 'd\'Alvin Ailey sur les plus grandes scènes de New York, notamment au David H. Koch Theater et au City Center.',
    heEmbodiedLeadingRoles: 'Il incarne des rôles principaux dans des chorégraphies de Ray Mercer et Darshan Singh Bhuller, eGloryaage la scène avec des artistes de la trempe de Matthew Rushing, Renee Robinson et Jamar Roberts. Son talent le mène également sur les plateaux de cinéma, où il révèle ses talents de comédien dans des films tels que',
    inShort: '\'In Short\'',
    documentaryBy: '(un documentaire de Katie Holmes),',
    aisha: '\'AISHA\'',
    bollywoodFilm: '(un film de Bollywood) et',
    phantomOfTheOpera: '\'Le Fantôme de l\'Opéra\'',
    hollywoodFeature: '(un long métrage hollywood, Los Angeles).',
    heLentHisImage: 'Il prête son image à des campagnes publicitaires pour des marques internationales comme HBO, Siemens et Reebok.',
    awardsAndScholarships: 'Prix et Bourses',
    theYassFamilyScholarship: 'The Yass Family Scholarship',
    theAdaBrandonScholarship: 'The Ada Brandon Scholarship',
    theGloryaKaufmanDanceFoundationScholarship: 'The Glorya Kaufman Dance Foundation Scholarship',
    theBobFosseGwenVerdonScholarship: 'The Bob Fosse-Gwen Verdon Scholarship',
    hisApproach: 'Son approche, à la fois raffinée et profondément humaine, révèle une compréhension intime du corps, du mouvement et de l\'esthétique.',
    revealsUnderstanding: '',
    heBelievesThat: 'Il croit que',
    feminineEnergyQuote: '\'l\'énergie féminine est la plus belle énergie disponible chez tous les êtres vivants,\'',
    addingThatHe: 'et ajoute qu\'il',
    lovesToSeeItRise: '\'aime la voir s\'élever chez les autres, peu importe le genre ou l\'espèce,',
    becauseWeAreAllBorn: 'car nous sommes tous nés grâce à elle.\'',
    thisConviction: 'et cette conviction guide son art et son engagement à célébrer',
    sensitivityAndVulnerability: 'la sensibilité et la vulnérabilité',
    expressionsOf: 'expressions de son idéal d\'élégance et de sensualité, ce qu\'il appelle',
    sanchuality: 'Sanchualité.',
    inHisOwnWords: 'Et, pour reprendre ses mots',
    whenAskedAbout: 'quand on l\'interroge sur son rapport à l\'élégance et à la sensualité, et sur son ouverture à ces sujets, il répond sincèrement :',
    iToMyFirstBreath: '\'J\'ai ressenti mon premier battement de cœur dans un corps physique sur la planète où le genre était défini comme masculin. La force, la vigueur et la solidité étaient considérées comme positives et donc approuvées, mais en moi, une voix disait toujours :',
    whatIsThisQuote: '« C\'est quoi ça ? Pourquoi les humains se définissent-ils et attendent-ils les uns des autres des attitudes selon leurs propres perceptions ou leur intellect ?',
    doesHeartKnowGender: 'Le cœur ne connaît ni masculin ni féminin,',
    orDoesItKnowLove: 'il ne connaît que l\'amour ou la peur,',
    orFreedomAndControl: 'la liberté ou le contrôle.',
    masculineAndFeminine: 'Le masculin et le féminin',
    arentJust: 'ne sont pas seulement',
    genders: 'des genres ;',
    theyAreDimensions: 'ce sont des dimensions.',
    whenWillWeSee: 'Quand verra t-on les deux avec la douceur et la gentillesse qui viennent de nos cœurs aimants, ce qui n\'a rien à voir avec le sexe ou le genre ?',
    thisVoiceAlways: '» Cette voix m\'a toujours guidé vers mes sensations, la danse et la créativité, où la liberté est le fondement de ma sécurité. Mes créations résultent de la certitude que',
    sensitivityVulnerability: 'la sensibilité, la vulnérabilité',
    softness: 'la douceur',
    authenticSigns: 'sont les signes de l\'élégance et de la sensualité.',
  },
  press: {
    title: 'Presse',
    interviews: 'Interviews',
    features: 'Articles',
    publications: 'Publications',
    readMore: 'Lire plus',
  },
  reviews: {
    title: 'Témoignages',
    clientTestimonials: 'Témoignages Clients',
    readMore: 'Lire la suite',
    showLess: 'Réduire',
  },
  studioSanch: {
    description: "Studio Créatif de Sanchit Babbar, basé à Paris, spécialisé dans la mode et les films numériques.",
    trademark: "Sanch et Studio Sanch sont des marques françaises, officiellement enregistrées auprès du directeur général de l'Institut national de la propriété industrielle.",
    visitWebsite: "ACCÉDER AU SITE OFFICIEL"
  },
};

// Bundle translations
export const translations = { en, fr };

type TranslationsType = typeof en;
type LanguageContextType = {
  language: string;
  t: (key: string, section?: string) => string;
  setLanguage: (code: string) => void;
  getFullTranslation: (section: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('fr');

  // Function to get nested translation by dot notation
  const t = (key: string, sectionParam = '') => {
    try {
      if (sectionParam) {
        return translations[language as keyof typeof translations][sectionParam as keyof TranslationsType][key as any] || key;
      }
      
      const parts = key.split('.');
      if (parts.length === 1) return key; // Return the key if no dot notation
      
      const section = parts[0];
      const translationKey = parts[1];
      
      return translations[language as keyof typeof translations][section as keyof TranslationsType][translationKey as any] || key;
    } catch (error) {
      console.error('Translation error:', error);
      return key; // Fallback to the key itself
    }
  };

  // Get a whole section of translations
  const getFullTranslation = (section: string) => {
    return translations[language as keyof typeof translations][section as keyof TranslationsType] || {};
  };

  // Save language preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    }
  }, [language]);

  // Initialize language from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, getFullTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
