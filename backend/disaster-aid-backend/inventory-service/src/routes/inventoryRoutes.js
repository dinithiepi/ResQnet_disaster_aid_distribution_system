const express = require('express');
const router = express.Router();

// Require the controller safely so a failed require doesn't crash the whole app.
let inventoryController = null;
try {
	inventoryController = require('../controllers/inventoryController');
} catch (err) {
	console.error('Failed to load inventoryController:', err);
}

// Get all inventory items
router.get('/', async (req, res, next) => {
	if (!inventoryController || typeof inventoryController.getInventory !== 'function') {
		return res.status(500).json({ message: 'Inventory controller not available' });
	}
	return inventoryController.getInventory(req, res, next);
});
// Get all donations
router.get('/donations', async (req, res, next) => {
    if (!inventoryController || typeof inventoryController.getdonations !== 'function') {
        return res.status(500).json({ message: 'Inventory controller not available' });
    }
    return inventoryController.getdonations(req, res, next);
});

module.exports = router;

//http://localhost:4000/inventory/donations    donation
//http://localhost:4000/inventory              inventory
