const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  pricing: {
    basePrice: Number,
    currency: { type: String, default: 'USD' }
  },
  images: [String],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
listingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
