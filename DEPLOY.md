# Quick S3 Deployment Guide

## Step-by-Step Instructions

### 1. Prepare Files

Make sure you have these 3 files:
- `index.html`
- `styles.css`
- `script.js`

### 2. Update API Endpoint

Open `script.js` and change line 2:
```javascript
const API_BASE_URL = 'https://your-actual-domain.com/test';
```

### 3. Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://your-pos-poc-bucket
```

Or use AWS Console:
1. Go to S3
2. Click "Create bucket"
3. Enter bucket name: `your-pos-poc-bucket`
4. Uncheck "Block all public access"
5. Click "Create bucket"

### 4. Enable Static Website Hosting

AWS Console:
1. Select your bucket
2. Go to "Properties" tab
3. Scroll to "Static website hosting"
4. Click "Edit"
5. Enable "Static website hosting"
6. Index document: `index.html`
7. Save changes

### 5. Upload Files

```bash
# Using AWS CLI
aws s3 cp index.html s3://your-pos-poc-bucket/
aws s3 cp styles.css s3://your-pos-poc-bucket/
aws s3 cp script.js s3://your-pos-poc-bucket/
```

Or use AWS Console:
1. Select your bucket
2. Click "Upload"
3. Drag and drop all 3 files
4. Click "Upload"

### 6. Set Bucket Policy

AWS Console:
1. Select your bucket
2. Go to "Permissions" tab
3. Scroll to "Bucket policy"
4. Click "Edit"
5. Paste this policy (replace `your-pos-poc-bucket`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-pos-poc-bucket/*"
    }
  ]
}
```

6. Save changes

### 7. Access Your Website

Your website URL will be:
```
http://your-pos-poc-bucket.s3-website-us-east-1.amazonaws.com
```

Replace `us-east-1` with your bucket's region.

Find the exact URL in:
- Bucket → Properties → Static website hosting → Bucket website endpoint

## Optional: CloudFront CDN

For better performance and HTTPS:

1. Create CloudFront distribution
2. Origin domain: Your S3 website endpoint
3. Wait for deployment (~15 minutes)
4. Access via CloudFront URL

## Optional: Custom Domain

1. Register domain in Route 53
2. Create CloudFront distribution
3. Add alternate domain name (CNAME)
4. Request SSL certificate in ACM
5. Create Route 53 record pointing to CloudFront

## Troubleshooting

### 403 Forbidden Error
- Check bucket policy is applied
- Verify "Block public access" is OFF
- Ensure files are uploaded

### CORS Error
- Add CORS configuration to S3 bucket
- Or ensure API has proper CORS headers

### Files Not Updating
- Clear browser cache
- Or add version query: `?v=2` to file URLs

## Testing Before Deploy

Test locally first:
```bash
python3 -m http.server 8080
```

Visit: `http://localhost:8080`

## Cost Estimate

S3 hosting is very cheap:
- Storage: ~$0.023 per GB/month
- Requests: ~$0.0004 per 1,000 requests
- Data transfer: First 1 GB free

For a small POC: **< $1/month**