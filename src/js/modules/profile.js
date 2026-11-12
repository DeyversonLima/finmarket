import { showToast } from './notifications.js';
import { store } from './store.js';

const setValue = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.value = value;
};

export const renderProfile = () => {
    const { profile, transactions, portfolio } = store.getState();
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    const initials = [profile.firstName, profile.lastName].map((part) => String(part).trim()[0] ?? '').join('').toUpperCase() || 'FM';
    const textValues = {
        profileName: fullName,
        profileEmail: profile.email,
        avatarInitials: initials,
        statTransactions: transactions.length,
        statAssets: Object.keys(portfolio).length,
        statMemberSince: profile.memberSince
    };
    Object.entries(textValues).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    setValue('firstName', profile.firstName);
    setValue('lastName', profile.lastName);
    setValue('email', profile.email);
    setValue('phone', profile.phone);
};

export const initProfileForm = () => {
    const form = document.getElementById('profileForm');
    if (!form) return;

    renderProfile();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.reportValidity()) return;
        store.update('profile-updated', (draft) => {
            draft.profile.firstName = document.getElementById('firstName').value.trim();
            draft.profile.lastName = document.getElementById('lastName').value.trim();
            draft.profile.email = document.getElementById('email').value.trim().toLowerCase();
            draft.profile.phone = document.getElementById('phone').value.trim();
        });
        renderProfile();
        showToast('Perfil atualizado com sucesso');
    });
};

export const updateProfileStats = () => {
    renderProfile();
};
