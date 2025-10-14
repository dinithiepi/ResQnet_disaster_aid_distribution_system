// gateway/src/index.js
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());

// Health route
app.get('/', (req, res) => {
  res.json({ message: 'API Gateway is running' });
});

// Example proxy route for auth service
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:4002', // your auth service port
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' }
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API Gateway running on port ${PORT}`));
