const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, set: (v) => hashPassword(v) }, // Hash password before saving
  role: { 
    type: String, 
    required: true,
    enum: ['customer', 'vendor', 'admin']
  },
  contactDetails: {
    phone: String,
    address: String
  }
});

const listingSchema = new mongoose.Schema({
  vendorId: { 
    type: String, // Change to String to accommodate UUID
    required: true 
  },
  type: {
    type: String,
    required: true,
    enum: ['hotel', 'restaurant']
  },
  name: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  description: String,
  facilities: [String],
  amenities: [String], // Additional field for amenities
  pricing: {
    basePrice: Number,
    currency: { type: String, default: 'USD' }
  },
  images: [String],
  status: {
    bookingStatus: { // Define booking status transitions
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

const unitSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  type: { type: String, required: true }, // Room type or Table type
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  availability: [{
    date: Date,
    available: { type: Boolean, default: true }
  }]
});

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  bookingDates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentDetails: {
    amount: Number,
    currency: { type: String, default: 'USD' },
    paymentMethod: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending'
    }
  }
});

const reviewSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);
const Unit = mongoose.model('Unit', unitSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = {
  User,
  Listing,
  Unit,
  Booking,
  Review
};
