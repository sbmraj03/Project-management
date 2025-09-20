# 🔍 Blank Screen Debug Guide

## 🚨 **Common Causes of Blank Screen in Vercel**

Even with correct Root Directory, blank screens can occur due to:

1. **Environment Variables Not Set**
2. **Build Errors (JavaScript crashes)**
3. **Missing Dependencies**
4. **CORS Issues**
5. **API Connection Failures**

## 🔧 **Step-by-Step Debugging**

### **Step 1: Check Vercel Build Logs**

1. **Go to Vercel Dashboard**
2. **Click on your project**
3. **Go to "Deployments" tab**
4. **Click on the latest deployment**
5. **Check "Build Logs"**

**Look for:**
- ✅ `✓ Built successfully` - Build completed
- ❌ `Error:` - Build failed
- ❌ `Warning:` - Potential issues

### **Step 2: Check Browser Console**

1. **Open your deployed Vercel URL**
2. **Press F12 (Developer Tools)**
3. **Go to Console tab**
4. **Look for errors:**

**Common Errors:**
```
❌ Failed to load resource: net::ERR_NAME_NOT_RESOLVED
❌ CORS policy: No 'Access-Control-Allow-Origin' header
❌ Uncaught ReferenceError: Cannot access before initialization
❌ Uncaught TypeError: Cannot read properties of undefined
```

### **Step 3: Verify Environment Variables**

**In Vercel Dashboard → Settings → Environment Variables:**

Make sure you have:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=Project Management App
VITE_APP_VERSION=1.0.0
```

**Important:**
- Variables must start with `VITE_`
- No spaces around `=`
- Replace `your-backend-url.onrender.com` with actual URL

### **Step 4: Test Local Build**

Run this locally to test if the build works:

```bash
cd frontend
npm install
npm run build
npm run preview
```

If local build fails, fix those issues first.

## 🛠️ **Quick Fixes**

### **Fix 1: Update Vercel Configuration**

Create/update `vercel.json` in the frontend directory:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### **Fix 2: Add Error Boundary**

Add this to catch React errors:

```jsx
// In App.jsx, wrap your app with error boundary
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check console for details.</h1>;
    }
    return this.props.children;
  }
}

// Wrap your app
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

### **Fix 3: Add Debug Logging**

Add this to `main.jsx` to debug:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

console.log('Environment variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
});

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  )
} catch (error) {
  console.error('App failed to render:', error);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>App Failed to Load</h1>
      <p>Error: ${error.message}</p>
      <p>Check console for details.</p>
    </div>
  `;
}
```

## 🎯 **Specific Solutions**

### **Solution 1: Environment Variables Issue**

If environment variables are not set:

1. **Go to Vercel Dashboard**
2. **Settings → Environment Variables**
3. **Add all required variables**
4. **Redeploy**

### **Solution 2: API Connection Issue**

If API is not reachable:

1. **Test backend URL directly**: `https://your-backend-url.onrender.com/`
2. **Should show**: "API is running..."
3. **If not working**: Check Render deployment

### **Solution 3: CORS Issue**

If getting CORS errors:

1. **Check backend CORS settings**
2. **Make sure `FRONTEND_URL` in Render includes your Vercel domain**
3. **Update Render environment variables**

### **Solution 4: Build Configuration Issue**

If build is failing:

1. **Check `package.json` has all dependencies**
2. **Verify `vite.config.js` is correct**
3. **Make sure `index.html` exists**

## 🔍 **Debugging Checklist**

- [ ] Vercel Root Directory: `frontend`
- [ ] Environment Variables: All set with `VITE_` prefix
- [ ] Backend URL: Accessible and working
- [ ] Build Logs: No errors
- [ ] Browser Console: No JavaScript errors
- [ ] Local Build: Works without errors

## 📞 **Still Having Issues?**

If you're still getting blank screen:

1. **Share your Vercel build logs**
2. **Share browser console errors**
3. **Share your environment variables (without sensitive data)**
4. **Test backend URL separately**

The most common cause is missing or incorrect environment variables!
