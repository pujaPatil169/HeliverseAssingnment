const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Listing = require('../models/Listing');

const getVendorAnalytics = async (req, res) => {
  try {
    const vendorId = req.user._id;

    // Get all listings for the vendor
    const listings = await Listing.find({ vendorId });

    // Get booking statistics
    const bookings = await Booking.aggregate([
      {
        $match: {
          listingId: { $in: listings.map(l => l._id) }
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          averageBookingValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    // Get review statistics
    const reviews = await Review.aggregate([
      {
        $match: {
          listingId: { $in: listings.map(l => l._id) }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const analytics = {
      totalListings: listings.length,
      totalBookings: bookings[0]?.totalBookings || 0,
      totalRevenue: bookings[0]?.totalRevenue || 0,
      averageBookingValue: bookings[0]?.averageBookingValue || 0,
      averageRating: reviews[0]?.averageRating || 0,
      totalReviews: reviews[0]?.totalReviews || 0
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    // Get overall statistics
    const [totalListings, totalBookings, totalRevenue, totalUsers] = await Promise.all([
      Listing.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ]),
      User.countDocuments()
    ]);

    const analytics = {
      totalListings,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVendorAnalytics,
  getAdminAnalytics
};
