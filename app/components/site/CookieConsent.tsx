'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './CookieConsent.module.css';

type Preferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

const STORAGE_KEY = 'cookiePreferences';

const copy = {
  en: {
    eyebrow: 'A considered experience',
    message: 'Essential cookies preserve the site’s core functions. Optional cookies are used only with your permission.',
    privacy: 'Privacy',
    preferences: 'Preferences',
    essential: 'Essential only',
    accept: 'Allow all',
    title: 'Cookie preferences',
    intro: 'Choose the elements that may accompany your visit. Essential cookies remain active for security and access.',
    necessary: 'Essential',
    necessaryDetail: 'Security, language and client access.',
    analytics: 'Analytics',
    analyticsDetail: 'Anonymous audience measurement.',
    experience: 'Experience',
    experienceDetail: 'Remembered display preferences.',
    save: 'Save preferences',
    manage: 'Cookies',
    close: 'Close preferences',
  },
  fr: {
    eyebrow: 'Une expérience maîtrisée',
    message: 'Les cookies essentiels préservent les fonctions du site. Les cookies optionnels ne sont utilisés qu’avec votre accord.',
    privacy: 'Confidentialité',
    preferences: 'Préférences',
    essential: 'Essentiels uniquement',
    accept: 'Tout autoriser',
    title: 'Préférences de cookies',
    intro: 'Choisissez les éléments qui peuvent accompagner votre visite. Les cookies essentiels restent actifs pour la sécurité et les accès.',
    necessary: 'Essentiels',
    necessaryDetail: 'Sécurité, langue et espace client.',
    analytics: 'Analyse',
    analyticsDetail: 'Mesure d’audience anonyme.',
    experience: 'Expérience',
    experienceDetail: 'Préférences d’affichage mémorisées.',
    save: 'Enregistrer',
    manage: 'Cookies',
    close: 'Fermer les préférences',
  },
};

const essentialOnly: Preferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export default function CookieConsent() {
  const pathname = usePathname();
  const language = pathname === '/fr' || pathname.startsWith('/fr/') ? 'fr' : 'en';
  const text = copy[language];
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const privacyHref = useMemo(() => '/privacy-policy.html', []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && new URLSearchParams(window.location.search).has('previewCookies')) {
      setVisible(true);
      return;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const preferences = JSON.parse(saved) as Preferences;
        setAnalytics(Boolean(preferences.analytics));
        setFunctional(Boolean(preferences.functional));
        setHasChoice(true);
        return;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setVisible(true);
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      setVisible(false);
      setSettingsOpen(true);
    };
    window.addEventListener('studio-sanch:open-cookie-preferences', openPreferences);
    return () => window.removeEventListener('studio-sanch:open-cookie-preferences', openPreferences);
  }, []);

  const afterExit = (callback: () => void) => {
    setLeaving(true);
    window.setTimeout(() => {
      callback();
      setLeaving(false);
    }, 460);
  };

  const persist = (preferences: Preferences) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    window.dispatchEvent(new CustomEvent('studio-sanch:cookie-preferences', { detail: preferences }));
    setAnalytics(preferences.analytics);
    setFunctional(preferences.functional);
    setHasChoice(true);
    afterExit(() => {
      setVisible(false);
      setSettingsOpen(false);
    });
  };

  const allowAll = () => persist({ necessary: true, analytics: true, marketing: true, functional: true });
  const savePreferences = () => persist({ necessary: true, analytics, marketing: false, functional });

  return (
    <>
      {visible && !settingsOpen && (
        <section className={`${styles.bar} ${leaving ? styles.leaving : ''}`} aria-label={text.title}>
          <div>
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <p className={styles.copy}>
              {text.message}{' '}
              <a href={privacyHref}>{text.privacy}</a>
            </p>
          </div>
          <div className={styles.actions}>
            <button className={styles.action} type="button" onClick={() => afterExit(() => { setVisible(false); setSettingsOpen(true); })}>
              {text.preferences}
            </button>
            <button className={styles.action} type="button" onClick={() => persist(essentialOnly)}>
              {text.essential}
            </button>
            <button className={styles.primary} type="button" onClick={allowAll}>
              {text.accept}
            </button>
          </div>
        </section>
      )}

      {settingsOpen && (
        <section className={`${styles.panel} ${leaving ? styles.leaving : ''}`} role="dialog" aria-modal="true" aria-label={text.title}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelTitle}>{text.title}</p>
              <p className={styles.panelIntro}>{text.intro}</p>
            </div>
            <button
              className={styles.close}
              type="button"
              aria-label={text.close}
              onClick={() => afterExit(() => { setSettingsOpen(false); if (!hasChoice) setVisible(true); })}
            >
              ×
            </button>
          </div>

          <div className={styles.choices}>
            <div className={styles.choice}>
              <span>
                <span className={styles.choiceName}>{text.necessary}</span>
                <span className={styles.choiceDescription}>{text.necessaryDetail}</span>
              </span>
              <label className={styles.toggle} aria-label={text.necessary}>
                <input type="checkbox" checked disabled readOnly />
                <span className={styles.track} />
              </label>
            </div>
            <div className={styles.choice}>
              <span>
                <span className={styles.choiceName}>{text.analytics}</span>
                <span className={styles.choiceDescription}>{text.analyticsDetail}</span>
              </span>
              <label className={styles.toggle} aria-label={text.analytics}>
                <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
                <span className={styles.track} />
              </label>
            </div>
            <div className={styles.choice}>
              <span>
                <span className={styles.choiceName}>{text.experience}</span>
                <span className={styles.choiceDescription}>{text.experienceDetail}</span>
              </span>
              <label className={styles.toggle} aria-label={text.experience}>
                <input type="checkbox" checked={functional} onChange={(event) => setFunctional(event.target.checked)} />
                <span className={styles.track} />
              </label>
            </div>
          </div>

          <div className={styles.panelActions}>
            <button className={styles.action} type="button" onClick={() => persist(essentialOnly)}>
              {text.essential}
            </button>
            <button className={styles.primary} type="button" onClick={savePreferences}>
              {text.save}
            </button>
          </div>
        </section>
      )}
    </>
  );
}
