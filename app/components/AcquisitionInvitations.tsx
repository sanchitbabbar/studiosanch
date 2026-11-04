'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ArtworksBoutiquePanel.module.css';

export default function AcquisitionInvitations({ titles, french, onSelect }: { titles: string[]; french: boolean; onSelect: (index: number) => void }) {
  const list = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const update = () => setMore(element.scrollHeight - element.clientHeight - element.scrollTop > 5);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener('scroll', update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener('scroll', update); };
  }, []);
  return (
    <div className={styles.acquisitionList}>
      <p className={styles.previewLabel}>Acquisition</p>
      <div className={styles.invitationScroll} ref={list} data-more={more} role="group" aria-label={french ? 'Œuvres originales disponibles' : 'Available original artworks'}>
        {titles.map((title, index) => (
          <button key={title} type="button" className={styles.auctionPreview} onClick={() => onSelect(index)}>
            <span className={styles.previewTitle}>{title}</span>
            <span className={styles.previewLabel}>{french ? 'Se renseigner' : 'Enquire'}</span>
          </button>
        ))}
      </div>
      <button type="button" className={styles.moreOriginals} aria-label={french ? 'Voir les autres œuvres originales' : 'View more original artworks'} aria-hidden={!more} tabIndex={more ? 0 : -1} data-visible={more} onClick={() => list.current?.scrollBy({ top: 180, behavior: 'smooth' })}><span aria-hidden="true" className={styles.originalsScrollLight} /></button>
    </div>
  );
}
