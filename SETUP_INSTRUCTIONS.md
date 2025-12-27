# KID2POCKET Setup Instructions

## Features Added
1. Unique product codes for each product
2. QR code generation for products
3. Barcode/QR code scanner to identify products
4. Supabase database integration for data persistence

## Setup Steps

### 1. Supabase Configuration
The Supabase database is already set up with the products table. You need to configure the connection:

1. The `.env` file should contain your Supabase credentials:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

2. Update `/js/supabase-client.js` with actual environment variables if needed

### 2. Database Schema
The products table includes:
- `id` - Unique product identifier (UUID)
- `product_code` - Unique scannable code (text, unique index)
- `name` - Product name
- `category` - Product category
- `age_range` - Age range (1-3, 4-6, 7-10, 11-15)
- `price` - Product price
- `stock` - Stock quantity
- `image` - Product image URL
- `description` - Product description
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### 3. How to Use

#### Adding Products:
1. Go to Products page
2. Click "Add New Product"
3. Fill in product details
4. Use "Auto Generate" button to create a unique product code
5. The system will automatically generate a QR code for the product
6. Save the product

#### Scanning Products:
1. Click "Scan Product Code" button on Products page
2. Allow camera access when prompted
3. Point camera at the product's barcode or QR code
4. The system will automatically identify the product
5. You can add the product directly to cart from the scanner

#### Manual Code Entry:
If the scanner doesn't work (browser compatibility):
- Enter the product code manually in the text field
- Click "Search Product" to find the product

### 4. Browser Compatibility

#### Scanner Requirements:
- **Chrome/Edge**: Full support for camera and barcode scanning
- **Safari**: Requires iOS 14+ or macOS Big Sur+
- **Firefox**: Limited barcode detection support (manual entry recommended)

#### Fallback:
If browser doesn't support native barcode scanning, the system will prompt for manual code entry.

### 5. Product Code Format
- Format: `KID-XXXXX-XXXX`
- Example: `KID-L7X9K-A3B4`
- Unique for each product
- Can be scanned as QR code or barcode

### 6. Security
- Row Level Security (RLS) enabled on products table
- Public can read products (for browsing)
- Only authenticated users can add/edit/delete products

## Troubleshooting

### Scanner Not Working:
1. Check camera permissions in browser settings
2. Try using manual code entry
3. Ensure using HTTPS (required for camera access)
4. Try a different browser

### Database Connection Issues:
1. Verify Supabase credentials in `.env`
2. Check if `supabase-client.js` is properly loaded
3. Open browser console for error messages

### Product Code Already Exists:
- Each product code must be unique
- Use "Auto Generate" to create a new unique code
- Or modify the code manually

## Running the Application

1. Start the Python server:
   ```
   python -m http.server 8000
   ```
   OR double-click `START_SERVER.bat`

2. Open Chrome browser

3. Navigate to:
   ```
   http://localhost:8000/index.html
   ```

4. Start managing products with unique codes and scanning!
