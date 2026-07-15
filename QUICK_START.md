# ⚡ Quick Start Guide - SoftMarket

Get your SoftMarket platform running in **under 5 minutes**!

## 🎯 What You'll Get

After following this guide, you'll have:
- ✅ A fully functional enterprise-level UI running locally
- ✅ Beautiful glassy design with smooth animations
- ✅ Complete authentication flow
- ✅ Marketplace, dashboards, and all pages
- ✅ Ready for backend integration

---

## 📋 Prerequisites (1 minute)

### Do you have Node.js installed?

Check by running:
```bash
node --version
```

**If you see a version number (v18.0.0 or higher)**: ✅ Skip to Step 1

**If you see an error**: Download and install Node.js:
1. Go to https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. Restart your terminal

---

## 🚀 Installation Steps

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter

**Or:**
- Right-click the project folder
- Select "Open in Terminal"

### Step 2: Navigate to Project

```bash
cd "c:\software market place\ui"
```

### Step 3: Install Dependencies (2-3 minutes)

```bash
npm install
```

Wait for the installation to complete. You'll see a progress bar.

### Step 4: Start the Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.3.1  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Open your web browser and visit:
```
http://localhost:3000
```

**🎉 Congratulations! You're now running SoftMarket!**

---

## 🎨 What You'll See

### Homepage
- Beautiful hero section with gradient backgrounds
- Animated search bar
- Category cards
- Featured products
- Trust badges and statistics

### Try These Pages

1. **Homepage**: http://localhost:3000/
2. **Marketplace**: http://localhost:3000/marketplace
3. **Login**: http://localhost:3000/login
4. **Register**: http://localhost:3000/register

---

## 🔧 Common Issues & Quick Fixes

### Issue: "Port 3000 already in use"

**Fix:** Stop the process using port 3000:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

**Or change the port** in `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change to 3001 or any other port
}
```

### Issue: "Cannot find module" errors

**Fix:**
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue: Terminal shows errors about missing packages

**Fix:**
```bash
npm install --legacy-peer-deps
```

### Issue: Browser shows blank page

**Fix:**
1. Check browser console (F12) for errors
2. Ensure dev server is running
3. Try clearing browser cache (Ctrl + Shift + Delete)
4. Restart dev server (Ctrl + C, then `npm run dev`)

---

## 📂 Project Structure Overview

```
ui/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # All page components
│   ├── layouts/      # Layout wrappers
│   ├── lib/          # Utilities and API
│   └── stores/       # State management
├── public/           # Static assets
└── Configuration files
```

---

## 🎮 What to Do Next

### For Development:

1. **Explore the UI**
   - Navigate through all pages
   - Test responsive design (resize browser)
   - Try the authentication pages

2. **Make Changes**
   - Edit any `.tsx` file in `src/`
   - Changes appear instantly (hot reload)

3. **Add New Features**
   - Create new components in `src/components/`
   - Add new pages in `src/pages/`
   - Update routes in `src/App.tsx`

### For Production:

1. **Read Documentation**
   - `README.md` - Complete overview
   - `SETUP.md` - Detailed setup guide
   - `DEPLOYMENT.md` - Deploy to production
   - `PROJECT_OVERVIEW.md` - Architecture details

2. **Connect Backend**
   - Update `.env` with your API URL
   - Backend should run on port 8080
   - Or update `VITE_API_BASE_URL` in `.env`

3. **Deploy**
   - See `DEPLOYMENT.md` for deployment options
   - Recommended: Vercel (easiest)

---

## 💡 Development Tips

### Hot Reload
- Save any file → Browser updates automatically
- No need to refresh manually

### Dev Tools
- Press `F12` to open browser developer tools
- Check Console tab for errors
- Check Network tab for API calls

### Stop the Server
- Press `Ctrl + C` in terminal
- Or close the terminal window

### Restart the Server
```bash
npm run dev
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#YOUR_COLOR', // Your brand color
  }
}
```

### Change Logo

Edit `src/layouts/MainLayout.tsx`:
```tsx
<span className="text-2xl font-display font-bold">
  YourBrand  {/* Change this */}
</span>
```

### Change Homepage Content

Edit `src/pages/HomePage.tsx`

---

## 📊 Performance

The dev server is fast because:
- ⚡ Vite uses esbuild (10-100x faster than webpack)
- 🔥 Hot Module Replacement (HMR)
- 📦 Optimized dependencies pre-bundling

For production build:
```bash
npm run build
```

This creates optimized files in the `dist/` folder.

---

## 🆘 Need Help?

### Documentation Files
- `README.md` - Main documentation
- `SETUP.md` - Detailed installation
- `DEPLOYMENT.md` - Production deployment
- `PROJECT_OVERVIEW.md` - Architecture

### Check These:
1. Browser console (F12) for errors
2. Terminal output for server errors
3. Network tab (F12) for failed API calls

### Common Solutions:
```bash
# Clean install
npm ci

# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Verification Checklist

After starting the server, verify:

- [ ] Terminal shows "VITE ready"
- [ ] No error messages in terminal
- [ ] Browser opens http://localhost:3000
- [ ] Homepage loads with animations
- [ ] Can navigate to other pages
- [ ] No console errors (F12 → Console)
- [ ] Images load correctly
- [ ] Responsive (resize browser window)

---

## 🎯 Next Steps

### Learning Path:

1. **Explore the Code**
   - Start with `src/App.tsx` (routing)
   - Look at `src/pages/HomePage.tsx` (main page)
   - Check `src/components/ui/` (UI components)

2. **Understand State**
   - Open `src/stores/useAuthStore.ts`
   - See how authentication state is managed

3. **Learn API Integration**
   - Check `src/lib/api.ts`
   - Understand how API calls are made

4. **Customize Design**
   - Edit `tailwind.config.js` (colors, spacing)
   - Modify `src/index.css` (global styles)

### Building Features:

5. **Add a New Page**
   ```tsx
   // src/pages/MyNewPage.tsx
   const MyNewPage = () => {
     return <div>My content</div>
   }
   export default MyNewPage
   ```

6. **Add Route**
   ```tsx
   // src/App.tsx
   <Route path="/my-page" element={<MyNewPage />} />
   ```

7. **Use Components**
   ```tsx
   import Button from '@/components/ui/Button'
   import Card from '@/components/ui/Card'
   ```

---

## 🚀 Advanced Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Check code quality
npx tsc --noEmit       # Check TypeScript errors

# Package Management
npm install [package]   # Install new package
npm update             # Update all packages
npm outdated           # Check outdated packages
```

---

## 📱 Mobile Testing

To test on your phone:

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Look for "IPv4 Address"
   ```

2. Update `vite.config.ts`:
   ```typescript
   server: {
     host: '0.0.0.0',
     port: 3000,
   }
   ```

3. Restart server:
   ```bash
   npm run dev
   ```

4. On your phone, open:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

---

## 🎉 Success!

You now have a fully functional enterprise-level software marketplace platform running locally!

**Enjoy building with SoftMarket!** 🚀

---

**Quick Reference:**

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `Ctrl + C` | Stop server |
| `F12` | Open browser dev tools |

**Need more help?** Check the other documentation files in this folder.
