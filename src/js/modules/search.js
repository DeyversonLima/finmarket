export const initSearch = () => {
    const catalogInput = document.querySelector('[data-search="catalog"]')
        ?? (document.getElementById('assetsGrid') ? document.querySelector('.header-center .search-input') : null);
    const helpInput = document.querySelector('[data-search="help"]');
    const headerInput = document.querySelector('.header-center .search-input');

    catalogInput?.addEventListener('input', (event) => {
        const term = event.target.value.trim().toLocaleLowerCase('pt-BR');
        document.querySelectorAll('.product-card').forEach((card) => {
            const content = `${card.querySelector('.product-name')?.textContent} ${card.querySelector('.product-ticker')?.textContent}`.toLocaleLowerCase('pt-BR');
            card.hidden = !content.includes(term);
        });
    });

    helpInput?.addEventListener('input', (event) => {
        const term = event.target.value.trim().toLocaleLowerCase('pt-BR');
        document.querySelectorAll('.help-card, .faq-item').forEach((item) => {
            item.hidden = !item.textContent.toLocaleLowerCase('pt-BR').includes(term);
        });
    });

    if (headerInput && !catalogInput) {
        headerInput.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' || !event.target.value.trim()) return;
            window.location.href = `index.html?q=${encodeURIComponent(event.target.value.trim())}`;
        });
    }

    const query = new URLSearchParams(window.location.search).get('q');
    if (query && catalogInput) {
        catalogInput.value = query;
        catalogInput.dispatchEvent(new Event('input'));
        catalogInput.focus();
    }
};
