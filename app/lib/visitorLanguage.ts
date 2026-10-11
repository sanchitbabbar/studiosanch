export async function visitorLanguage(signal: AbortSignal): Promise<'fr' | 'en'> {
  try {
    const response = await fetch('/api/visitor-language', { signal, cache: 'no-store' });
    if (!response.ok) return 'en';
    const data = await response.json();
    return data.language === 'fr' ? 'fr' : 'en';
  } catch { return 'en'; }
}

export function savedLanguage(): string | null {
  try { return localStorage.getItem('preferredLanguage'); } catch { return null; }
}

export function saveLanguage(code: string): void {
  try {
    localStorage.setItem('preferredLanguage', code);
    localStorage.setItem('language', code);
    localStorage.setItem('i18nextLng', code);
  } catch { /* Browsing remains usable when storage is blocked. */ }
}
