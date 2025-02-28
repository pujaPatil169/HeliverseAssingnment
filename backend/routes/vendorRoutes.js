const express = require('express');
const { addListing } = require('../controllers/vendorController');

const router = express.Router();

// Route to add a new listing

router.post('/add', addListing); // Route to add a new listing
module.exports = router;
