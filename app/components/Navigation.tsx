'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { languages } from '../context/LanguageContext';

interface MenuItem {
  href: string;
  label: string;
}

// Mirrors the menu in the existing static pages, with a direct Boutique route.
const menuItems: MenuItem[] = [
  { href: '/', label: 'HOME' },
  { href: '/about.html', label: 'ABOUT' },
  { href: '/atelier.html', label: 'ATELIER' },
  { href: '/haute-couture.html', label: 'HAUTE COUTURE' },
  { href: '/boutique/', label: 'BOUTIQUE' },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const selectedLang = languages.find((lang) => lang.code === language) || languages[0];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs font-light tracking-[0.2em] flex items-center gap-2 group text-white/70 hover:text-white transition-colors"
      >
        <span className="group-hover:tracking-[0.3em] transition-all duration-300">LANGUAGE</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="opacity-50 text-xs"
        >
          ↓
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-3 py-1.5 space-y-1.5 flex flex-col items-center"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 text-[11px] tracking-[0.15em] ${
                  lang.code === selectedLang.code ? 'text-white' : 'text-white/50 hover:text-white'
                } transition-all duration-300`}
              >
                <span>{lang.label}</span>
                {lang.code === selectedLang.code && <span className="text-xs ml-1">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] flex h-12 items-center justify-between px-8">
        <div>
          <a
            href="/"
            aria-label="Studio Sanch home"
            className="inline-block uppercase leading-none text-[#c0c0c0] transition-colors hover:text-white"
            style={{ fontFamily: 'Balgin, serif', fontSize: '0.864rem', fontWeight: 400, letterSpacing: '0.14em' }}
          >
            SANCH
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          className="relative z-[60] flex h-full cursor-pointer items-center"
        >
          <span className="mr-[5px] flex h-4 w-6 flex-col justify-between p-[5px]">
            <motion.span
              className="block h-[0.7px] w-full origin-center bg-white"
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 4 : 0 }}
              transition={{ duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }}
            />
            <motion.span
              className="block h-[0.7px] w-full origin-center bg-white"
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -4 : 0 }}
              transition={{ duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }}
            />
          </span>
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-lg flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeMenu();
            }}
          >
            <div className="relative w-4/5 max-w-lg text-center">
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="absolute -top-[70px] right-0 w-10 h-10 flex items-center justify-center text-2xl text-white/70 border border-white/20 rounded-full hover:rotate-90 transition-transform duration-500"
              >
                &times;
              </button>

              <ul className="list-none p-0 m-0">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="my-6"
                  >
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className="text-sm tracking-[0.2em] uppercase font-light text-white/90 hover:text-white hover:tracking-[0.25em] transition-all duration-500"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-12 flex justify-center opacity-80">
                <LanguageSelector />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
