'use client';

/**
 * Get the language-specific URL for a given path
 * @param path - The path without language prefix (e.g., '/about')
 * @param language - The current language ('en' or 'fr')
 * @returns The language-appropriate URL
 */
export function getLocalizedUrl(path: string, language: string): string {
  // Clean the path (remove leading/trailing slashes and any existing language prefix)
  let cleanPath = path;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  if (cleanPath.startsWith('fr/')) {
    cleanPath = cleanPath.substring(3);
  }
  
  // For English (default), return the path without language prefix
  if (language === 'en') {
    return `/${cleanPath}`;
  }
  
  // For French, add the language prefix
  return `/fr/${cleanPath}`;
}
