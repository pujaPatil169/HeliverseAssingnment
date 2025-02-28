const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  permissions: {
    manageUsers: {
      type: Boolean,
      default: false
    },
    manageListings: {
      type: Boolean,
      default: false
    },
    manageBookings: {
      type: Boolean,
      default: false
    },
    managePayments: {
      type: Boolean,
      default: false
    },
    manageReviews: {
      type: Boolean,
      default: false
    },
    manageSystemSettings: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
