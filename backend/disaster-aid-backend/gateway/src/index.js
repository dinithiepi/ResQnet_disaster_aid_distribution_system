// File: index.js of API Gateway

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config(); // load environment variables from .env

const app = express();
const PORT = process.env.PORT || 4000;

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

// Service targets (use deploy URLs via env vars, fallback to localhost for local dev)
const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || process.env.INVENTORY_SERVICE_HOST || 'http://localhost:4001';
const ADMIN_URL = process.env.ADMIN_SERVICE_URL || process.env.ADMIN_SERVICE_HOST || 'http://localhost:4002';
const MANAGER_URL = process.env.MANAGER_SERVICE_URL || process.env.MANAGER_SERVICE_HOST || 'http://localhost:4003';

// Forward requests to the inventory service
app.use('/inventory', createProxyMiddleware({
    target: INVENTORY_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/inventory': '', // /inventory/foo -> /foo at inventory service
    },
}));

// Forward requests to the admin service
app.use('/admin', createProxyMiddleware({
    target: ADMIN_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/admin': '', // strip prefix; set to '/api/admin' if admin expects that base
    },
}));

// Forward requests to the manager service
app.use('/manager', createProxyMiddleware({
    target: MANAGER_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/manager': '',
    },
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
