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

// Create new inventory item
router.post('/', async (req, res, next) => {
	if (!inventoryController || typeof inventoryController.createInventoryItem !== 'function') {
		return res.status(500).json({ message: 'Inventory controller not available' });
	}
	return inventoryController.createInventoryItem(req, res, next);
});

// Update inventory item
router.put('/:itemid', async (req, res, next) => {
	if (!inventoryController || typeof inventoryController.updateInventoryItem !== 'function') {
		return res.status(500).json({ message: 'Inventory controller not available' });
	}
	return inventoryController.updateInventoryItem(req, res, next);
});

// Delete inventory item
router.delete('/:itemid', async (req, res, next) => {
	if (!inventoryController || typeof inventoryController.deleteInventoryItem !== 'function') {
		return res.status(500).json({ message: 'Inventory controller not available' });
	}
	return inventoryController.deleteInventoryItem(req, res, next);
});

// Get all donations
router.get('/donations', async (req, res, next) => {
    if (!inventoryController || typeof inventoryController.getdonations !== 'function') {
        return res.status(500).json({ message: 'Inventory controller not available' });
    }
    return inventoryController.getdonations(req, res, next);
});

// Submit new donation (public endpoint)
router.post('/donations/submit', async (req, res, next) => {
    if (!inventoryController || typeof inventoryController.submitDonation !== 'function') {
        return res.status(500).json({ message: 'Inventory controller not available' });
    }
    return inventoryController.submitDonation(req, res, next);
});

// Get pending donations (admin only)
router.get('/donations/pending', async (req, res, next) => {
    if (!inventoryController || typeof inventoryController.getPendingDonations !== 'function') {
        return res.status(500).json({ message: 'Inventory controller not available' });
    }
    return inventoryController.getPendingDonations(req, res, next);
});

// Update donation status (admin only)
router.put('/donations/:donationid/status', async (req, res, next) => {
    if (!inventoryController || typeof inventoryController.updateDonationStatus !== 'function') {
        return res.status(500).json({ message: 'Inventory controller not available' });
    }
    return inventoryController.updateDonationStatus(req, res, next);
});

module.exports = router;

//http://localhost:4000/inventory/donations    donation
//http://localhost:4000/inventory              inventory
