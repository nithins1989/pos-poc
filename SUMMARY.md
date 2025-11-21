# POS POC - Summary

## What's Included

### Files (3 total - S3 ready)
1. **index.html** - Main page structure
2. **styles.css** - All styling
3. **script.js** - Logic and API calls

### Features
✅ Left sidebar: Order numbers only  
✅ Right panel: Full order details with images  
✅ "Add to Order" CTA button  
✅ Auto-refresh every 30 seconds  
✅ Mock data enabled for testing  
✅ Responsive design  
✅ No dependencies  

## Layout

```
┌─────────────────────────────────────┐
│         POS POC (Header)            │
├──────────┬──────────────────────────┤
│ Orders   │  Order Details           │
│          │                          │
│ Order #1 │  Order ID: 1             │
│ Order #2 │  Total Items: 2          │
│          │                          │
│          │  [Product Images]        │
│          │  Product Name 02         │
│          │  Price: $99.99           │
│          │                          │
│          │  Product Name 03         │
│          │  Price: $999.99          │
│          │                          │
│          │  Total: $1,099.98        │
│          │                          │
│          │  [Add to Order Button]   │
└──────────┴──────────────────────────┘
│         Footer                      │
└─────────────────────────────────────┘
```

## API Structure

**Endpoint:** `https://X/test/orders`

**Response:**
```json
[
  {
    "id": 1,
    "0": [
      {
        "name": "Product Name 01",
        "image": "https://example.com/image.jpg",
        "total": 99.99
      }
    ]
  },
  {
    "id": 2,
    "0": [
      {
        "name": "Product Name 02",
        "image": "https://example.com/image.jpg",
        "total": 99.99
      },
      {
        "name": "Product Name 03",
        "image": "https://example.com/image.jpg",
        "total": 999.99
      }
    ]
  }
]
```

## Quick Start

### 1. Test Locally (Mock Data)
```bash
# Just open index.html in browser
# OR
python3 -m http.server 8080
```

### 2. Connect to Real API
Edit `script.js`:
```javascript
const API_BASE_URL = 'https://your-domain.com/test';
const useMock = false; // Line 16
```

### 3. Deploy to S3
```bash
# Upload files
aws s3 cp index.html s3://your-bucket/
aws s3 cp styles.css s3://your-bucket/
aws s3 cp script.js s3://your-bucket/

# Enable static hosting
# Set bucket policy for public access
```

See `DEPLOY.md` for detailed instructions.

## Customization Points

### Change API Endpoint
`script.js` - Line 2

### Enable/Disable Mock Data
`script.js` - Line 16

### Modify Add to Order Action
`script.js` - `addToOrder()` function (Line 175)

### Change Colors
`styles.css` - Search for color codes

### Adjust Auto-Refresh Interval
`script.js` - Line 21 (currently 30000ms = 30 seconds)

## File Sizes (Optimized for S3)

- index.html: ~2 KB
- styles.css: ~4 KB
- script.js: ~6 KB

**Total: ~12 KB** (very lightweight!)

## Browser Compatibility

✅ Chrome  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile browsers  

## Next Steps

1. ✅ Files are ready
2. ⏳ Update API endpoint in script.js
3. ⏳ Test locally
4. ⏳ Deploy to S3
5. ⏳ Configure "Add to Order" POST endpoint

## Support

- See `README.md` for full documentation
- See `DEPLOY.md` for S3 deployment guide
- Mock data is enabled by default for testing