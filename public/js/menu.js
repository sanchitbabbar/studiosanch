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

    document.addEventListener('click', function(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = event.target.closest('a[href]');
        if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

        const destination = new URL(link.href, window.location.href);
        if (destination.origin !== window.location.origin) return;
        if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash) return;
        if (document.body.classList.contains('cinematic-page-exit')) {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        const isBoutique = destination.pathname.replace(/\/$/, '') === '/boutique';
        document.body.classList.add('cinematic-page-exit');
        if (isBoutique) document.body.classList.add('cinematic-page-exit-fast');
        try {
            window.sessionStorage.setItem('studio-sanch-cinematic-entry', '1');
        } catch (error) {
            // Navigation still works when storage is unavailable.
        }
        window.setTimeout(function() {
            window.location.href = destination.href;
        }, isBoutique ? 260 : 420);
    }, true);

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
