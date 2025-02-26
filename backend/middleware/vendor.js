const User = require('../models/User');

const vendorMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied. Vendor privileges required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = vendorMiddleware;
