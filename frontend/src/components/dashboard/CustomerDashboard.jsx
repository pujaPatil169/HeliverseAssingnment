import { useEffect, useState } from 'react';
import SearchFilter from '../SearchFilter'; // Import SearchFilter component
import { Link } from 'react-router-dom'; // Import Link for navigation

import axios from 'axios';

function CustomerDashboard() {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);

  const handleSearch = (filters) => {
    fetchListings(filters); // Pass filters to fetchListings
  };

  useEffect(() => {
    fetchListings();
    fetchBookings();
  }, []);

  const fetchListings = async (filters = {}) => {
    console.log("Fetching listings..."); // Log the fetching process
    const response = await axios.get('/api/listings', { params: filters }); // Include filters in the API call
    console.log(response.data); // Log the response data
    setListings(Array.isArray(response.data) ? response.data : []); // Ensure listings is an array
  };

  const fetchBookings = async () => {
    console.log("Fetching bookings..."); // Log the fetching process
    const response = await axios.get('/api/bookings/customer');
    console.log(response.data); // Log the response data
    setBookings(Array.isArray(response.data) ? response.data : []); // Ensure bookings is an array
  };

  const handleLeaveReview = async (listingId) => {
    const review = prompt("Enter your review:");
    const rating = prompt("Enter your rating (1-5):");
    await axios.post('/api/reviews', { listingId, review, rating });
    fetchListings(); // Refresh listings to show new reviews
  };

  return (
    <div>
      <h1>Customer Dashboard</h1>
      <SearchFilter onSearch={handleSearch} /> {/* Include SearchFilter component */}
      <h2>Available Listings</h2>
      <Link to="/search">
        <button>View All Listings</button> {/* Button to view all listings */}
      </Link>
      <ul>
        {listings.length === 0 && <li>No listings found.</li>} {/* Message for no listings */}
        {listings.map((listing) => (
          <li key={listing._id}>
            {listing.name} - {listing.status}
            <button onClick={() => handleLeaveReview(listing._id)}>Leave Review</button>
          </li>
        ))}
      </ul>
      <h2>Your Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            Booking for {booking.listingId.name} from {booking.bookingDates.start} to {booking.bookingDates.end}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerDashboard;
