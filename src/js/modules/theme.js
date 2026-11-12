import { store } from './store.js';

const getElements = () => ({
    themeToggle: document.getElementById('themeToggle'),
    themeToggleLarge: document.getElementById('themeToggleLarge')
});

export const initTheme = () => {
    const savedTheme = store.getState().settings.theme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
};

export const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    store.update('theme-updated', (draft) => { draft.settings.theme = newTheme; });
    updateThemeIcons(newTheme);

    if (getElements().themeToggleLarge) {
        updateLargeThemeToggle(newTheme);
    }
};

const updateThemeIcons = (theme) => {
    const elements = getElements();
    if (!elements.themeToggle) return;
    const isDark = theme === 'dark';
    elements.themeToggle.classList.toggle('dark', isDark);
};

const updateLargeThemeToggle = (theme) => {
    const elements = getElements();
    if (!elements.themeToggleLarge) return;
    const options = elements.themeToggleLarge.querySelectorAll('.theme-option');
    options.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
    });
};

export const initThemeSettings = () => {
    const elements = getElements();
    if (elements.themeToggleLarge) {
        elements.themeToggleLarge.addEventListener('click', (e) => {
            const option = e.target.closest('.theme-option');
            if (option) {
                const theme = option.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                store.update('theme-updated', (draft) => { draft.settings.theme = theme; });
                updateThemeIcons(theme);
                updateLargeThemeToggle(theme);
            }
        });

        updateLargeThemeToggle(store.getState().settings.theme);
    }
};
