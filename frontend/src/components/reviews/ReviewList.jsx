import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const ReviewList = ({ listingId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/listings/${listingId}/reviews`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [listingId, user.token]);

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-2">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
              <span className="text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

ReviewList.propTypes = {
  listingId: PropTypes.string.isRequired
};

export default ReviewList;
