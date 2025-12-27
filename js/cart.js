// Shopping Cart Functionality

let cart = [];

// Load cart from localStorage
function loadCart() {
    cart = getItem('cart') || [];
    return cart;
}

// Render cart items
function renderCart() {
    cart = loadCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: #666; margin-bottom: 1rem;">Your cart is empty!</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p style="color: #666; font-size: 0.9rem;">${item.category}</p>
                <p class="cart-item-price">${formatCurrency(item.price)} each</p>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.productId}', -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantityInput('${item.productId}', this.value)">
                    <button class="quantity-btn" onclick="updateQuantity('${item.productId}', 1)">+</button>
                </div>
                <p style="margin-top: 0.5rem; font-weight: 600; color: var(--success-color);">
                    Total: ${formatCurrency(item.price * item.quantity)}
                </p>
            </div>
            <button class="btn btn-danger btn-small" onclick="removeFromCart('${item.productId}')" style="align-self: flex-start;">Remove</button>
        </div>
    `).join('');

    if (cartSummary) {
        cartSummary.style.display = 'block';
        updateCartSummary();
    }
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    // Check stock availability
    const products = getItem('products') || [];
    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
        showNotification(`Only ${product.stock} items available in stock!`, 'warning');
        return;
    }

    item.quantity = newQuantity;
    setItem('cart', cart);
    renderCart();
    updateCartBadge();
}

// Update quantity from input
function updateQuantityInput(productId, value) {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) {
        renderCart();
        return;
    }

    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    // Check stock availability
    const products = getItem('products') || [];
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
        showNotification(`Only ${product.stock} items available in stock!`, 'warning');
        item.quantity = product.stock;
    } else {
        item.quantity = quantity;
    }

    setItem('cart', cart);
    renderCart();
    updateCartBadge();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    setItem('cart', cart);
    renderCart();
    updateCartBadge();
    showNotification('Item removed from cart', 'success');
}

// Calculate cart total
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0; // Tax removed as per requirement
    const total = subtotal; // Total equals subtotal (no tax)
    
    return { subtotal, tax, total };
}

// Update cart summary
function updateCartSummary() {
    const totals = calculateTotal();
    // Only show total amount (tax removed)
    const totalEl = document.getElementById('total');
    if (totalEl) {
        totalEl.innerHTML = `<strong>${formatCurrency(totals.total)}</strong>`;
    }
}

// Get cart total for use in other pages
function getCartTotal() {
    cart = loadCart();
    return calculateTotal();
}

// Clear cart
function clearCart() {
    cart = [];
    setItem('cart', cart);
    updateCartBadge();
}

