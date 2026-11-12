import { PRODUCTS } from '../config/constants.js';

export const ALL_PRODUCTS = Object.values(PRODUCTS).flat();

export const findProduct = (id) => ALL_PRODUCTS.find((product) => product.id === id);

const hash = (value) => [...value].reduce(
    (total, character) => ((total * 31) + character.charCodeAt(0)) | 0,
    7
);

const dateKey = (date) => {
    const normalized = new Date(date);
    return `${normalized.getFullYear()}-${normalized.getMonth() + 1}-${normalized.getDate()}`;
};

export const getQuote = (product, date = new Date()) => {
    if (!product) return 0;
    const variation = (Math.abs(hash(`${product.id}:${dateKey(date)}`)) % 601 - 300) / 10000;
    return Math.max(0.01, Math.round(product.price * (1 + variation) * 100) / 100);
};

export const getPreviousQuote = (product, date = new Date()) => {
    const previous = new Date(date);
    previous.setDate(previous.getDate() - 1);
    return getQuote(product, previous);
};

export const getDailyVariation = (product, date = new Date()) => {
    const current = getQuote(product, date);
    const previous = getPreviousQuote(product, date);
    return previous ? (current - previous) / previous : 0;
};
