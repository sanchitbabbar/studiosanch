// Mobile optimization script for Studio Sanch

document.addEventListener('DOMContentLoaded', function() {
    // iOS-specific optimization
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Add iOS-specific class to body for targeted CSS
        document.body.classList.add('ios-device');
        
        // Prevent scroll chaining/rubber-banding effect
        document.body.addEventListener('touchmove', function(e) {
            if (e.target === document.body) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Fix for iOS scrolling glitch - prevents scale fluctuations during scroll
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    // Optimize image loading based on device
    function optimizeImages() {
        const isMobile = window.innerWidth <= 767;
        const images = document.querySelectorAll('img[data-src-mobile]');
        
        images.forEach(img => {
            if (isMobile && img.getAttribute('data-src-mobile')) {
                // Use smaller image file for mobile
                img.src = img.getAttribute('data-src-mobile');
            } else if (img.getAttribute('data-src-desktop')) {
                // Use regular image for desktop
                img.src = img.getAttribute('data-src-desktop');
            }
        });
    }
    
    // Run optimization on page load
    optimizeImages();
    
    // Also run on resize with debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(optimizeImages, 250);
    });
});
