import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to post assessment data and get a prediction
export const postAssessment = createAsyncThunk(
  'prediction/postAssessment',
  async (assessmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/predict', assessmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const predictionSlice = createSlice({
  name: 'prediction',
  initialState: {
    result: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetPrediction: (state) => {
      state.result = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postAssessment.pending, (state) => {
        state.status = 'loading';
        state.result = null;
        state.error = null;
      })
      .addCase(postAssessment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(postAssessment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetPrediction } = predictionSlice.actions;
export default predictionSlice.reducer;
