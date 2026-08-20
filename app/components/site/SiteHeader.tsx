'use client';

import { useEffect, useState } from 'react';

interface MenuItem {
  href: string;
  label: string;
  i18n: string;
}

// Same menu as the original static pages, with BOUTIQUE added.
const menuItems: MenuItem[] = [
  { href: '/', label: 'HOME', i18n: 'header.home' },
  { href: '/boutique', label: 'BOUTIQUE', i18n: 'header.boutique' },
  { href: '/haute-couture.html', label: 'HAUTE COUTURE', i18n: 'header.hauteCouture' },
  { href: '/productions/', label: 'PRODUCTIONS', i18n: 'header.productions' },
  { href: '/atelier.html', label: 'ATELIER', i18n: 'header.atelier' },
  { href: '/about.html', label: 'ABOUT', i18n: 'header.about' },
];

export default function SiteHeader({ active }: { active?: string }) {
  const [isOpen, setIsOpen] = useState(false);

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
          aria-label="Open menu"
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
          <div className="menu-close" onClick={() => setIsOpen(false)} role="button" aria-label="Close menu">
            &times;
          </div>
          <ul className="menu-items">
            {menuItems.map((item, index) => (
              <li
                key={item.label}
                style={{ ['--i' as string]: index }}
                onClick={() => setIsOpen(false)}
              >
                <a
                  href={item.href}
                  data-i18n={item.i18n}
                  className={active === item.label ? 'active' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
