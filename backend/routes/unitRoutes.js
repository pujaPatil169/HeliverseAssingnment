const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const authMiddleware = require('../middleware/auth');
const vendorMiddleware = require('../middleware/vendor');

router.post('/', authMiddleware, vendorMiddleware, unitController.createUnit);
router.get('/listing/:listingId', unitController.getUnitsByListing);
router.put('/:unitId', authMiddleware, vendorMiddleware, unitController.updateUnit);
router.delete('/:unitId', authMiddleware, vendorMiddleware, unitController.deleteUnit);

module.exports = router;
