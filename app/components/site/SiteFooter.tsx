'use client';

import { useEffect, useState } from 'react';

export default function SiteFooter({ backgroundColor }: { backgroundColor?: string }) {
  const [isLanguagePanelOpen, setIsLanguagePanelOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLanguagePanelOpen(false);
        setIsNewsletterOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Same endpoint as js/newsletter-handler.js
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const formData = new FormData();
      formData.append('email', email);
      await fetch('/php/subscribe.php', { method: 'POST', body: formData });
    } catch {
      // Network/host errors are non-blocking, matching the original behaviour
    } finally {
      setShowSuccess(true);
      setEmail('');
    }
  };

  return (
    <footer style={backgroundColor ? { backgroundColor } : undefined}>
      <div className="footer-container">
        <div className="footer-section">
          <h3
            id="language-selector-trigger"
            data-i18n="footer.language"
            onClick={() => setIsLanguagePanelOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            LANGUAGE
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
              aria-label="Close"
            >
              &times;
            </div>
            <div className="panel-content">
              <h2 data-i18n="footer.selectLanguage">SELECT LOCATION AND LANGUAGE</h2>
              <ul className="language-options">
                <li>
                  <a href="/" id="english-link" data-lang="en" className="active">
                    English
                  </a>
                </li>
                <li>
                  <a href="/fr/index.html" id="french-link" data-lang="fr">
                    Français
                  </a>
                </li>
              </ul>
              <p className="notice" data-i18n="footer.basketNotice">
                IF YOU ALREADY HAVE ITEMS IN YOUR BASKET, PLEASE NOTE THAT THEY WILL BE SHIPPED TO
                THE COUNTRY/REGION YOU WILL SELECT
              </p>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3 data-i18n="footer.clientService">CLIENT SERVICE</h3>
          <ul>
            <li>
              <a href="/track-order.html" data-i18n="footer.trackOrder">
                TRACK ORDER
              </a>
            </li>
            <li className="newsletter-item">
              <a
                href="#"
                id="newsletter-link"
                data-i18n="footer.subscribe"
                onClick={(e) => {
                  e.preventDefault();
                  setIsNewsletterOpen(true);
                }}
              >
                SUBSCRIBE TO NEWS LETTER
              </a>
              <div className={`newsletter-dropdown${isNewsletterOpen ? ' active' : ''}`}>
                <span
                  className="dropdown-close"
                  onClick={() => {
                    setIsNewsletterOpen(false);
                    setShowSuccess(false);
                  }}
                  role="button"
                  aria-label="Close"
                >
                  &times;
                </span>
                <h3 data-i18n="footer.newsletter">Newsletter</h3>
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    data-i18n="footer.enterEmail"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="send-button-wrapper">
                    <span className="send-text" data-i18n="footer.send" onClick={handleSubscribe}>
                      Send
                    </span>
                    <input type="submit" value="" className="hidden-submit" />
                  </div>
                </form>
                <div className={`success-message${showSuccess ? ' active' : ''}`} data-i18n="footer.thankYou">
                  Thank you for subscribing to our newsletter.
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 data-i18n="footer.contactUs">CONTACT US</h3>
          <ul>
            <li>
              <a href="/appointment.html" data-i18n="footer.makeAppointment">
                MAKE AN APPOINTMENT
              </a>
            </li>
            <li>
              <a href="/contact.html" data-i18n="footer.writeToUs">
                WRITE TO US
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 data-i18n="footer.legal">LEGAL</h3>
          <ul>
            <li>
              <a href="/legal-notice.html" data-i18n="footer.legalNotice">
                LEGAL NOTICE
              </a>
            </li>
            <li>
              <a href="#" data-i18n="footer.accessibility">
                ACCESSIBILITY
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section career-section">
          <h3 data-i18n="footer.career">CAREER</h3>
        </div>
      </div>

      <div className="copyright-container">
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
        </div>
      </div>
    </footer>
  );
}
