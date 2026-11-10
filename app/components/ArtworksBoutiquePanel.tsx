'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { originalArtworks as acquisitionArtworks } from '../data/originalArtworks';
import AuctionInterestForm from './AuctionInterestForm';
import AcquisitionInvitations from './AcquisitionInvitations';
import styles from './ArtworksBoutiquePanel.module.css';



interface Props {
  language: string;
  galleryHref: string;
  initialAuction?: boolean;
  initialArtwork?: number;
  initialPrintNotice?: boolean;
  onBack: () => void;
  onClose: () => void;
}

export default function ArtworksBoutiquePanel({ language, galleryHref, initialAuction = false, initialArtwork = 0, initialPrintNotice = false, onBack, onClose }: Props) {
  const [selectedArtwork, setSelectedArtwork] = useState(initialArtwork);
  const auctionArtwork = acquisitionArtworks[selectedArtwork];
  const [leaving, setLeaving] = useState(false);
  const [showAuctions, setShowAuctions] = useState(initialAuction);
  const [showAuctionDetail, setShowAuctionDetail] = useState(initialAuction);
  const [showInterest, setShowInterest] = useState(false);
  const [showPrintNotice, setShowPrintNotice] = useState(initialPrintNotice);
  const french = language === 'fr';
  const ArtworkHeading = initialAuction ? 'h1' : 'h2';
  const origin = useRef<{ url: string; title: string } | null>(null);
  useEffect(() => {
    origin.current = { url: location.href, title: document.title };
    return () => { if (origin.current) document.title = origin.current.title; };
  }, []);
  useEffect(() => {
    if (!origin.current) return;
    if (showAuctionDetail) {
      const slug = ['celle-qui-se-connait', 'deepa', 'instar', 'murmure-des-petales'][selectedArtwork];
      history.replaceState(history.state, '', `${french ? '/fr' : ''}/originals/${slug}/`);
      document.title = `${auctionArtwork.title} — ${french ? 'Œuvre originale' : 'Original artwork'}`;
    } else {
      history.replaceState(history.state, '', initialAuction ? '/boutique/' : origin.current.url);
      document.title = initialAuction ? (french ? "Œuvres Originales" : "Original artworks") : origin.current.title;
    }
  }, [showAuctionDetail, selectedArtwork, french, auctionArtwork.title, initialAuction]);



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
    window.setTimeout(() => { if (origin.current && !initialAuction) { history.replaceState(history.state, '', origin.current.url); document.title = origin.current.title; } action(); }, 550);
  };

  const back = () => showInterest ? setShowInterest(false) : showAuctionDetail ? setShowAuctionDetail(false) : showAuctions ? setShowAuctions(false) : showPrintNotice ? setShowPrintNotice(false) : leave(onBack);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={styles.overlay} role="dialog" aria-modal="true" aria-label={french ? 'Choisir une collection' : 'Choose a collection'}>
      <div className={styles.background} aria-hidden="true" />
      <motion.div layout transition={{ layout: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }} data-enquiry-card={showInterest || undefined} className={`${styles.panel} ${showAuctionDetail && !showInterest ? styles.auctionPanel : ''}`}>
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
          <AcquisitionInvitations titles={acquisitionArtworks.map(artwork => artwork.title)} french={french} onSelect={index => { setSelectedArtwork(index); setShowAuctionDetail(true); }} />
        ) : showAuctions ? (
          <div className={styles.auctionPresentation}>
            <figure className={styles.auctionImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={auctionArtwork.image} alt={auctionArtwork.title} />
            </figure>
            <div className={styles.auctionDetails}>
              <p className={styles.auctionLabel}>{french ? 'Acquisition · Œuvre originale' : 'Acquisition · Original artwork'}</p>
              <ArtworkHeading className={styles.auctionTitle}>{auctionArtwork.title}</ArtworkHeading>
              <p className={styles.auctionYear}>{auctionArtwork.year}</p>
              <p className={styles.medium}>{french ? 'Encre sur papier' : 'Ink on paper'}{'dimensions' in auctionArtwork ? ` · ${auctionArtwork.dimensions} (${french ? 'H × L' : 'H × W'})` : ''}<span className={styles.provenance}>{french ? 'Créée à la main à Montmartre, Paris.' : 'Created by hand in Montmartre, Paris.'}</span></p>
              <p className={styles.proposal}>{french ? 'Proposition — à partir de ' : 'Proposal — from '}{auctionArtwork.minimumProposal.toLocaleString(french ? 'fr-FR' : 'en-GB')} EUR</p>
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
            <a className={styles.choice} href={french ? '/fr/originals/celle-qui-se-connait/' : '/originals/celle-qui-se-connait/'} onClick={(event) => { event.preventDefault(); setShowAuctions(true); }}>{french ? 'Œuvres Originales' : 'Originals'}</a>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
