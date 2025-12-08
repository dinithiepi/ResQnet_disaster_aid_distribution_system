// API Gateway - Fully Corrected
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// -------------------------------
// HARDCODE SERVICE URLS (NO ENV)
// -------------------------------
const ADMIN_URL = 'https://miraculous-caring-production.up.railway.app';
const INVENTORY_URL = 'https://brave-joy-production-9077.up.railway.app';
const MANAGER_URL = 'https://cooperative-enthusiasm-production.up.railway.app';

// -------------------------------
// CORRECT PROXY ROUTES
// Your frontend uses /api/... so gateway must too
// -------------------------------

// ADMIN SERVICE
app.use('/api/admin', createProxyMiddleware({
    target: ADMIN_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/admin': '/api/admin',  
    },
}));

// INVENTORY SERVICE
app.use('/api/inventory', createProxyMiddleware({
    target: INVENTORY_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/inventory': '/api/inventory',
    },
}));

// MANAGER SERVICE
app.use('/api/manager', createProxyMiddleware({
    target: MANAGER_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/manager': '/api/manager',
    },
}));

// HEALTH CHECK
app.get('/', (req, res) => {
    res.send('Gateway Running Successfully');
});

// START
app.listen(process.env.PORT || 8080, () => {
    console.log('Gateway running...');
});
