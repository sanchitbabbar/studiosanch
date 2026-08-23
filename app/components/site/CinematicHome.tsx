'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import CinematicReel from './CinematicReel';
import styles from './CinematicHome.module.css';

function DeferredVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceRef = useRef<HTMLSourceElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const source = sourceRef.current;
    if (!video || !source) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || source.src) return;
        source.src = src;
        video.load();
        void video.play().catch(() => undefined);
      },
      { rootMargin: '700px 0px' },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video ref={videoRef} autoPlay muted loop playsInline preload="none">
      <source ref={sourceRef} type="video/webm" />
    </video>
  );
}

const chapters = [
  {
    title: { en: 'HAUTE COUTURE', fr: 'HAUTE COUTURE' },
    text: {
      en: 'A second skin sighed around the feminine\nUnfurled for your silhouette alone',
      fr: 'Une peau déployée pour le féminin\nÉpousant la silhouette',
    },
    href: '/haute-couture.html',
    image: '/images/Haute%20Couture%20/Slider%20Thumbnail%202/10.webp',
    className: styles.chapterPortrait,
  },
  {
    title: { en: 'PRODUCTIONS', fr: 'PRODUCTIONS' },
    text: {
      en: 'For those seeking to realise a singular idea as a film, an image, an exhibition—or a world that could be remembered.',
      fr: 'Pour celles et ceux qui souhaitent donner forme à une idée singulière — un film, une image, une exposition ou un univers dont on se souviendra.',
    },
    href: '/productions/',
    image: '/images/productions-hero-reel.webp',
    className: styles.chapterLandscape,
  },
  {
    title: { en: 'ATELIER', fr: 'ATELIER' },
    text: {
      en: 'An Ode to Femininity — Revealing the delicate interplay between masculine and feminine, defined by style and elegance.',
      fr: "Une Ode à la Féminité — Où se révèle la délicate interaction entre le masculin et le féminin, dans une grâce auréolée d'élégance.",
    },
    href: '/atelier.html',
    image: '/images/sketch1.jpg',
    className: styles.chapterDetail,
  },
];

function MultilineText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`}>
          {line}
          {lineIndex < text.split('\n').length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function ChapterScene({
  chapter,
  index,
  language,
}: {
  chapter: (typeof chapters)[number];
  index: number;
  language: 'en' | 'fr';
}) {
  const sceneRef = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    index === 1 ? ['13%', '-13%'] : index === 2 ? ['-10%', '13%'] : ['14%', '-10%'],
  );
  const mediaX = useTransform(
    scrollYProgress,
    [0, 1],
    index === 1 ? ['-3.5%', '3.5%'] : index === 2 ? ['3%', '-4%'] : ['-2.5%', '3.5%'],
  );
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    index === 2 ? [0.88, 1.035, 1.12] : [0.965, 1.015, 0.975],
  );
  const mediaRotate = useTransform(
    scrollYProgress,
    [0, 1],
    index === 1 ? [-0.45, 0.45] : index === 2 ? [0.55, -0.35] : [-0.35, 0.5],
  );
  const copyY = useTransform(
    scrollYProgress,
    [0.04, 0.3, 0.7, 0.96],
    index === 1 ? ['16%', '0%', '-2%', '-15%'] : ['18%', '0%', '-3%', '-16%'],
  );
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.14, 0.82, 1], [0, 1, 1, 0]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.2, 0.34, 0.7, 0.88, 0.98],
    [0.72, 0.9, 1, 1, 0.86, 0.72],
  );
  const copyX = useTransform(
    scrollYProgress,
    [0.06, 0.32, 0.7, 0.96],
    index === 1 ? ['-9%', '0%', '1%', '8%'] : ['8%', '0%', '-1%', '-7%'],
  );
  const copyBlur = useTransform(
    scrollYProgress,
    [0.06, 0.28, 0.72, 0.95],
    ['blur(2px)', 'blur(0px)', 'blur(0px)', 'blur(2px)'],
  );
  const copyScale = useTransform(
    scrollYProgress,
    [0.06, 0.32, 0.72, 0.96],
    index === 2 ? [0.94, 1, 1.02, 1.055] : [0.965, 1, 1.008, 1.035],
  );
  const atmosphereXFront = useTransform(scrollYProgress, [0, 1], ['-46%', '62%']);
  const atmosphereXBack = useTransform(scrollYProgress, [0, 1], ['38%', '-48%']);
  const atmosphereOpacity = useTransform(scrollYProgress, [0.04, 0.28, 0.72, 0.96], [0, 0.72, 0.48, 0]);
  const supportAX = useTransform(scrollYProgress, [0, 1], ['-24%', '18%']);
  const supportAY = useTransform(scrollYProgress, [0, 1], ['18%', '-16%']);
  const supportAScale = useTransform(scrollYProgress, [0, 1], [0.68, 1.14]);
  const supportARotate = useTransform(scrollYProgress, [0, 1], [-3.4, 1.8]);
  const supportBX = useTransform(scrollYProgress, [0, 1], ['21%', '-19%']);
  const supportBY = useTransform(scrollYProgress, [0, 1], ['-13%', '17%']);
  const supportBScale = useTransform(scrollYProgress, [0, 1], [1.16, 0.7]);
  const supportBRotate = useTransform(scrollYProgress, [0, 1], [2.8, -2]);
  const supportAOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.15, 0.36, 0.55, 0.78, 0.96],
    [0, 0.92, 0.42, 1, 0.22, 0],
  );
  const supportBOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.26, 0.47, 0.68, 0.86, 0.99],
    [0, 0.32, 1, 0.38, 0.88, 0],
  );

  return (
    <motion.a
      ref={sceneRef}
      href={chapter.href}
      className={`${styles.chapter} ${chapter.className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {index !== 2 && (
        <motion.div
          className={styles.chapterMedia}
          style={{ y: mediaY, x: mediaX, scale: mediaScale, rotate: mediaRotate, opacity: mediaOpacity }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={chapter.image} alt="" loading="lazy" decoding="async" />
        </motion.div>
      )}
      {index === 0 && (
        <div className={styles.coutureSequence} aria-hidden="true">
          <motion.figure
            className={`${styles.sequenceFrame} ${styles.coutureFrameLeft}`}
            style={{ x: supportAX, y: supportAY, scale: supportAScale, rotate: supportARotate, opacity: supportAOpacity }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/Haute%20Couture%20/Slider%20Thumbnail%205/2.webp" alt="" loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/haute-couture-landing/grace-in-motion-15.webp" alt="" loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/haute-couture-landing/img-4804.webp" alt="" loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/haute-couture-landing/img-3673.webp" alt="" loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/haute-couture-landing/5f100405.webp" alt="" loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/Haute%20Couture%20/Slider%20Thumbnail%206/1.webp" alt="" loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/Haute%20Couture%20/Slider%20Thumbnail%206/3.webp" alt="" loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/Haute%20Couture%20/Slider%20Thumbnail%206/5.webp" alt="" loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.coutureCarouselSlide} src="/images/Haute%20Couture%20/Slider%20Thumbnail%206/7.webp" alt="" loading="lazy" decoding="async" />
          </motion.figure>
          <motion.figure
            className={`${styles.sequenceFrame} ${styles.coutureFrameRight}`}
            style={{ x: supportBX, y: supportBY, scale: supportBScale, rotate: supportBRotate, opacity: supportBOpacity }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/Haute%20Couture%20/Slider%20Thumbnail%205/1.webp" alt="" loading="lazy" decoding="async" />
          </motion.figure>
        </div>
      )}
      {index === 2 && (
        <div className={styles.atelierSequence} aria-hidden="true">
          <figure className={`${styles.sequenceFrame} ${styles.atelierSlide} ${styles.atelierSlideSketch}`}>
            <DeferredVideo src="/Videos/5_ultrahq_curved_optimized.webm" />
          </figure>
          <figure className={`${styles.sequenceFrame} ${styles.atelierSlide} ${styles.atelierSlideFirstVideo}`}>
            <DeferredVideo src="/Videos/4.webm" />
          </figure>
          <figure className={`${styles.sequenceFrame} ${styles.atelierSlide} ${styles.atelierSlideSecondVideo}`}>
            <DeferredVideo src="/Videos/Atelier_ultrahq_curved.webm" />
          </figure>
        </div>
      )}
      {index === 2 && (
        <div className={styles.atelierAtmosphere} aria-hidden="true">
          <motion.span className={styles.atelierMistBack} style={{ x: atmosphereXBack, opacity: atmosphereOpacity }} />
          <motion.span className={styles.atelierMistFront} style={{ x: atmosphereXFront, opacity: atmosphereOpacity }} />
        </div>
      )}
      <motion.div
        className={`${styles.chapterCopy} ${index === 2 ? styles.atelierCopy : ''}`}
        style={{ y: copyY, x: copyX, opacity: copyOpacity, filter: copyBlur, scale: copyScale }}
      >
        <h3><MultilineText text={chapter.title[language]} /></h3>
        <p><MultilineText text={chapter.text[language]} /></p>
      </motion.div>
    </motion.a>
  );
}

export default function CinematicHome() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const currentLanguage: 'en' | 'fr' = fr ? 'fr' : 'en';
  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLElement>(null);
  const boutiqueRef = useRef<HTMLElement>(null);
  const finaleRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const { scrollYProgress: reelProgress } = useScroll({
    target: reelRef,
    offset: ['start end', 'end start'],
  });
  const { scrollYProgress: manifestoProgress } = useScroll({ target: manifestoRef, offset: ['start end', 'end start'] });
  const { scrollYProgress: boutiqueProgress } = useScroll({ target: boutiqueRef, offset: ['start end', 'end start'] });
  const { scrollYProgress: finaleProgress } = useScroll({ target: finaleRef, offset: ['start end', 'end start'] });

  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.085]);
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '7%']);
  const heroShade = useTransform(heroProgress, [0, 0.78], [0.08, 0.7]);
  const titleY = useTransform(heroProgress, [0, 1], ['0%', '-32%']);
  const reelScale = useTransform(reelProgress, [0, 0.5, 1], [1.08, 1, 1.08]);
  const reelY = useTransform(reelProgress, [0, 1], ['-3%', '3%']);
  const reelCopyOpacity = useTransform(reelProgress, [0.12, 0.3, 0.7, 0.9], [0.72, 1, 1, 0.72]);
  const reelCopyY = useTransform(reelProgress, [0.12, 0.35, 0.9], ['10%', '0%', '-7%']);
  const manifestoOpacity = useTransform(manifestoProgress, [0.08, 0.27, 0.72, 0.92], [0.72, 1, 1, 0.72]);
  const manifestoY = useTransform(manifestoProgress, [0.08, 0.34, 0.9], ['12%', '0%', '-10%']);
  const boutiqueImageY = useTransform(boutiqueProgress, [0, 1], ['12%', '-12%']);
  const boutiqueCopyOpacity = useTransform(boutiqueProgress, [0.12, 0.32, 0.72, 0.9], [0.72, 1, 1, 0.72]);
  const boutiqueCopyY = useTransform(boutiqueProgress, [0.12, 0.36, 0.9], ['12%', '0%', '-8%']);
  const finaleOpacity = useTransform(finaleProgress, [0.1, 0.34, 0.78, 0.96], [0.72, 1, 1, 0.72]);
  const finaleY = useTransform(finaleProgress, [0.1, 0.38, 0.94], ['14%', '0%', '-8%']);

  return (
    <main className={styles.home}>
      <section ref={heroRef} className={styles.hero} aria-label={fr ? 'Introduction' : 'Introduction'}>
        <motion.div className={`${styles.heroMedia} homepage-hero-stage`} style={{ scale: heroScale, y: heroY }}>
          <picture className="homepage-hero-picture homepage-hero-picture--colour">
            <source media="(min-width: 1201px)" srcSet="/images/hero-gala-desktop-wide-updated.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-gala-mobile-tablet-updated.jpg" alt="Studio Sanch couture portrait" fetchPriority="high" decoding="async" />
          </picture>
          <picture className="homepage-hero-picture homepage-hero-picture--monochrome" aria-hidden="true">
            <source media="(min-width: 1201px)" srcSet="/images/archive/homepage-black-white-2026-08-21-desktop-wide.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/archive/homepage-black-white-2026-08-21-mobile-tablet.webp" alt="" decoding="async" />
          </picture>
        </motion.div>
        <motion.div className={styles.heroShade} style={{ opacity: heroShade }} />
        <div className={styles.grain} aria-hidden="true" />
        <motion.div className={styles.heroCopy} style={{ y: titleY }} />
      </section>

      <section ref={manifestoRef} className={styles.manifesto}>
        <motion.span className={styles.eyebrow} style={{ opacity: manifestoOpacity, y: manifestoY }}>STUDIO SANCH</motion.span>
        <motion.div style={{ opacity: manifestoOpacity, y: manifestoY }}>
          <h2>
            {fr
              ? 'spécialisé dans la mode et les films numériques.'
              : 'Versed in high fashion and digital films.'}
          </h2>
        </motion.div>
      </section>

      <section ref={reelRef} className={styles.reelSection}>
        <motion.div className={styles.reelMedia} style={{ scale: reelScale, y: reelY }}>
          <CinematicReel
            src="/Videos/productions-gallery-montage-selective-monochrome.mp4"
            poster="/images/productions-hero-reel.webp"
            label={fr ? 'Film de productions Studio Sanch' : 'Studio Sanch productions film'}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.reelStill}
            src="/images/haute-couture-landing/grace-in-motion-15.webp"
            alt={fr ? 'Trois silhouettes vêtues de rouge en mouvement' : 'Three figures in red dresses in motion'}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
        <div className={styles.reelVeil} />
        <motion.div className={styles.reelCopy} style={{ opacity: reelCopyOpacity, y: reelCopyY }}>
          <span>{fr ? 'LE STUDIO' : 'THE STUDIO'}</span>
          <h2>{fr ? 'De l’idée initiale à une forme durable, chaque production est composée avec sensibilité et une précision minutieuse.' : 'From an initial idea to a lasting form, every production is composed with sensitivity and minute precision.'}</h2>
          <a href="/productions/">PRODUCTIONS <i>{'\u2197\uFE0E'}</i></a>
        </motion.div>
      </section>

      <section className={`${styles.chapters} ${styles.chaptersLead}`}>
        <ChapterScene chapter={chapters[0]} index={0} language={currentLanguage} />
      </section>

      <section ref={boutiqueRef} className={styles.boutiqueScene}>
        <motion.div className={styles.boutiqueImage} style={{ y: boutiqueImageY }}>
          <motion.figure
            className={`${styles.boutiqueArtwork} ${styles.boutiqueArtworkSecondary}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/art-prints/murmure-des-petals.jpg" alt="Murmure des Pétales artwork" />
          </motion.figure>
          <motion.figure
            className={`${styles.boutiqueArtwork} ${styles.boutiqueArtworkPrimary}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/art-prints/londe-interieure.jpg" alt="L’Onde Intérieure artwork on white paper" />
          </motion.figure>
          <motion.figure
            className={`${styles.boutiqueArtwork} ${styles.boutiqueArtworkTertiary}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/art-prints/celle-qui-se-connait.webp" alt="Celle qui se connaît artwork" />
          </motion.figure>
        </motion.div>
        <motion.div className={styles.boutiqueCopy} style={{ opacity: boutiqueCopyOpacity, y: boutiqueCopyY }}>
          <span className={styles.eyebrow}>DÉCOR</span>
          <h2>{fr ? "Œuvres d'art" : 'Artworks'}</h2>
          <p>
            {fr
              ? "Tactile Monochromes de qualité muséale — des dessins originaux, imprimés sur papier Hahnemühle Photo Rag 308 g/m² avec des encres archivistiques, en éditions de cinq exemplaires. Chaque tirage est accompagné d’un certificat d’authenticité signé."
              : "Tactile Monochromes — original works drawn entirely by Sanchit's hand with graphic-ink pens, discerningly rendered on Hahnemühle Photo Rag 308gsm with archival inks, in editions of five. Each is accompanied by a signed certificate of authenticity."}
          </p>
          <a href="/boutique">BOUTIQUE <i>{'\u2197\uFE0E'}</i></a>
        </motion.div>
      </section>

      <section className={`${styles.chapters} ${styles.chaptersTail}`}>
        {chapters.slice(1).map((chapter, index) => (
          <ChapterScene chapter={chapter} index={index + 1} language={currentLanguage} key={chapter.title.en} />
        ))}
      </section>

      <section ref={finaleRef} className={styles.finale}>
        <motion.div style={{ opacity: finaleOpacity, y: finaleY }}>
        <span className={styles.eyebrow}>{fr ? 'LE PREMIER CADRE' : 'THE FIRST FRAME'}</span>
          <h2>{fr ? 'Que le travail commence.' : 'Let the work begin.'}</h2>
        <div className={styles.finaleLinks}>
          <a href={fr ? '/fr/contact.html' : '/contact.html'}>{fr ? 'DÉMARRER UN PROJET' : 'START A PROJECT'}</a>
        </div>
        </motion.div>
      </section>
    </main>
  );
}
