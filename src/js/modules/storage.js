const STORAGE_KEY = 'finmarket:v2';
const LEGACY_KEYS = ['balance', 'portfolio', 'transactions', 'orders', 'theme'];

const clone = (value) => JSON.parse(JSON.stringify(value));

export const DataStore = {
    key: STORAGE_KEY,

    read(defaultValue) {
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            return value ? JSON.parse(value) : clone(defaultValue);
        } catch (error) {
            console.warn('Não foi possível ler os dados do FinMarket.', error);
            return clone(defaultValue);
        }
    },

    write(value) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Não foi possível salvar os dados do FinMarket.', error);
            return false;
        }
    },

    readLegacy(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? defaultValue : JSON.parse(value);
        } catch {
            return defaultValue;
        }
    },

    removeLegacy() {
        LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
        localStorage.removeItem('finmarket-theme');
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
        this.removeLegacy();
    }
};
