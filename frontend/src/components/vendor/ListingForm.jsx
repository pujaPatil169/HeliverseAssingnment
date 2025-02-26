import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const ListingForm = () => {
  const user = useSelector(selectCurrentUser);
  const [formData, setFormData] = useState({
    type: 'hotel',
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    facilities: '',
    basePrice: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...formData,
          facilities: formData.facilities.split(',').map(f => f.trim()),
          pricing: { basePrice: parseFloat(formData.basePrice) }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      // Reset form or show success message
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="hotel">Hotel</option>
          <option value="restaurant">Restaurant</option>
        </select>
      </div>
      
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Base Price</label>
        <input
          type="number"
          name="basePrice"
          value={formData.basePrice}
          onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Create Listing
      </button>
    </form>
  );
};

export default ListingForm;
