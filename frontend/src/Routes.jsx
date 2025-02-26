import { Route, Routes } from 'react-router-dom';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import VendorDashboard from './components/dashboard/VendorDashboard';
import Login from './components/auth/Login'; // Import the Login component
import Register from './components/auth/Register';
import Home from './components/Home'; // Import the Home component
import SearchResults from './components/SearchResults'; // Import the SearchResults component

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> {/* Add the login route */}
      <Route path="/register" element={<Register />} /> {/* Add the login route */}
      <Route path="/" element={<Home />} /> {/* Add the home route */}
      <Route path="/search" element={<SearchResults />} /> {/* Add the search results route */}
      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/vendor" element={<VendorDashboard />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default AppRoutes;
