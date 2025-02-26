const Wishlist = require('../models/Wishlist');
const Listing = require('../models/Listing');

const addToWishlist = async (req, res) => {
  try {
    const { listingId } = req.body;

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });


    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user._id,
        listings: [listingId]
      });
    } else {
      // Check if listing already exists in wishlist
      if (wishlist.listings.includes(listingId)) {
        return res.status(400).json({ 
          message: 'Listing already in wishlist',
          wishlistCount: wishlist.listings.length
        });
      }
      
      // Limit wishlist size to 50 items
      if (wishlist.listings.length >= 50) {
        return res.status(400).json({ 
          message: 'Wishlist limit reached (50 items)',
          wishlistCount: wishlist.listings.length
        });
      }
      
      wishlist.listings.push(listingId);
    }

    await wishlist.save();
    
    res.status(201).json({
      wishlist,
      wishlistCount: wishlist.listings.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.listings = wishlist.listings.filter(id => id.toString() !== listingId);
    await wishlist.save();

    res.json({ message: 'Listing removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate({
        path: 'listings',
        select: 'name images pricing type status',
        match: { status: 'approved' }
      });

    // Filter out any listings that are no longer approved
    if (wishlist) {
      wishlist.listings = wishlist.listings.filter(listing => listing !== null);
      await wishlist.save();
    }

    res.json({
      wishlist: wishlist || { listings: [] },
      wishlistCount: wishlist ? wishlist.listings.length : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlistCount = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    res.json({ count: wishlist ? wishlist.listings.length : 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getWishlistCount
};
