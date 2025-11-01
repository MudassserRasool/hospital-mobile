/**
 * Authentication API endpoints
 */

import { apiSlice } from '../../apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Google OAuth Login
    loginWithGoogle: builder.mutation({
      query: (data) => ({
        url: '/auth/login/google',
        method: 'POST',
        body: data, // { googleId, email, firstName, lastName, role, profilePicture, phone, hospitalId }
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Refresh Token
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),

    // Logout
    logout: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { refreshToken },
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Get Profile
    getProfile: builder.query({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),

    // Register Device Token for Push Notifications
    registerDeviceToken: builder.mutation({
      query: (deviceToken) => ({
        url: '/notifications/register-token',
        method: 'POST',
        body: { deviceToken },
      }),
    }),

    unregisterDeviceToken: builder.mutation({
      query: (deviceToken) => ({
        url: '/notifications/unregister-token',
        method: 'POST',
        body: { deviceToken },
      }),
    }),
  }),
});

export const {
  useLoginWithGoogleMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useRegisterDeviceTokenMutation,
  useUnregisterDeviceTokenMutation,
} = authApi;
