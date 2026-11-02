'use client';

import { useEffect, useRef, useState } from 'react';
import { designs } from '../data/artworks';
import AuctionInterestForm from './AuctionInterestForm';
import styles from './ArtworksBoutiquePanel.module.css';

const auctionArtwork = designs.find(design => design.title === 'Celle qui se connaît')!;

interface Props {
  language: string;
  galleryHref: string;
  initialAuction?: boolean;
  initialPrintNotice?: boolean;
  onBack: () => void;
  onClose: () => void;
}

export default function ArtworksBoutiquePanel({ language, galleryHref, initialAuction = false, initialPrintNotice = false, onBack, onClose }: Props) {
  const [showAuctions, setShowAuctions] = useState(initialAuction);
  const [showInterest, setShowInterest] = useState(false);
  const [showPrintNotice, setShowPrintNotice] = useState(initialPrintNotice);
  const artworkRef = useRef<HTMLImageElement>(null);
  const french = language === 'fr';
  const ArtworkHeading = initialAuction ? 'h1' : 'h2';

  useEffect(() => {
    const artwork = artworkRef.current;
    if (!artwork) return;
    let movement: Animation | undefined;
    let previousExit = -1;
    let stopped = false;
    const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    const crossScreen = (firstPass = false) => {
      if (stopped) return;
      const entries = corners.map((_, index) => index).filter(index => index !== previousExit);
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const [x, y] = corners[entry];
      previousExit = 3 - entry;
      // Animate transform for consistent Safari support. The opening half-pass
      // starts in view, then subsequent passes enter and fully exit diagonally.
      const start = firstPass ? 'translate(-50%, -50%)' : `translate(-50%, -50%) translate(${x * 135}vw, ${y * 145}vh)`;
      movement = artwork.animate([
        { transform: start },
        { transform: `translate(-50%, -50%) translate(${-x * 135}vw, ${-y * 145}vh)` }
      ], { duration: firstPass ? 28000 : 56000, easing: 'linear', fill: 'forwards' });
      movement.onfinish = () => { movement?.cancel(); crossScreen(); };
    };
    crossScreen(true);
    return () => {
      stopped = true;
      if (movement) { movement.onfinish = null; movement.cancel(); }
    };
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showInterest) setShowInterest(false);
        else if (showAuctions) setShowAuctions(false);
        else if (showPrintNotice) setShowPrintNotice(false);
        else onClose();
      }
    };
    document.addEventListener('keydown', escape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', escape);
    };
  }, [onClose, showAuctions, showInterest, showPrintNotice]);

  const back = () => showInterest ? setShowInterest(false) : showAuctions ? setShowAuctions(false) : showPrintNotice ? setShowPrintNotice(false) : onBack();

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={french ? 'Choisir une collection' : 'Choose a collection'}>
      <div className={styles.background} aria-hidden="true">
        {/* The original artwork remains intact beneath the translucent veil. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={artworkRef} className={styles.artwork} src="/images/art-prints/le-sillage-epure.webp" alt="" />
        <div className={styles.veil} />
      </div>
      <div className={`${styles.panel} ${showAuctions && !showInterest ? styles.auctionPanel : ''}`}>
        <button type="button" autoFocus className={styles.back} onClick={back}>← {french ? 'Retour' : 'Back'}</button>
        <button type="button" className={styles.close} aria-label={french ? 'Fermer' : 'Close'} onClick={onClose}>×</button>
        {showPrintNotice ? (
          <section className={styles.printNotice}>
            <h2>{french ? 'Œuvres d’art' : 'Artworks'}</h2>
            <p>{french ? "Chaque tirage est réalisé sur papier d'archives de qualité musée, garantissant une longévité exceptionnelle et la préservation des couleurs." : 'Each print is produced on museum-grade archival paper, ensuring exceptional longevity and color preservation.'}</p>
            <p className={styles.printNote}>{french ? "Les œuvres sont vendues sans cadre. Un encadrement professionnel d'archives est recommandé pour une conservation et une mise en valeur optimales." : 'Note: Prints are sold unframed. Professional archival framing is recommended for optimal preservation and display.'}</p>
            <a className={styles.collectionLink} href={`${galleryHref}${galleryHref.includes('?') ? '&' : '?'}from=fine-art-editions`}>{french ? 'Voir la Collection' : 'View Collection'}<span aria-hidden="true">→</span></a>
          </section>
        ) : showInterest ? (
          <AuctionInterestForm language={language} />
        ) : showAuctions ? (
          <div className={styles.auctionPresentation}>
            <figure className={styles.auctionImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/auctions/celle-qui-se-connait-original.webp" alt={auctionArtwork.title} />
            </figure>
            <div className={styles.auctionDetails}>
              <p className={styles.auctionLabel}>{french ? 'Vente aux enchères à venir · Œuvre originale' : 'Upcoming auction · Original artwork'}</p>
              <ArtworkHeading className={styles.auctionTitle}>{auctionArtwork.title}</ArtworkHeading>
              <p className={styles.auctionYear}>{auctionArtwork.year}</p>
              <p className={styles.poetry}>{french ? auctionArtwork.descriptionFr : auctionArtwork.descriptionEn}</p>
              <button type="button" className={styles.interestButton} onClick={() => setShowInterest(true)}>
                {french ? 'Exprimer mon intérêt' : 'Express interest'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.choices}>
            <a className={styles.choice} href={galleryHref} onClick={(event) => { event.preventDefault(); setShowPrintNotice(true); }}>{french ? 'Éditions d’Art' : 'Fine Art Editions'}</a>
            <span className={styles.separator} aria-hidden="true" />
            <a className={styles.choice} href={french ? '/fr/auctions/celle-qui-se-connait/' : '/auctions/celle-qui-se-connait/'} onClick={(event) => { event.preventDefault(); setShowAuctions(true); }}>{french ? 'Œuvres Originales' : 'Originals'}</a>
          </div>
        )}
      </div>
    </div>
  );
}
