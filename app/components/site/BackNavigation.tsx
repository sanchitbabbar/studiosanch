'use client';

import { usePathname } from 'next/navigation';

export default function BackNavigation() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/' || pathname === '/fr';

  if (isLandingPage) return null;

  const fallback = pathname.startsWith('/fr/') ? '/fr/' : '/';

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign(fallback);
  }

  return (
    <button className="studio-back-control" type="button" onClick={goBack} aria-label="Go back">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.5 5.5 8 12l6.5 6.5M8.5 12H20" />
      </svg>
    </button>
  );
}
