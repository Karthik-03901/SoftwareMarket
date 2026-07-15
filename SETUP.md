# 🛠️ SoftMarket Setup Guide

Complete step-by-step guide to set up and run the SoftMarket platform.

## 📋 System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **RAM**: Minimum 4GB
- **Disk Space**: 500MB for dependencies
- **OS**: Windows 10/11, macOS, or Linux

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Node.js
If you don't have Node.js installed:

1. Download from https://nodejs.org/
2. Choose LTS version (recommended)
3. Run installer
4. Verify installation:
```bash
node --version
npm --version
```

### Step 2: Navigate to Project
```bash
cd "c:\software market place\ui"
```

### Step 3: Install Dependencies
```bash
npm install
```

This will install all required packages. It may take 2-3 minutes.

### Step 4: Configure Environment
```bash
copy .env.example .env
```

Open `.env` and update if needed (default values work for development).

### Step 5: Start Development Server
```bash
npm run dev
```

Open your browser and visit: **http://localhost:3000**

🎉 **You're all set!**

---

## 📦 Detailed Installation

### Option 1: Using npm (Recommended)
```bash
# Navigate to project directory
cd "c:\software market place\ui"

# Clean install
npm ci

# Or regular install
npm install

# Start development server
npm run dev
```

### Option 2: Using yarn
```bash
# Install yarn globally
npm install -g yarn

# Install dependencies
yarn install

# Start development server
yarn dev
```

## ⚙️ Configuration

### Environment Variables

Create `.env` file by copying from `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_URL=http://localhost:3000

# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

### Backend Configuration

For local development, ensure your Spring Boot backend is running on port 8080.

To change the backend URL, update `VITE_API_BASE_URL` in `.env`.

## 🏗️ Project Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Backend API running (optional for UI-only development)
- [ ] Development server started (`npm run dev`)
- [ ] Browser opened at http://localhost:3000

## 🔧 Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 🌐 Port Configuration

Default ports:
- **Frontend**: 3000
- **Backend**: 8080

To change frontend port, edit `vite.config.ts`:
```ts
server: {
  port: 3001, // Your custom port
}
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Or change the port in `vite.config.ts`.

### Issue: Environment variables not working
**Solution:**
- Ensure `.env` file is in the project root
- All variables must start with `VITE_`
- Restart dev server after changing `.env`

### Issue: Slow build or dev server
**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear npm cache
npm cache clean --force
```

### Issue: TypeScript errors
**Solution:**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Install missing type definitions
npm install --save-dev @types/node
```

## 📱 Mobile Development Setup

To test on mobile devices on the same network:

1. Find your local IP address:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

2. Update `vite.config.ts`:
```ts
server: {
  host: '0.0.0.0',
  port: 3000,
}
```

3. Access from mobile: `http://YOUR_IP:3000`

## 🚀 Production Deployment

### Build Production Bundle
```bash
npm run build
```

This creates optimized files in the `dist` folder.

### Deploy Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Manual Deployment
1. Build: `npm run build`
2. Upload `dist` folder to your web server
3. Configure server to serve `index.html` for all routes

## 🔐 Security Considerations

### For Development
- Use `.env` for secrets (already in `.gitignore`)
- Never commit API keys or tokens
- Use test/sandbox keys only

### For Production
- Enable HTTPS
- Use environment variables on hosting platform
- Rotate API keys regularly
- Enable rate limiting
- Configure CORS properly

## 📊 Performance Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Optimize images (if adding custom images)
# Use WebP format
# Lazy load images
```

## 🧪 Testing Setup (Future)

To add testing:
```bash
# Install testing libraries
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

## 💬 Support

If you encounter issues:
1. Check this guide
2. Search existing GitHub issues
3. Check browser console for errors
4. Review network tab for API errors

---

**Happy Coding!** 🎉
