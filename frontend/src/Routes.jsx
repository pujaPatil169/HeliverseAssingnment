import { Route, Routes } from 'react-router-dom';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import VendorDashboard from './components/dashboard/VendorDashboard';
import Login from './components/auth/Login'; // Import the Login component
import Register from './components/auth/Register';
import Home from './components/Home'; // Import the Home component
import SearchResults from './components/SearchResults'; // Import the SearchResults component
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
      <Route path="/login" element={<Login />} /> {/* Add the login route */}
      <Route path="/register" element={<Register />} /> `{/* Add the login route */}
      <Route path="/" element={<Home />} /> {/* Add the home route */}
      <Route path="/search" element={<SearchResults />} /> {/* Add the search results route */}
      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/vendor" element={<VendorDashboard />} />
      </Route>
      {/* Add other routes here */}
    </Routes>
  );
};

export default AppRoutes;





// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       // Public Route (Only accessible when logged OUT)
//       {
//         element: <ProtectedRoute authPage={true} />, // Redirects to "/" if logged in
//         children: [{ path: "auth", element: <LoginPage /> }],
//       },

//       // Protected Routes (Only accessible when logged IN)
//       {
//         element: <ProtectedRoute authPage={false} />, // Redirects to "/auth" if NOT logged in
//         children: [
//           { path: "news/:category", element: <Feed /> },
//           { path: "media", element: <MediaPage /> },
//           { path: "/home", element: <Home /> },
//           { path: "about", element: <About /> },
//           { path: "contact", element: <Contact /> },
//           { path: "dashboard", element: <Dashboard /> },
//           { path: "articles/:id", element: <ArticleDetail /> },
//           { path: "enewspapers", element: <ENewspaperPage /> },
//           { path: "newspaper/:newspaperName", element: <NewspaperDetailPage /> },
//         ],
//       },
//     ],
//   },
// ]);

