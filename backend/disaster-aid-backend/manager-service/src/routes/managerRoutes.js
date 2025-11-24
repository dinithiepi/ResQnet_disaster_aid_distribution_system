const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { verifyManagerToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', upload.single('certificate'), managerController.register);
router.post('/login', managerController.login);

// Protected routes
router.get('/profile', verifyManagerToken, managerController.getProfile);

module.exports = router;
