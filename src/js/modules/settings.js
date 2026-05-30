import { DataStore } from './storage.js';
import { INITIAL_BALANCE, PRODUCTS } from '../config/constants.js';
import { showToast } from './notifications.js';

let state = null;
let onRender = {
    wallet: () => {},
    assets: () => {},
    history: () => {}
};

export const setSettingsState = (appState) => {
    state = appState;
};

export const setSettingsRenderCallbacks = (callbacks) => {
    onRender = { ...onRender, ...callbacks };
};

export const initSettings = () => {
    const clearBtn = document.getElementById('clearDataBtn');
    const confirmModal = document.getElementById('confirmModal');
    const cancelClear = document.getElementById('cancelClear');
    const confirmClear = document.getElementById('confirmClear');
    const currentYear = document.getElementById('currentYear');

    if (clearBtn && confirmModal) {
        clearBtn.addEventListener('click', () => {
            confirmModal.classList.add('active');
            confirmModal.setAttribute('aria-hidden', 'false');
        });

        cancelClear?.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            confirmModal.setAttribute('aria-hidden', 'true');
        });

        confirmClear?.addEventListener('click', () => {
            DataStore.remove('balance');
            DataStore.remove('portfolio');
            DataStore.remove('transactions');
            DataStore.remove('orders');

            state.balance = INITIAL_BALANCE;
            state.portfolio = {};
            state.transactions = [];
            state.orders = [];

            onRender.wallet();
            onRender.assets();
            onRender.history();

            confirmModal.classList.remove('active');
            confirmModal.setAttribute('aria-hidden', 'true');
            showToast('Todos os dados foram limpos');
        });
    }

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
};