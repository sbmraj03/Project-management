// Script to generate environment variables for cloud deployment
// Run with: node generate-env-vars.js

const crypto = require('crypto');

console.log('🔧 Environment Variables for Cloud Deployment');
console.log('===============================================\n');

// Generate random JWT secret
const jwtSecret = crypto.randomBytes(32).toString('base64');

console.log('📋 Backend Environment Variables (for Render):');
console.log('-----------------------------------------------');
console.log('NODE_ENV=production');
console.log('PORT=10000');
console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management?retryWrites=true&w=majority');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('JWT_EXPIRE=7d');
console.log('FRONTEND_URL=https://your-frontend-url.vercel.app');
console.log('SOCKET_CORS_ORIGIN=https://your-frontend-url.vercel.app');

console.log('\n📋 Frontend Environment Variables (for Vercel):');
console.log('-----------------------------------------------');
console.log('VITE_API_URL=https://your-backend-url.onrender.com/api');
console.log('VITE_SOCKET_URL=https://your-backend-url.onrender.com');
console.log('VITE_APP_NAME=Project Management App');
console.log('VITE_APP_VERSION=1.0.0');

console.log('\n⚠️  Important Notes:');
console.log('-------------------');
console.log('1. Replace "username:password" in MONGODB_URI with your MongoDB Atlas credentials');
console.log('2. Replace "cluster.mongodb.net" with your actual MongoDB cluster URL');
console.log('3. Replace "your-frontend-url.vercel.app" with your actual Vercel URL');
console.log('4. Replace "your-backend-url.onrender.com" with your actual Render URL');
console.log('5. Keep the JWT_SECRET secure and don\'t share it publicly');

console.log('\n🚀 Ready to deploy!');
console.log('Follow the steps in CLOUD_DEPLOYMENT.md');
