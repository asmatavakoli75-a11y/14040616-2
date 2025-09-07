import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch settings
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    data: {
      appName: 'CLBP Predictive System',
      emergencyContact: { name: '', phone: '' },
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Standard reducers can go here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;
