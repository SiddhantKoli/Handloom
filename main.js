import './style.css'

console.log('The Artisanal Editorial project initialized.')

// Toast Notification System
window.showToast = function(message) {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'bg-primary text-on-primary px-6 py-4 rounded-lg shadow-xl shadow-surface-tint/20 transform translate-y-8 opacity-0 transition-all duration-300 font-label tracking-wide text-sm flex items-center gap-3';
    
    // Add icon and message
    toast.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">info</span>
        <span>${message}</span>
    `;

    // Add to container
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-8', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Animate out and remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-8', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300); // Wait for transition to complete
    }, 3000);
}

// Newsletter Subscription logic
window.subscribeNewsletter = function() {
    const input = document.getElementById('email-input');
    if (input && input.value && input.value.includes('@')) {
        showToast('Thank you for subscribing to our journal!');
        input.value = ''; // clear input
    } else {
        showToast('Please enter a valid email address.');
    }
}
