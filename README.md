# POS POC - Point of Sale Proof of Concept

Simple static website for displaying orders from an API endpoint. Optimized for S3 hosting.

## Features

- **Order Numbers List**: Left sidebar shows order numbers only
- **Order Details**: Right panel displays full order details with images
- **Add to Order**: CTA button to add selected order
- **Auto-Refresh**: Refreshes orders every 30 seconds
- **Responsive**: Works on all devices

## Files

```
pos-poc/
├── index.html      # Main HTML (simple structure)
├── styles.css      # All styling (minimal)
├── script.js       # JavaScript logic
└── README.md       # This file
```

## Setup for S3

### 1. Update API Endpoint

Edit `script.js` line 2:
```javascript
const API_BASE_URL = 'https://your-domain.com/test';
```

### 2. Upload to S3

1. Create an S3 bucket
2. Enable static website hosting
3. Upload all files (index.html, styles.css, script.js)
4. Set bucket policy for public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

5. Access via: `http://your-bucket-name.s3-website-region.amazonaws.com`

### 3. Enable CORS (if API is on different domain)

Add CORS configuration to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

## API Response Format

**GET /orders** should return:
```json
[
  {
    "id": 1,
    "0": [
      {
        "name": "Product Name",
        "image": "https://example.com/image.jpg",
        "total": 99.99
      }
    ]
  }
]
```

## Testing Locally

### Option 1: Mock Data (Default)
The app uses mock data by default. Just open `index.html` in a browser.

### Option 2: Use Real API
Edit `script.js` line 16:
```javascript
const useMock = false; // Change to false
```

### Option 3: Local Server
```bash
python3 -m http.server 8080
# Visit: http://localhost:8080
```

## Customization

### Change Colors
Edit `styles.css`:
- Header/Footer: `#2c3e50`
- Selected Order: `#3498db`
- Add Button: `#27ae60`

### Modify Add to Order Action
Edit `addToOrder()` function in `script.js` to POST to your endpoint.

## Browser Support

- Chrome ✓
- Firefox ✓
- Safari ✓
- Edge ✓

## Notes

- All files are standalone (no external dependencies)
- Images have fallback placeholders
- Mobile responsive
- Simple enough for S3 static hosting
- No build process required