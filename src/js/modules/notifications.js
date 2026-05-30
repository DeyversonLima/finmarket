let toastContainer = null;
const MAX_TOASTS = 3; // Limite máximo de alertas visíveis simultaneamente

export const initNotifications = () => {
    toastContainer = document.getElementById('toastContainer');
};

export const showToast = (message, type = 'success') => {
    if (!toastContainer) return;

    // 1. CORREÇÃO: Selecionamos apenas os toasts ativos (que NÃO estão sumindo)
    const activeToasts = Array.from(toastContainer.querySelectorAll('.toast:not(.hide)'));
    
    if (activeToasts.length >= MAX_TOASTS) {
        // Pegamos o mais antigo dos ativos
        const oldestToast = activeToasts[0];
        
        // Em vez de esperar 300ms para tirar do DOM, nós removemos o elemento imediatamente!
        // Como o usuário clicou rápido, a troca abrupta limpa o espaço para o novo sem quebrar o layout
        oldestToast.remove();
    }

    // 2. Criação da nova notificação
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // 3. Ativa a animação de entrada
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 4. Agenda a remoção automática após 3 segundos
    setTimeout(() => {
        if (toast.parentNode === toastContainer) {
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentNode === toastContainer) {
                    toast.remove();
                }
            }, 300); // Tempo da transição de opacidade do CSS
        }
    }, 3000);
};