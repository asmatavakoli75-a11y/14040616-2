import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to submit a completed assessment
export const submitAssessment = createAsyncThunk(
  'assessment/submitAssessment',
  async (assessmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/assessments', assessmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState: {
    submissionStatus: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    resetSubmissionStatus: (state) => {
      state.submissionStatus = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAssessment.pending, (state) => {
        state.submissionStatus = 'loading';
        state.error = null;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.submissionStatus = 'succeeded';
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.submissionStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetSubmissionStatus } = assessmentSlice.actions;
export default assessmentSlice.reducer;
