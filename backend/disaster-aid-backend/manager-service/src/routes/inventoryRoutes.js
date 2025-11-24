const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyManagerToken } = require('../middleware/auth');

router.use(verifyManagerToken);

router.get('/', inventoryController.getInventory);
router.post('/update', inventoryController.updateInventory);

module.exports = router;
