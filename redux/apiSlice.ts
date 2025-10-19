/**
 * RTK Query Base API Slice
 * Central API configuration with authentication
 */

import { ENV } from '@/constants/enviroment';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: [
    'Auth',
    'User',
    'Patient',
    'Doctors',
    'Appointments',
    'Wallet',
    'Staff',
    'Attendance',
    'Leaves',
    'Owner',
    'Hospital',
    'Bonuses',
  ],

  endpoints: () => ({}),
});
