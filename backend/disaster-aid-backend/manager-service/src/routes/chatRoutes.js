const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyManagerToken } = require('../middleware/auth');

router.use(verifyManagerToken);

router.post('/send', chatController.sendMessage);
router.get('/conversations', chatController.getConversations);
router.get('/messages', chatController.getMessages);
router.get('/unread-count', chatController.getUnreadCount);

module.exports = router;
