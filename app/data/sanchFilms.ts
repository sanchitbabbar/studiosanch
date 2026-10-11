export type FilmCredit = { role: string; roleFr?: string; name: string };

const entreLesHeuresCredits: FilmCredit[] = [
  { role: 'Director of Photography', roleFr: 'Direction de la photographie', name: 'Alex Gist' },
  { role: 'Actor and Creative Director', roleFr: 'Acteur et direction artistique', name: 'Sanchit Babbar' },
  { role: 'Production', name: 'Studio Sanch' },
];

// Shared by the landing page and Frames so both use the same graded masters.
export const newSanchFilms = [
  {
    id: 5,
    name: 'Entre les heures — Official trailer',
    nameFr: 'Entre les heures — Bande-annonce officielle',
    src: '/images/gallery/Videos/Sanch/sanch-trailer.mp4',
    thumbnail: '/images/gallery/Videos/Sanch/sanch-trailer-poster.webp',
    category: 'Art Film',
    categoryFr: "Film d’art",
    credits: entreLesHeuresCredits,
    description: '',
    descriptionFr: '',
  },
  {
    id: 6,
    name: 'Entre les heures. The first look.',
    nameFr: 'Entre les heures — Premier regard',
    src: '/images/gallery/Videos/Sanch/sanch-paris.mp4',
    thumbnail: '/images/gallery/Videos/Sanch/sanch-paris-poster.webp',
    category: 'Art Film',
    categoryFr: "Film d’art",
    credits: entreLesHeuresCredits,
    description: '',
    descriptionFr: '',
  },
];
