/**
 * File Upload API endpoints
 */

import { ENV } from '@/constants/enviroment';
import { apiSlice } from '../../apiSlice';
import type { RootState } from '../../store';
import { store } from '../../store';

export interface FileData{
    file: File;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    url: string;
}

export interface FileUploadResponse {
  data: FileData;
}

export const fileApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Upload single file
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      queryFn: async (formData, api, extraOptions) => {
        // Get token from store
        const state = store.getState() as RootState;
        const token = state.auth.token;

        // Create headers
        const headers: HeadersInit = {};
        if (token) {
          headers['authorization'] = `Bearer ${token}`;
        }
        // Don't set Content-Type - fetch will set it with boundary for FormData

        try {
          const response = await fetch(`${ENV.API_BASE_URL}/files/upload`, {
            method: 'POST',
            headers,
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({
              message: 'Upload failed',
            }));
            return { error: { status: response.status, data: error } };
          }

          const data = await response.json();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error?.message || 'Network error',
            },
          };
        }
      },
    }),

    // Upload multiple files
    uploadMultipleFiles: builder.mutation<FileUploadResponse[], FormData>({
      queryFn: async (formData, api, extraOptions) => {
        // Get token from store
        const state = store.getState() as RootState;
        const token = state.auth.token;

        // Create headers
        const headers: HeadersInit = {};
        if (token) {
          headers['authorization'] = `Bearer ${token}`;
        }
        // Don't set Content-Type - fetch will set it with boundary for FormData

        try {
          const response = await fetch(
            `${ENV.API_BASE_URL}/files/upload/multiple`,
            {
              method: 'POST',
              headers,
              body: formData,
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({
              message: 'Upload failed',
            }));
            return { error: { status: response.status, data: error } };
          }

          const data = await response.json();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error?.message || 'Network error',
            },
          };
        }
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

