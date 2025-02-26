const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

const createReview = async (req, res) => {
  const { rating, comment } = req.body;

  // Validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  // Validate comment
  if (comment && comment.trim() === '') {
    return res.status(400).json({ message: 'Comment cannot be empty' });
  }
  try {
    const { bookingId, rating, comment, images } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to review this booking' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = new Review({
      comments: comment, // Ensure comments are saved correctly
      bookingId,
      listingId: booking.listingId,
      customerId: req.user._id,
      rating,
      comment,
      images,
      status: 'pending'
    });

    await review.save();
    
    // Create notification for vendor
    const listing = await Listing.findById(booking.listingId);
    await createNotification(
      listing.vendorId,
      `New review received for ${listing.name}`,
      'review',
      `/reviews/${review._id}`
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    const reviews = await Review.find({ listingId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;
    await review.save();

    res.json({ message: 'Review status updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addVendorResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.vendorResponse = response;
    await review.save();

    res.json({ message: 'Vendor response added successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getListingReviews,
  updateReviewStatus,
  addVendorResponse
};
