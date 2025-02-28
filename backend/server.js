const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// const searchRoutes = require('./routes/searchRoutes'); // Import searchRoutes
const vendorRoutes = require('./routes/vendorRoutes'); // Import searchRoutes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const listingRoutes = require('./routes/listingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/vendors', vendorRoutes); // Register vendor routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
