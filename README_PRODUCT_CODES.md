# Product Code & Scanning Feature

## Overview
Your KID2POCKET application now includes a comprehensive product identification system using unique codes and QR code scanning.

## New Features

### 1. Unique Product Codes
- Every product gets a unique identifier code
- Format: `KID-XXXXX-XXXX` (e.g., `KID-L7X9K-A3B4`)
- Automatically generated or manually entered
- Stored in Supabase database with unique constraint

### 2. QR Code Generation
- Each product code automatically generates a QR code
- QR codes are displayed when adding/editing products
- Can be printed and attached to physical products
- Scannable by any QR code reader

### 3. Barcode/QR Code Scanner
- Built-in camera scanner to identify products
- Click "Scan Product Code" button on Products page
- Point camera at product code or QR code
- Automatically finds and displays product details
- Add scanned products directly to cart

### 4. Manual Code Entry
- Fallback option if camera scanning doesn't work
- Enter product code manually to search
- Works in all browsers

## How It Works

### For Admin (Adding Products):

1. Navigate to Products page
2. Click "Add New Product"
3. Click "Auto Generate" to create a unique code
   - Or enter your own custom code
4. Fill in other product details (name, price, category, etc.)
5. QR code automatically displays as you enter the code
6. Save the product
7. Print the QR code and attach to physical product (optional)

### For Scanning Products:

1. Go to Products page
2. Click "Scan Product Code" button
3. Allow camera access when prompted
4. Hold product's barcode/QR code in front of camera
5. System identifies product automatically
6. Add to cart or view product details

### For Manual Search:

1. If scanner doesn't work, manual entry field appears
2. Type the product code
3. Click "Search Product"
4. Product details display if found

## Database Structure

### Products Table:
- `id` (UUID) - Primary key
- `product_code` (TEXT) - Unique scannable code
- `name` - Product name
- `category` - Product category
- `age_range` - Age range (1-3, 4-6, 7-10, 11-15)
- `price` - Product price
- `stock` - Stock quantity
- `image` - Product image URL
- `description` - Product description
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Security:
- Row Level Security (RLS) enabled
- Public can view products (read-only)
- Only authenticated users can add/edit/delete

## Technical Details

### Scanner Technology:
1. Uses browser's native BarcodeDetector API (Chrome/Edge)
2. Falls back to manual entry for unsupported browsers
3. Camera access required (HTTPS recommended)

### QR Code Generation:
- Uses qrcode.js library
- Generates high-quality QR codes
- Embeds product code in QR format
- Can be printed at any size

### Integration:
- Supabase for database
- Real-time data sync
- Client-side JavaScript
- No server-side code needed

## Browser Support

### Full Support (Camera + Scanning):
- Chrome 83+
- Edge 83+
- Safari 14+ (iOS/macOS)

### Partial Support (Manual Entry Only):
- Firefox (all versions)
- Older browser versions

## Use Cases

1. **Quick Product Lookup**: Scan product to view details
2. **Fast Cart Addition**: Scan and add to cart instantly
3. **Inventory Management**: Easy product identification
4. **Physical Products**: Print QR codes for product tags
5. **Stock Taking**: Scan products to update inventory

## Example Workflow

### Retail Store Scenario:
1. Admin adds products with unique codes
2. Print QR code labels for each product
3. Attach QR codes to physical products
4. At checkout: Scan products to add to bill
5. Process payment
6. Generate invoice

### Online + Offline Integration:
1. Products in database have codes
2. Physical inventory labeled with QR codes
3. Staff can quickly find products by scanning
4. Updates reflect in real-time database
5. Cart syncs across sessions

## Customization

### Product Code Format:
Edit `generateProductCode()` in `scanner.js`:
```javascript
function generateProductCode() {
    const prefix = 'KID';  // Change prefix here
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}
```

### QR Code Styling:
Modify `generateProductQRCode()` in `scanner.js`:
```javascript
QRCode.toCanvas(container, productCode, {
    width: 150,           // Change size
    colorDark: '#000000', // Change color
    colorLight: '#ffffff',// Change background
    correctLevel: QRCode.CorrectLevel.H
});
```

## Troubleshooting

### Scanner Not Working:
1. Check browser compatibility
2. Ensure HTTPS connection
3. Grant camera permissions
4. Use manual entry as fallback

### Product Code Already Exists:
- Each code must be unique
- Click "Auto Generate" for new code
- Or modify existing code

### QR Code Not Displaying:
- Check if qrcode.js is loaded
- View browser console for errors
- Refresh the page

### Camera Permission Denied:
1. Browser settings > Site settings
2. Allow camera access for the site
3. Reload the page

## Future Enhancements

Possible additions:
- Bulk code generation
- Print multiple QR codes at once
- Export codes to CSV
- Barcode format support (EAN, UPC)
- Mobile app integration
- Bluetooth scanner support

## Support

For issues or questions:
1. Check browser console for errors
2. Review SETUP_INSTRUCTIONS.md
3. Verify Supabase connection
4. Test with manual entry first
