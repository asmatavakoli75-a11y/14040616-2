import { configureStore } from '@reduxjs/toolkit';

import settingsReducer from './slices/settingsSlice';
import userReducer from './slices/userSlice';
import chartReducer from './slices/chartSlice';
import predictionReducer from './slices/predictionSlice';
import assessmentReducer from './slices/assessmentSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    users: userReducer,
    charts: chartReducer,
    prediction: predictionReducer,
    assessment: assessmentReducer,
  },
  // Adding middleware is a good practice for things like logging
  // or handling async actions, but we can start simple.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});
