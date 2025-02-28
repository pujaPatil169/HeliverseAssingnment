const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect, authorize } = require('../middleware/auth');

// Add listing to wishlist
router.post('/', protect, wishlistController.addToWishlist);

// Remove listing from wishlist
router.delete('/:listingId', protect, wishlistController.removeFromWishlist);

// Get user's wishlist
router.get('/', protect, wishlistController.getWishlist);

// Get wishlist count
router.get('/count', protect, wishlistController.getWishlistCount);

module.exports = router;
