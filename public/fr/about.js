// Language Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageTrigger = document.getElementById('language-selector-trigger');
    const languagePanel = document.querySelector('.language-panel-overlay');
    const panelClose = document.querySelector('.panel-close');

    if (languageTrigger) {
        languageTrigger.addEventListener('click', function() {
            openLanguagePanel();
        });
    }

    // Keep track of panel state
    let isPanelAnimating = false;
    
    // Helper function to open panel with proper timing
    function openLanguagePanel() {
        if (isPanelAnimating) return;
        
        isPanelAnimating = true;
        languagePanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            isPanelAnimating = false;
        }, 2200);
    }
    
    // Helper function for closing with proper timing
    function closeLanguagePanel() {
        if (isPanelAnimating) return;
        
        isPanelAnimating = true;
        const panel = document.querySelector('.language-panel');
        
        // Add a class to trigger the slide back transition
        panel.classList.add('sliding-back');
        
        // Make backdrop fade out with delay
        setTimeout(() => {
            languagePanel.style.opacity = 0;
        }, 500);
        
        // Only remove active class after animation completes
        setTimeout(() => {
            languagePanel.classList.remove('active');
            document.body.style.overflow = '';
            // Reset styles for next open
            languagePanel.style.opacity = '';
            panel.classList.remove('sliding-back');
            isPanelAnimating = false;
        }, 2200);
    }

    if (panelClose) {
        panelClose.addEventListener('click', function() {
            closeLanguagePanel();
        });
    }

    if (languagePanel) {
        languagePanel.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLanguagePanel();
            }
        });
    }

    // Close panel with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && languagePanel.classList.contains('active')) {
            closeLanguagePanel();
        }
    });
    
    // Handle language switching
    const englishLink = document.getElementById('english-link');
    const frenchLink = document.getElementById('french-link');
    
    if (englishLink) {
        englishLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../about.html';
        });
    }
    
    if (frenchLink) {
        frenchLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Already on the French page, no need to navigate
            closeLanguagePanel();
        });
    }
});
