# 🚀 Deployment Guide - SoftMarket

Complete guide for deploying the SoftMarket frontend to production.

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Production API endpoints ready
- [ ] Build passes without errors
- [ ] Lighthouse score > 90
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Cross-browser testing complete
- [ ] Security headers configured

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Zero-configuration deployment
- Automatic HTTPS
- Global CDN
- Instant rollbacks
- Preview deployments for pull requests
- Perfect for React/Vite projects

#### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
# From project root
cd "c:\software market place\ui"

# Deploy to production
vercel --prod
```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env`:
     ```
     VITE_API_BASE_URL=https://api.yourdomain.com/api
     VITE_SUPABASE_URL=your_production_url
     VITE_SUPABASE_ANON_KEY=your_production_key
     VITE_RAZORPAY_KEY_ID=your_production_key
     ```

5. **Custom Domain** (Optional)
   - Go to Domains tab
   - Add your custom domain
   - Update DNS records as instructed

**Automatic Deployments:**
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Preview deployment

---

### Option 2: Netlify

#### Steps:

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Initialize**
```bash
cd "c:\software market place\ui"
netlify init
```

4. **Deploy**
```bash
npm run build
netlify deploy --prod --dir=dist
```

5. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables in Netlify Dashboard

**Redirect Rules** (create `public/_redirects`):
```
/* /index.html 200
```

---

### Option 3: AWS S3 + CloudFront

#### Steps:

1. **Build Production Bundle**
```bash
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://softmarket-frontend
```

3. **Configure Bucket for Static Hosting**
```bash
aws s3 website s3://softmarket-frontend --index-document index.html --error-document index.html
```

4. **Upload Files**
```bash
aws s3 sync dist/ s3://softmarket-frontend --delete
```

5. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: index.html
   - Error Pages: 404 → /index.html (200)

6. **Update DNS**
   - Point your domain to CloudFront distribution

---

### Option 4: Docker + Any Cloud Provider

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

#### Build and Deploy
```bash
# Build image
docker build -t softmarket-frontend .

# Run locally
docker run -p 80:80 softmarket-frontend

# Push to registry
docker tag softmarket-frontend yourusername/softmarket-frontend:latest
docker push yourusername/softmarket-frontend:latest

# Deploy to cloud (example: AWS ECS, Google Cloud Run, etc.)
```

---

## ⚙️ Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_URL=https://yourdomain.com
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=true
```

### Security Considerations

1. **Never commit `.env` files**
2. **Use production Razorpay keys** (not test keys)
3. **Enable CORS** on backend for your domain only
4. **Use HTTPS** everywhere
5. **Implement rate limiting** on API
6. **Set up security headers**

---

## 🔒 Security Headers

Add to your hosting platform:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.yourdomain.com https://*.supabase.co;
```

---

## 📊 Performance Optimization

### Before Deployment:

1. **Analyze Bundle Size**
```bash
npm run build
npx vite-bundle-visualizer
```

2. **Optimize Images**
   - Use WebP format
   - Compress images
   - Use responsive images

3. **Code Splitting**
   - Already handled by Vite
   - Verify with build output

4. **Lazy Loading**
```tsx
// Example
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
```

### Performance Checklist:
- [ ] Bundle size < 200KB gzipped
- [ ] Images optimized
- [ ] Fonts preloaded
- [ ] Code splitting enabled
- [ ] Tree shaking working
- [ ] Minification enabled
- [ ] Compression (gzip/brotli) enabled

---

## 🧪 Pre-Deployment Testing

### Build Test
```bash
npm run build
npm run preview
```

Access at `http://localhost:4173` and test:
- [ ] All routes work
- [ ] API calls successful
- [ ] Authentication flow
- [ ] Payment flow
- [ ] Image loading
- [ ] Responsive design

### Cross-Browser Testing
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### Lighthouse Audit
```bash
npx lighthouse http://localhost:4173 --view
```

Target scores:
- Performance: > 90
- Accessibility: 100
- Best Practices: > 90
- SEO: > 90

---

## 📱 Mobile App (Future)

For future mobile app deployment:

1. **React Native** or **Capacitor**
2. Deploy to:
   - Apple App Store
   - Google Play Store
3. Use same API endpoints
4. Consider offline capabilities

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_RAZORPAY_KEY_ID: ${{ secrets.VITE_RAZORPAY_KEY_ID }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📈 Monitoring & Analytics

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/react
```

### 2. Analytics (Google Analytics)
```bash
npm install react-ga4
```

### 3. Performance Monitoring
- Vercel Analytics (built-in)
- Google Lighthouse CI
- Web Vitals tracking

---

## 🆘 Rollback Procedure

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Manual Rollback
1. Keep previous build in `dist-backup`
2. Re-deploy previous version
3. Revert environment variables if needed

---

## 📝 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] SSL certificate active
- [ ] All environment variables set
- [ ] API endpoints responding
- [ ] Authentication works
- [ ] Payment gateway functional
- [ ] Email notifications working
- [ ] Images loading from CDN
- [ ] Error tracking configured
- [ ] Analytics tracking data
- [ ] Performance metrics acceptable
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Social media cards working

---

## 🔧 Troubleshooting

### Issue: Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Issue: Environment Variables Not Working
- Ensure variables start with `VITE_`
- Check they're set in hosting platform
- Rebuild after changing variables

### Issue: 404 on Routes
- Ensure SPA redirect rules configured
- Check `_redirects` or equivalent

### Issue: API CORS Errors
- Update backend CORS to allow production domain
- Check API URL in environment variables

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com/
- **AWS S3 Hosting**: https://docs.aws.amazon.com/s3/
- **Docker Docs**: https://docs.docker.com/

---

**Happy Deploying!** 🚀
