// Payment Processing and QR Code Generation

// Generate QR code for payment
function generatePaymentQRCode(amount, invoiceNumber) {
    const qrcodeContainer = document.getElementById('qrcode');
    if (!qrcodeContainer) return;

    // Clear previous QR code
    qrcodeContainer.innerHTML = '';

    // Create payment data string
    // Using UPI payment format with the actual UPI ID
    // UPI ID: maffinishfranklin@okicici
    const paymentData = `upi://pay?pa=maffinishfranklin@okicici&pn=maffinish%20franklin&am=${amount.toFixed(2)}&cu=INR&tn=KID2POCKET-${invoiceNumber}`;

    // Generate QR code using qrcode.js library
    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(qrcodeContainer, paymentData, {
            width: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        }, function (error) {
            if (error) {
                console.error('QR Code generation error:', error);
                qrcodeContainer.innerHTML = `
                    <div style="padding: 2rem; background: white; border-radius: 10px;">
                        <p style="color: var(--danger-color);">Error generating QR code</p>
                        <p style="margin-top: 1rem; color: #666;">Payment Details:</p>
                        <p><strong>Amount:</strong> ${formatCurrency(amount)}</p>
                        <p><strong>Invoice:</strong> ${invoiceNumber}</p>
                        <p style="margin-top: 1rem; word-break: break-all; font-size: 0.9rem;"><strong>Payment Link:</strong> ${paymentData}</p>
                    </div>
                `;
            }
        });
    } else {
        // Fallback if QRCode library not loaded
        qrcodeContainer.innerHTML = `
            <div style="padding: 2rem; background: white; border-radius: 10px;">
                <p style="color: var(--warning-color);">QR Code library not loaded</p>
                <p style="margin-top: 1rem; color: #666;">Payment Details:</p>
                <p><strong>Amount:</strong> ${formatCurrency(amount)}</p>
                <p><strong>Invoice:</strong> ${invoiceNumber}</p>
                <p style="margin-top: 1rem; word-break: break-all; font-size: 0.9rem;"><strong>Payment Link:</strong> ${paymentData}</p>
            </div>
        `;
    }
}

// Process online payment (called when QR code is scanned/payment confirmed)
function processOnlinePayment(invoiceData) {
    // In a real implementation, this would:
    // 1. Send payment request to payment gateway
    // 2. Wait for payment confirmation
    // 3. Verify payment status via webhook/callback
    // 4. Update invoice status
    
    // For demo purposes, we'll simulate payment processing
    return new Promise((resolve) => {
        // Simulate payment processing delay
        setTimeout(() => {
            invoiceData.paymentStatus = 'completed';
            resolve(invoiceData);
        }, 1000);
    });
}

// Process offline payment
function processOfflinePayment(invoiceData) {
    invoiceData.paymentMethod = 'offline';
    invoiceData.paymentStatus = 'completed';
    return invoiceData;
}

// Verify payment status (would be called from payment gateway callback in real app)
function verifyPaymentStatus(invoiceNumber) {
    const purchases = getItem('purchases') || [];
    const purchase = purchases.find(p => p.invoiceNumber === invoiceNumber);
    
    if (purchase) {
        return purchase.paymentStatus === 'completed';
    }
    
    return false;
}

