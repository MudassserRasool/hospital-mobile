/**
 * Profiles API endpoints
 * For role-specific profile data (not patients - they use /patients/me)
 */

import { apiSlice } from '../../apiSlice';

export const profilesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get my profile
    getMyProfile: builder.query({
      query: () => '/profiles/me',
      providesTags: ['Profile'],
    }),

    // Update my profile
    updateMyProfile: builder.mutation({
      query: (data) => ({
        url: '/profiles/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile', 'User'],
    }),

    // Create profile
    createProfile: builder.mutation({
      query: (data) => ({
        url: '/profiles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetMyProfileQuery: useGetProfileQuery,
  useUpdateMyProfileMutation: useUpdateProfileMutation,
  useCreateProfileMutation,
} = profilesApi;

