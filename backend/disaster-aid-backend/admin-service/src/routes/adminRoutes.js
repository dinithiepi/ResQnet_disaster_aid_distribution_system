const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin registration route
router.post('/register', adminController.register);

// Admin login route
router.post('/login', adminController.login);

module.exports = router;
