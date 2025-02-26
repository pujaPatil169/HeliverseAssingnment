const express = require('express');
const router = express.Router();
const bookingCalendarController = require('../controllers/bookingCalendarController');
const authMiddleware = require('../middleware/auth');

router.get('/availability', bookingCalendarController.checkAvailability);

module.exports = router;
