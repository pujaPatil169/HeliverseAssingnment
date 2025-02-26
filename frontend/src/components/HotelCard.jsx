import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes for validation

const HotelCard = ({ hotel }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={hotel.image}
        alt={hotel.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {hotel.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hotel.description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${hotel.price} per night
        </Typography>
        <Button size="small" variant="contained" color="primary">
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

HotelCard.propTypes = {
  hotel: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default HotelCard;
