// Luxury Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuClose = document.querySelector('.menu-close');
    const menuItems = document.querySelectorAll('.menu-items li');
    
    // Set sequential animation delay for menu items
    menuItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
    
    // Toggle menu on hamburger click
    hamburgerIcon.addEventListener('click', function() {
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        
        // Animate hamburger icon into X
        const spans = hamburgerIcon.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.transform = 'rotate(-45deg) translate(-1px, -1px)';
    });
    
    // Close menu on close button click
    menuClose.addEventListener('click', closeMenu);
    
    // Close menu when clicking on a menu item
    menuItems.forEach(item => {
        item.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside menu content
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });
    
    // Close menu when ESC key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
    
    function closeMenu() {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset hamburger icon
        const spans = hamburgerIcon.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
    }
});
