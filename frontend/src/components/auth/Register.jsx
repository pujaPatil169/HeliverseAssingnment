import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../features/auth/authSlice'; // Import the register action
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // New state for name
  const [role, setRole] = useState(''); // New state for role
  const [error, setError] = useState(''); // Define setError

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', { name, email, password, role });
      dispatch(register({ vendorId: response.data.vendorId })); // Dispatch the register action with vendorId
      navigate('/vendor'); // Redirect to the vendor dashboard after registration
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Registration failed. Please try again.'); // Set error message
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <TextField
       
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
        
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />







        <Button type="submit" variant="contained" color="primary" >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
