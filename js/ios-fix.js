// iOS-specific fixes for STUDIO SANCH website
document.addEventListener('DOMContentLoaded', function() {
    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Add iOS-specific class to body
        document.body.classList.add('ios-device');
        
        // Fix zooming glitch during scroll by temporarily disabling animations during scroll
        let scrollTimeout;
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Detect scroll direction
            const isScrollingDown = scrollTop > lastScrollTop;
            lastScrollTop = scrollTop;
            
            // Add class to body to control rendering during fast scrolls
            document.body.classList.add('ios-scrolling');
            
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Set timeout to remove class after scrolling stops
            scrollTimeout = setTimeout(function() {
                document.body.classList.remove('ios-scrolling');
            }, 300);
        }, { passive: true }); // Using passive listener for better scroll performance
        
        // Additional fix for the 2-second zoom issue by managing rendering layer
        const heroImage = document.querySelector('.responsive-image');
        if (heroImage) {
            // Preload the hero image to ensure it's ready before scrolling
            const img = new Image();
            img.src = heroImage.src;
            
            img.onload = function() {
                // Add loaded class once image is loaded
                heroImage.classList.add('image-loaded');
            };
        }
    }
});
