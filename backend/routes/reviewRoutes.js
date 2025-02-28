const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, reviewController.createReview);
router.put('/:reviewId/status', protect, reviewController.updateReviewStatus);
router.put('/:reviewId/response', protect, reviewController.addVendorResponse);
router.get('/listing/:listingId', protect, reviewController.getListingReviews);

module.exports = router;
