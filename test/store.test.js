import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = { addEventListener() {} };
globalThis.localStorage = {
    values: new Map(),
    getItem(key) { return this.values.get(key) ?? null; },
    setItem(key, value) { this.values.set(key, value); },
    removeItem(key) { this.values.delete(key); }
};

const { createDefaultState, sanitizeState } = await import('../src/js/modules/store.js');

test('estado padrão possui todas as áreas persistidas', () => {
    const state = createDefaultState();
    assert.equal(state.version, 2);
    assert.equal(state.balance, 1_000_000);
    assert.deepEqual(state.portfolio, {});
    assert.ok(state.profile.email);
    assert.equal(state.settings.theme, 'light');
});

test('normaliza estado adulterado sem propagar números inválidos', () => {
    const state = sanitizeState({
        balance: 'inválido',
        portfolio: { PETR4: -4, VALE3: { quantity: 2, averagePrice: 60 } },
        transactions: 'inválido',
        settings: { theme: 'qualquer' }
    });
    assert.equal(state.balance, 1_000_000);
    assert.equal(state.portfolio.PETR4, undefined);
    assert.equal(state.portfolio.VALE3.quantity, 2);
    assert.deepEqual(state.transactions, []);
    assert.equal(state.settings.theme, 'light');
});
