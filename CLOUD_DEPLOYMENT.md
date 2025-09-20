# Cloud Deployment Guide - Vercel + Render

This guide will help you deploy your Project Management App to:
- **Frontend**: Vercel (https://vercel.com)
- **Backend**: Render (https://render.com)

## Prerequisites

1. GitHub account with your project repository
2. Vercel account (free)
3. Render account (free)
4. MongoDB Atlas account (free) for database

## Step 1: Set up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (choose the free tier)
4. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Username: `project-management-user`
   - Password: Generate a secure password
   - Database User Privileges: "Read and write to any database"
5. Whitelist your IP:
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` (allow access from anywhere)
6. Get your connection string:
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `project-management`

Example connection string:
```
mongodb+srv://project-management-user:yourpassword@cluster0.xxxxx.mongodb.net/project-management?retryWrites=true&w=majority
```

## Step 2: Deploy Backend to Render

### 2.1 Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository: `project-management-app`
5. Choose the repository

### 2.2 Configure Backend Service

**Basic Settings:**
- **Name**: `project-management-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `Project-management/backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://project-management-user:yourpassword@cluster0.xxxxx.mongodb.net/project-management?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-for-production-change-this-to-something-random
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.vercel.app
SOCKET_CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Important Notes:**
- Replace `yourpassword` with your actual MongoDB password
- Replace `cluster0.xxxxx` with your actual cluster URL
- Replace `your-frontend-url.vercel.app` with your actual Vercel URL (you'll get this after deploying frontend)
- Generate a strong JWT_SECRET (you can use: `openssl rand -base64 32`)

### 2.3 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Note down your backend URL (e.g., `https://project-management-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select your repository: `project-management-app`

### 3.2 Configure Frontend Project

**Project Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `Project-management/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Environment Variables:**
Add these environment variables in Vercel dashboard:

```
VITE_API_URL=https://project-management-backend.onrender.com/api
VITE_SOCKET_URL=https://project-management-backend.onrender.com
VITE_APP_NAME=Project Management App
VITE_APP_VERSION=1.0.0
```

**Important Notes:**
- Replace `project-management-backend.onrender.com` with your actual Render backend URL

### 3.3 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. Note down your frontend URL (e.g., `https://project-management-app.vercel.app`)

## Step 4: Update Environment Variables

### 4.1 Update Backend Environment Variables

Go back to Render dashboard and update the backend environment variables:

```
FRONTEND_URL=https://project-management-app.vercel.app
SOCKET_CORS_ORIGIN=https://project-management-app.vercel.app
```

Then redeploy the backend service.

### 4.2 Update Frontend Environment Variables (if needed)

If you need to update frontend environment variables, go to Vercel dashboard and update them, then redeploy.

## Step 5: Test Your Deployment

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend**: Visit `https://your-backend-url.onrender.com/` - you should see "API is running..."
3. **Test Registration**: Try creating a new account
4. **Test Login**: Try logging in with your account
5. **Test Features**: Create projects, add tasks, etc.

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Make sure `FRONTEND_URL` and `SOCKET_CORS_ORIGIN` in backend match your Vercel URL exactly
   - Include `https://` in the URLs

2. **Database Connection Issues**:
   - Verify MongoDB connection string is correct
   - Check that IP whitelist includes `0.0.0.0/0`
   - Ensure database user has correct permissions

3. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Verify build commands are correct
   - Check logs in Render/Vercel dashboard

4. **Environment Variables**:
   - Make sure all required environment variables are set
   - Check for typos in variable names
   - Ensure values don't have extra spaces

### Checking Logs

**Render (Backend) Logs:**
1. Go to Render dashboard
2. Click on your backend service
3. Go to "Logs" tab

**Vercel (Frontend) Logs:**
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Functions" tab for serverless functions
4. Check "Deployments" for build logs

## Cost Information

- **Vercel**: Free tier includes 100GB bandwidth, unlimited deployments
- **Render**: Free tier includes 750 hours/month, sleeps after 15 minutes of inactivity
- **MongoDB Atlas**: Free tier includes 512MB storage

## Performance Tips

1. **Render Free Tier**: Services sleep after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds to wake up
   - Consider upgrading to paid plan for production use

2. **MongoDB Atlas**: 
   - Use connection pooling
   - Add database indexes for better performance

3. **Vercel**:
   - Enable automatic deployments from GitHub
   - Use preview deployments for testing

## Security Considerations

1. **Environment Variables**:
   - Never commit `.env` files to GitHub
   - Use strong, unique JWT secrets
   - Rotate secrets regularly

2. **MongoDB Atlas**:
   - Use strong passwords
   - Regularly review database access
   - Enable audit logging for production

3. **CORS**:
   - Only allow your frontend domain
   - Don't use wildcard (`*`) in production

## Next Steps

1. **Custom Domain**: Add custom domains to both Vercel and Render
2. **SSL**: Both platforms provide free SSL certificates
3. **Monitoring**: Set up error tracking (Sentry, LogRocket)
4. **Analytics**: Add Google Analytics or similar
5. **Backup**: Set up regular MongoDB backups

## Support

If you encounter issues:
1. Check the logs first
2. Verify environment variables
3. Test individual services
4. Check this documentation
5. Contact platform support (Vercel/Render)

Your live application will be available at:
- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://your-project-name.onrender.com`
