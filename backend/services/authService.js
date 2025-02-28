const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose'); // Import mongoose

const generateVendorId = () => {
  return new mongoose.Types.ObjectId(); // Generate a valid ObjectId for vendor ID
};

const registerUser = async (userData) => {
  try {
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with vendorId
    const vendorId = generateVendorId(); // Generate vendorId
    console.log('vendorId in authservice',vendorId);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      vendorId 
    });
    console.log('user in authservice fo register',user);
console.log('useer in autheservice fo register',user);
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorId: vendorId, // Include vendorId in the response
      token // Include token in the response
    };
  } catch (error) {
    throw error;
  }
};

const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({ email });
    console.log('user in login of authservice',user);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorId: user.vendorId, // Include vendorId in the response
      token // Include token in the response
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser
};
