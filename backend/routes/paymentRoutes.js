const express = require('express');
const router = express.Router();
const { createPaymentIntent, processRefund } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/intent', protect, createPaymentIntent);
router.post('/:paymentId/refund', protect, processRefund);
