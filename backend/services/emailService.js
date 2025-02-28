const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendBookingConfirmation = async (email, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmation',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Thank you for your booking!</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Listing: ${bookingDetails.listingName}</li>
        <li>Check-in: ${new Date(bookingDetails.startDate).toDateString()}</li>
        <li>Check-out: ${new Date(bookingDetails.endDate).toDateString()}</li>
        <li>Total Price: $${bookingDetails.totalPrice}</li>
      </ul>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendReviewNotification = async (email, reviewDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'New Review Received',
    html: `
      <h1>New Review Received</h1>
      <p>You have received a new review for your listing:</p>
      <h3>Review Details:</h3>
      <ul>
        <li>Rating: ${reviewDetails.rating} stars</li>
        <li>Comment: ${reviewDetails.comment}</li>
      </ul>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendBookingConfirmation,
  sendReviewNotification
};
