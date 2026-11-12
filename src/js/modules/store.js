import { INITIAL_BALANCE, PRODUCTS } from '../config/constants.js';
import { DataStore } from './storage.js';

export const APP_VERSION = 2;

export const createDefaultState = () => ({
    version: APP_VERSION,
    balance: INITIAL_BALANCE,
    portfolio: {},
    transactions: [],
    orders: [],
    profile: {
        firstName: 'João',
        lastName: 'da Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321',
        memberSince: new Date().getFullYear()
    },
    settings: {
        theme: 'light'
    }
});

const finiteNonNegative = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : fallback;
};

const basePriceById = new Map(Object.values(PRODUCTS).flat().map((product) => [product.id, product.price]));

const sanitizePortfolio = (portfolio) => {
    if (!portfolio || typeof portfolio !== 'object' || Array.isArray(portfolio)) return {};
    return Object.fromEntries(
        Object.entries(portfolio)
            .map(([id, position]) => {
                const normalized = typeof position === 'number'
                    ? { quantity: position, averagePrice: basePriceById.get(id) ?? 0 }
                    : {
                        quantity: finiteNonNegative(position?.quantity),
                        averagePrice: finiteNonNegative(position?.averagePrice, basePriceById.get(id) ?? 0)
                    };
                return [id, normalized];
            })
            .filter(([, position]) => position.quantity > 0)
    );
};

const sanitizeList = (value) => Array.isArray(value)
    ? value.filter((item) => item && typeof item === 'object')
    : [];

export const sanitizeState = (candidate) => {
    const defaults = createDefaultState();
    const source = candidate && typeof candidate === 'object' ? candidate : {};
    const profile = source.profile && typeof source.profile === 'object' ? source.profile : {};
    const settings = source.settings && typeof source.settings === 'object' ? source.settings : {};

    return {
        ...defaults,
        balance: finiteNonNegative(source.balance, defaults.balance),
        portfolio: sanitizePortfolio(source.portfolio),
        transactions: sanitizeList(source.transactions),
        orders: sanitizeList(source.orders),
        profile: {
            ...defaults.profile,
            ...Object.fromEntries(Object.entries(profile).filter(([, value]) => typeof value === 'string' || typeof value === 'number'))
        },
        settings: {
            ...defaults.settings,
            theme: settings.theme === 'dark' ? 'dark' : 'light'
        },
        version: APP_VERSION
    };
};

const migrateLegacyState = () => {
    const defaults = createDefaultState();
    const legacyBalance = DataStore.readLegacy('balance', null);
    const legacyPortfolio = DataStore.readLegacy('portfolio', null);
    const legacyTransactions = DataStore.readLegacy('transactions', null);
    const hasLegacyData = legacyBalance !== null || legacyPortfolio !== null || legacyTransactions !== null;

    if (!hasLegacyData) return defaults;

    const migrated = sanitizeState({
        ...defaults,
        balance: legacyBalance ?? defaults.balance,
        portfolio: legacyPortfolio ?? {},
        transactions: legacyTransactions ?? [],
        orders: DataStore.readLegacy('orders', []),
        settings: { ...defaults.settings, theme: DataStore.readLegacy('theme', 'light') }
    });
    DataStore.write(migrated);
    DataStore.removeLegacy();
    return migrated;
};

let state = (() => {
    const persisted = DataStore.read(null);
    return persisted ? sanitizeState(persisted) : migrateLegacyState();
})();

const listeners = new Set();
const notify = (reason) => listeners.forEach((listener) => listener(state, reason));

export const store = {
    getState: () => state,

    subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },

    update(reason, updater) {
        const draft = structuredClone(state);
        updater(draft);
        state = sanitizeState(draft);
        const saved = DataStore.write(state);
        notify(saved ? reason : 'storage-error');
        return saved;
    },

    reset() {
        state = createDefaultState();
        DataStore.clear();
        DataStore.write(state);
        notify('reset');
    }
};

window.addEventListener('storage', (event) => {
    if (event.key !== DataStore.key || !event.newValue) return;
    try {
        state = sanitizeState(JSON.parse(event.newValue));
        notify('external-update');
    } catch {
        // Mantém o último estado válido se outra aba escrever dados inválidos.
    }
});
