import styles from './ArtworksBoutiquePanel.module.css';

const source = '/images/art-prints/encadrement-preview';

export default function FramingPreview({ french }: { french: boolean }) {
  return (
    <div className={styles.framingPreview}>
      <video
        aria-label={french ? 'Encadrement d’une édition d’art' : 'Framing a fine art edition'}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={source + '.webm'} type="video/webm" />
        <source src={source + '.mp4'} type="video/mp4" />
      </video>
    </div>
  );
}
