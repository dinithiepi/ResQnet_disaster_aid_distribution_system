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

// Item request routes
router.post('/item-requests', verifyManagerToken, managerController.createItemRequest);
router.get('/item-requests', verifyManagerToken, managerController.getItemRequests);
router.post('/item-requests/received', verifyManagerToken, managerController.markItemReceived);

module.exports = router;
