const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

const getSystemStats = async (req, res) => {
  try {
    const [users, listings, bookings] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Booking.countDocuments()
    ]);

    res.json({ users, listings, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const [recentUsers, recentListings, recentBookings] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5),
      Listing.find().sort({ createdAt: -1 }).limit(5),
      Booking.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({ recentUsers, recentListings, recentBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manageUser = async (req, res) => {
  console.log(`Admin ${req.user._id} is attempting to ${action} user ${userId}`);
  try {
    const { userId } = req.params;
    const { action } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    switch (action) {
      case 'activate':
        user.status = 'active';
        break;
      case 'deactivate':
        user.status = 'inactive';
        break;
      case 'delete':
        await user.remove();
        return res.json({ message: 'User deleted successfully' });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();
    console.log(`User ${userId} has been ${action}d successfully`);
    res.json({ message: `User ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveListing = async (req, res) => {
  const { listingId } = req.params;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  listing.status = 'active';
  await listing.save();

  res.json({ message: 'Listing approved successfully', listing });
};

const disapproveListing = async (req, res) => {
  const { listingId } = req.params;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  listing.status = 'inactive';
  await listing.save();

  res.json({ message: 'Listing disapproved successfully', listing });
};

module.exports = {
  approveListing,
  disapproveListing,
  getSystemStats,
  getRecentActivities,
  manageUser
};
