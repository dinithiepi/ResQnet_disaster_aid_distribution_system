
// Load environment variables (confirm .env exists in service folder or use host env)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4004;


// Middleware
// Caution: express.json() will parse bodies; for proxied flows ensure body
// consumption doesn't break other components.
app.use(cors());
app.use(express.json());

// Routes
const inventoryRoutes = require('./routes/inventoryRoutes');
const disasterAreaRoutes = require('./routes/disasterAreaRoutes');

// Mount inventory routes under /api/inventory (for admin CRUD)
app.use('/api/inventory', inventoryRoutes);

// Mount inventory routes under /inventory (for backward compatibility with donations)
app.use('/inventory', inventoryRoutes);

// Mount disaster area routes under /api/disaster-areas
app.use('/api/disaster-areas', disasterAreaRoutes);


// Error handling middleware - add this after routes
app.use((req, res, next) => {
    // 404 for inventory routes
    res.status(404).json({
        message: `inventory ${req.url} not found`
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!'
    });
});


// Root route
app.get('/', (req, res) => {
    res.send('inventory Service is running(Root Route)');
});



app.listen(PORT, () => {
    console.log(`inventory Service running on port ${PORT}`);
});
