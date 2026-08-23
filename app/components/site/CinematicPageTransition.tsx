'use client';

import { useEffect } from 'react';

const TRANSITION_DURATION = 420;

export default function CinematicPageTransition() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('studio-sanch-cinematic-entry') === '1') {
        window.sessionStorage.removeItem('studio-sanch-cinematic-entry');
        document.body.classList.add('cinematic-page-enter');
        window.setTimeout(() => document.body.classList.remove('cinematic-page-enter'), 620);
      }
    } catch {
      // Navigation still works when storage is unavailable.
    }

    const handleNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash) return;
      if (document.body.classList.contains('cinematic-page-exit')) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const isBoutique = destination.pathname.replace(/\/$/, '') === '/boutique';
      document.body.classList.add('cinematic-page-exit');
      if (isBoutique) document.body.classList.add('cinematic-page-exit-fast');
      try {
        window.sessionStorage.setItem('studio-sanch-cinematic-entry', '1');
        if (isBoutique) {
          window.sessionStorage.setItem(
            'studio-sanch-boutique-origin',
            `${window.location.pathname}${window.location.search}${window.location.hash}`
          );
        }
      } catch {
        // Navigation still works when storage is unavailable.
      }
      window.setTimeout(() => {
        window.location.href = destination.href;
      }, isBoutique ? 260 : TRANSITION_DURATION);
    };

    document.addEventListener('click', handleNavigation, true);
    return () => document.removeEventListener('click', handleNavigation, true);
  }, []);

  return null;
}
