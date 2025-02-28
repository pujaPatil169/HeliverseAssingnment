const BookingCalendar = require('../models/BookingCalendar');
const Booking = require('../models/Booking');

const checkAvailability = async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.query;

    const calendar = await BookingCalendar.findOne({ listingId });
    if (!calendar) {
      return res.json({ available: true });
    }

    const isAvailable = !calendar.bookedDates.some(booking => {
      return (
        (startDate >= booking.startDate && startDate <= booking.endDate) ||
        (endDate >= booking.startDate && endDate <= booking.endDate) ||
        (startDate <= booking.startDate && endDate >= booking.endDate)
      );
    });

    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCalendar = async (booking) => {
  try {
    const { listingId, startDate, endDate, _id } = booking;

    let calendar = await BookingCalendar.findOne({ listingId });
    if (!calendar) {
      calendar = new BookingCalendar({ listingId });
    }

    calendar.bookedDates.push({
      startDate,
      endDate,
      bookingId: _id
    });

    await calendar.save();
  } catch (error) {
    console.error('Error updating booking calendar:', error);
  }
};

const removeFromCalendar = async (bookingId) => {
  try {
    const calendar = await BookingCalendar.findOne({
      'bookedDates.bookingId': bookingId
    });

    if (calendar) {
      calendar.bookedDates = calendar.bookedDates.filter(
        date => date.bookingId.toString() !== bookingId.toString()
      );
      await calendar.save();
    }
  } catch (error) {
    console.error('Error removing from booking calendar:', error);
  }
};

module.exports = {
  checkAvailability,
  updateCalendar,
  removeFromCalendar
};
