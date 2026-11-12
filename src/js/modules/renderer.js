import { PRODUCTS } from '../config/constants.js';
import { formatCurrency, formatDate } from './utils.js';
import { findProduct, getQuote } from './market.js';
import { store } from './store.js';
import { formatNumber } from './utils.js';

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
            <div class="product-price">${formatCurrency(getQuote(product))}</div>
            <p class="product-description">${product.description}</p>
        </div>
        <div class="product-card-footer">
            <button type="button" class="btn-buy" data-trade="buy" data-product-id="${product.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Comprar
            </button>
            <button type="button" class="btn-sell" data-trade="sell" data-product-id="${product.id}" ${!store.getState().portfolio[product.id] ? 'disabled' : ''}>
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

    const assets = Object.entries(store.getState().portfolio);

    if (assets.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.innerHTML = '';

    assets.forEach(([id, position]) => {
        const product = findProduct(id);
        if (!product) return;
        const quote = getQuote(product);

        const item = document.createElement('div');
        item.className = 'wallet-asset-item';
        item.innerHTML = `
            <div class="wallet-asset-info">
                <div class="wallet-asset-icon">${product.ticker[0]}</div>
                <div class="wallet-asset-details">
                    <h4 class="wallet-asset-name">${product.name}</h4>
                    <span class="wallet-asset-ticker">${product.ticker} • ${formatNumber(position.quantity)} unid. • PM ${formatCurrency(position.averagePrice)}</span>
                </div>
            </div>
            <div class="wallet-asset-values">
                <div class="wallet-asset-current">${formatCurrency(quote)}</div>
                <div class="wallet-asset-total">${formatCurrency(quote * position.quantity)}</div>
            </div>
            <button type="button" class="btn-sell-small" data-trade="sell" data-product-id="${id}" aria-label="Vender ${product.ticker}">
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

    const state = store.getState();
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter ?? 'all';
    const transactions = activeFilter === 'all'
        ? state.transactions
        : state.transactions.filter((transaction) => transaction.type === activeFilter);
    container.innerHTML = '';

    if (transactions.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    transactions.forEach(tx => {
        const type = tx.type === 'buy' ? 'buy' : 'sell';
        const product = findProduct(tx.productId);
        const item = document.createElement('div');
        item.className = `history-item ${type}`;
        item.innerHTML = `
            <div class="history-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${type === 'buy'
                        ? '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'
                        : '<line x1="5" y1="12" x2="19" y2="12"/>'}
                </svg>
            </div>
            <div class="history-details">
                <div class="history-title">${type === 'buy' ? 'Compra' : 'Venda'} • ${product?.ticker ?? 'Ativo removido'}</div>
                <div class="history-date">${formatDate(tx.date)}</div>
            </div>
            <div class="history-amount ${type}">
                ${type === 'buy' ? '-' : '+'} ${formatCurrency(tx.total ?? tx.price * (tx.quantity ?? 1))}
            </div>
        `;
        container.appendChild(item);
    });
};

export const renderOrders = () => {
    const container = document.getElementById('ordersList');
    const emptyState = document.getElementById('ordersEmptyState');

    if (!container) return;

    const filter = document.querySelector('.tab-btn.active')?.dataset.tab ?? 'open';
    const statusMap = { open: 'open', cancelled: 'cancelled', executed: 'executed' };
    const orders = store.getState().orders.filter((order) => order.status === statusMap[filter]);
    container.innerHTML = '';
    if (emptyState) {
        emptyState.style.display = orders.length ? 'none' : 'flex';
        const title = emptyState.querySelector('.empty-title');
        const description = emptyState.querySelector('.empty-description');
        const labels = {
            open: ['Nenhuma ordem em aberto', 'Ordens limitadas aguardando execução aparecerão aqui'],
            cancelled: ['Nenhuma ordem cancelada', 'Ordens canceladas aparecerão aqui'],
            executed: ['Nenhuma ordem executada', 'Suas ordens executadas aparecerão aqui']
        };
        if (title) title.textContent = labels[filter][0];
        if (description) description.textContent = labels[filter][1];
    }

    orders.forEach((order) => {
        const product = findProduct(order.productId);
        if (!product) return;
        const card = document.createElement('article');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="order-header"><div><h3>${product.name}</h3><span>${order.ticker}</span></div><span class="order-status ${order.status}">${order.status === 'open' ? 'Em aberto' : order.status === 'executed' ? 'Executada' : 'Cancelada'}</span></div>
            <div class="order-details">
                <div><span>Lado</span><strong>${order.side === 'buy' ? 'Compra' : 'Venda'}</strong></div>
                <div><span>Quantidade</span><strong>${formatNumber(order.quantity)}</strong></div>
                <div><span>Preço</span><strong>${formatCurrency(order.executionPrice ?? order.limitPrice)}</strong></div>
            </div>
            <div class="order-footer"><span>${formatDate(order.executedAt ?? order.cancelledAt ?? order.createdAt)}</span>${order.status === 'open' ? `<button type="button" class="btn-cancel-order" data-cancel-order="${order.id}">Cancelar ordem</button>` : ''}</div>`;
        container.appendChild(card);
    });
};

export const initListFilters = () => {
    document.querySelectorAll('.filter-btn').forEach((button) => button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((item) => item.classList.toggle('active', item === button));
        renderHistory();
    }));
    document.querySelectorAll('.tab-btn').forEach((button) => button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach((item) => item.classList.toggle('active', item === button));
        renderOrders();
    }));
};
