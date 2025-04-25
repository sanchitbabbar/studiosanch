// iOS-specific fixes for STUDIO SANCH Create page
document.addEventListener('DOMContentLoaded', function() {
    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Add iOS-specific class to body
        document.body.classList.add('ios-device');
        
        // Optimize video elements for iOS
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Add iOS-specific optimization classes
            video.classList.add('ios-optimized');
            
            // Ensure proper playback on iOS
            video.setAttribute('playsinline', '');
            
            // Optimize video container elements
            const container = video.closest('.step-media') || video.parentElement;
            if (container) {
                container.classList.add('ios-container');
            }
        });
        
        // Fix for scrolling glitches
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
        
        // Fix for iOS "rubber-banding" effect at page boundaries
        document.body.addEventListener('touchmove', function(e) {
            // Only prevent default if at top or bottom of page to still allow normal scrolling
            const scrollY = window.scrollY;
            const isAtTop = scrollY <= 0;
            const isAtBottom = scrollY + window.innerHeight >= document.body.scrollHeight;
            
            if ((isAtTop && e.touches[0].screenY > window.innerHeight/2) || 
                (isAtBottom && e.touches[0].screenY < window.innerHeight/2)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});
