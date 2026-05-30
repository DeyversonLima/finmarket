import { DataStore } from './storage.js';

let elements = {
    themeToggle: null,
    themeToggleLarge: null
};

export const initThemeElements = (els) => {
    elements = { ...elements, ...els };
};

export const initTheme = () => {
    const savedTheme = DataStore.get('theme', 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
};

export const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    DataStore.set('theme', newTheme);
    updateThemeIcons(newTheme);

    if (elements.themeToggleLarge) {
        updateLargeThemeToggle(newTheme);
    }
};

const updateThemeIcons = (theme) => {
    if (!elements.themeToggle) return;
    const isDark = theme === 'dark';
    elements.themeToggle.classList.toggle('dark', isDark);
};

const updateLargeThemeToggle = (theme) => {
    if (!elements.themeToggleLarge) return;
    const options = elements.themeToggleLarge.querySelectorAll('.theme-option');
    options.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
    });
};

export const initThemeSettings = () => {
    if (elements.themeToggleLarge) {
        elements.themeToggleLarge.addEventListener('click', (e) => {
            const option = e.target.closest('.theme-option');
            if (option) {
                const theme = option.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                DataStore.set('theme', theme);
                updateThemeIcons(theme);
                updateLargeThemeToggle(theme);
            }
        });

        updateLargeThemeToggle(DataStore.get('theme', 'light'));
    }
};
