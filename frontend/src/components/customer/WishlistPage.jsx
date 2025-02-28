import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist } from '../../features/wishlist/wishlistSlice';
import ListingCard from '../common/ListingCard';
import { Typography } from '@mui/material';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        My Wishlist
      </Typography>
      {wishlist.length > 0 ? (
        wishlist.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))
      ) : (
        <Typography variant="body1">Your wishlist is empty.</Typography>
      )}
    </div>
  );
};

export default WishlistPage;
