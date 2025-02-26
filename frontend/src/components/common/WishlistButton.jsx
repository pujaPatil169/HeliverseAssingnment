import  { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import { toast } from 'react-toastify';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const WishlistButton = ({ listingId, isInWishlist, className = '' }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleWishlistClick = async () => {
    if (!user) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(listingId)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(listingId)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistClick}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${className} ${
        isInWishlist
          ? 'text-red-500 hover:bg-red-50'
          : 'text-gray-400 hover:bg-gray-100'
      }`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlist ? (
        <HeartSolid className="h-6 w-6" />
      ) : (
        <HeartOutline className="h-6 w-6" />
      )}
    </button>
  );
};

WishlistButton.propTypes = {
  listingId: PropTypes.string.isRequired,
  isInWishlist: PropTypes.bool.isRequired,
  className: PropTypes.string
};

export default WishlistButton;
