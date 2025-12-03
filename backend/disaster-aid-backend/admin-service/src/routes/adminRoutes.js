const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Simple auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [adminId] = decoded.split(':');
    req.adminId = parseInt(adminId);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin registration route
router.post('/register', adminController.register);

// Admin login route
router.post('/login', adminController.login);

// Manager approval routes
router.get('/managers/pending', authMiddleware, adminController.getPendingManagers);
router.post('/managers/approve', authMiddleware, adminController.approveManager);
router.post('/managers/reject', authMiddleware, adminController.rejectManager);

// Aid centers
router.get('/aidcenters', authMiddleware, adminController.getAidCenters);

// Item request routes
router.get('/item-requests', authMiddleware, adminController.getItemRequests);
router.post('/item-requests/approve', authMiddleware, adminController.approveItemRequest);
router.post('/item-requests/reject', authMiddleware, adminController.rejectItemRequest);

module.exports = router;
