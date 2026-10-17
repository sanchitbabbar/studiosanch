'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { accessoryProducts } from '../../data/accessories';
import { useLanguage } from '../../context/LanguageContext';
import styles from './BoutiqueSlider.module.css';

const productIds = ['sanch-suede', 'velour-fur-scarf', 'sunglasses-black', 'belt-sanch', 'artbook-main'];
const products = productIds.flatMap(id => accessoryProducts.find(product => product.id === id) ?? []);

export default function BoutiqueSlider() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    let previous = 0;
    let offset = 0;
    const move = (time: number) => {
      if (previous) offset += Math.min(time - previous, 100) * 0.0105;
      previous = time;
      const loopWidth = track.scrollWidth / 2;
      if (loopWidth) offset %= loopWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className={styles.section} aria-label="Boutique">
      <div className={styles.viewport}>
        <div ref={trackRef} className={styles.track}>
          {[0, 1].map(copy => (
            <div key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
              {products.map(product => (
                <Link href="/boutique/" key={product.id} className={styles.card} tabIndex={copy === 1 ? -1 : undefined}>
                  <div className={styles.image}>
                    <Image src={product.image} alt={fr ? product.nameFr || product.name : product.name} fill sizes="280px"
                      style={{ objectFit: 'cover', objectPosition: product.id === 'velour-fur-scarf' ? 'center 72%' : product.id === 'sanch-suede' ? 'center 65%' : 'center' }} />
                    <span className={styles.overlay}>{fr ? 'EXPLORER LA BOUTIQUE' : 'EXPLORE BOUTIQUE'}</span>
                  </div>
                  <h3>{fr ? product.nameFr || product.name : product.name}</h3>
                  <p>{product.price}</p>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
