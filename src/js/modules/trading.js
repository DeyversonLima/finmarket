import { findProduct, getQuote } from './market.js';
import { showToast } from './notifications.js';
import { store } from './store.js';
import { formatCurrency, generateId, roundMoney } from './utils.js';

const canExecuteLimit = (side, limitPrice, quote) => side === 'buy'
    ? quote <= limitPrice
    : quote >= limitPrice;

const executeOrder = (draft, order, product, executionPrice) => {
    const total = roundMoney(executionPrice * order.quantity);
    const position = draft.portfolio[order.productId] ?? { quantity: 0, averagePrice: 0 };

    if (order.side === 'buy') {
        if (draft.balance < total) {
            order.status = 'cancelled';
            order.cancelReason = 'Saldo insuficiente no momento da execução';
            order.cancelledAt = new Date().toISOString();
            return { ok: false, message: 'Saldo insuficiente' };
        }
        const previousCost = position.quantity * position.averagePrice;
        const nextQuantity = position.quantity + order.quantity;
        draft.balance = roundMoney(draft.balance - total);
        draft.portfolio[order.productId] = {
            quantity: nextQuantity,
            averagePrice: roundMoney((previousCost + total) / nextQuantity)
        };
    } else {
        if (position.quantity < order.quantity) {
            order.status = 'cancelled';
            order.cancelReason = 'Quantidade insuficiente no momento da execução';
            order.cancelledAt = new Date().toISOString();
            return { ok: false, message: 'Quantidade insuficiente na carteira' };
        }
        draft.balance = roundMoney(draft.balance + total);
        position.quantity = roundMoney(position.quantity - order.quantity);
        if (position.quantity <= 0) delete draft.portfolio[order.productId];
        else draft.portfolio[order.productId] = position;
    }

    order.status = 'executed';
    order.executionPrice = executionPrice;
    order.executedAt = new Date().toISOString();
    draft.transactions.unshift({
        id: generateId(),
        orderId: order.id,
        type: order.side,
        productId: product.id,
        productName: product.name,
        ticker: product.ticker,
        price: executionPrice,
        quantity: order.quantity,
        total,
        date: order.executedAt
    });
    return { ok: true };
};

export const placeOrder = ({ productId, side, quantity, orderType, limitPrice }) => {
    const product = findProduct(productId);
    const quote = getQuote(product);
    const normalizedQuantity = Number(quantity);
    const normalizedLimit = Number(limitPrice);

    if (!product || !['buy', 'sell'].includes(side)) return { ok: false, message: 'Operação inválida' };
    if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) return { ok: false, message: 'Informe uma quantidade válida' };
    if (orderType === 'limit' && (!Number.isFinite(normalizedLimit) || normalizedLimit <= 0)) {
        return { ok: false, message: 'Informe um preço limite válido' };
    }
    const currentState = store.getState();
    const reservedForSale = currentState.orders
        .filter((order) => order.status === 'open' && order.side === 'sell' && order.productId === productId)
        .reduce((total, order) => total + Number(order.quantity), 0);
    if (side === 'sell' && (currentState.portfolio[productId]?.quantity ?? 0) - reservedForSale < normalizedQuantity) {
        return { ok: false, message: 'Quantidade insuficiente na carteira' };
    }

    let result = { ok: true };
    store.update('order-created', (draft) => {
        const order = {
            id: generateId(),
            productId,
            ticker: product.ticker,
            side,
            quantity: normalizedQuantity,
            orderType,
            limitPrice: orderType === 'limit' ? normalizedLimit : null,
            status: 'open',
            createdAt: new Date().toISOString()
        };

        const shouldExecute = orderType === 'market' || canExecuteLimit(side, normalizedLimit, quote);
        if (shouldExecute) result = executeOrder(draft, order, product, quote);
        if (result.ok) draft.orders.unshift(order);
    });
    return result;
};

export const cancelOrder = (orderId) => {
    let cancelled = false;
    store.update('order-cancelled', (draft) => {
        const order = draft.orders.find((item) => item.id === orderId && item.status === 'open');
        if (!order) return;
        order.status = 'cancelled';
        order.cancelledAt = new Date().toISOString();
        cancelled = true;
    });
    return cancelled;
};

export const processOpenOrders = () => {
    store.update('orders-processed', (draft) => {
        draft.orders.filter((order) => order.status === 'open').forEach((order) => {
            const product = findProduct(order.productId);
            const quote = getQuote(product);
            if (product && canExecuteLimit(order.side, order.limitPrice, quote)) {
                executeOrder(draft, order, product, quote);
            }
        });
    });
};

const tradeDialogMarkup = `
    <form method="dialog" class="trade-form" id="tradeForm">
        <div class="modal-header">
            <div class="trade-heading">
                <span class="trade-symbol" id="tradeSymbol" aria-hidden="true">F</span>
                <div><p class="trade-eyebrow" id="tradeEyebrow">Nova ordem</p><h2 id="tradeTitle">Comprar ativo</h2></div>
            </div>
            <button type="button" class="modal-close" data-close-trade aria-label="Fechar janela">×</button>
        </div>
        <div class="trade-market-summary" aria-label="Resumo da cotação">
            <div><span>Cotação simulada</span><strong id="tradeQuote"></strong></div>
            <div><span>Saldo disponível</span><strong id="tradeAvailable"></strong></div>
        </div>
        <input type="hidden" id="tradeProductId">
        <input type="hidden" id="tradeSide">
        <div class="trade-fields">
            <label><span>Quantidade</span><input id="tradeQuantity" type="number" inputmode="decimal" min="0.0001" step="0.0001" value="1" required aria-describedby="quantityHint"><small id="quantityHint">Você pode negociar unidades fracionadas.</small></label>
            <label><span>Tipo de ordem</span><select id="tradeOrderType"><option value="market">A mercado — executar agora</option><option value="limit">Limitada — definir preço</option></select></label>
            <label id="limitPriceGroup" hidden><span>Preço limite</span><input id="tradeLimitPrice" type="number" inputmode="decimal" min="0.01" step="0.01"><small>A ordem aguardará até a cotação atingir este valor.</small></label>
        </div>
        <div class="trade-estimate" aria-live="polite">
            <div><span>Preço considerado</span><strong id="tradeUnitPrice"></strong></div>
            <div><span>Quantidade</span><strong id="tradeQuantitySummary"></strong></div>
            <div class="trade-total"><span>Total estimado</span><strong id="tradeTotal"></strong></div>
        </div>
        <p class="form-error" id="tradeError" role="alert"></p>
        <div class="modal-actions"><button type="button" class="btn-secondary" data-close-trade>Voltar</button><button type="submit" class="btn-primary" id="tradeSubmit">Confirmar compra</button></div>
    </form>`;

export const initTrading = () => {
    const dialog = document.createElement('dialog');
    dialog.className = 'trade-dialog';
    dialog.setAttribute('aria-labelledby', 'tradeTitle');
    dialog.innerHTML = tradeDialogMarkup;
    document.body.appendChild(dialog);

    const form = dialog.querySelector('#tradeForm');
    const quantity = dialog.querySelector('#tradeQuantity');
    const orderType = dialog.querySelector('#tradeOrderType');
    const limitPrice = dialog.querySelector('#tradeLimitPrice');
    const limitGroup = dialog.querySelector('#limitPriceGroup');

    const updateEstimate = () => {
        const product = findProduct(dialog.querySelector('#tradeProductId').value);
        const price = orderType.value === 'limit' ? Number(limitPrice.value) : getQuote(product);
        const normalizedQuantity = Number(quantity.value) || 0;
        dialog.querySelector('#tradeUnitPrice').textContent = formatCurrency(price);
        dialog.querySelector('#tradeQuantitySummary').textContent = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(normalizedQuantity);
        dialog.querySelector('#tradeTotal').textContent = formatCurrency(price * normalizedQuantity);
    };

    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-trade]');
        if (!trigger) return;
        const product = findProduct(trigger.dataset.productId);
        const side = trigger.dataset.trade;
        if (!product) return;
        dialog.querySelector('#tradeProductId').value = product.id;
        dialog.querySelector('#tradeSide').value = side;
        dialog.dataset.side = side;
        dialog.querySelector('#tradeSymbol').textContent = product.ticker[0];
        dialog.querySelector('#tradeEyebrow').textContent = `${product.name} • ${product.type}`;
        dialog.querySelector('#tradeTitle').textContent = `${side === 'buy' ? 'Comprar' : 'Vender'} ${product.ticker}`;
        dialog.querySelector('#tradeQuote').textContent = formatCurrency(getQuote(product));
        dialog.querySelector('#tradeAvailable').textContent = formatCurrency(store.getState().balance);
        dialog.querySelector('#tradeSubmit').textContent = side === 'buy' ? 'Confirmar compra' : 'Confirmar venda';
        quantity.value = '1';
        orderType.value = 'market';
        limitPrice.value = getQuote(product).toFixed(2);
        limitGroup.hidden = true;
        dialog.querySelector('#tradeError').textContent = '';
        updateEstimate();
        dialog.showModal();
        quantity.focus();
    });

    dialog.querySelectorAll('[data-close-trade]').forEach((button) => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
    orderType.addEventListener('change', () => {
        limitGroup.hidden = orderType.value !== 'limit';
        limitPrice.required = orderType.value === 'limit';
        updateEstimate();
    });
    [quantity, limitPrice].forEach((input) => input.addEventListener('input', updateEstimate));

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const result = placeOrder({
            productId: dialog.querySelector('#tradeProductId').value,
            side: dialog.querySelector('#tradeSide').value,
            quantity: quantity.value,
            orderType: orderType.value,
            limitPrice: limitPrice.value
        });
        if (!result.ok) {
            dialog.querySelector('#tradeError').textContent = result.message;
            return;
        }
        dialog.close();
        showToast(orderType.value === 'market' ? 'Ordem executada com sucesso' : 'Ordem registrada com sucesso');
    });
};
