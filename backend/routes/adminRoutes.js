const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/stats', protect, adminMiddleware, adminController.getSystemStats);
router.get('/activities', protect, adminMiddleware, adminController.getRecentActivities);
router.put('/users/:userId', protect, adminMiddleware, adminController.manageUser);

module.exports = router;
