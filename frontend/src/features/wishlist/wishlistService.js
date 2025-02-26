import axios from 'axios';

const API_URL = '/api/wishlist';

// Get user's wishlist
const getWishlist = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add listing to wishlist
const addToWishlist = async (listingId) => {
  const response = await axios.post(API_URL, { listingId });
  return response.data;
};

// Remove listing from wishlist
const removeFromWishlist = async (listingId) => {
  const response = await axios.delete(`${API_URL}/${listingId}`);
  return response.data;
};

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;
