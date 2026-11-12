import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = { addEventListener() {} };
globalThis.document = { getElementById() { return null; } };
globalThis.localStorage = {
    values: new Map(),
    getItem(key) { return this.values.get(key) ?? null; },
    setItem(key, value) { this.values.set(key, value); },
    removeItem(key) { this.values.delete(key); }
};

const { store } = await import('../src/js/modules/store.js');
const { cancelOrder, placeOrder } = await import('../src/js/modules/trading.js');

test('compra e venda atualizam saldo, posição, histórico e ordens', () => {
    store.reset();
    const buy = placeOrder({ productId: 'PETR4', side: 'buy', quantity: 2, orderType: 'market' });
    assert.equal(buy.ok, true);
    assert.equal(store.getState().portfolio.PETR4.quantity, 2);
    assert.equal(store.getState().transactions[0].quantity, 2);
    assert.equal(store.getState().orders[0].status, 'executed');

    const sell = placeOrder({ productId: 'PETR4', side: 'sell', quantity: 1, orderType: 'market' });
    assert.equal(sell.ok, true);
    assert.equal(store.getState().portfolio.PETR4.quantity, 1);
    assert.equal(store.getState().transactions.length, 2);
});

test('ordem limitada distante permanece aberta e pode ser cancelada', () => {
    store.reset();
    const result = placeOrder({ productId: 'PETR4', side: 'buy', quantity: 1, orderType: 'limit', limitPrice: 1 });
    assert.equal(result.ok, true);
    assert.equal(store.getState().orders[0].status, 'open');
    assert.equal(cancelOrder(store.getState().orders[0].id), true);
    assert.equal(store.getState().orders[0].status, 'cancelled');
});

test('impede venda sem posição disponível', () => {
    store.reset();
    const result = placeOrder({ productId: 'VALE3', side: 'sell', quantity: 1, orderType: 'market' });
    assert.equal(result.ok, false);
    assert.match(result.message, /Quantidade insuficiente/);
});
