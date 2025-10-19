/**
 * Root Reducer - Combines all feature reducers
 */

import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './features/auth/authSlice';
import patientReducer from './features/patient/patientSlice';
import staffReducer from './features/staff/staffSlice';
import ownerReducer from './features/owner/ownerSlice';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  patient: patientReducer,
  staff: staffReducer,
  owner: ownerReducer,
});

export default rootReducer;
