const express = require('express');
const router = express.Router();

// Sample GET route for listings
router.get('/', (req, res) => {
    res.json({ message: 'Listing route is working!' });
});

module.exports = router;
