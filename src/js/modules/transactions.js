import { DataStore } from './storage.js';
import { formatCurrency, generateId } from './utils.js';
import { findProduct, updateWalletDisplay } from './wallet.js';
import { showToast } from './notifications.js';

let state = null;
let onRender = {
    wallet: () => {},
    assets: () => {},
    history: () => {}
};

export const setTransactionState = (appState) => {
    state = appState;
};

export const setRenderCallbacks = (callbacks) => {
    onRender = { ...onRender, ...callbacks };
};

export const buyAsset = (productId) => {
    console.log('🛒 Tentando comprar:', productId);
    const product = findProduct(productId);
    if (!product) {
        console.warn('⚠️ Produto não encontrado:', productId);
        return;
    }

    if (state.balance < product.price) {
        console.warn('⚠️ Saldo insuficiente. Saldo:', state.balance, 'Preço:', product.price);
        showToast('Saldo insuficiente', 'error');
        return;
    }

    state.balance -= product.price;
    state.portfolio[productId] = (state.portfolio[productId] || 0) + 1;

    const transaction = {
        id: generateId(),
        type: 'buy',
        productId,
        productName: product.name,
        ticker: product.ticker,
        price: product.price,
        quantity: 1,
        date: new Date().toISOString()
    };

    state.transactions.unshift(transaction);

    DataStore.set('balance', state.balance);
    DataStore.set('portfolio', state.portfolio);
    DataStore.set('transactions', state.transactions);

    console.log('✅ Compra realizada! Novo saldo:', state.balance);

    // 🔥 Força a atualização imediata da Navbar e Index
    updateWalletDisplay();
    
    onRender.wallet();
    onRender.assets();
    onRender.history();
    showToast(`Compra realizada: ${product.ticker}`);
};

export const sellAsset = (productId) => {
    console.log('💰 Tentando vender:', productId);
    if (!state.portfolio[productId] || state.portfolio[productId] <= 0) {
        console.warn('⚠️ Você não possui este ativo:', productId);
        showToast('Você não possui este ativo', 'error');
        return;
    }

    const product = findProduct(productId);
    if (!product) {
        console.warn('⚠️ Produto não encontrado:', productId);
        return;
    }

    state.balance += product.price;
    state.portfolio[productId] -= 1;

    if (state.portfolio[productId] === 0) {
        delete state.portfolio[productId];
    }

    const transaction = {
        id: generateId(),
        type: 'sell',
        productId,
        productName: product.name,
        ticker: product.ticker,
        price: product.price,
        quantity: 1,
        date: new Date().toISOString()
    };

    state.transactions.unshift(transaction);

    DataStore.set('balance', state.balance);
    DataStore.set('portfolio', state.portfolio);
    DataStore.set('transactions', state.transactions);

    console.log('✅ Venda realizada! Novo saldo:', state.balance);

    // 🔥 Força a atualização imediata da Navbar e Index
    updateWalletDisplay();
    
    onRender.wallet();
    onRender.assets();
    onRender.history();
    showToast(`Venda realizada: ${product.ticker}`);
};
