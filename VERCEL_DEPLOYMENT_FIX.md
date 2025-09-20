# 🔧 Vercel Frontend Deployment Fix Guide

## ❌ **The Problem**

Your Vercel deployment is showing a blank screen because:
1. Vercel is building from the wrong directory (root instead of `frontend`)
2. The build configuration is incorrect
3. Environment variables might not be set properly

## ✅ **Solution: Fix Vercel Configuration**

### **Method 1: Update Vercel Project Settings (Recommended)**

1. **Go to your Vercel dashboard**
2. **Click on your frontend project**
3. **Go to Settings tab**
4. **Update these settings:**

   **Build & Development Settings:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Go to Environment Variables tab**
6. **Add these variables:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   VITE_APP_NAME=Project Management App
   VITE_APP_VERSION=1.0.0
   ```

7. **Save and redeploy**

### **Method 2: Delete and Recreate Project**

If Method 1 doesn't work:

1. **Delete your current Vercel project**
2. **Create a new project**
3. **Import your GitHub repository**
4. **Use these exact settings:**

   **Project Settings:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` ⚠️ **Important: Must be "frontend"**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

   **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   VITE_APP_NAME=Project Management App
   VITE_APP_VERSION=1.0.0
   ```

## 🔍 **Verification Steps**

After fixing the configuration:

1. **Check the build logs** - Should show:
   ```
   Installing dependencies...
   Running "npm run build"
   ✓ Built successfully
   ```

2. **Test the frontend URL** - Should show your app, not a blank screen

3. **Check browser console** - Should not show CORS or API errors

## 🚨 **Common Issues & Solutions**

### **Issue 1: Still getting blank screen**
- **Solution**: Make sure Root Directory is exactly `frontend`
- **Check**: Environment variables are set correctly
- **Verify**: Backend URL is accessible

### **Issue 2: Build fails**
- **Solution**: Check that `package.json` is in the frontend folder
- **Verify**: All dependencies are listed in package.json

### **Issue 3: CORS errors in browser console**
- **Solution**: Make sure `VITE_API_URL` points to your Render backend
- **Check**: Backend CORS settings include your Vercel domain

### **Issue 4: Environment variables not working**
- **Solution**: Make sure variables start with `VITE_`
- **Check**: Variables are set in Vercel dashboard, not just locally

## 📋 **Correct Vercel Settings Summary**

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## 🎯 **Environment Variables Checklist**

Make sure you have these environment variables in Vercel:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=Project Management App
VITE_APP_VERSION=1.0.0
```

**Important Notes:**
- Replace `your-backend-url.onrender.com` with your actual Render backend URL
- All variables must start with `VITE_` to be accessible in the frontend
- No spaces around the `=` sign

## 🔗 **Complete Deployment Flow**

1. **Backend (Render)**: ✅ Working
   - URL: `https://your-backend-url.onrender.com`
   - Test: Visit URL, should show "API is running..."

2. **Frontend (Vercel)**: 🔧 Fix needed
   - Root Directory: `frontend`
   - Environment Variables: Set with backend URL
   - Test: Should show your app, not blank screen

3. **Update Backend**: After frontend is working
   - Update `FRONTEND_URL` in Render with your Vercel URL
   - Update `SOCKET_CORS_ORIGIN` in Render with your Vercel URL

## 🎉 **Expected Result**

After fixing the configuration:
- ✅ Build should complete successfully
- ✅ Frontend should show your app (not blank screen)
- ✅ App should connect to backend API
- ✅ All features should work (login, projects, tasks)

## 📞 **Need Help?**

If you're still having issues:
1. Check Vercel build logs for specific error messages
2. Verify Root Directory is set to `frontend`
3. Make sure all environment variables are set correctly
4. Test your backend URL separately
5. Check browser console for JavaScript errors

The key is getting the **Root Directory** setting correct: it should be `frontend`, not the root of your repository!
