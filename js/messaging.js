// WhatsApp and SMS Messaging Functionality

// Send invoice via WhatsApp or SMS
function sendInvoiceToCustomer(customerPhone, invoiceData) {
    const phone = customerPhone.replace(/\D/g, ''); // Remove non-digits
    const settings = getItem('settings') || { shopName: 'KID2POCKET' };
    
    // Format invoice message
    let message = `*Invoice from ${settings.shopName}*\n\n`;
    message += `Invoice #: ${invoiceData.invoiceNumber}\n`;
    message += `Date: ${formatDate(invoiceData.date)}\n`;
    message += `Customer: ${invoiceData.customerName}\n`;
    message += `Phone: ${invoiceData.customerPhone}\n\n`;
    message += `*Items:*\n`;
    
    invoiceData.items.forEach(item => {
        message += `${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Total Amount: ₹${invoiceData.total.toFixed(2)}*\n`;
    message += `Payment Method: ${invoiceData.paymentMethod === 'online' ? 'Online Payment' : 'Offline Payment'}\n`;
    message += `Payment Status: ${invoiceData.paymentStatus === 'completed' ? 'Paid' : 'Pending'}\n\n`;
    message += `Thank you for shopping with ${settings.shopName}!`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Try WhatsApp first (works if user has WhatsApp installed)
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    // Create a link to open WhatsApp
    const whatsappLink = document.createElement('a');
    whatsappLink.href = whatsappUrl;
    whatsappLink.target = '_blank';
    whatsappLink.click();
    
    // Show notification that WhatsApp is opening
    showNotification('Opening WhatsApp to send invoice...', 'info');
    
    // Provide SMS fallback option after a delay
    setTimeout(() => {
        const useSMS = confirm('If WhatsApp did not open, would you like to send via SMS/Text Message instead?');
        if (useSMS) {
            sendViaSMS(phone, message);
        }
    }, 2000);
}

// Send invoice via WhatsApp Web/Desktop
function sendViaWhatsApp(phone, message) {
    const phoneClean = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Send invoice via SMS (opens default SMS app)
function sendViaSMS(phone, message) {
    const phoneClean = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const smsUrl = `sms:${phoneClean}?body=${encodedMessage}`;
    window.location.href = smsUrl;
}

