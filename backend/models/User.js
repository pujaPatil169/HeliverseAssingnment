const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['customer', 'vendor', 'admin']
  },
  vendorId: String,
  contactDetails: {
    phone: String,
    address: String
  },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('User', userSchema);
