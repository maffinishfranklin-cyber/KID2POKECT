// Product CRUD Operations

let products = [];
let filteredProducts = [];

// Load products from localStorage
function loadProducts() {
    products = getItem('products') || [];
    filteredProducts = [...products];
    renderProducts();
    // Add sample products if empty
    if (products.length === 0) {
        addSampleProducts();
    }
}

// Add sample products for demonstration
function addSampleProducts() {
    const sampleProducts = [
        {
            id: generateId(),
            name: 'Pink Frock Dress',
            category: 'Frock',
            age: '4-6',
            price: 899,
            stock: 15,
            image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400',
            description: 'Beautiful pink frock for girls'
        },
        {
            id: generateId(),
            name: 'Blue T-Shirt',
            category: 'Top',
            age: '7-10',
            price: 499,
            stock: 20,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            description: 'Comfortable blue t-shirt'
        },
        {
            id: generateId(),
            name: 'Denim Jeans (Boys)',
            category: 'Pant-Boys',
            age: '7-10',
            price: 799,
            stock: 12,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
            description: 'Stylish denim jeans for boys'
        },
        {
            id: generateId(),
            name: 'Sun Cap',
            category: 'Cap',
            age: '1-3',
            price: 299,
            stock: 25,
            image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
            description: 'Sun protection cap'
        },
        {
            id: generateId(),
            name: 'Kids Sunglasses',
            category: 'Glasses',
            age: '4-6',
            price: 399,
            stock: 18,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
            description: 'Stylish sunglasses for kids'
        },
        {
            id: generateId(),
            name: 'Floral Dress',
            category: 'Frock',
            age: '11-15',
            price: 1299,
            stock: 10,
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
            description: 'Elegant floral dress for teen girls'
        },
        {
            id: generateId(),
            name: 'Colorful Sunglasses',
            category: 'Glasses',
            age: '7-10',
            price: 449,
            stock: 15,
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
            description: 'Fun colorful sunglasses for kids'
        },
        {
            id: generateId(),
            name: 'Denim Jacket (Boys)',
            category: 'Jacket',
            age: '7-10',
            price: 1299,
            stock: 12,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
            description: 'Stylish denim jacket for boys'
        },
        {
            id: generateId(),
            name: 'Pink Jacket (Girls)',
            category: 'Jacket',
            age: '4-6',
            price: 1199,
            stock: 14,
            image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
            description: 'Warm pink jacket for girls'
        },
        {
            id: generateId(),
            name: 'Winter Jacket',
            category: 'Jacket',
            age: '11-15',
            price: 1599,
            stock: 10,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
            description: 'Warm winter jacket'
        },
        {
            id: generateId(),
            name: 'Kids Digital Watch',
            category: 'Watch',
            age: '7-10',
            price: 699,
            stock: 20,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            description: 'Digital watch for kids'
        },
        {
            id: generateId(),
            name: 'Colorful Watch',
            category: 'Watch',
            age: '4-6',
            price: 549,
            stock: 18,
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
            description: 'Fun colorful watch'
        },
        {
            id: generateId(),
            name: 'Sports Watch',
            category: 'Watch',
            age: '11-15',
            price: 899,
            stock: 15,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            description: 'Sports watch for active kids'
        }
    ];
    
    products = sampleProducts;
    setItem('products', products);
    filteredProducts = [...products];
    renderProducts();
}

// Render products grid
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No products found. Add your first product!</p>';
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category} • Age: ${product.age} years</p>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <p style="color: #666; font-size: 0.9rem;">Stock: ${product.stock} units</p>
                ${product.description ? `<p style="color: #666; font-size: 0.85rem; margin-top: 0.5rem;">${product.description}</p>` : ''}
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteProduct('${product.id}')">Delete</button>
                    <button class="btn btn-success btn-small" onclick="addToCart('${product.id}')">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products
function filterProducts() {
    const category = document.getElementById('filterCategory').value;
    const age = document.getElementById('filterAge').value;
    const search = document.getElementById('searchProducts').value.toLowerCase();

    filteredProducts = products.filter(product => {
        const matchCategory = !category || product.category === category;
        const matchAge = !age || product.age === age;
        const matchSearch = !search || 
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search) ||
            (product.description && product.description.toLowerCase().includes(search));
        
        return matchCategory && matchAge && matchSearch;
    });

    renderProducts();
}

// Open product modal
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    form.reset();
    document.getElementById('productId').value = '';
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            modalTitle.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productAge').value = product.age;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productDescription').value = product.description || '';
        }
    } else {
        modalTitle.textContent = 'Add New Product';
    }
    
    modal.style.display = 'flex';
}

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Save product (Create/Update)
function saveProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const age = document.getElementById('productAge').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value;
    const description = document.getElementById('productDescription').value;

    if (id) {
        // Update existing product
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                category,
                age,
                price,
                stock,
                image,
                description
            };
            showNotification('Product updated successfully!', 'success');
        }
    } else {
        // Create new product
        const newProduct = {
            id: generateId(),
            name,
            category,
            age,
            price,
            stock,
            image,
            description
        };
        products.push(newProduct);
        showNotification('Product added successfully!', 'success');
    }

    setItem('products', products);
    filteredProducts = [...products];
    renderProducts();
    closeProductModal();
}

// Edit product
function editProduct(productId) {
    openProductModal(productId);
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        setItem('products', products);
        filteredProducts = filteredProducts.filter(p => p.id !== productId);
        renderProducts();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Add to cart (from products page)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
        showNotification('Product is out of stock!', 'danger');
        return;
    }

    let cart = getItem('cart') || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('Cannot add more. Stock limit reached!', 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }

    setItem('cart', cart);
    updateCartBadge();
    showNotification(`${product.name} added to cart!`, 'success');
}

