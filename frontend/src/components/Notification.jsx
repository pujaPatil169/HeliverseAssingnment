import { Snackbar, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Notification = ({ open, message, onClose }) => {
  
  // Prop validation
  Notification.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  return ( 
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={<Typography>{message}</Typography>}
    />
  );
};

Notification.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;
