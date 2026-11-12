import { store } from './store.js';
import { findProduct, getPreviousQuote, getQuote } from './market.js';
import { formatCurrency } from './utils.js';

export { findProduct } from './market.js';

export const getPortfolioSummary = (state = store.getState()) => {
    let invested = 0;
    let previousInvested = 0;
    let cost = 0;

    Object.entries(state.portfolio).forEach(([id, position]) => {
        const product = findProduct(id);
        if (!product) return;
        invested += getQuote(product) * position.quantity;
        previousInvested += getPreviousQuote(product) * position.quantity;
        cost += position.averagePrice * position.quantity;
    });

    const dayChange = invested - previousInvested;
    return {
        available: state.balance,
        invested,
        cost,
        total: state.balance + invested,
        dayChange,
        dayChangePercent: previousInvested ? dayChange / previousInvested : 0,
        unrealizedResult: invested - cost
    };
};

export const updateWalletDisplay = () => {
    const summary = getPortfolioSummary();
    const values = {
        headerWallet: summary.available,
        heroBalance: summary.available,
        walletBalance: summary.available,
        investedBalance: summary.invested
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = formatCurrency(value);
    });

    const dayChange = document.getElementById('dayChange');
    if (dayChange) {
        const positive = summary.dayChange >= 0;
        dayChange.textContent = `${positive ? '+' : ''}${formatCurrency(summary.dayChange)} (${(summary.dayChangePercent * 100).toFixed(2)}%)`;
        dayChange.className = `wallet-card-value ${positive ? 'positive' : 'negative'}`;
    }

};
