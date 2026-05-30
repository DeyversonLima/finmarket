import { INITIAL_BALANCE, PRODUCTS } from './config/constants.js';
import { DataStore } from './modules/storage.js';
import { formatCurrency } from './modules/utils.js';
import { initNotifications, showToast } from './modules/notifications.js';
import { initTheme, toggleTheme, initThemeSettings, initThemeElements } from './modules/theme.js';
import { toggleMenu, closeMenu, initMenuListeners, initMenuElements } from './modules/menu.js';
import { initWalletElements, setWalletState, updateWalletDisplay, findProduct } from './modules/wallet.js';
import { setTransactionState, setRenderCallbacks, buyAsset, sellAsset } from './modules/transactions.js';
import { setRendererState, renderProducts, renderWalletAssets, renderHistory, renderOrders } from './modules/renderer.js';
import { initSearch } from './modules/search.js';
import { setProfileState, initProfileForm } from './modules/profile.js';
import { setSettingsState, setSettingsRenderCallbacks, initSettings } from './modules/settings.js';

(function() {
    'use strict';

    // State
    let state = {
        balance: DataStore.get('balance', INITIAL_BALANCE),
        portfolio: DataStore.get('portfolio', {}),
        transactions: DataStore.get('transactions', []),
        orders: DataStore.get('orders', []),
        theme: DataStore.get('theme', 'light')
    };

    // DOM Elements - will be populated after DOM is ready
    let elements = {};

    // Capture DOM Elements (must be called after DOM is ready)
    const captureElements = () => {
        elements = {
            menuToggle: document.getElementById('menuToggle'),
            sidebar: document.getElementById('sidebar'),
            sidebarClose: document.getElementById('sidebarClose'),
            menuOverlay: document.getElementById('menuOverlay'),
            themeToggle: document.getElementById('themeToggle'),
            themeToggleLarge: document.getElementById('themeToggleLarge'),
            headerWallet: document.getElementById('headerWallet'),
            heroBalance: document.getElementById('heroBalance'),
            walletBalance: document.getElementById('walletBalance'),
            investedBalance: document.getElementById('investedBalance'),
            dayChange: document.getElementById('dayChange')
        };
    };

    // Initialize Modules
    const initModules = () => {
        initNotifications();
        initMenuElements(elements);
        initThemeElements(elements);
        initWalletElements(elements);

        setWalletState(state);
        setTransactionState(state);
        setRendererState(state);
        setProfileState(state);
        setSettingsState(state);

        setRenderCallbacks({
            wallet: updateWalletDisplay,
            assets: renderWalletAssets,
            history: renderHistory
        });

        setSettingsRenderCallbacks({
            wallet: updateWalletDisplay,
            assets: renderWalletAssets,
            history: renderHistory
        });
    };

    // Event Listeners
    const initEventListeners = () => {
        initMenuListeners();

        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        // Expose functions globally for onclick handlers
        window.buyAsset = buyAsset;
        window.sellAsset = sellAsset;
        window.showToast = showToast;
    };

    // Initialize
    const init = () => {
        captureElements();
        initModules();
        initTheme();
        initEventListeners();
        initSearch();
        initProfileForm();
        initSettings();
        initThemeSettings();

        renderProducts();
        renderWalletAssets();
        renderHistory();
        renderOrders();
        updateWalletDisplay();
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
