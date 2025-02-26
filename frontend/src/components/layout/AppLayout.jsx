import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice'; // Import the logout action

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Access the authentication state

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };

  return (
    <div>
      <AppBar position="static"> 
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hotel and Restaurant Booking
          </Typography>
          <Link to="/">
            <Button color="inherit">Home</Button>
          </Link>
          <Link to="/search">
            <Button color="inherit">Search</Button>
          </Link>
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Link to="/login">
                <Button color="inherit">Login</Button>
              </Link>
              <Link to="/register">
                <Button color="inherit">Register</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
      <main>{children}</main>
      <footer>
        <Typography variant="body2" color="textSecondary" align="center">
          © 2023 Hotel and Restaurant Booking
        </Typography>
      </footer>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
