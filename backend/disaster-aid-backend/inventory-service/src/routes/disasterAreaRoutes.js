const express = require('express');
const router = express.Router();

// Require the controller safely
let disasterAreaController = null;
try {
	disasterAreaController = require('../controllers/disasterAreaController');
} catch (err) {
	console.error('Failed to load disasterAreaController:', err);
}

// Get all disaster areas
router.get('/', async (req, res, next) => {
	if (!disasterAreaController || typeof disasterAreaController.getDisasterAreas !== 'function') {
		return res.status(500).json({ message: 'Disaster area controller not available' });
	}
	return disasterAreaController.getDisasterAreas(req, res, next);
});

// Get disaster area by ID
router.get('/:areaid', async (req, res, next) => {
	if (!disasterAreaController || typeof disasterAreaController.getDisasterAreaById !== 'function') {
		return res.status(500).json({ message: 'Disaster area controller not available' });
	}
	return disasterAreaController.getDisasterAreaById(req, res, next);
});

// Create new disaster area
router.post('/', async (req, res, next) => {
	if (!disasterAreaController || typeof disasterAreaController.createDisasterArea !== 'function') {
		return res.status(500).json({ message: 'Disaster area controller not available' });
	}
	return disasterAreaController.createDisasterArea(req, res, next);
});

// Update disaster area
router.put('/:areaid', async (req, res, next) => {
	if (!disasterAreaController || typeof disasterAreaController.updateDisasterArea !== 'function') {
		return res.status(500).json({ message: 'Disaster area controller not available' });
	}
	return disasterAreaController.updateDisasterArea(req, res, next);
});

// Delete disaster area
router.delete('/:areaid', async (req, res, next) => {
	if (!disasterAreaController || typeof disasterAreaController.deleteDisasterArea !== 'function') {
		return res.status(500).json({ message: 'Disaster area controller not available' });
	}
	return disasterAreaController.deleteDisasterArea(req, res, next);
});

module.exports = router;
