let elements = {
    menuToggle: null,
    sidebar: null,
    sidebarClose: null,
    menuOverlay: null
};

export const initMenuElements = (els) => {
    elements = { ...elements, ...els };
};

export const toggleMenu = () => {
    const isOpen = elements.sidebar.classList.toggle('open');
    elements.menuOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    elements.menuToggle.setAttribute('aria-expanded', isOpen);
};

export const closeMenu = () => {
    elements.sidebar.classList.remove('open');
    elements.menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    elements.menuToggle.setAttribute('aria-expanded', 'false');
};

export const initMenuListeners = () => {
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', toggleMenu);
    }
    if (elements.sidebarClose) {
        elements.sidebarClose.addEventListener('click', closeMenu);
    }
    if (elements.menuOverlay) {
        elements.menuOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
};
