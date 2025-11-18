const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Admin Service is running');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: `Route ${req.url} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Admin Service running on port ${PORT}`);
});
