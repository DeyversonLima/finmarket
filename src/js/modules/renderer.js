import { PRODUCTS } from '../config/constants.js';
import { formatCurrency, formatDate } from './utils.js';
import { findProduct } from './wallet.js';
import { buyAsset, sellAsset } from './transactions.js';

let state = null;

export const setRendererState = (appState) => {
    state = appState;
};

export const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-card-header">
            <div class="product-icon">${product.ticker[0]}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-ticker">${product.ticker}</span>
            </div>
            <span class="product-type">${product.type}</span>
        </div>
        <div class="product-card-body">
            <div class="product-price">${formatCurrency(product.price)}</div>
            <p class="product-description">${product.description}</p>
        </div>
        <div class="product-card-footer">
            <button class="btn-buy" onclick="window.buyAsset('${product.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Comprar
            </button>
            <button class="btn-sell" onclick="window.sellAsset('${product.id}')" ${!state.portfolio[product.id] ? 'disabled' : ''}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Vender
            </button>
        </div>
    `;
    return card;
};

export const renderProducts = () => {
    const assetsGrid = document.getElementById('assetsGrid');
    const liabilitiesGrid = document.getElementById('liabilitiesGrid');
    const currenciesGrid = document.getElementById('currenciesGrid');

    if (assetsGrid) {
        assetsGrid.innerHTML = '';
        PRODUCTS.assets.forEach(product => {
            assetsGrid.appendChild(createProductCard(product));
        });
    }

    if (liabilitiesGrid) {
        liabilitiesGrid.innerHTML = '';
        PRODUCTS.liabilities.forEach(product => {
            liabilitiesGrid.appendChild(createProductCard(product));
        });
    }

    if (currenciesGrid) {
        currenciesGrid.innerHTML = '';
        PRODUCTS.currencies.forEach(product => {
            currenciesGrid.appendChild(createProductCard(product));
        });
    }
};

export const renderWalletAssets = () => {
    const container = document.getElementById('walletAssetsList');
    const emptyState = document.getElementById('walletEmptyState');

    if (!container) return;

    const assets = Object.entries(state.portfolio);

    if (assets.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.innerHTML = '';

    assets.forEach(([id, quantity]) => {
        const product = findProduct(id);
        if (!product) return;

        const item = document.createElement('div');
        item.className = 'wallet-asset-item';
        item.innerHTML = `
            <div class="wallet-asset-info">
                <div class="wallet-asset-icon">${product.ticker[0]}</div>
                <div class="wallet-asset-details">
                    <h4 class="wallet-asset-name">${product.name}</h4>
                    <span class="wallet-asset-ticker">${product.ticker} • ${quantity} unid.</span>
                </div>
            </div>
            <div class="wallet-asset-values">
                <div class="wallet-asset-current">${formatCurrency(product.price)}</div>
                <div class="wallet-asset-total">${formatCurrency(product.price * quantity)}</div>
            </div>
            <button class="btn-sell-small" onclick="window.sellAsset('${id}')" title="Vender">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
            </button>
        `;
        container.appendChild(item);
    });
};

export const renderHistory = () => {
    const container = document.getElementById('historyList');
    const emptyState = document.getElementById('historyEmptyState');

    if (!container) return;

    if (state.transactions.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.innerHTML = '';

    state.transactions.forEach(tx => {
        const item = document.createElement('div');
        item.className = `history-item ${tx.type}`;
        item.innerHTML = `
            <div class="history-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${tx.type === 'buy'
                        ? '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'
                        : '<line x1="5" y1="12" x2="19" y2="12"/>'}
                </svg>
            </div>
            <div class="history-details">
                <div class="history-title">${tx.type === 'buy' ? 'Compra' : 'Venda'} • ${tx.ticker}</div>
                <div class="history-date">${formatDate(tx.date)}</div>
            </div>
            <div class="history-amount ${tx.type}">
                ${tx.type === 'buy' ? '-' : '+'} ${formatCurrency(tx.price)}
            </div>
        `;
        container.appendChild(item);
    });
};

export const renderOrders = () => {
    const container = document.getElementById('ordersList');
    const emptyState = document.getElementById('ordersEmptyState');

    if (!container) return;

    if (emptyState) {
        emptyState.style.display = 'flex';
    }
};
