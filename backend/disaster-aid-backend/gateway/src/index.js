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
// Frontend: /api/admin/... -> Gateway -> Admin Service: /api/admin/...
app.use(createProxyMiddleware('/api/admin', {
    target: ADMIN_URL,
    changeOrigin: true,
}));

// INVENTORY SERVICE
// Frontend: /api/inventory/... -> Gateway -> Inventory Service: /api/inventory/...
app.use(createProxyMiddleware('/api/inventory', {
    target: INVENTORY_URL,
    changeOrigin: true,
}));

// DISASTER AREAS (INVENTORY SERVICE)
// Frontend: /api/disaster-areas/... -> Gateway -> Inventory Service: /api/disaster-areas/...
app.use(createProxyMiddleware('/api/disaster-areas', {
    target: INVENTORY_URL,
    changeOrigin: true,
}));

// MANAGER SERVICE
// Frontend: /api/manager/... -> Gateway -> Manager Service: /manager/...
app.use(createProxyMiddleware('/api/manager', {
    target: MANAGER_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/manager': '/manager',
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
