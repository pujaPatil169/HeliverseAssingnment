import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice'; // Import the login action
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Define setError

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      dispatch(login({ vendorId: response.data.vendorId })); // Dispatch the login action with vendorId
      console.log('Vendor ID after login:', response.data.vendorId); // Log the vendorId for debugging
      console.log('response data after login', response.data); // Log the token for debugging
      navigate('/vendor'); // Redirect to the vendor dashboard after login
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Login failed. Please check your credentials.'); // Set error message
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
