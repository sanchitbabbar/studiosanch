import { designs } from './artworks';

// Originals are deliberately separate from the fine-art print catalogue.
const murmure = designs.find(item => item.title === 'Murmure des Pétales')!;

export const originalArtworks = [
  ...['Celle qui se connaît', 'Deepa'].map(title => {
    const artwork = designs.find(item => item.title === title)!;
    return { minimumProposal: 1000000, dimensions: '50 × 32.5 cm', title: artwork.title, year: artwork.year, descriptionEn: artwork.descriptionEn, descriptionFr: artwork.descriptionFr, image: title === 'Deepa' ? '/images/auctions/deepa-original.webp' : '/images/auctions/celle-qui-se-connait-original.webp' };
  }),
  {"minimumProposal": 1000000, "dimensions": "28 × 21.5 cm", "title": "Instar", "year": "2025", "descriptionEn": "Present now in this moment—breathing, vulnerable, efflorescing like a flower, sharing life... Is what is shared felt deep within, yet what makes a sudden fog appear, luring towards past or future to compare or define? Does yielding to that sway mean crushing the blossoming rose right in front, or admiring a fallen leaf which is not even here? The curiosity in the source remains open, continuing for the feminine to be.", "descriptionFr": "Présente ici, en cet instant—respirante, vulnérable, s’épanouissant comme une fleur, offrant la vie… Ce qui est partagé est-il ressenti au plus profond, et pourtant, qu’est-ce qui fait apparaître une brume soudaine, attirant vers le passé ou l’avenir pour comparer ou définir ? Glisser dans ce penchant signifie-t-il écraser la rose en fleur juste devant soi, ou admirer une feuille morte qui n’est même pas là ? Demeure au cœur la curiosité ouverte, pour que le féminin continue d’être.", "image": "/images/auctions/instar-original.webp"},
  {
    title: murmure.title,
    year: murmure.year,
    descriptionEn: murmure.descriptionEn,
    descriptionFr: murmure.descriptionFr,
    image: '/images/auctions/murmure-des-petales-original.webp',
    minimumProposal: 1600000,
    dimensions: '28 × 21.5 cm',
  },
];
