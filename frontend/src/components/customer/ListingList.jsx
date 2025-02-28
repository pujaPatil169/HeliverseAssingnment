import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const ListingList = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    city: '',
    priceRange: 'all'
  });
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const queryParams = new URLSearchParams({
          type: filters.type,
          city: filters.city,
          priceRange: filters.priceRange
        }).toString();

        const response = await fetch(`http://localhost:5000/api/listings?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch listings');

        const data = await response.json();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters, user.token]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="all">All Types</option>
            <option value="hotel">Hotels</option>
            <option value="restaurant">Restaurants</option>
          </select>

          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
            className="p-2 border rounded"
          />

          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="all">All Prices</option>
            <option value="budget">Budget</option>
            <option value="mid">Mid-Range</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  ListingCard.propTypes = {
    listing: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string.isRequired,
      address: PropTypes.shape({
        city: PropTypes.string
      }).isRequired,
      pricing: PropTypes.shape({
        basePrice: PropTypes.number.isRequired
      }).isRequired,
      type: PropTypes.string.isRequired
    }).isRequired
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={listing.images[0] || '/placeholder.jpg'} 
        alt={listing.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{listing.name}</h3>
        <p className="text-gray-600 mb-2">{listing.address.city}</p>
        <p className="text-gray-800 font-bold">
          ${listing.pricing.basePrice} / night
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
          </span>
          <button
            onClick={() => navigate(`/listing/${listing._id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingList;
