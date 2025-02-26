const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');
const vendorMiddleware = require('../middleware/vendor');
const adminMiddleware = require('../middleware/admin');

router.get('/vendor', authMiddleware, vendorMiddleware, analyticsController.getVendorAnalytics);
router.get('/admin', authMiddleware, adminMiddleware, analyticsController.getAdminAnalytics);

module.exports = router;
