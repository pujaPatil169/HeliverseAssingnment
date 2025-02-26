const express = require('express');
const router = express.Router();
const {createBooking,updateBookingStatus,getCustomerBookings,getVendorBookings} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware,createBooking);
router.put('/:bookingId/status', authMiddleware,updateBookingStatus);
router.get('/customer', authMiddleware,getCustomerBookings);
router.get('/vendor', authMiddleware,getVendorBookings);

module.exports = router