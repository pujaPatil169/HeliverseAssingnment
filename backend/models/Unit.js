const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['room', 'table']
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  capacity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  amenities: [String],
  images: [String],
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  availability: [{
    date: Date,
    available: { 
      type: Boolean, 
      default: true 
    }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
unitSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Unit', unitSchema);
