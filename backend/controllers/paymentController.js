
const stripe = require('../config/stripe');
const Booking = require('../models/Booking');

const createPaymentIntent = async (req, res) => {
  // Temporarily disabled due to missing Stripe secret key
  try {
    const { bookingId, amount, currency, paymentMethod } = req.body;

    // Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethod,
      confirm: true,
      metadata: { bookingId }
    });

    // Create payment record
    const payment = new Payment({
      bookingId,
      amount,
      currency,
      paymentMethod,
      status: paymentIntent.status,
      transactionId: paymentIntent.id
    });

    await payment.save();

    // Update booking payment status
    booking.paymentStatus = paymentIntent.status;
    await booking.save();

    // Create notification
    await createNotification(
      booking.customerId,
      `Payment ${paymentIntent.status} for booking ${bookingId}`,
      'payment',
      `/bookings/${bookingId}`
    );

    // Temporarily disabled due to missing Stripe secret key
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentStatus: paymentIntent.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify booking exists
    const booking = await Booking.findById(payment.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId,
      amount: payment.amount
    });

    // Update payment status
    payment.status = 'refunded';
    payment.refundDate = Date.now();
    await payment.save();

    // Update booking status
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Create notification
    await createNotification(
      booking.customerId,
      `Refund processed for booking ${booking._id}`,
      'payment',
      `/bookings/${booking._id}`
    );

    res.json({ message: 'Refund processed successfully', refund });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createPaymentIntent,
  processRefund
};
