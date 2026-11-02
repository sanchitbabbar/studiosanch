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
  onBack: () => void;
  onClose: () => void;
}

export default function ArtworksBoutiquePanel({ language, galleryHref, initialAuction = false, onBack, onClose }: Props) {
  const [showAuctions, setShowAuctions] = useState(initialAuction);
  const [showInterest, setShowInterest] = useState(false);
  const artworkRef = useRef<HTMLImageElement>(null);
  const french = language === 'fr';
  const ArtworkHeading = initialAuction ? 'h1' : 'h2';

  useEffect(() => {
    const artwork = artworkRef.current;
    if (!artwork) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let movement: Animation | undefined;
    let previousExit = -1;
    let stopped = false;
    const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    const crossScreen = () => {
      if (stopped || preference.matches) return;
      const entries = corners.map((_, index) => index).filter(index => index !== previousExit);
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const [x, y] = corners[entry];
      previousExit = 3 - entry;
      movement = artwork.animate([
        { translate: `${x * 135}vw ${y * 145}vh` },
        { translate: `${-x * 135}vw ${-y * 145}vh` }
      ], { duration: 42000, easing: 'linear', fill: 'forwards' });
      movement.onfinish = () => { movement?.cancel(); crossScreen(); };
    };
    const updateMotion = () => {
      if (movement) { movement.onfinish = null; movement.cancel(); }
      crossScreen();
    };
    crossScreen();
    preference.addEventListener('change', updateMotion);
    return () => {
      stopped = true;
      preference.removeEventListener('change', updateMotion);
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
        else onClose();
      }
    };
    document.addEventListener('keydown', escape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', escape);
    };
  }, [onClose, showAuctions, showInterest]);

  const back = () => showInterest ? setShowInterest(false) : showAuctions ? setShowAuctions(false) : onBack();

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
        {showInterest ? (
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
              <p className={styles.auctionYear}>{auctionArtwork.year} · Paris, France</p>
              <p className={styles.poetry}>{french ? auctionArtwork.descriptionFr : auctionArtwork.descriptionEn}</p>
              <button type="button" className={styles.interestButton} onClick={() => setShowInterest(true)}>
                {french ? 'Exprimer mon intérêt' : 'Express interest'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.choices}>
            <a className={styles.choice} href={galleryHref}>{french ? 'Éditions d’Art' : 'Fine Art Editions'}</a>
            <span className={styles.separator} aria-hidden="true" />
            <a className={styles.choice} href={french ? '/fr/auctions/celle-qui-se-connait/' : '/auctions/celle-qui-se-connait/'} onClick={(event) => { event.preventDefault(); setShowAuctions(true); }}>{french ? 'Œuvres Originales' : 'Originals'}</a>
          </div>
        )}
      </div>
    </div>
  );
}
