'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const historyKey = 'studio-sanch-internal-history';

function readInternalHistory() {
  try {
    const value = window.sessionStorage.getItem(historyKey);
    const history = value ? JSON.parse(value) : [];
    return Array.isArray(history) ? history.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function writeInternalHistory(history: string[]) {
  try {
    window.sessionStorage.setItem(historyKey, JSON.stringify(history.slice(-20)));
  } catch {
    // The back control still has its safe home fallback when storage is unavailable.
  }
}

export default function BackNavigation() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/' || pathname === '/fr';
  const fallback = pathname.startsWith('/fr/') ? '/fr/' : '/';

  useEffect(() => {
    const current = `${pathname}${window.location.search}${window.location.hash}`;
    const history = readInternalHistory();

    if (history.at(-1) !== current) {
      history.push(current);
      writeInternalHistory(history);
    }
  }, [pathname]);

  if (isLandingPage) return null;

  function goBack() {
    const current = `${pathname}${window.location.search}${window.location.hash}`;
    const history = readInternalHistory();
    const currentIndex = history.lastIndexOf(current);

    if (currentIndex > 0) {
      const previousPage = history[currentIndex - 1];
      writeInternalHistory(history.slice(0, currentIndex));
      window.location.assign(previousPage);
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
