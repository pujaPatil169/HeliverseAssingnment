import  { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function ReviewForm({ listingId }) {
  // PropTypes validation
  ReviewForm.propTypes = {
    listingId: PropTypes.string.isRequired,
  };
  // PropTypes validation
  ReviewForm.propTypes = {
    listingId: PropTypes.string.isRequired,
  };
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', { listingId, rating, comment });
      alert('Review submitted successfully!');
      setRating(1);
      setComment('');
    } catch (error) {
      alert('Error submitting review: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Leave a Review</h2>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </label>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
