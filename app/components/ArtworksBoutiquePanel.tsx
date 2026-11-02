'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ArtworksBoutiquePanel.module.css';

interface Props {
  language: string;
  galleryHref: string;
  onBack: () => void;
  onClose: () => void;
}

export default function ArtworksBoutiquePanel({ language, galleryHref, onBack, onClose }: Props) {
  const [showAuctions, setShowAuctions] = useState(false);
  const artworkRef = useRef<HTMLImageElement>(null);
  const french = language === 'fr';

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
        if (showAuctions) setShowAuctions(false);
        else onClose();
      }
    };
    document.addEventListener('keydown', escape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', escape);
    };
  }, [onClose, showAuctions]);

  const back = () => showAuctions ? setShowAuctions(false) : onBack();

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={french ? 'Choisir une collection' : 'Choose a collection'}>
      <div className={styles.background} aria-hidden="true">
        {/* The original artwork remains intact beneath the translucent veil. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={artworkRef} className={styles.artwork} src="/images/art-prints/le-sillage-epure.webp" alt="" />
        <div className={styles.veil} />
      </div>
      <div className={styles.panel}>
        <button type="button" autoFocus className={styles.back} onClick={back}>← {french ? 'Retour' : 'Back'}</button>
        <button type="button" className={styles.close} aria-label={french ? 'Fermer' : 'Close'} onClick={onClose}>×</button>
        {showAuctions ? (
          <p className={styles.notice} role="status">{french ? 'Restez à l’écoute des prochaines ventes aux enchères.' : 'Stay tuned for upcoming auctions.'}</p>
        ) : (
          <div className={styles.choices}>
            <a className={styles.choice} href={galleryHref}>{french ? 'Éditions d’Art' : 'Fine Art Editions'}</a>
            <span className={styles.separator} aria-hidden="true" />
            <button type="button" className={styles.choice} onClick={() => setShowAuctions(true)}>{french ? 'Œuvres Originales' : 'Originals'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
