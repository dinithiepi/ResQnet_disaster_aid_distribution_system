// File: index.js of API Gateway

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config(); // load environment variables from .env

const app = express();
const PORT = process.env.PORT || 4000;

// Service URLs - use environment variables for production deployment
const INVENTORY_SERVICE_URL = process.env.INVENTORY_URL || 'http://localhost:4004';
const ADMIN_SERVICE_URL = process.env.ADMIN_URL || 'http://localhost:4002';
const MANAGER_SERVICE_URL = process.env.MANAGER_URL || 'http://localhost:4003';

console.log('🚀 Gateway Configuration:');
console.log('📦 Inventory Service:', INVENTORY_SERVICE_URL);
console.log('👤 Admin Service:', ADMIN_SERVICE_URL);
console.log('👔 Manager Service:', MANAGER_SERVICE_URL);

// ---------------------------
// Middleware
// ---------------------------

// NOTE: CORS is enabled globally here. 
// In production, you might want to restrict allowed origins.
app.use(cors());

// Token verification middleware for protected routes
//const verifyToken = require('./middlewares/verifyToken');


// ---------------------------
// Proxy routes
// ---------------------------

// Forward requests to the inventory service (including disaster areas)
app.use('/api', createProxyMiddleware({
    target: INVENTORY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl
}));

// Forward inventory requests to the inventory service
app.use('/inventory', createProxyMiddleware({
    target: INVENTORY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.replace(/^^\/inventory/, '/inventory')
}));

// Forward requests to the admin service
app.use('/admin', createProxyMiddleware({
    target: ADMIN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/admin': '/api/admin', // rewrite path
    },
}));

// Forward requests to the manager service
app.use('/manager', createProxyMiddleware({
    target: MANAGER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.replace(/^\/manager/, '/manager')
}));

// Forward uploaded certificate files to manager service
app.use('/uploads', createProxyMiddleware({
    target: MANAGER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl
}));

// ---------------------------
// Root route for testing
// ---------------------------
app.get('/', (req, res) => {
    res.send('API Gateway is running');
});


// ---------------------------
// Start the server
// ---------------------------
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
