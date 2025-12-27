// Purchase History Management

let allPurchases = [];
let filteredPurchases = [];

// Load purchase history
function loadHistory() {
    allPurchases = getItem('purchases') || [];
    // Sort by date (newest first)
    allPurchases.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredPurchases = [...allPurchases];
    renderHistory();
}

// Render history list
function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    if (filteredPurchases.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; padding: 3rem; color: #666;">No purchase history found.</p>';
        return;
    }

    historyList.innerHTML = filteredPurchases.map(purchase => `
        <div class="history-item" onclick="viewInvoice('${purchase.invoiceNumber}')">
            <div class="history-header">
                <div>
                    <span class="history-invoice">${purchase.invoiceNumber}</span>
                    <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">${purchase.customerName}</p>
                </div>
                <div style="text-align: right;">
                    <span class="history-date">${formatDate(purchase.date)}</span>
                    <p style="margin-top: 0.5rem;">
                        <span style="background: ${purchase.paymentMethod === 'online' ? '#3498db' : '#95a5a6'}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">
                            ${purchase.paymentMethod === 'online' ? 'Online' : 'Offline'}
                        </span>
                        <span style="background: ${purchase.paymentStatus === 'completed' ? '#27ae60' : '#f39c12'}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; margin-left: 0.5rem;">
                            ${purchase.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                        </span>
                    </p>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                <div>
                    <p style="color: #666; font-size: 0.9rem;">${purchase.items.length} item(s)</p>
                </div>
                <div class="history-amount">${formatCurrency(purchase.total)}</div>
            </div>
        </div>
    `).join('');
}

// Filter history
function filterHistory() {
    const paymentMethod = document.getElementById('filterPaymentMethod').value;
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    const search = document.getElementById('searchHistory').value.toLowerCase();

    filteredPurchases = allPurchases.filter(purchase => {
        const matchPayment = !paymentMethod || purchase.paymentMethod === paymentMethod;
        const matchStartDate = !startDate || new Date(purchase.date) >= new Date(startDate);
        const matchEndDate = !endDate || new Date(purchase.date) <= new Date(endDate + 'T23:59:59');
        const matchSearch = !search ||
            purchase.invoiceNumber.toLowerCase().includes(search) ||
            purchase.customerName.toLowerCase().includes(search) ||
            purchase.customerPhone.includes(search);
        
        return matchPayment && matchStartDate && matchEndDate && matchSearch;
    });

    renderHistory();
}

// Clear filters
function clearFilters() {
    document.getElementById('filterPaymentMethod').value = '';
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    document.getElementById('searchHistory').value = '';
    filteredPurchases = [...allPurchases];
    renderHistory();
}

// View invoice details
function viewInvoice(invoiceNumber) {
    const purchase = allPurchases.find(p => p.invoiceNumber === invoiceNumber);
    if (!purchase) return;

    const settings = getItem('settings') || { shopName: 'KID2POCKET' };
    
    let html = `
        <div class="invoice-header">
            <h1>${settings.shopName}</h1>
            <p>Kids Clothing Shop (Ages 1-15)</p>
        </div>
        
        <div class="invoice-info">
            <div>
                <h3>Bill To:</h3>
                <p><strong>${purchase.customerName}</strong></p>
                <p>Phone: ${purchase.customerPhone}</p>
            </div>
            <div style="text-align: right;">
                <h3>Invoice Details:</h3>
                <p><strong>Invoice #:</strong> ${purchase.invoiceNumber}</p>
                <p><strong>Date:</strong> ${formatDate(purchase.date)}</p>
                <p><strong>Payment:</strong> ${purchase.paymentMethod === 'online' ? 'Online' : 'Offline (Cash/Hand)'}</p>
                <p><strong>Status:</strong> ${purchase.paymentStatus === 'completed' ? 'Paid' : 'Pending'}</p>
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

    purchase.items.forEach(item => {
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
                <span><strong>${formatCurrency(purchase.total)}</strong></span>
            </div>
        </div>

        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
            <p><strong>Payment Method:</strong> ${purchase.paymentMethod === 'online' ? 'Online Payment (QR Code)' : 'Offline Payment (Cash/Hand)'}</p>
            <p><strong>Payment Status:</strong> ${purchase.paymentStatus === 'completed' ? 'Completed' : 'Pending'}</p>
        </div>

        <div style="margin-top: 2rem; text-align: center; color: #666; font-size: 0.9rem;">
            <p>Thank you for shopping with ${settings.shopName}!</p>
        </div>
    `;

    document.getElementById('invoiceModalContent').innerHTML = html;
    document.getElementById('invoiceModal').style.display = 'flex';
}

// Close invoice modal
function closeInvoiceModal() {
    document.getElementById('invoiceModal').style.display = 'none';
}

// Print invoice from modal
function printInvoiceFromModal() {
    const modalContent = document.getElementById('invoiceModalContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; }
                    .invoice-header { text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 3px solid #ff6b9d; }
                    .invoice-header h1 { color: #ff6b9d; font-size: 2.5rem; margin-bottom: 0.5rem; }
                    .invoice-info { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
                    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background: #ecf0f1; font-weight: 600; }
                    .invoice-total { text-align: right; margin-top: 2rem; }
                    .invoice-total-row { display: flex; justify-content: flex-end; gap: 2rem; margin-bottom: 0.5rem; }
                    .invoice-total-row.total { font-size: 1.5rem; font-weight: bold; color: #27ae60; border-top: 2px solid #ddd; padding-top: 1rem; }
                </style>
            </head>
            <body>
                ${modalContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

