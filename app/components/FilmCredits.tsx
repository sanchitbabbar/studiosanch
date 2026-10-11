import { useLanguage } from '../context/LanguageContext';
import styles from './FilmPlayer.module.css';
import type { FilmCredit } from '../data/sanchFilms';

export default function FilmCredits({ credits }: { credits?: FilmCredit[] }) {
  const { language } = useLanguage();
  if (!credits?.length) return null;

  return (
    <dl className={styles.credits}>
      {credits.map(({ role, roleFr, name }) => (
        <div key={role} className={styles.credit}>
          <dt className={styles.role}>{language === 'fr' ? (roleFr || role) : role}</dt>
          <dd className={styles.name}>{name}</dd>
        </div>
      ))}
    </dl>
  );
}
