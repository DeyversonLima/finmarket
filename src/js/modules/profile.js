import { showToast } from './notifications.js';

let state = null;

export const setProfileState = (appState) => {
    state = appState;
};

export const initProfileForm = () => {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;

        const nameEl = document.getElementById('profileName');
        const emailEl = document.getElementById('profileEmail');
        const initialsEl = document.getElementById('avatarInitials');

        if (nameEl) nameEl.textContent = `${firstName} ${lastName}`;
        if (emailEl) emailEl.textContent = email;
        if (initialsEl) {
            initialsEl.textContent = `${firstName[0]}${lastName[0]}`.toUpperCase();
        }

        showToast('Perfil atualizado com sucesso');
    });

    updateProfileStats();
};

export const updateProfileStats = () => {
    const txCount = document.getElementById('statTransactions');
    const assetCount = document.getElementById('statAssets');

    if (txCount) txCount.textContent = state.transactions.length;
    if (assetCount) assetCount.textContent = Object.keys(state.portfolio).length;
};
