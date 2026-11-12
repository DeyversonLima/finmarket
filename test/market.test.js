import test from 'node:test';
import assert from 'node:assert/strict';
import { findProduct, getDailyVariation, getQuote } from '../src/js/modules/market.js';

test('localiza produtos de todas as categorias', () => {
    assert.equal(findProduct('PETR4').ticker, 'PETR4');
    assert.equal(findProduct('TESOURO_SELIC').ticker, 'LFT');
    assert.equal(findProduct('BTC').ticker, 'BTC');
});

test('cotação simulada é determinística para produto e data', () => {
    const product = findProduct('PETR4');
    const date = new Date('2026-11-11T12:00:00-03:00');
    assert.equal(getQuote(product, date), getQuote(product, date));
    assert.ok(getQuote(product, date) > 0);
    assert.ok(Number.isFinite(getDailyVariation(product, date)));
});
