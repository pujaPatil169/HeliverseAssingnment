import { Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';





 const AdminDashboard = () => {
  // Admin Dashboard Component
  const navigate = useNavigate();

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleManageListings = () => {
    navigate('/admin/listings');
  };

  const handleManageReviews = () => {
    navigate('/admin/reviews');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleManageUsers}>
        Manage Users
      </Button>
      <Button variant="contained" color="primary" onClick={handleManageListings}>
        Manage Listings
      </Button>
      <Button variant="contained" color="primary" onClick={handleManageReviews}>
        Manage Reviews
      </Button>
    </Container>
  );
};

export default AdminDashboard;