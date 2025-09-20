# Project Management App - Cloud Deployment Guide

This guide covers cloud deployment options for the Project Management App using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account with your project repository
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)

## Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Project Management App
VITE_APP_VERSION=1.0.0
```

For production, update the URLs to point to your backend server:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
VITE_APP_NAME=Project Management App
VITE_APP_VERSION=1.0.0
```

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/project-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Socket.IO Configuration
SOCKET_CORS_ORIGIN=http://localhost:5173
```

For production:

```env
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Socket.IO Configuration
SOCKET_CORS_ORIGIN=https://your-frontend-domain.com
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

This is the easiest way to deploy the entire application stack.

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd Project-management
   ```

2. **Update environment variables in docker-compose.yml:**
   - Change the JWT_SECRET to a secure random string
   - Update MongoDB credentials
   - Update FRONTEND_URL to your domain

3. **Build and start the services:**
   ```bash
   docker-compose up -d
   ```

4. **Check the status:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Manual Docker Deployment

#### Backend Deployment

1. **Build the backend image:**
   ```bash
   docker build -f Dockerfile.backend -t project-management-backend .
   ```

2. **Run the backend container:**
   ```bash
   docker run -d \
     --name project-management-backend \
     -p 5000:5000 \
     -e NODE_ENV=production \
     -e MONGODB_URI=mongodb://your-mongodb-host:27017/project-management \
     -e JWT_SECRET=your-secret-key \
     -e FRONTEND_URL=http://your-frontend-domain \
     project-management-backend
   ```

#### Frontend Deployment

1. **Build the frontend image:**
   ```bash
   docker build -f Dockerfile.frontend -t project-management-frontend .
   ```

2. **Run the frontend container:**
   ```bash
   docker run -d \
     --name project-management-frontend \
     -p 80:80 \
     project-management-frontend
   ```

### Option 3: Cloud Platform Deployment

#### Heroku Deployment

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create Heroku apps:**
   ```bash
   # For backend
   heroku create your-app-backend
   
   # For frontend
   heroku create your-app-frontend
   ```

3. **Add MongoDB addon:**
   ```bash
   heroku addons:create mongolab:sandbox -a your-app-backend
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production -a your-app-backend
   heroku config:set JWT_SECRET=your-secret-key -a your-app-backend
   heroku config:set FRONTEND_URL=https://your-app-frontend.herokuapp.com -a your-app-backend
   ```

5. **Deploy:**
   ```bash
   # Backend
   cd backend
   git subtree push --prefix backend heroku main
   
   # Frontend
   cd frontend
   git subtree push --prefix frontend heroku main
   ```

#### Vercel Deployment (Frontend)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy frontend:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - VITE_API_URL: https://your-backend-domain.com/api
   - VITE_SOCKET_URL: https://your-backend-domain.com

#### Railway Deployment

1. **Connect your GitHub repository to Railway**

2. **Create separate services for frontend and backend**

3. **Set environment variables in Railway dashboard**

4. **Deploy automatically on git push**

### Option 4: VPS/Server Deployment

1. **Set up a VPS (Ubuntu 20.04+ recommended)**

2. **Install Docker and Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd project-management-app/Project-management
   ```

4. **Update docker-compose.yml with your domain**

5. **Deploy:**
   ```bash
   docker-compose up -d
   ```

6. **Set up reverse proxy with Nginx (optional):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

1. **Install Certbot:**
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal:**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Monitoring and Maintenance

### Health Checks

The application includes health checks for all services:

- Backend: `GET /` returns "API is running..."
- Frontend: Nginx serves static files
- Database: MongoDB connection check

### Logs

View logs for troubleshooting:

```bash
# Docker Compose logs
docker-compose logs -f

# Individual service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Backup

#### MongoDB Backup

```bash
# Create backup
docker exec project-management-db mongodump --out /backup

# Copy backup from container
docker cp project-management-db:/backup ./mongodb-backup
```

#### Restore

```bash
# Copy backup to container
docker cp ./mongodb-backup project-management-db:/restore

# Restore database
docker exec project-management-db mongorestore /restore
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Change ports in docker-compose.yml if 3000, 5000, or 27017 are in use

2. **CORS errors:**
   - Ensure FRONTEND_URL environment variable is set correctly
   - Check that the frontend URL matches exactly

3. **Database connection issues:**
   - Verify MongoDB is running
   - Check MONGODB_URI format
   - Ensure network connectivity between services

4. **Build failures:**
   - Check Dockerfile syntax
   - Verify all required files are present
   - Check for typos in environment variables

### Performance Optimization

1. **Enable MongoDB indexing:**
   ```javascript
   // Add to your MongoDB initialization
   db.users.createIndex({ email: 1 }, { unique: true });
   db.projects.createIndex({ owner: 1 });
   db.tasks.createIndex({ project: 1 });
   db.notifications.createIndex({ user: 1, read: 1 });
   ```

2. **Enable Redis for session storage (optional):**
   - Add Redis service to docker-compose.yml
   - Update backend to use Redis for sessions

3. **CDN for static assets:**
   - Use CloudFlare or AWS CloudFront
   - Configure proper caching headers

## Security Considerations

1. **Change default passwords:**
   - Update MongoDB admin password
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **Network security:**
   - Use private networks for database
   - Implement firewall rules
   - Use HTTPS in production

3. **Environment variables:**
   - Never commit .env files
   - Use secure secret management
   - Rotate credentials regularly

## Scaling

### Horizontal Scaling

1. **Load balancer setup:**
   - Use Nginx or HAProxy
   - Configure sticky sessions for Socket.IO
   - Implement health checks

2. **Database scaling:**
   - MongoDB replica sets
   - Read replicas for queries
   - Sharding for large datasets

3. **Container orchestration:**
   - Kubernetes deployment
   - Docker Swarm
   - AWS ECS or Google Cloud Run

## Support

For issues and questions:
1. Check the logs first
2. Verify environment variables
3. Test individual services
4. Check network connectivity
5. Review this documentation

Remember to always test deployments in a staging environment before production!
