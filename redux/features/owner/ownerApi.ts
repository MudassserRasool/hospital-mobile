/**
 * Owner API endpoints
 */

import { apiSlice } from '../../apiSlice';
import {
  HospitalProfile,
  DashboardStats,
  StaffProfile,
  StaffDetails,
  CreateStaffData,
  Bonus,
  CreateBonusData,
  LeaveRequest,
  Appointment,
  StaffFilters,
  DoctorAppointmentFilters,
  RevenueReport,
} from '@/types';

export const ownerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/owner/dashboard/stats',
      providesTags: ['Owner'],
    }),

    getRevenueReport: builder.query<RevenueReport, { period: string }>({
      query: (params) => ({
        url: '/owner/dashboard/revenue',
        params,
      }),
      providesTags: ['Owner'],
    }),

    // Hospital Profile
    getHospitalProfile: builder.query<HospitalProfile, void>({
      query: () => '/owner/hospital/profile',
      providesTags: ['Hospital'],
    }),

    updateHospitalProfile: builder.mutation<HospitalProfile, Partial<HospitalProfile>>({
      query: (data) => ({
        url: '/owner/hospital/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Hospital'],
    }),

    // Staff Management
    getAllStaff: builder.query<StaffProfile[], StaffFilters>({
      query: (filters) => ({
        url: '/owner/staff',
        params: filters,
      }),
      providesTags: ['Staff'],
    }),

    getStaffById: builder.query<StaffDetails, string>({
      query: (id) => `/owner/staff/${id}`,
      providesTags: (result, error, id) => [{ type: 'Staff', id }],
    }),

    createStaff: builder.mutation<StaffProfile, CreateStaffData>({
      query: (data) => ({
        url: '/owner/staff',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Staff'],
    }),

    updateStaff: builder.mutation<StaffProfile, { id: string; data: Partial<CreateStaffData> }>({
      query: ({ id, data }) => ({
        url: `/owner/staff/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Staff'],
    }),

    deactivateStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `/owner/staff/${id}/deactivate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Staff'],
    }),

    activateStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `/owner/staff/${id}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Staff'],
    }),

    // Leave Management
    getPendingLeaves: builder.query<LeaveRequest[], void>({
      query: () => '/owner/leaves/pending',
      providesTags: ['Leaves'],
    }),

    getAllLeaves: builder.query<LeaveRequest[], { status?: string; staffId?: string }>({
      query: (params) => ({
        url: '/owner/leaves',
        params,
      }),
      providesTags: ['Leaves'],
    }),

    approveLeave: builder.mutation<void, string>({
      query: (id) => ({
        url: `/owner/leaves/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Leaves'],
    }),

    rejectLeave: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/owner/leaves/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Leaves'],
    }),

    // Doctor Appointments
    getDoctorAppointments: builder.query<Appointment[], DoctorAppointmentFilters>({
      query: (filters) => ({
        url: '/owner/appointments',
        params: filters,
      }),
      providesTags: ['Appointments'],
    }),

    // Bonuses
    getBonuses: builder.query<Bonus[], { staffId?: string }>({
      query: (params) => ({
        url: '/owner/bonuses',
        params,
      }),
      providesTags: ['Bonuses'],
    }),

    createBonus: builder.mutation<Bonus, CreateBonusData>({
      query: (data) => ({
        url: '/owner/bonuses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Bonuses', 'Staff'],
    }),

    deleteBonus: builder.mutation<void, string>({
      query: (id) => ({
        url: `/owner/bonuses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bonuses'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueReportQuery,
  useGetHospitalProfileQuery,
  useUpdateHospitalProfileMutation,
  useGetAllStaffQuery,
  useGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeactivateStaffMutation,
  useActivateStaffMutation,
  useGetPendingLeavesQuery,
  useGetAllLeavesQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useGetDoctorAppointmentsQuery,
  useGetBonusesQuery,
  useCreateBonusMutation,
  useDeleteBonusMutation,
} = ownerApi;

