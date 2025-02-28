const Unit = require('../models/Unit');
const Listing = require('../models/Listing');

const createUnit = async (req, res) => {
  try {
    const { listingId, type, name, description, capacity, price, quantity, amenities } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to add units to this listing' });
    }

    const unit = new Unit({
      listingId,
      type,
      name,
      description,
      capacity,
      price,
      quantity,
      amenities
    });

    await unit.save();
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUnitsByListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const units = await Unit.find({ listingId });
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const unit = await Unit.findById(unitId);

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const listing = await Listing.findById(unit.listingId);
    if (listing.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this unit' });
    }

    Object.assign(unit, req.body);
    await unit.save();
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const unit = await Unit.findById(unitId);

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const listing = await Listing.findById(unit.listingId);
    if (listing.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this unit' });
    }

    await unit.remove();
    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUnit,
  getUnitsByListing,
  updateUnit,
  deleteUnit
};
