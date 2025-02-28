import { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'; // Import additional components for listing type
import PropTypes from 'prop-types'; // Import PropTypes for validation

const SearchFilter = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const [listingType, setListingType] = useState('hotel'); // State for listing type

  const handleSearch = () => {
    onSearch({ query, priceRange, rating, listingType }); // Include listingType in search parameters
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Price Range</InputLabel>
        <Select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="0-50">$0 - $50</MenuItem>
          <MenuItem value="51-100">$51 - $100</MenuItem>
          <MenuItem value="101-200">$101 - $200</MenuItem>
          <MenuItem value="201+">$201+</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Rating</InputLabel>
        <Select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="1">1 Star</MenuItem>
          <MenuItem value="2">2 Stars</MenuItem>
          <MenuItem value="3">3 Stars</MenuItem>
          <MenuItem value="4">4 Stars</MenuItem>
          <MenuItem value="5">5 Stars</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Listing Type</InputLabel>
        <Select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
        >
          <MenuItem value="hotel">Hotel</MenuItem>
          <MenuItem value="restaurant">Restaurant</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

SearchFilter.propTypes = {
  onSearch: PropTypes.func.isRequired, // Validate onSearch prop
};

export default SearchFilter;
