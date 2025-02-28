import { useState } from 'react'; 
import { useSelector ,useDispatch} from 'react-redux'; // Import useSelector
import axios from 'axios';
import {login} from '../../features/auth/authSlice'; // Import the login action
const VendorDashboard = () => {
  const vendorId = useSelector((state) => state.auth.vendorId); // Retrieve vendorId from Redux state
  const [listing, setListing] = useState({
    vendorId: '60d5ec49f1a2c12f88b0c1e0', // Hardcoded valid vendorId for testing
    type: '',
    name: '',
    address: { street: '', city: '', state: '', zip: '', country: '' },
    contact: '',
    description: '',
    price: '',
    image: ''
  });
const dispatch = useDispatch()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  console.log('Vendor ID:', vendorId); // Log the vendorId for debugging
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorId) {
      alert('You must be logged in to add a listing.'); // Alert if vendorId is not set
      return;
    }
    try {
      console.log('Listing object being sent:', listing); // Log the listing object for debugging
    const response = await axios.post('http://localhost:4000/api/vendors/add', listing);
      alert(response.data.message);
      dispatch(login({ vendorId: response.data.vendorId })); // Dispatch the login action with vendorId
      // Reset form or handle success
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to add listing');
    }
  };

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Property Name" onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Contact Information" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
        <select name="type" onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="hotel">Hotel</option>
          <option value="restaurant">Restaurant</option>
        </select>
        <input type="text" name="image" placeholder="Image URL" onChange={handleChange} required />
        <h3>Address</h3>
        <input type="text" name="street" placeholder="Street" onChange={handleAddressChange} required />
        <input type="text" name="city" placeholder="City" onChange={handleAddressChange} required />
        <input type="text" name="state" placeholder="State" onChange={handleAddressChange} required />
        <input type="text" name="zip" placeholder="Zip" onChange={handleAddressChange} required />
        <input type="text" name="country" placeholder="Country" onChange={handleAddressChange} required />
        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
};

export default VendorDashboard;
