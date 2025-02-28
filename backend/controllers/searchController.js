const Listing = require('../models/Listing');

const searchListings = async (req, res) => {
  try {
    const { location, checkInDate, checkOutDate, guests, minPrice, maxPrice, amenities } = req.query;

    const query = {
      status: 'approved'
    };

    // Location filter
    if (location) {
      query['location.city'] = new RegExp(location, 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Amenities filter
    if (amenities) {
      query.amenities = { $all: amenities.split(',') };
    }

    // Find listings that match the search criteria
    const listings = await Listing.find(query)
      .populate('units')
      .exec();

    // Filter listings based on availability
    const availableListings = listings.filter(listing => {
      return listing.units.some(unit => {
        // Check if unit is available for the selected dates
        const isAvailable = !unit.bookedDates.some(booking => {
          return (
            (new Date(checkInDate) <= booking.endDate && 
             new Date(checkOutDate) >= booking.startDate)
          );
        });

        // Check if unit has enough capacity
        const hasCapacity = unit.capacity >= Number(guests || 1);

        return isAvailable && hasCapacity;
      });
    });

    res.json(availableListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchListings
};
