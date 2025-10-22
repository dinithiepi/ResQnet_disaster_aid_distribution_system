const express = require("express");
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Inventory route
router.get("/inventory", inventoryController.getInventory);

// Donations route
router.get("/donations", inventoryController.getDonations);

module.exports = router;

//http://localhost:4001/api/inventory
//http://localhost:4001/api/donations