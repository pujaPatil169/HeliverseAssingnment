const Listing = require('../models/Listing'); // Import the Listing model

// Controller function to add a new listing
const mongoose = require('mongoose'); // Import mongoose
const addListing = async (req, res) => {
  const { vendorId } = req.body;

  // Validate vendorId
  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ message: 'Invalid vendorId. It must be a valid ObjectId.' });
  }
  try {
    const { name, address, contact, description, price, image, type, vendorId } = req.body;

    // Create a new listing instance
    const newListing = new Listing({ 
      name,
      address,
      contact,
      description,
      price,
      image,
      type,      // Include type
      vendorId,  // Include vendorId
    });

    // Save the listing to the database
    await newListing.save();
    res.status(201).json({ message: 'Listing added successfully', listing: newListing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding listing', error });
  }
};

module.exports = { addListing };
