import { PRODUCTS } from '../config/constants.js';
import { formatCurrency } from './utils.js';

let elements = {
    headerWallet: null,
    heroBalance: null,
    walletBalance: null,
    investedBalance: null,
    dayChange: null
};

let state = null;

export const initWalletElements = (els) => {
    elements = { ...elements, ...els };
};

export const setWalletState = (appState) => {
    state = appState;
};

export const findProduct = (id) => {
    return [...PRODUCTS.assets, ...PRODUCTS.liabilities, ...PRODUCTS.currencies]
        .find(p => p.id === id);
};

export const updateWalletDisplay = () => {
    const totalInvested = Object.entries(state.portfolio).reduce((acc, [id, qty]) => {
        const product = findProduct(id);
        return acc + (product ? product.price * qty : 0);
    }, 0);

    const totalBalance = state.balance + totalInvested;

    console.log('🔄 Atualizando display:', { balance: state.balance, totalInvested, totalBalance });

    if (elements.headerWallet) {
        elements.headerWallet.textContent = formatCurrency(totalBalance);
        console.log('✅ headerWallet atualizado:', formatCurrency(totalBalance));
    } else {
        console.warn('⚠️ headerWallet não encontrado');
    }
    
    if (elements.heroBalance) {
        elements.heroBalance.textContent = formatCurrency(totalBalance);
        console.log('✅ heroBalance atualizado:', formatCurrency(totalBalance));
    } else {
        console.warn('⚠️ heroBalance não encontrado');
    }
    
    if (elements.walletBalance) {
        elements.walletBalance.textContent = formatCurrency(state.balance);
        console.log('✅ walletBalance atualizado:', formatCurrency(state.balance));
    } else {
        console.warn('⚠️ walletBalance não encontrado');
    }
    
    if (elements.investedBalance) {
        elements.investedBalance.textContent = formatCurrency(totalInvested);
        console.log('✅ investedBalance atualizado:', formatCurrency(totalInvested));
    } else {
        console.warn('⚠️ investedBalance não encontrado');
    }
    
    if (elements.dayChange) {
        const change = (Math.random() * 200 - 50).toFixed(2);
        const isPositive = change > 0;
        elements.dayChange.textContent = `${isPositive ? '+' : ''}${formatCurrency(change)}`;
        elements.dayChange.className = `wallet-card-value ${isPositive ? 'positive' : 'negative'}`;
    }
};
