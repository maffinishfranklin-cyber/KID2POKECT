// Main utility functions for KID2POCKET billing system

// Initialize the application
function initApp() {
    // Initialize default data structures if they don't exist
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('purchases')) {
        localStorage.setItem('purchases', JSON.stringify([]));
    }
    if (!localStorage.getItem('settings')) {
        localStorage.setItem('settings', JSON.stringify({
            shopName: 'KID2POCKET',
            taxRate: 0,
            currency: '₹'
        }));
    }
}

// LocalStorage helpers
function getItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error writing to localStorage:', e);
        return false;
    }
}

// Format currency
function formatCurrency(amount) {
    const settings = getItem('settings') || { currency: '₹' };
    return `${settings.currency}${parseFloat(amount).toFixed(2)}`;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generate invoice number
function generateInvoiceNumber() {
    const date = new Date();
    const dateStr = date.getFullYear().toString().substr(-2) + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${dateStr}-${random}`;
}

// Show notification/toast
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Format date
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/\D/g, ''));
}

// Initialize app on load
initApp();

// Update cart badge on all pages
function updateCartBadge() {
    const cart = getItem('cart') || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = totalItems;
    });
}

// Call updateCartBadge when cart changes
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
});

