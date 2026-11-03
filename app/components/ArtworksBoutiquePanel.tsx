'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { designs } from '../data/artworks';
import AuctionInterestForm from './AuctionInterestForm';
import styles from './ArtworksBoutiquePanel.module.css';

const acquisitionArtworks = ['Celle qui se connaît', 'Deepa'].map(title => designs.find(design => design.title === title)!);

interface Props {
  language: string;
  galleryHref: string;
  initialAuction?: boolean;
  initialPrintNotice?: boolean;
  onBack: () => void;
  onClose: () => void;
}

export default function ArtworksBoutiquePanel({ language, galleryHref, initialAuction = false, initialPrintNotice = false, onBack, onClose }: Props) {
  const [selectedArtwork, setSelectedArtwork] = useState(0);
  const auctionArtwork = acquisitionArtworks[selectedArtwork];
  const [leaving, setLeaving] = useState(false);
  const [showAuctions, setShowAuctions] = useState(initialAuction);
  const [showAuctionDetail, setShowAuctionDetail] = useState(initialAuction);
  const [showInterest, setShowInterest] = useState(false);
  const [showPrintNotice, setShowPrintNotice] = useState(initialPrintNotice);
  const french = language === 'fr';
  const ArtworkHeading = initialAuction ? 'h1' : 'h2';


  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showInterest) setShowInterest(false);
        else if (showAuctionDetail) setShowAuctionDetail(false);
        else if (showAuctions) setShowAuctions(false);
        else if (showPrintNotice) setShowPrintNotice(false);
        else leave(onClose);
      }
    };
    document.addEventListener('keydown', escape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', escape);
    };
  }, [onClose, showAuctions, showAuctionDetail, showInterest, showPrintNotice]);

  const leave = (action: () => void) => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(action, 550);
  };

  const back = () => showInterest ? setShowInterest(false) : showAuctionDetail ? setShowAuctionDetail(false) : showAuctions ? setShowAuctions(false) : showPrintNotice ? setShowPrintNotice(false) : leave(onBack);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={styles.overlay} role="dialog" aria-modal="true" aria-label={french ? 'Choisir une collection' : 'Choose a collection'}>
      <div className={styles.background} aria-hidden="true" />
      <motion.div layout transition={{ layout: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }} className={`${styles.panel} ${showAuctionDetail && !showInterest ? styles.auctionPanel : ''}`}>
        <button type="button" autoFocus className={styles.back} onClick={back}>← {french ? 'Retour' : 'Back'}</button>
        <button type="button" className={styles.close} aria-label={french ? 'Fermer' : 'Close'} onClick={() => leave(onClose)}>×</button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className={styles.flowContent} key={showPrintNotice ? 'prints' : showInterest ? 'interest' : showAuctions ? showAuctionDetail ? 'artwork' : 'auction-preview' : 'choices'} initial={{ opacity: 0, filter: 'blur(10px)', y: 12 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} exit={{ opacity: 0, filter: 'blur(8px)', y: -6 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        {showPrintNotice ? (
          <section className={styles.printNotice}>
            <h2>{french ? 'Œuvres d’art' : 'Artworks'}</h2>
            <p>{french ? "Chaque tirage est réalisé sur papier d'archives de qualité musée, garantissant une longévité exceptionnelle et la préservation des couleurs." : 'Each print is produced on museum-grade archival paper, ensuring exceptional longevity and color preservation.'}</p>
            <p className={styles.printNote}>{french ? "Les œuvres sont vendues sans cadre. Un encadrement professionnel d'archives est recommandé pour une conservation et une mise en valeur optimales." : 'Note: Prints are sold unframed. Professional archival framing is recommended for optimal preservation and display.'}</p>
            <a className={styles.collectionLink} href={`${galleryHref}${galleryHref.includes('?') ? '&' : '?'}from=fine-art-editions`}>{french ? 'Voir la Collection' : 'View Collection'}<span aria-hidden="true">→</span></a>
          </section>
        ) : showInterest ? (
          <AuctionInterestForm key={auctionArtwork.title} language={language} artworkTitle={auctionArtwork.title} />
        ) : showAuctions && !showAuctionDetail ? (
          <div className={styles.acquisitionList}>
            <p className={styles.previewLabel}>Acquisition</p>
            {acquisitionArtworks.map((artwork, index) => (
              <button key={artwork.title} type="button" className={styles.auctionPreview} onClick={() => { setSelectedArtwork(index); setShowAuctionDetail(true); }}>
                <span className={styles.previewTitle}>{artwork.title}</span>
                <span className={styles.previewLabel}>{french ? 'Se renseigner' : 'Enquire'}</span>
              </button>
            ))}
          </div>
        ) : showAuctions ? (
          <div className={styles.auctionPresentation}>
            <figure className={styles.auctionImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedArtwork === 0 ? '/images/auctions/celle-qui-se-connait-original.webp' : '/images/auctions/deepa-original.webp'} alt={auctionArtwork.title} />
            </figure>
            <div className={styles.auctionDetails}>
              <p className={styles.auctionLabel}>{french ? 'Acquisition · Œuvre originale' : 'Acquisition · Original artwork'}</p>
              <ArtworkHeading className={styles.auctionTitle}>{auctionArtwork.title}</ArtworkHeading>
              <p className={styles.auctionYear}>{auctionArtwork.year}</p>
              <p className={styles.medium}>{french ? 'Encre sur papier' : 'Ink on paper'}</p>
              <p className={styles.proposal}>{french ? 'Proposition — à partir de 1 000 000 EUR' : 'Proposal — from 1,000,000 EUR'}</p>
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
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
