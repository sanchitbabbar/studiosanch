'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface MenuItem {
  href: string;
  en: string;
  fr: string;
}

// Same menu as the original static pages, with BOUTIQUE added.
const menuItems: MenuItem[] = [
  { href: '/', en: 'HOME', fr: 'ACCUEIL' },
  { href: '/boutique', en: 'BOUTIQUE', fr: 'BOUTIQUE' },
  { href: '/haute-couture.html', en: 'HAUTE COUTURE', fr: 'HAUTE COUTURE' },
  { href: '/productions/', en: 'PRODUCTIONS', fr: 'PRODUCTIONS' },
  { href: '/atelier.html', en: 'ATELIER', fr: 'ATELIER' },
  { href: '/about.html', en: 'ABOUT', fr: 'À PROPOS' },
];

const frenchRoutes: Record<string, string> = {
  HOME: '/fr/',
  ATELIER: '/fr/atelier.html',
  ABOUT: '/fr/about.html',
};

export default function SiteHeader({ active }: { active?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  // Lock scrolling while the overlay is open, matching js/menu.js
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <header>
        <div className="logo">
          <a href="/">SANCH</a>
        </div>
        <div
          className="hamburger-menu"
          onClick={() => setIsOpen(true)}
          role="button"
          aria-label={language === 'fr' ? 'Ouvrir le menu' : 'Open menu'}
        >
          <div className="hamburger-icon">
            <span
              style={isOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : undefined}
            />
            <span
              style={isOpen ? { transform: 'rotate(-45deg) translate(-1px, -1px)' } : undefined}
            />
          </div>
        </div>
      </header>

      <div
        className={`menu-overlay${isOpen ? ' active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div className="menu-content">
          <div className="menu-close" onClick={() => setIsOpen(false)} role="button" aria-label={language === 'fr' ? 'Fermer le menu' : 'Close menu'}>
            &times;
          </div>
          <ul className="menu-items">
            {menuItems.map((item, index) => (
              <li
                key={item.en}
                style={{ ['--i' as string]: index }}
              >
                <a
                  href={language === 'fr' ? (frenchRoutes[item.en] || item.href) : item.href}
                  className={active === item.en ? 'active' : undefined}
                >
                  {item[language]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
