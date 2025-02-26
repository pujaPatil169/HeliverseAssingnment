import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from './wishlistService';

const initialState = {
  wishlist: null,
  status: 'idle',
  error: null,
};

// Get user's wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, thunkAPI) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Add listing to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (listingId, thunkAPI) => {
    try {
      return await wishlistService.addToWishlist(listingId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Remove listing from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (listingId, thunkAPI) => {
    try {
      return await wishlistService.removeFromWishlist(listingId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    reset: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { reset } = wishlistSlice.actions;
export default wishlistSlice.reducer;
