const Booking = require('../models/Booking');
const Unit = require('../models/Unit');
const Listing = require('../models/Listing');
const { updateCalendar } = require('./bookingCalendarController');
const { createNotification } = require('./notificationController');

const createBooking = async (req, res) => {
  const { startDate, endDate } = req.body;
  
  // Validate booking dates
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ message: 'Start date must be before end date' });
  }
  try {
    const { listingId, unitId, startDate, endDate, numberOfGuests, specialRequests } = req.body;

    // Verify unit exists and is available
    const unit = await Unit.findById(unitId);
    if (!unit || unit.status !== 'available') {
      return res.status(400).json({ message: 'Selected unit is not available' });
    }

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Calculate total price based on duration and unit price
    const duration = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    const totalPrice = unit.price * duration;

    const booking = new Booking({
      paymentDetails: {
        amount: totalPrice,
        currency: 'USD',
        paymentMethod: 'dummy', // Simulated payment method
        transactionId: 'dummy_transaction_id', // Simulated transaction ID
        status: 'success' // Simulated payment status
      },
      customerId: req.user._id,
      listingId,
      unitId,
      startDate,
      endDate,
      totalPrice,
      numberOfGuests,
      specialRequests
    });

    await booking.save();
    
    // Update booking calendar
    await updateCalendar(booking);
    
    // Create notification for vendor
    await createNotification(
      listing.vendorId,
      `New booking received for ${listing.name}`,
      'booking',
      `/bookings/${booking._id}`
    );

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify user has permission to update
    const listing = await Listing.findById(booking.listingId);
    if (req.user.role === 'vendor' && listing.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this booking' });
    }

    if (req.user.role === 'customer' && booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this booking' });
    }

    booking.bookingStatus = status;
    booking.updatedAt = Date.now();
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('listingId', 'name images')
      .populate('unitId', 'name price');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorBookings = async (req, res) => {
  try {
    const listings = await Listing.find({ vendorId: req.user._id });
    const listingIds = listings.map(listing => listing._id);

    const bookings = await Booking.find({ listingId: { $in: listingIds } })
      .populate('listingId', 'name images')
      .populate('unitId', 'name price')
      .populate('customerId', 'name email');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  updateBookingStatus,
  getCustomerBookings,
  getVendorBookings
};
