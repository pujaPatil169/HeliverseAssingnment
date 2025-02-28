const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

// Get user notifications
router.get('/', protect, notificationController.getNotifications);

// Mark notification as read
router.put('/:notificationId/read', protect, notificationController.markAsRead);

// Delete notification
router.delete('/:notificationId', protect, notificationController.deleteNotification);

module.exports = router;
