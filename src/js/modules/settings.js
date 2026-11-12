import { showToast } from './notifications.js';
import { store } from './store.js';

export const initSettings = () => {
    const clearBtn = document.getElementById('clearDataBtn');
    const confirmModal = document.getElementById('confirmModal');
    const cancelClear = document.getElementById('cancelClear');
    const confirmClear = document.getElementById('confirmClear');
    const currentYear = document.getElementById('currentYear');
    if (clearBtn && confirmModal) {
        clearBtn.addEventListener('click', () => {
            confirmModal.classList.add('active');
            confirmModal.setAttribute('aria-hidden', 'false');
            confirmModal.removeAttribute('inert');
            confirmClear?.focus();
        });

        cancelClear?.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            confirmModal.setAttribute('aria-hidden', 'true');
            confirmModal.setAttribute('inert', '');
            clearBtn.focus();
        });

        confirmClear?.addEventListener('click', () => {
            store.reset();
            confirmModal.classList.remove('active');
            confirmModal.setAttribute('aria-hidden', 'true');
            confirmModal.setAttribute('inert', '');
            showToast('Todos os dados foram limpos');
        });

        confirmModal.querySelector('.modal-overlay')?.addEventListener('click', () => cancelClear?.click());
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && confirmModal.classList.contains('active')) cancelClear?.click();
            if (event.key === 'Tab' && confirmModal.classList.contains('active')) {
                const controls = [cancelClear, confirmClear].filter(Boolean);
                const first = controls[0];
                const last = controls.at(-1);
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    }

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
};
