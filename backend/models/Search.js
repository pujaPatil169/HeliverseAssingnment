const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  filters: {
    location: String,
    priceRange: {
      min: Number,
      max: Number
    },
    ratings: Number,
    amenities: [String]
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Search', searchSchema);
