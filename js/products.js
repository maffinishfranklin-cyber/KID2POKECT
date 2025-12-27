// Product CRUD Operations with Supabase

let products = [];
let filteredProducts = [];

// Load products from Supabase
async function loadProducts() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }

        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        products = data || [];
        filteredProducts = [...products];
        renderProducts();

        if (products.length === 0) {
            showNotification('No products found. Add your first product!', 'info');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products from database', 'danger');
    }
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
            <img src="${product.image || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p style="color: var(--primary-color); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem;">Code: ${product.product_code}</p>
                <p class="product-category">${product.category} • Age: ${product.age_range} years</p>
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
        const matchAge = !age || product.age_range === age;
        const matchSearch = !search ||
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search) ||
            product.product_code.toLowerCase().includes(search) ||
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
    const qrCodeDisplay = document.getElementById('qrCodeDisplay');

    form.reset();
    document.getElementById('productId').value = '';
    qrCodeDisplay.style.display = 'none';

    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            modalTitle.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productCode').value = product.product_code;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productAge').value = product.age_range;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productDescription').value = product.description || '';

            qrCodeDisplay.style.display = 'block';
            generateProductQRCode(product.product_code);
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
async function saveProduct(event) {
    event.preventDefault();

    try {
        const id = document.getElementById('productId').value;
        const productCode = document.getElementById('productCode').value.trim();
        const name = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategory').value;
        const age = document.getElementById('productAge').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        const image = document.getElementById('productImage').value.trim();
        const description = document.getElementById('productDescription').value.trim();

        if (!window.supabaseClient) {
            showNotification('Database connection not available', 'danger');
            return;
        }

        const productData = {
            product_code: productCode,
            name: name,
            category: category,
            age_range: age,
            price: price,
            stock: stock,
            image: image,
            description: description
        };

        if (id) {
            const { error } = await window.supabaseClient
                .from('products')
                .update(productData)
                .eq('id', id);

            if (error) throw error;
            showNotification('Product updated successfully!', 'success');
        } else {
            const { error } = await window.supabaseClient
                .from('products')
                .insert([productData]);

            if (error) {
                if (error.code === '23505') {
                    showNotification('Product code already exists. Please use a unique code.', 'warning');
                } else {
                    throw error;
                }
                return;
            }
            showNotification('Product added successfully!', 'success');
        }

        await loadProducts();
        closeProductModal();
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('Error saving product: ' + error.message, 'danger');
    }
}

// Edit product
function editProduct(productId) {
    openProductModal(productId);
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        if (!window.supabaseClient) {
            showNotification('Database connection not available', 'danger');
            return;
        }

        const { error } = await window.supabaseClient
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;

        await loadProducts();
        showNotification('Product deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Error deleting product: ' + error.message, 'danger');
    }
}

// Add to cart (from products page)
async function addToCart(productId) {
    try {
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
                price: parseFloat(product.price),
                image: product.image,
                category: product.category,
                quantity: 1
            });
        }

        setItem('cart', cart);
        updateCartBadge();
        showNotification(`${product.name} added to cart!`, 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding product to cart', 'danger');
    }
}

// Show QR code when product code is entered
document.addEventListener('DOMContentLoaded', function() {
    const productCodeInput = document.getElementById('productCode');
    if (productCodeInput) {
        productCodeInput.addEventListener('blur', function() {
            const code = this.value.trim();
            if (code) {
                const qrCodeDisplay = document.getElementById('qrCodeDisplay');
                qrCodeDisplay.style.display = 'block';
                generateProductQRCode(code);
            }
        });
    }
});
