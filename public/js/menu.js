// Luxury Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (window.sessionStorage.getItem('studio-sanch-cinematic-entry') === '1') {
            window.sessionStorage.removeItem('studio-sanch-cinematic-entry');
            document.body.classList.add('cinematic-page-enter');
            window.setTimeout(function() {
                document.body.classList.remove('cinematic-page-enter');
            }, 620);
        }
    } catch (error) {
        // Navigation still works when storage is unavailable.
    }

    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const isLandingPage = currentPath === '/' || currentPath === '/index.html' || currentPath === '/fr' || currentPath === '/fr/index.html';

    if (!isLandingPage && !document.querySelector('.studio-back-control')) {
        const backButton = document.createElement('button');
        backButton.className = 'studio-back-control';
        backButton.type = 'button';
        backButton.setAttribute('aria-label', 'Go back');
        backButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5M8.5 12H20" /></svg>';
        backButton.addEventListener('click', function() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.assign(currentPath.indexOf('/fr/') === 0 ? '/fr/' : '/');
            }
        });
        const socialLinks = document.querySelector('.footer-social, .social-links');
        if (socialLinks?.parentNode) {
            socialLinks.parentNode.insertBefore(backButton, socialLinks);
        } else {
            document.body.appendChild(backButton);
        }
    }

    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuClose = document.querySelector('.menu-close');
    const menuList = document.querySelector('.menu-items');

    if (!hamburgerIcon || !menuOverlay || !menuClose || !menuList) {
        return;
    }

    // Keep the Boutique destination available in every page's menu, including
    // legacy pages whose static navigation has not yet been updated.
    const boutiqueLink = menuList.querySelector('a[href$="accessoires.html"]') || menuList.querySelector('a[href="/boutique/"]');
    if (boutiqueLink) {
        boutiqueLink.textContent = 'BOUTIQUE';
        boutiqueLink.removeAttribute('data-i18n');
        boutiqueLink.setAttribute('href', '/boutique/');
    } else {
        const boutiqueItem = document.createElement('li');
        boutiqueItem.innerHTML = '<a href="/boutique/">BOUTIQUE</a>';
        menuList.appendChild(boutiqueItem);
    }

    // Make the Studio's creative-production offering discoverable everywhere.
    // It deliberately remains the final navigation destination.
    if (!menuList.querySelector('a[href="/productions/"]')) {
        const productionsItem = document.createElement('li');
        productionsItem.innerHTML = '<a href="/productions/">PRODUCTIONS</a>';
        menuList.appendChild(productionsItem);
    }

    // Keep the same intentional order on every legacy static page.
    const itemFor = (selector) => menuList.querySelector(selector)?.closest('li');
    const orderedItems = [
        itemFor('a[href="index.html"], a[href="/"], a[href="/"]'),
        itemFor('a[href="/boutique/"]'),
        itemFor('a[href$="haute-couture.html"]'),
        itemFor('a[href="/productions/"]'),
        itemFor('a[href$="atelier.html"]'),
        itemFor('a[href$="about.html"]')
    ].filter(Boolean);
    orderedItems.forEach((item) => menuList.appendChild(item));

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
