'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { newSanchFilms, type FilmCredit } from '../data/sanchFilms';
import playerStyles from './FilmPlayer.module.css';
import FilmCredits from './FilmCredits';

interface Performance {
  id: number;
  title: string;
  titleFr?: string;
  description: string;
  category: string;
  descriptionFr: string;
  categoryFr: string;
  videoSrc: string;
  mp4Src?: string;
  poster?: string;
  credits?: FilmCredit[];
}

const performances: Performance[] = [
  ...newSanchFilms.map(({ name, nameFr, src, thumbnail, ...film }) => ({
    ...film, title: name, titleFr: nameFr, videoSrc: src, poster: thumbnail,
  })),
  {
    id: 4,
    title: "Between the flash and what remains unseen",
    description: "Editorial with Peter Müller and Samantha Maria. Paris, France.",
    category: "Fashion Film",
    descriptionFr: "Éditorial avec Peter Müller et Samantha Maria. Paris, France.",
    categoryFr: "Film de mode",
    videoSrc: "/images/gallery/Videos/Fashion_Films/sanch-fashion-editorial.webm",
    mp4Src: "/images/gallery/Videos/Fashion_Films/sanch-fashion-editorial.mp4",
    poster: "/images/gallery/Videos/Fashion_Films/sanch-fashion-editorial-poster.webp"
  },
  {
    id: 7,
    title: "Le sens de Sanch…",
    description: "",
    category: "Art Film",
    descriptionFr: "",
    categoryFr: "Film d’art",
    videoSrc: "/images/gallery/Videos/Music_Videos/Art_in_Antibes.webm",
    poster: "/images/gallery/Videos/Music_Videos/art-in-antibes-poster.webp"
  },
  {
    id: 3,
    title: "Campaign",
    description: "With Benjamin Amar for Studio Sanch. Paris, France.",
    category: "Fashion Campaign",
    descriptionFr: "Avec Benjamin Amar pour Studio Sanch. Paris, France.",
    categoryFr: "Campagne de mode",
    videoSrc: "/images/gallery/Videos/Music_Videos/video_3.webm",
    poster: "/images/gallery/Videos/Music_Videos/video_3-poster.webp"
  },
  {
    id: 1,
    title: "La chanson de Prévert",
    description: "Revisiting timeless classic by Serge Gainsbourg. Music Direction & Composition: Studio Fredh. Sounds recording: https://fred-h.com",
    category: "Music Video",
    descriptionFr: "Une relecture du classique intemporel de Serge Gainsbourg. Direction musicale et composition : Studio Fredh. Prise de son : https://fred-h.com",
    categoryFr: "Clip musical",
    videoSrc: "/images/gallery/Videos/Music_Videos/LCDP_StudioFredh_HZ_optimized.webm",
    poster: "/images/gallery/Videos/Music_Videos/LCDP_StudioFredh_HZ_optimized-poster.webp"
  }
];

export default function FeaturedPerformances() {
  const { language } = useLanguage();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [loadFilm, setLoadFilm] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!('IntersectionObserver' in window)) {
      setLoadFilm(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setLoadFilm(true);
        observer.disconnect();
      }
    }, { rootMargin: '400px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  const featured = performances[featuredIndex];
  const fr = language === 'fr';

  return (
    <section ref={sectionRef} className={playerStyles.section} aria-label={fr ? 'Films sélectionnés' : 'Featured films'}>
      <div className={playerStyles.inner}>
        <h3 className={playerStyles.heading}>Films</h3>
        <div className={playerStyles.grid}>
          <div className={playerStyles.player}>
            <video
              ref={videoRef}
              key={`${featured.videoSrc}-${loadFilm}`}
              className={playerStyles.media}
              autoPlay loop muted={isMuted} playsInline preload="metadata"
              poster={featured.poster}
              aria-label={fr ? (featured.titleFr || featured.title) : featured.title}
              onLoadedData={event => { void event.currentTarget.play().catch(() => undefined); }}
            >
              <source src={loadFilm ? featured.videoSrc : undefined} type={featured.videoSrc.endsWith('.mp4') ? 'video/mp4' : 'video/webm'} />
              {featured.mp4Src && <source src={loadFilm ? featured.mp4Src : undefined} type="video/mp4" />}
            </video>
            <div className={playerStyles.info}>
              <div>
                <p className={playerStyles.category}>{fr ? featured.categoryFr : featured.category}</p>
                <h4 className={playerStyles.title}>{fr ? (featured.titleFr || featured.title) : featured.title}</h4>
                {(fr ? featured.descriptionFr : featured.description) && <p className={playerStyles.description}>{fr ? featured.descriptionFr : featured.description}</p>}
                <FilmCredits credits={featured.credits} />
              </div>
              <button type="button" className={playerStyles.sound} aria-label={isMuted ? (fr ? 'Activer le son' : 'Unmute') : (fr ? 'Couper le son' : 'Mute')} aria-pressed={!isMuted} onClick={() => setIsMuted(muted => !muted)}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  {isMuted ? (
                    <><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></>
                  ) : (
                    <><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 5.93a10 10 0 0 1 0 12.14" /></>
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div className={playerStyles.playlist}>
            {performances.map((film, index) => index !== featuredIndex && (
              <button type="button" key={film.id} className={playerStyles.thumbnail} onClick={() => setFeaturedIndex(index)} aria-label={`${fr ? 'Lire' : 'Play'} ${fr ? (film.titleFr || film.title) : film.title}`}>
                <img src={film.poster} alt="" loading="lazy" />
                <span className={playerStyles.thumbnailInfo}>
                  <span className={playerStyles.category}>{fr ? film.categoryFr : film.category}</span>
                  <span className={playerStyles.thumbnailTitle}>{fr ? (film.titleFr || film.title) : film.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
