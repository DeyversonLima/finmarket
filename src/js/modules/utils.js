export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(value) || 0);
};

export const formatNumber = (value, maximumFractionDigits = 4) => new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits
}).format(Number(value) || 0);

export const formatDate = (date) => {
    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return 'Data indisponível';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(value);
};

export const generateId = () => {
    return globalThis.crypto?.randomUUID?.()
        ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
};

export const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
