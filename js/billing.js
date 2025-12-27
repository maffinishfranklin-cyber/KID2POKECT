// Billing and Invoice Generation

let selectedPaymentMethod = null;
let currentInvoice = null;

// Load billing page
function loadBillingPage() {
    const cart = getItem('cart') || [];
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const billingContent = document.getElementById('billingContent');

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        billingContent.style.display = 'none';
        return;
    }

    emptyCartMessage.style.display = 'none';
    billingContent.style.display = 'block';
    renderOrderSummary();
}

// Render order summary
function renderOrderSummary() {
    const cart = getItem('cart') || [];
    const orderSummary = document.getElementById('orderSummary');

    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>No items in cart</p>';
        return;
    }

    let html = '<table class="invoice-table">';
    html += '<thead><tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr></thead>';
    html += '<tbody>';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(itemTotal)}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';

    // Calculate total directly
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    html += `
        <div style="margin-top: 1rem; text-align: right;">
            <p style="font-size: 1.8rem; font-weight: bold; color: var(--success-color); margin-top: 1rem; padding-top: 1rem; border-top: 3px solid var(--border-color);">
                Total Amount: ${formatCurrency(totalAmount)}
            </p>
        </div>
    `;

    orderSummary.innerHTML = html;
}

// Select payment method
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    const onlineOption = document.querySelector('#paymentOnline').closest('.payment-option');
    const offlineOption = document.querySelector('#paymentOffline').closest('.payment-option');
    const qrContainer = document.getElementById('qrCodeContainer');

    // Update UI
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    
    if (method === 'online') {
        onlineOption.classList.add('selected');
        document.getElementById('paymentOnline').checked = true;
    } else {
        offlineOption.classList.add('selected');
        document.getElementById('paymentOffline').checked = true;
        qrContainer.style.display = 'none';
    }
}

// Process billing
function processBilling() {
    // Validate customer form
    const customerForm = document.getElementById('customerForm');
    if (!customerForm.checkValidity()) {
        customerForm.reportValidity();
        return;
    }

    if (!selectedPaymentMethod) {
        showNotification('Please select a payment method', 'warning');
        return;
    }

    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;

    // Validate phone
    if (!validatePhone(customerPhone)) {
        showNotification('Please enter a valid 10-digit phone number', 'warning');
        return;
    }

    const cart = getItem('cart') || [];
    if (cart.length === 0) {
        showNotification('Cart is empty!', 'warning');
        return;
    }

    // Calculate total directly from cart
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const invoiceNumber = generateInvoiceNumber();

    // Handle payment method
    if (selectedPaymentMethod === 'online') {
        // Show QR code
        generatePaymentQRCode(totalAmount, invoiceNumber);
        document.getElementById('qrCodeContainer').style.display = 'block';
        
        // Store pending invoice data
        currentInvoice = {
            invoiceNumber,
            customerName,
            customerPhone,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            subtotal: totalAmount,
            total: totalAmount,
            paymentMethod: 'online',
            paymentStatus: 'pending',
            date: new Date().toISOString()
        };
    } else {
        // Offline payment - generate invoice directly
        generateInvoice({
            invoiceNumber,
            customerName,
            customerPhone,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            subtotal: totalAmount,
            total: totalAmount,
            paymentMethod: 'offline',
            paymentStatus: 'completed',
            date: new Date().toISOString()
        });
    }
}

// Confirm payment (for online payments)
function confirmPayment() {
    if (!currentInvoice) {
        showNotification('No pending payment found', 'warning');
        return;
    }

    currentInvoice.paymentStatus = 'completed';
    generateInvoice(currentInvoice);
    
    // Send invoice to customer via WhatsApp/SMS
    sendInvoiceToCustomer(currentInvoice.customerPhone, currentInvoice);
}

// Generate invoice
function generateInvoice(invoiceData) {
    const settings = getItem('settings') || { shopName: 'KID2POCKET' };
    
    let html = `
        <div class="invoice-header">
            <h1>${settings.shopName}</h1>
            <p>Kids Clothing Shop (Ages 1-15)</p>
        </div>
        
        <div class="invoice-info">
            <div>
                <h3>Bill To:</h3>
                <p><strong>${invoiceData.customerName}</strong></p>
                <p>Phone: ${invoiceData.customerPhone}</p>
            </div>
            <div style="text-align: right;">
                <h3>Invoice Details:</h3>
                <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
                <p><strong>Date:</strong> ${formatDate(invoiceData.date)}</p>
                <p><strong>Payment:</strong> ${invoiceData.paymentMethod === 'online' ? 'Online' : 'Offline (Cash/Hand)'}</p>
                <p><strong>Status:</strong> ${invoiceData.paymentStatus === 'completed' ? 'Paid' : 'Pending'}</p>
            </div>
        </div>

        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    invoiceData.items.forEach(item => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(item.total)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>

        <div class="invoice-total">
            <div class="invoice-total-row total" style="font-size: 1.8rem; border-top: 3px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;">
                <span><strong>Total Amount:</strong></span>
                <span><strong>${formatCurrency(invoiceData.total)}</strong></span>
            </div>
        </div>

        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
            <p><strong>Payment Method:</strong> ${invoiceData.paymentMethod === 'online' ? 'Online Payment (QR Code)' : 'Offline Payment (Cash/Hand)'}</p>
            <p><strong>Payment Status:</strong> ${invoiceData.paymentStatus === 'completed' ? 'Completed' : 'Pending'}</p>
        </div>

        <div style="margin-top: 2rem; text-align: center; color: #666; font-size: 0.9rem;">
            <p>Thank you for shopping with ${settings.shopName}!</p>
        </div>
    `;

    document.getElementById('invoice').innerHTML = html;
    
    // Hide billing form, show invoice
    document.getElementById('billingFormCard').style.display = 'none';
    document.getElementById('invoiceContainer').style.display = 'block';

    // Save purchase to history
    savePurchase(invoiceData);

    // Send invoice to customer via WhatsApp/SMS after payment completion
    if (invoiceData.paymentStatus === 'completed') {
        // Small delay to ensure invoice is displayed first
        setTimeout(() => {
            sendInvoiceToCustomer(invoiceData.customerPhone, invoiceData);
        }, 500);
    }

    // Clear cart
    clearCart();
    updateCartBadge();

    // Scroll to invoice
    document.getElementById('invoiceContainer').scrollIntoView({ behavior: 'smooth' });
}

// Save purchase to history
function savePurchase(invoiceData) {
    let purchases = getItem('purchases') || [];
    purchases.push(invoiceData);
    setItem('purchases', purchases);
    showNotification('Invoice generated and saved!', 'success');
}

// Download PDF
function downloadPDF() {
    const invoiceContent = document.getElementById('invoice').innerHTML;
    const printWindow = window.open('', '_blank');
    const settings = getItem('settings') || { shopName: 'KID2POCKET' };
    const invoiceNumber = document.querySelector('.invoice-info p strong')?.textContent.replace('Invoice #:', '').trim() || 'INV-' + Date.now();
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Invoice-${invoiceNumber}</title>
                <style>
                    @media print {
                        @page { margin: 0.5cm; }
                    }
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 2rem; 
                        margin: 0;
                        color: #2c3e50;
                    }
                    .invoice-header { 
                        text-align: center; 
                        margin-bottom: 2rem; 
                        padding-bottom: 2rem; 
                        border-bottom: 3px solid #ff6b9d; 
                    }
                    .invoice-header h1 { 
                        color: #ff6b9d; 
                        font-size: 2.5rem; 
                        margin-bottom: 0.5rem; 
                    }
                    .invoice-info { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 2rem; 
                        margin-bottom: 2rem; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 2rem; 
                    }
                    th, td { 
                        padding: 1rem; 
                        text-align: left; 
                        border-bottom: 1px solid #ddd; 
                    }
                    th { 
                        background: #ecf0f1; 
                        font-weight: 600; 
                    }
                    .invoice-total { 
                        text-align: right; 
                        margin-top: 2rem; 
                    }
                    .invoice-total-row { 
                        display: flex; 
                        justify-content: flex-end; 
                        gap: 2rem; 
                        margin-bottom: 0.5rem; 
                    }
                    .invoice-total-row.total { 
                        font-size: 1.8rem; 
                        font-weight: bold; 
                        color: #27ae60; 
                        border-top: 3px solid #ddd; 
                        padding-top: 1rem; 
                        margin-top: 1rem;
                    }
                    h3 { margin-bottom: 0.5rem; }
                </style>
            </head>
            <body>
                ${invoiceContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print/download
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Back to billing
function backToBilling() {
    document.getElementById('billingFormCard').style.display = 'block';
    document.getElementById('invoiceContainer').style.display = 'none';
    document.getElementById('customerForm').reset();
    selectedPaymentMethod = null;
    currentInvoice = null;
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById('qrCodeContainer').style.display = 'none';
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => radio.checked = false);
    loadBillingPage();
}

