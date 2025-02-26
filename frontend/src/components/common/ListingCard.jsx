import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

import PropTypes from 'prop-types';

const ListingCard = ({ listing }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={listing.image}
        alt={listing.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {listing.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {listing.description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${listing.price} per night
        </Typography>
        <Button size="small" variant="contained" color="primary">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

ListingCard.propTypes = {
  listing: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default ListingCard;
