const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');

// Send a new message
router.post('/', protect, messageController.sendMessage);

// Get message history between users
router.get('/:userId', protect, messageController.getMessages);

// Mark message as read
router.put('/:messageId/read', protect, messageController.markAsRead);

// Delete a message
router.delete('/:messageId', protect, messageController.deleteMessage);

module.exports = router;
