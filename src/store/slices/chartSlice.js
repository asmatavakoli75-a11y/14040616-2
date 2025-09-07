import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch chart data
export const fetchChartData = createAsyncThunk(
  'charts/fetchData',
  async (splitRatio = '80:20', { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/data?split=${splitRatio}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chartSlice = createSlice({
  name: 'charts',
  initialState: {
    modelPerformance: {
      accuracy: 0,
      f1: 0,
      auc: 0,
      precision: 0,
      recall: 0,
    },
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.modelPerformance = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default chartSlice.reducer;
