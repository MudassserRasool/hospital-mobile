/**
 * Authentication API endpoints
 */

import { apiSlice } from '../../apiSlice';
import { User } from '@/types';

interface LoginRequest {
  googleToken: string;
}

interface LoginResponse {
  user: User;
  token: string;
  role: 'patient' | 'staff' | 'owner';
}

interface RegisterRequest {
  googleToken: string;
  role: 'patient' | 'staff' | 'owner';
  name: string;
  email: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/google/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    googleRegister: builder.mutation<LoginResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/google/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    
    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGoogleLoginMutation,
  useGoogleRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
} = authApi;
