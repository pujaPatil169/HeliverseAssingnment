import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    vendorId: null, // Initialize vendorId to null
    isAuthenticated: false,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.vendorId = action.payload.vendorId; // Set vendorId on login
    },
    logout(state) {
      state.isAuthenticated = false;
      state.vendorId = null; // Reset vendorId on logout
    },
    register(state, action) {
      state.vendorId = action.payload.vendorId; // Set vendorId on registration
      state.isAuthenticated = true; // Assuming registration also logs the user in
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
