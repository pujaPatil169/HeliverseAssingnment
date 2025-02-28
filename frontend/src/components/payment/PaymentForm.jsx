import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { processPayment } from '../../features/payment/paymentSlice';
import { TextField, Button, Typography } from '@mui/material';

import PropTypes from 'prop-types';

const PaymentForm = ({ bookingId }) => {
  const dispatch = useDispatch();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(processPayment({ bookingId, cardNumber, expiryDate, cvv }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Payment Details</Typography>
      <TextField
        label="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Expiry Date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Pay Now
      </Button>
    </form>
  );
};

PaymentForm.propTypes = {
  bookingId: PropTypes.string.isRequired,
};

export default PaymentForm;
