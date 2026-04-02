import './style.css'

console.log('The Artisanal Editorial project initialized.')

// --- MOCK DATABASE ---
const PRODUCTS_DB = {
  'The Heirloom Cardigan': { 
      price: 280, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOVLbhFpJa5S4QFXiD83ycHu_Q0Gn4TgQ3256LWSFFK7Apivjr9Hnf3Ss1197ItUOQ94nq9cwi80cgdSkJgVToAyzgNQII7IK5wuPmDR7OT0OU-4tAwI1sFCyMcnoE3ZqHidvZbbcAYecbGOgezXwPo7H4kRfeYaGtUel4lSiqNrHtl0SnTWCT9qQCLjZhLcGSQoXmjjLxkyNVUNwSo4rf5SCnuLe64yOZmbcyR3TQm_rsPQpn2-2fyUhgkYfYzJvyFmVDaGOXvOMW' 
  },
  'Dining Linens Set': { 
      price: 145, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2eJgJ11h1TWezGfXo0Yk3A6lyd09Xp57sD3i-j2Tq9F_F_E5h_1b-5v2T3090Fk_Iu1b203aQOqN8D_w0b_aR737gK0A5L1nZ3lXqY9X0LwI0q8xG_B2zZ70Jq2YV_F31y_I3aJ6R9Ym3GvZ9z4n4_wR7qO0-v7_X_M5yXZ4O00R80p-aE6m8N1_Yx_o-V7qN' 
  },
  'Basalt Wall Tapestry': { 
      price: 420, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC20_gB5mG1v79_03BhUu6z9bVlMvWJ6T941KqJp1kX2G17wD8Hj02xL714f36cM4yZ57aZ2pB5Wj5G8uL5Hl62g6Z574_n2kYfC9Yl35P7U70XwLzG7_gP90d40X8G10vF7Yh0fTbJc_e-4HnZ9sA114_Nq2zV_iK1Q18H-7vUe2o0OqTqVq_gO5X-pX0jM8B9gXkXv3XF9H-kY8d3-i4_C5aX_G_kY9j4L3h-7T' 
  }
};

// --- CART STATE ---
let cart = JSON.parse(localStorage.getItem('loom_cart') || '[]');

function saveCart() {
    localStorage.setItem('loom_cart', JSON.stringify(cart));
}

function addToCart(name, price, image) {
    const existingEntry = cart.find(i => i.name === name);
    if (existingEntry) {
        existingEntry.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    saveCart();
    renderCart();
    
    // Quick indicator bounce on nav cart icon
    const icon = document.querySelector('[data-icon="shopping_bag"]');
    if (icon) {
        icon.classList.add('text-on-surface');
        icon.parentElement.classList.add('scale-125');
        setTimeout(() => {
            icon.classList.remove('text-on-surface');
            icon.parentElement.classList.remove('scale-125');
        }, 300);
    }
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// --- CART UI ---
function injectCartUI() {
    const overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.className = 'fixed inset-0 bg-[#2b221f]/50 backdrop-blur-sm z-[100] opacity-0 pointer-events-none transition-opacity duration-300';
    overlay.onclick = toggleCart;
    document.body.appendChild(overlay);

    const drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.className = 'fixed top-0 right-0 h-full w-full max-w-md bg-background z-[101] translate-x-full transition-transform duration-500 cubic-bezier-custom shadow-2xl flex flex-col border-l border-outline/10';
    drawer.innerHTML = `
        <div class="px-8 py-6 flex justify-between items-center border-b border-outline/10">
            <h2 class="font-headline italic text-3xl text-primary">Your Archive</h2>
            <button onclick="toggleCart()" class="text-on-surface-variant hover:text-primary transition-colors hover:scale-110 active:scale-95">
                <span class="material-symbols-outlined text-[28px]">close</span>
            </button>
        </div>
        <div id="cart-items" class="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <!-- Items injected here -->
        </div>
        <div class="p-8 border-t border-outline/10 bg-surface-container-low">
            <div class="flex justify-between font-label text-on-surface text-lg mb-6 tracking-wide">
                <span>Subtotal</span>
                <span id="cart-total" class="font-bold">$0</span>
            </div>
            <button onclick="checkout()" class="w-full bg-primary text-on-primary py-4 rounded-lg font-label uppercase tracking-widest text-sm hover:bg-primary-container active:scale-[0.98] transition-all shadow-xl shadow-primary/10">
                Proceed to Checkout
            </button>
        </div>
    `;
    document.body.appendChild(drawer);
}

window.toggleCart = function() {
    let overlay = document.getElementById('cart-overlay');
    let drawer = document.getElementById('cart-drawer');
    if (!overlay) {
        injectCartUI();
        overlay = document.getElementById('cart-overlay');
        drawer = document.getElementById('cart-drawer');
    }

    const isOpen = !drawer.classList.contains('translate-x-full');
    
    if (isOpen) {
        drawer.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    } else {
        renderCart();
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        document.body.style.overflow = 'hidden';
    }
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-60 mt-24">
                <span class="material-symbols-outlined text-4xl mb-4">inventory_2</span>
                <p class="font-body italic text-lg">Your bag is currently empty.</p>
            </div>
        `;
        totalEl.innerText = '$0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
            <div class="flex gap-4 group">
                <img src="${item.image}" class="w-24 h-32 object-cover rounded-md bg-surface-container shadow-sm">
                <div class="flex-1 py-1 flex flex-col justify-between">
                    <div>
                        <h4 class="font-headline text-lg">${item.name}</h4>
                        <p class="font-label text-sm text-on-surface-variant opacity-80 mt-1">Qty: ${item.quantity}</p>
                    </div>
                    <div class="flex justify-between items-end">
                        <p class="font-label font-bold text-primary">$${item.price * item.quantity}</p>
                        <button onclick="removeFromCart(${index})" class="text-xs font-label uppercase tracking-widest text-on-surface-variant opacity-50 hover:opacity-100 hover:text-[#d32f2f] transition-colors border-b border-transparent hover:border-[#d32f2f]">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalEl.innerText = `$${total}`;

    // Update count indicator on navbar if requested
    const icon = document.querySelector('[data-icon="shopping_bag"]');
    if (icon && cart.length > 0) {
        icon.classList.add('text-primary'); 
        // We could also dynamically inject a red badge here easily, but keeping it minimal aesthetic.
    }
}

window.checkout = function() {
    if (cart.length === 0) return;
    alert("This is a demo. Processing to Stripe/Shopify...");
    cart = [];
    saveCart();
    toggleCart();
    showToast("Checkout simulation complete.");
}


// --- TOAST INTERCEPTOR SYSTEM ---
const originalShowToast = function(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-8 right-8 z-[1000] flex flex-col gap-4 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'bg-[#fbf9f5] border border-outline/10 text-on-surface px-6 py-4 rounded-lg shadow-2xl shadow-surface-tint/10 transform translate-y-8 opacity-0 transition-all duration-300 font-label tracking-wide text-sm flex items-center gap-3';
    
    // Add icon based on message
    let iconName = 'info';
    if (message.includes('bag')) iconName = 'check_circle';
    if (message.includes('subscrib')) iconName = 'mark_email_read';

    toast.innerHTML = `
        <span class="material-symbols-outlined text-[18px] text-primary">${iconName}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-8', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-8', 'opacity-0');
        setTimeout(() => toast.remove(), 300); 
    }, 3500);
}

// Override showToast to intercept bag clicks
window.showToast = function(msg) {
    if (msg.includes('shopping bag is currently empty') || msg === 'open_cart') {
        toggleCart();
        return;
    }
    
    // Intercept generic 'added to bag' messages to route them to the real cart
    let addedProductKey = null;
    for (let key in PRODUCTS_DB) {
        if (msg.includes(key) && msg.includes('added')) {
            addedProductKey = key;
            break;
        }
    }

    if (addedProductKey) {
        const prod = PRODUCTS_DB[addedProductKey];
        addToCart(addedProductKey, prod.price, prod.image);
    }
    
    // Always show the visual toast confirmation as well
    originalShowToast(msg);
}

// --- NEWSLETTER ---
window.subscribeNewsletter = function() {
    const input = document.getElementById('email-input');
    if (input && input.value && input.value.includes('@')) {
        showToast('Thank you for subscribing to our journal!');
        input.value = ''; 
    } else {
        showToast('Please enter a valid email address.');
    }
}

// --- IMAGE CAROUSEL LOGIC ---
window.currentSlide = 0;

window.goToSlide = function(idx) {
    const images = document.querySelectorAll('.carousel-img');
    const dots = document.getElementById('carousel-indicators')?.children;
    const thumbs = document.querySelectorAll('#product-carousel .grid button');
    
    if (!images || images.length === 0) return;
    
    // Convert to valid index
    let newSlide = idx % images.length;
    if (newSlide < 0) newSlide += images.length;
    
    // Hide current
    if (images[window.currentSlide]) {
        images[window.currentSlide].classList.replace('opacity-100', 'opacity-0');
        if (dots && dots[window.currentSlide]) dots[window.currentSlide].classList.replace('opacity-100', 'opacity-50');
        if (thumbs && thumbs[window.currentSlide]) thumbs[window.currentSlide].classList.replace('border-primary', 'border-transparent');
    }
    
    // Show new
    window.currentSlide = newSlide;
    if (images[window.currentSlide]) {
        images[window.currentSlide].classList.replace('opacity-0', 'opacity-100');
        if (dots && dots[window.currentSlide]) dots[window.currentSlide].classList.replace('opacity-50', 'opacity-100');
        if (thumbs && thumbs[window.currentSlide]) {
            thumbs[window.currentSlide].classList.remove('border-transparent');
            thumbs[window.currentSlide].classList.add('border-primary');
        }
    }
}

window.nextSlide = function() { window.goToSlide(window.currentSlide + 1); }
window.prevSlide = function() { window.goToSlide(window.currentSlide - 1); }
