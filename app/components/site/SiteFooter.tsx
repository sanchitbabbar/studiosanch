'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import BackNavigation from './BackNavigation';

export default function SiteFooter({ backgroundColor = '#000', compact = false }: { backgroundColor?: string; compact?: boolean }) {
  const [isLanguagePanelOpen, setIsLanguagePanelOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const fr = language === 'fr';
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLanguagePanelOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <footer style={{ backgroundColor }}>
      {!compact && <div className="footer-container" style={{ alignItems: 'center', textAlign: 'center' }}>
        <div className="footer-section">
          <h3
            id="language-selector-trigger"
            data-i18n="footer.language"
            onClick={() => setIsLanguagePanelOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            {fr ? 'LANGUE' : 'EN · FR'}
          </h3>
        </div>

        {/* Language Selector Panel */}
        <div
          className={`language-panel-overlay${isLanguagePanelOpen ? ' active' : ''}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLanguagePanelOpen(false);
          }}
        >
          <div className="language-panel">
            <div
              className="panel-close"
              onClick={() => setIsLanguagePanelOpen(false)}
              role="button"
              aria-label={fr ? 'Fermer' : 'Close'}
            >
              &times;
            </div>
            <div className="panel-content">
              <h2>{fr ? 'SÉLECTIONNER LA LANGUE' : 'SELECT LANGUAGE'}</h2>
              <ul className="language-options">
                <li>
                  <button type="button" id="english-link" className={language === 'en' ? 'active' : ''} onClick={() => { setLanguage('en'); setIsLanguagePanelOpen(false); }}>
                    English
                  </button>
                </li>
                <li>
                  <button type="button" id="french-link" className={language === 'fr' ? 'active' : ''} onClick={() => { setLanguage('fr'); setIsLanguagePanelOpen(false); }}>
                    Français
                  </button>
                </li>
              </ul>
              <p className="notice" data-i18n="footer.basketNotice">
                {fr
                  ? 'LA LANGUE CHOISIE SERA APPLIQUÉE À TOUTES LES PAGES DU SITE.'
                  : 'YOUR LANGUAGE CHOICE WILL BE APPLIED THROUGHOUT THE WEBSITE.'}
              </p>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <ul>
            <li>
              <a href={fr ? '/fr/contact.html' : '/contact.html'}>
                {fr ? 'NOUS ÉCRIRE' : 'WRITE TO US'}
              </a>
            </li>
          </ul>
        </div>

      </div>}

      <div className="copyright-container">
        {!compact && <BackNavigation />}
        <div className="social-links footer-social">
          <a
            href="https://www.facebook.com/profile.php?id=61559840979690"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook" />
          </a>
          <a
            href="https://www.instagram.com/studiosanch/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram" />
          </a>
          <a
            href="https://www.threads.com/@studiosanch"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Threads"
          >
            <svg width="1.1rem" height="1.1rem" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19.3 7.3C18.3 3.9 15.8 2 12 2 6.5 2 3.5 5.6 3.5 12s3 10 8.5 10c4.7 0 7.9-2.5 7.9-6.1 0-3.5-3.1-5.3-7.3-5.3-2.8 0-4.4 1.3-4.4 3.2 0 1.8 1.4 2.9 3.4 2.9 2.7 0 4.1-1.8 4.1-5.2 0-3-1.3-4.6-3.8-4.6-1.5 0-2.6.6-3.3 1.6" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/studiosanch/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin" />
          </a>
          <a
            href="https://youtube.com/@studiosanch"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <i className="fab fa-youtube" />
          </a>
          <a
            href="https://www.tiktok.com/@studiosanch"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <i className="fab fa-tiktok" />
          </a>
        </div>
        <div className="copyright">
          <motion.div
            className="footer-copyright-copy"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.2 }}
            viewport={{ once: true }}
          >
            <div style={{ paddingBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/mda-timestamp-stamp.webp"
                alt="Horodaté par MDA DATA avec IPOCAMP"
                width={1500}
                height={209}
                loading="lazy"
                style={{ display: 'block', height: 'auto', width: '268px', maxWidth: '80vw', clipPath: 'inset(22% 4%)' }}
              />
            </div>
            <p>ⓒ 2026 STUDIO SANCH</p>
            <p>{fr ? 'TOUS DROITS RÉSERVÉS.' : 'ALL RIGHTS RESERVED.'}</p>
          </motion.div>
          <div className="footer-policy-links" aria-label={fr ? 'Informations légales' : 'Legal information'}>
            <a href="/privacy-policy.html">{fr ? 'CONFIDENTIALITÉ' : 'PRIVACY'}</a>
            <span aria-hidden="true">|</span>
            <a href="/terms">{fr ? 'CONDITIONS' : 'TERMS'}</a>
            <span aria-hidden="true">|</span>
            <a href={fr ? '/fr/legal-notice.html' : '/legal-notice.html'}>{fr ? 'LÉGALE' : 'LEGAL'}</a>
          </div>
          <button
            className="footer-cookie-control"
            type="button"
            onClick={() => window.dispatchEvent(new Event('studio-sanch:open-cookie-preferences'))}
          >
            COOKIES
          </button>
        </div>
      </div>
    </footer>
  );
}
