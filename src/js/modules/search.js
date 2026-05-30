export const initSearch = () => {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            const name = card.querySelector('.product-name').textContent.toLowerCase();
            const ticker = card.querySelector('.product-ticker').textContent.toLowerCase();
            const visible = name.includes(term) || ticker.includes(term);
            card.style.display = visible ? 'flex' : 'none';
        });
    });
};
