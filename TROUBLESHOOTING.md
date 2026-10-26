# 🔧 Troubleshooting Guide

## ❌ Common Issue: 404 Error / Directory Index

### Problem
You see "Index of software market place/" instead of the React app, or you get 404 errors.

### Cause
You're running the wrong command or accessing the wrong directory.

---

## ✅ CORRECT Way to Run

### From the `ui` folder:

```bash
# Navigate to the ui folder
cd "c:\software market place\ui"

# Run Vite dev server
npm run dev
```

### Access at:
```
http://localhost:3000
```

---

## ❌ WRONG Commands (Don't Use These)

```bash
# DON'T use serve
npx serve .

# DON'T run from parent directory
cd "c:\software market place"
npm run dev  # This won't work!
```

---

## 🔍 Troubleshooting Steps

### Step 1: Check You're in the Right Directory
```bash
pwd
# Should show: C:\software market place\ui
```

### Step 2: Verify Package.json Exists
```bash
dir package.json
# Should exist in current directory
```

### Step 3: Stop Any Running Servers
Press `Ctrl + C` in any terminals running servers

### Step 4: Clear Node Modules (if needed)
```bash
rm -r node_modules
rm package-lock.json
npm install
```

### Step 5: Start Fresh
```bash
npm run dev
```

### Step 6: Access Correct URL
- ✅ Correct: `http://localhost:3000`
- ❌ Wrong: `http://localhost:45754` or any other port
- ❌ Wrong: `http://localhost:3000/ui`

---

## 🐛 Common Errors

### Error: "Cannot GET /"
**Cause**: Wrong server or wrong URL
**Solution**: Make sure you ran `npm run dev` from the `ui` folder

### Error: Directory Index Shows
**Cause**: Using `npx serve` or similar static file server
**Solution**: Use `npm run dev` instead

### Error: Port Already in Use
**Cause**: Another process using port 3000
**Solution**: 
```bash
# Change port in vite.config.ts
server: {
  port: 3001,
}
```

### Error: Module Not Found
**Cause**: Dependencies not installed
**Solution**:
```bash
npm install
```

---

## ✅ Verification Checklist

Run these commands from the `ui` folder:

```bash
# 1. Check you're in ui folder
pwd
# Should show: C:\software market place\ui

# 2. Check node_modules exists
dir node_modules
# Should exist

# 3. Check package.json has dev script
type package.json | findstr "dev"
# Should show: "dev": "vite"

# 4. Start server
npm run dev

# 5. Check terminal output
# Should see: "VITE v5.x.x ready in XXX ms"
# Should see: "Local: http://localhost:3000/"

# 6. Open browser
# Navigate to: http://localhost:3000
```

---

## 🎯 Expected Terminal Output

```
> softmarket-frontend@1.0.0 dev
> vite

  VITE v5.4.21  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🌐 What You Should See in Browser

### ✅ Correct (React App Loading):
- Beautiful landing page with gradient background
- Navigation bar with logo "SoftMarket"
- Search bar
- Feature cards
- No "Index of" heading
- No 404 errors in console

### ❌ Wrong (Directory Index):
- "Index of software market place/"
- Folder listings (.vscode/, ui/)
- Plain white background
- No React app

---

## 🔧 Quick Fix Commands

### If you see directory index:
```bash
# Stop current server (Ctrl + C)
cd "c:\software market place\ui"
npm run dev
# Open http://localhost:3000
```

### If nothing appears:
```bash
# Check for errors
npm run dev
# Look for error messages in terminal
# Check browser console (F12)
```

### Nuclear option (complete reset):
```bash
cd "c:\software market place\ui"
rm -r -force node_modules
rm package-lock.json
npm install
npm run dev
```

---

## 📱 Mobile Testing

```bash
# Update vite.config.ts:
server: {
  host: '0.0.0.0',
  port: 3000,
}

# Find your IP
ipconfig
# Look for IPv4 Address

# Access from mobile
http://YOUR_IP:3000
```

---

## 🆘 Still Not Working?

1. **Check Node.js version**: `node --version` (should be v18+)
2. **Check npm version**: `npm --version` (should be v9+)
3. **Check terminal location**: `pwd` (should be in ui folder)
4. **Check for error messages** in terminal
5. **Check browser console** (F12 → Console tab)
6. **Try different browser** (Chrome, Firefox, Edge)
7. **Restart computer** (sometimes helps with port issues)

---

## 📞 Getting Help

If none of this works, provide:
1. Terminal output of `npm run dev`
2. Browser console errors (F12)
3. Output of `pwd`
4. Output of `npm --version` and `node --version`

---

**Remember**: Always run `npm run dev` from the `ui` folder, not the parent directory!
