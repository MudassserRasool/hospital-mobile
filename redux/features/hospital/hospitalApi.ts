/**
 * Hospital API endpoints
 */

import { Hospital } from '@/types';
import { apiSlice } from '../../apiSlice';

export const hospitalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get hospital by mobile package ID
    getHospitalByPackageId: builder.query<Hospital, string>({
      query: (packageId) => `/hospitals/mobile-package-id/${packageId}`,
      providesTags: (result, error, packageId) => [
        { type: 'Hospital', id: packageId },
      ],
    }),
  }),
});

export const { useGetHospitalByPackageIdQuery } = hospitalApi;
