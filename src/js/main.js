import { initNotifications, showToast } from './modules/notifications.js';
import { initTheme, toggleTheme, initThemeSettings } from './modules/theme.js';
import { initMenuListeners } from './modules/menu.js';
import { updateWalletDisplay } from './modules/wallet.js';
import { initListFilters, renderProducts, renderWalletAssets, renderHistory, renderOrders } from './modules/renderer.js';
import { initSearch } from './modules/search.js';
import { initProfileForm, renderProfile } from './modules/profile.js';
import { initSettings } from './modules/settings.js';
import { cancelOrder, initTrading, processOpenOrders } from './modules/trading.js';
import { store } from './modules/store.js';

(function() {
    'use strict';

    const hideDecorativeIcons = () => document.querySelectorAll('svg').forEach((icon) => {
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('focusable', 'false');
    });

    const renderAll = () => {
        const catalogSearch = document.querySelector('[data-search="catalog"]');
        const searchTerm = catalogSearch?.value;
        renderProducts();
        if (searchTerm) catalogSearch.dispatchEvent(new Event('input'));
        renderWalletAssets();
        renderHistory();
        renderOrders();
        renderProfile();
        updateWalletDisplay();
        hideDecorativeIcons();
    };

    // Initialize
    const init = () => {
        initNotifications();
        initTheme();
        initMenuListeners();
        document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
        initSearch();
        initProfileForm();
        initSettings();
        initThemeSettings();
        initTrading();
        initListFilters();
        processOpenOrders();
        renderAll();

        document.addEventListener('click', (event) => {
            const cancelButton = event.target.closest('[data-cancel-order]');
            if (cancelButton && cancelOrder(cancelButton.dataset.cancelOrder)) {
                showToast('Ordem cancelada', 'info');
            }
            const toastButton = event.target.closest('[data-toast-message]');
            if (toastButton) showToast(toastButton.dataset.toastMessage, 'info');
        });

        store.subscribe((_state, reason) => {
            if (reason === 'reset' || reason === 'external-update') initTheme();
            const catalogSearch = document.querySelector('[data-search="catalog"]');
            const searchTerm = catalogSearch?.value;
            renderProducts();
            if (searchTerm) catalogSearch.dispatchEvent(new Event('input'));
            renderWalletAssets();
            renderHistory();
            renderOrders();
            updateWalletDisplay();
            if (['profile-updated', 'reset', 'external-update'].includes(reason)) renderProfile();
            hideDecorativeIcons();
            if (reason === 'storage-error') showToast('Não foi possível salvar os dados', 'error');
        });
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
