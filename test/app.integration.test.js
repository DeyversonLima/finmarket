import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

test('renderiza catálogo e executa uma compra a mercado', async () => {
    const html = await readFile('src/pages/index.html', 'utf8');
    const dom = new JSDOM(html, { url: 'http://localhost/src/pages/index.html' });
    const { window } = dom;
    window.HTMLDialogElement.prototype.showModal = function showModal() { this.open = true; };
    window.HTMLDialogElement.prototype.close = function close() { this.open = false; };

    Object.assign(globalThis, {
        window,
        document: window.document,
        localStorage: window.localStorage,
        Event: window.Event,
        HTMLElement: window.HTMLElement
    });

    await import(`../src/js/main.js?integration=${Date.now()}`);
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    assert.equal(window.document.querySelectorAll('.product-card').length, 30);
    const buyButton = window.document.querySelector('[data-trade="buy"][data-product-id="PETR4"]');
    buyButton.click();
    assert.equal(window.document.querySelector('.trade-dialog').open, true);

    window.document.querySelector('#tradeForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    const persisted = JSON.parse(window.localStorage.getItem('finmarket:v2'));
    assert.equal(persisted.portfolio.PETR4.quantity, 1);
    assert.equal(persisted.transactions.length, 1);
    assert.equal(persisted.orders[0].status, 'executed');
    assert.ok(persisted.balance < 1_000_000);
    const formattedBalance = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(persisted.balance);
    assert.equal(window.document.querySelector('#heroBalance').textContent, formattedBalance);
    assert.equal(window.document.querySelector('#headerWallet').textContent, formattedBalance);

    dom.window.close();
});
