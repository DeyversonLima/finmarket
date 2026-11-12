const getElements = () => ({
    menuToggle: document.getElementById('menuToggle'),
    sidebar: document.getElementById('sidebar'),
    sidebarClose: document.getElementById('sidebarClose'),
    menuOverlay: document.getElementById('menuOverlay')
});

export const toggleMenu = () => {
    const elements = getElements();
    if (!elements.sidebar || !elements.menuOverlay || !elements.menuToggle) return;
    const isOpen = elements.sidebar.classList.toggle('open');
    elements.menuOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    elements.menuToggle.setAttribute('aria-expanded', isOpen);
    if (isOpen) elements.sidebarClose?.focus();
};

export const closeMenu = () => {
    const elements = getElements();
    if (!elements.sidebar || !elements.menuOverlay || !elements.menuToggle) return;
    const wasOpen = elements.sidebar.classList.contains('open');
    elements.sidebar.classList.remove('open');
    elements.menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    elements.menuToggle.setAttribute('aria-expanded', 'false');
    if (wasOpen) elements.menuToggle.focus();
};

export const initMenuListeners = () => {
    const elements = getElements();
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
