// Initialize i18next
document.addEventListener('DOMContentLoaded', function() {
  // Load jQuery
  const $ = window.jQuery;

  // Function to get URL parameter
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Detect language from URL path
  function detectLanguage() {
    // Check URL first
    const pathLang = window.location.pathname.split('/')[1];
    if (pathLang === 'fr') return 'fr';
    
    // Check localStorage second
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang) return savedLang;
    
    // Check browser language third
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'fr' ? 'fr' : 'en';
  }

  // Load translations asynchronously
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`/js/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      return {};
    }
  }

  // Initialize language
  const currentLang = detectLanguage();
  let translations = {};

  // Load initial translations
  loadTranslations(currentLang).then(data => {
    translations = data;
    translatePage(currentLang);
    
    // Set language in localStorage
    localStorage.setItem('i18nextLng', currentLang);
    
    // Update the language selector to highlight the current language
    document.querySelectorAll('.language-options a').forEach(link => {
      if (link.getAttribute('data-lang') === currentLang) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

  // Add language switch event handlers
  document.querySelectorAll('.language-options a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const newLang = this.getAttribute('data-lang');
      changeLanguage(newLang);
    });
  });

  // Change language function
  function changeLanguage(lang) {
    loadTranslations(lang).then(data => {
      translations = data;
      translatePage(lang);
      localStorage.setItem('i18nextLng', lang);
      
      // Handle URL changes
      if (lang === 'fr' && !window.location.pathname.startsWith('/fr/')) {
        const newPath = '/fr' + window.location.pathname;
        window.location.href = newPath;
      } else if (lang === 'en' && window.location.pathname.startsWith('/fr/')) {
        const newPath = window.location.pathname.replace(/^\/fr/, '');
        window.location.href = newPath || '/';
      }
    });
  }

  // Apply translations to the page
  function translatePage(lang) {
    document.documentElement.lang = lang;
    
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = getNestedTranslation(translations, key);
      
      if (translation) {
        if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
          element.setAttribute('placeholder', translation);
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  // Helper function to get nested translation using dot notation
  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }

  // Add language selector click handler
  const languageTrigger = document.getElementById('language-selector-trigger');
  if (languageTrigger) {
    languageTrigger.addEventListener('click', function() {
      // Language panel is shown via the existing script
    });
  }
});
