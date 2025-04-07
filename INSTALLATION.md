# Detailed Installation Guide

This guide provides comprehensive instructions for setting up the Job Tracker application in different environments.

## Local Development Setup

### System Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git
- A text editor (VS Code recommended)
- MongoDB Atlas account

### Step 1: MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is sufficient)
3. Set up database access:
   - Create a database user
   - Set a secure password
4. Set up network access:
   - Add your IP address
   - For development, you can allow access from anywhere (0.0.0.0/0)
5. Get your connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### Step 2: Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Create .env file
   cp .env.example .env
   ```

4. Edit .env file with your MongoDB URI:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Step 3: Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

### Backend Deployment (Render)

1. Create a Render account
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure environment variables:
   - Add your MongoDB URI
   - Set NODE_ENV=production
5. Deploy your application

### Frontend Deployment (Vercel)

1. Create a Vercel account
2. Import your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set environment variables if needed
5. Deploy

## Common Issues and Solutions

### CORS Issues

If you encounter CORS errors:

1. Check your backend CORS configuration
2. Verify frontend API endpoint URLs
3. Ensure environment variables are set correctly

### MongoDB Connection Issues

1. Check if MongoDB URI is correct
2. Verify network access settings in MongoDB Atlas
3. Ensure database user credentials are correct

### Node.js Version Issues

1. Use nvm to manage Node.js versions
2. Ensure you're using a compatible version
3. Clear npm cache if needed:
   ```bash
   npm cache clean --force
   ```

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- MongoDB for VS Code
- GitLens
- React Developer Tools

### Debugging Tools

- Chrome DevTools for frontend
- Postman for API testing
- MongoDB Compass for database management
