/**
 * File Upload API endpoints
 */

import { ENV } from '@/constants/enviroment';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiSlice } from '../../apiSlice';
import type { RootState } from '../../store';

export interface FileUploadResponse {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

// Custom baseQuery for file uploads that properly handles FormData
const fileUploadBaseQuery = fetchBaseQuery({
  baseUrl: ENV.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // Don't set Content-Type - let fetch set it automatically with boundary for FormData
    return headers;
  },
  fetchFn: async (input, init) => {
    // Use native fetch to properly handle FormData
    const token = (init?.headers as Headers)?.get('authorization');
    const headers = new Headers();
    if (token) {
      headers.set('authorization', token);
    }
    // Don't set Content-Type - browser/fetch will set it with boundary
    
    return fetch(input, {
      ...init,
      headers,
    });
  },
});

export const fileApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Upload single file
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      queryFn: async (formData, api, extraOptions, baseQuery) => {
        // Use custom baseQuery for file uploads
        const result = await fileUploadBaseQuery(
          {
            url: '/files/upload',
            method: 'POST',
            body: formData,
          },
          api,
          extraOptions
        );
        return result as { data: FileUploadResponse } | { error: any };
      },
    }),

    // Upload multiple files
    uploadMultipleFiles: builder.mutation<FileUploadResponse[], FormData>({
      queryFn: async (formData, api, extraOptions, baseQuery) => {
        const result = await fileUploadBaseQuery(
          {
            url: '/files/upload/multiple',
            method: 'POST',
            body: formData,
          },
          api,
          extraOptions
        );
        return result as { data: FileUploadResponse[] } | { error: any };
      },
    }),

    // Delete file
    deleteFile: builder.mutation<
      { message: string },
      { category: string; filename: string }
    >({
      query: ({ category, filename }) => ({
        url: `/files/${category}/${filename}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useUploadFileMutation,
  useUploadMultipleFilesMutation,
  useDeleteFileMutation,
} = fileApi;

