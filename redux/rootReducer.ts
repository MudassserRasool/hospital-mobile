/**
 * Root Reducer - Combines all feature reducers
 */

import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './features/auth/authSlice';
import hospitalReducer from './features/hospital/hospitalSlice';
import ownerReducer from './features/owner/ownerSlice';
import patientReducer from './features/patient/patientSlice';
import staffReducer from './features/staff/staffSlice';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  patient: patientReducer,
  staff: staffReducer,
  owner: ownerReducer,
  hospital: hospitalReducer,
});

export default rootReducer;
