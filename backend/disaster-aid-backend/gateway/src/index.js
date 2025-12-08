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

// Forward requests to the inventory service
app.use('/inventory', createProxyMiddleware({
    target: 'http://localhost:4001', // inventory microservice
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.replace(/^\/inventory/, '/inventory')
}));

// Forward requests to the admin service
app.use('/admin', createProxyMiddleware({
    target: 'http://localhost:4002', // admin microservice
    changeOrigin: true,
    pathRewrite: {
        '^/admin': '/api/admin', // rewrite path
    },
}));

// Forward requests to the manager service
app.use('/manager', createProxyMiddleware({
    target: 'http://localhost:4003', // manager microservice
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.replace(/^\/manager/, '/manager')
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
