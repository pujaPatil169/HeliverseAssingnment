import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './Routes'; // Import the routes
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import store from './app/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap with BrowserRouter */}
      <Provider store={store}>
      <AppRoutes /> {/* Use the AppRoutes component for routing */}
      </Provider>
    </BrowserRouter> {/* Close BrowserRouter */}

  </React.StrictMode>,
);
