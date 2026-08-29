'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BackNavigation from './BackNavigation';

export default function SiteFooter({ backgroundColor = '#000' }: { backgroundColor?: string }) {
  const [isLanguagePanelOpen, setIsLanguagePanelOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const fr = language === 'fr';

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
      <div className="footer-container">
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
              <a href={fr ? '/fr/appointment.html' : '/appointment.html'}>
                {fr ? 'PRENDRE RENDEZ-VOUS' : 'MAKE AN APPOINTMENT'}
              </a>
            </li>
            <li>
              <a href={fr ? '/fr/contact.html' : '/contact.html'}>
                {fr ? 'NOUS ÉCRIRE' : 'WRITE TO US'}
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="copyright-container">
        <BackNavigation />
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
          <p data-i18n="copyright">© studiosanch 2026</p>
          <div className="footer-policy-links" aria-label={fr ? 'Informations légales' : 'Legal information'}>
            <a href="/privacy-policy.html">{fr ? 'CONFIDENTIALITÉ' : 'PRIVACY'}</a>
            <span aria-hidden="true">|</span>
            <a href="/terms">{fr ? 'CONDITIONS' : 'TERMS'}</a>
            <span aria-hidden="true">|</span>
            <a href={fr ? '/fr/legal-notice.html' : '/legal-notice.html'}>{fr ? 'LÉGAL' : 'LEGAL'}</a>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('studio-sanch:open-cookie-preferences'))}
            >
              COOKIES
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
