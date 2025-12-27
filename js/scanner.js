// Barcode and QR Code Scanner Functionality

let scannerStream = null;
let scannerActive = false;

// Open scanner modal
function openScanner() {
    const modal = document.getElementById('scannerModal');
    if (modal) {
        modal.style.display = 'flex';
        startScanner();
    }
}

// Close scanner modal
function closeScanner() {
    const modal = document.getElementById('scannerModal');
    if (modal) {
        modal.style.display = 'none';
        stopScanner();
    }
}

// Start camera for scanning
async function startScanner() {
    const video = document.getElementById('scannerVideo');
    const resultDiv = document.getElementById('scanResult');

    if (!video) return;

    try {
        scannerStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        video.srcObject = scannerStream;
        video.play();
        scannerActive = true;

        resultDiv.innerHTML = '<p style="color: #666;">Position barcode/QR code in front of camera...</p>';

        scanFromCamera();
    } catch (error) {
        console.error('Camera access error:', error);
        resultDiv.innerHTML = `
            <div style="color: var(--danger-color); padding: 1rem; background: #fee; border-radius: 8px;">
                <p><strong>Camera access denied or not available</strong></p>
                <p style="margin-top: 0.5rem;">Please enter product code manually:</p>
                <input type="text" id="manualCodeInput" class="form-control" style="margin-top: 0.5rem;" placeholder="Enter product code">
                <button class="btn btn-primary" onclick="searchByManualCode()" style="margin-top: 0.5rem; width: 100%;">Search Product</button>
            </div>
        `;
    }
}

// Stop camera scanner
function stopScanner() {
    if (scannerStream) {
        scannerStream.getTracks().forEach(track => track.stop());
        scannerStream = null;
    }
    scannerActive = false;
}

// Scan from camera using HTML5 Canvas
function scanFromCamera() {
    if (!scannerActive) return;

    const video = document.getElementById('scannerVideo');
    const canvas = document.getElementById('scannerCanvas');
    const resultDiv = document.getElementById('scanResult');

    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (typeof BarcodeDetector !== 'undefined') {
            const barcodeDetector = new BarcodeDetector();
            barcodeDetector.detect(imageData)
                .then(barcodes => {
                    if (barcodes.length > 0) {
                        const code = barcodes[0].rawValue;
                        handleScannedCode(code);
                    } else {
                        setTimeout(scanFromCamera, 100);
                    }
                })
                .catch(err => {
                    console.error('Barcode detection error:', err);
                    setTimeout(scanFromCamera, 100);
                });
        } else {
            tryZXingScanner(canvas);
        }
    } else {
        setTimeout(scanFromCamera, 100);
    }
}

// Fallback to ZXing scanner (library-based)
function tryZXingScanner(canvas) {
    const resultDiv = document.getElementById('scanResult');
    resultDiv.innerHTML = `
        <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; margin-top: 1rem;">
            <p style="color: #856404;"><strong>Note:</strong> Browser doesn't support native barcode scanning.</p>
            <p style="margin-top: 0.5rem;">Enter product code manually:</p>
            <input type="text" id="manualCodeInput" class="form-control" style="margin-top: 0.5rem;" placeholder="Enter product code">
            <button class="btn btn-primary" onclick="searchByManualCode()" style="margin-top: 0.5rem; width: 100%;">Search Product</button>
        </div>
    `;
    stopScanner();
}

// Handle scanned code
async function handleScannedCode(code) {
    stopScanner();
    const resultDiv = document.getElementById('scanResult');

    resultDiv.innerHTML = `<p style="color: var(--success-color); font-weight: 600;">Code detected: ${code}</p><p style="margin-top: 0.5rem;">Searching product...</p>`;

    const product = await findProductByCode(code);

    if (product) {
        resultDiv.innerHTML = `
            <div style="padding: 1rem; background: #d4edda; border-radius: 8px; color: #155724;">
                <h4>Product Found!</h4>
                <p style="margin-top: 0.5rem;"><strong>${product.name}</strong></p>
                <p>Code: ${product.product_code}</p>
                <p>Price: ${formatCurrency(product.price)}</p>
                <p>Stock: ${product.stock} units</p>
                <button class="btn btn-success" onclick="addToCartFromScanner('${product.id}')" style="margin-top: 1rem; width: 100%;">Add to Cart</button>
                <button class="btn btn-secondary" onclick="closeScanner()" style="margin-top: 0.5rem; width: 100%;">Close</button>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div style="padding: 1rem; background: #f8d7da; border-radius: 8px; color: #721c24;">
                <p><strong>Product not found</strong></p>
                <p style="margin-top: 0.5rem;">Code: ${code}</p>
                <button class="btn btn-primary" onclick="startScanner()" style="margin-top: 1rem; width: 100%;">Scan Again</button>
                <button class="btn btn-secondary" onclick="closeScanner()" style="margin-top: 0.5rem; width: 100%;">Close</button>
            </div>
        `;
    }
}

// Search by manually entered code
async function searchByManualCode() {
    const input = document.getElementById('manualCodeInput');
    const code = input ? input.value.trim() : '';

    if (!code) {
        showNotification('Please enter a product code', 'warning');
        return;
    }

    await handleScannedCode(code);
}

// Find product by code in Supabase
async function findProductByCode(code) {
    try {
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('product_code', code)
            .maybeSingle();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error finding product:', error);
        return null;
    }
}

// Add product to cart from scanner
async function addToCartFromScanner(productId) {
    try {
        const { data: product, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('id', productId)
            .maybeSingle();

        if (error) throw error;

        if (!product) {
            showNotification('Product not found', 'danger');
            return;
        }

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
        closeScanner();
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding product to cart', 'danger');
    }
}

// Generate unique product code
function generateProductCode() {
    const prefix = 'KID';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// Auto-fill product code field
function autoGenerateProductCode() {
    const codeInput = document.getElementById('productCode');
    if (codeInput && !codeInput.value) {
        codeInput.value = generateProductCode();
    }
}

// Generate QR code for product
function generateProductQRCode(productCode) {
    const container = document.getElementById('productQRCode');
    if (!container) return;

    container.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(container, productCode, {
            width: 150,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        }, function (error) {
            if (error) {
                console.error('QR Code generation error:', error);
                container.innerHTML = `<p style="color: var(--danger-color); font-size: 0.8rem;">QR code generation failed</p>`;
            }
        });
    } else {
        container.innerHTML = `<p style="color: #666; font-size: 0.8rem;">QR code library not loaded</p>`;
    }
}
