/**
 * Staff API endpoints
 */

import { apiSlice } from '../../apiSlice';
import {
  StaffProfile,
  CheckInRecord,
  AttendanceRecord,
  AttendanceSummary,
  LeaveRequest,
  LeaveBalance,
  WorkHoursSummary,
  CheckInVerification,
  CreateLeaveRequestData,
  Location,
} from '@/types';

export const staffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Profile
    getStaffProfile: builder.query<StaffProfile, void>({
      query: () => '/staff/profile',
      providesTags: ['Staff'],
    }),

    updateStaffProfile: builder.mutation<StaffProfile, Partial<StaffProfile>>({
      query: (data) => ({
        url: '/staff/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Staff'],
    }),

    // Check-in/Check-out
    verifyCheckIn: builder.query<CheckInVerification, Location>({
      query: (location) => ({
        url: '/staff/checkin/verify',
        params: location,
      }),
    }),

    checkIn: builder.mutation<CheckInRecord, Location>({
      query: (location) => ({
        url: '/staff/checkin',
        method: 'POST',
        body: location,
      }),
      invalidatesTags: ['Attendance'],
    }),

    checkOut: builder.mutation<CheckInRecord, Location>({
      query: (location) => ({
        url: '/staff/checkout',
        method: 'POST',
        body: location,
      }),
      invalidatesTags: ['Attendance'],
    }),

    getCurrentCheckIn: builder.query<CheckInRecord | null, void>({
      query: () => '/staff/checkin/current',
      providesTags: ['Attendance'],
    }),

    // Attendance
    getAttendanceHistory: builder.query<
      AttendanceRecord[],
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: '/staff/attendance',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    getAttendanceSummary: builder.query<AttendanceSummary, { month: string; year: string }>({
      query: (params) => ({
        url: '/staff/attendance/summary',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    // Work Hours
    getWorkHours: builder.query<WorkHoursSummary, void>({
      query: () => '/staff/work-hours',
      providesTags: ['Attendance'],
    }),

    // Leave Management
    getLeaveRequests: builder.query<LeaveRequest[], { status?: string }>({
      query: (params) => ({
        url: '/staff/leaves',
        params,
      }),
      providesTags: ['Leaves'],
    }),

    getLeaveBalance: builder.query<LeaveBalance, void>({
      query: () => '/staff/leaves/balance',
      providesTags: ['Leaves'],
    }),

    createLeaveRequest: builder.mutation<LeaveRequest, CreateLeaveRequestData>({
      query: (data) => ({
        url: '/staff/leaves',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Leaves'],
    }),

    cancelLeaveRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/staff/leaves/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Leaves'],
    }),
  }),
});

export const {
  useGetStaffProfileQuery,
  useUpdateStaffProfileMutation,
  useVerifyCheckInQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useGetCurrentCheckInQuery,
  useGetAttendanceHistoryQuery,
  useGetAttendanceSummaryQuery,
  useGetWorkHoursQuery,
  useGetLeaveRequestsQuery,
  useGetLeaveBalanceQuery,
  useCreateLeaveRequestMutation,
  useCancelLeaveRequestMutation,
} = staffApi;

