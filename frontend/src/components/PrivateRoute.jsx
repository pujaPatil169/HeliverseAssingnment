import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice';

const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default PrivateRoute;
