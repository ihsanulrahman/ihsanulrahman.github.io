'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
const mobileViewport = window.matchMedia('(max-width: 760px)');

if (menuToggle && navigation) {
    const menuLabel = menuToggle.querySelector('.menu-label');

    function setMenuOpen(open, returnFocus = false) {
        navigation.classList.toggle('is-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
        if (returnFocus) menuToggle.focus();
    }

    menuToggle.addEventListener('click', () => {
        setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    navigation.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link) return;

        // Keep keyboard focus on visible content when a mobile link closes the menu.
        if (mobileViewport.matches && link.hash) {
            const destination = document.getElementById(link.hash.slice(1));
            if (destination) {
                destination.setAttribute('tabindex', '-1');
                destination.focus({ preventScroll: true });
            }
        }
        setMenuOpen(false);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false, true);
        }
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.header-inner')) setMenuOpen(false);
    });

    mobileViewport.addEventListener('change', () => {
        const focusWillBeHidden = mobileViewport.matches && navigation.contains(document.activeElement);
        setMenuOpen(false, focusWillBeHidden);
    });

    // Without JavaScript, navigation remains visible at every screen size.
    menuToggle.hidden = false;
    document.documentElement.classList.add('js-enabled');
}

if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
    const sectionObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            for (const link of links) {
                if (link.hash === '#' + entry.target.id) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            }
        }
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });

    for (const id of ['home', 'projects', 'about', 'contact']) {
        const section = document.getElementById(id);
        if (section) sectionObserver.observe(section);
    }
}

const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());
