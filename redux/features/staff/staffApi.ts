/**
 * Staff API endpoints
 */

import { apiSlice } from '../../apiSlice';

export const staffApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Attendance
    checkIn: builder.mutation({
      query: (data) => ({
        url: '/attendance/checkin',
        method: 'POST',
        body: data, // { wifiSSID, gpsCoordinates }
      }),
      invalidatesTags: ['Attendance'],
    }),

    checkOut: builder.mutation({
      query: () => ({
        url: '/attendance/checkout',
        method: 'POST',
      }),
      invalidatesTags: ['Attendance'],
    }),

    getTodayAttendance: builder.query({
      query: () => '/attendance/today',
      providesTags: ['Attendance'],
    }),

    getMyAttendance: builder.query({
      query: (params) => ({
        url: '/attendance/me',
        params, // startDate, endDate, limit, skip
      }),
      providesTags: ['Attendance'],
    }),

    getWorkHoursSummary: builder.query({
      query: ({ staffId, startDate, endDate }) => 
        `/attendance/work-hours/${staffId}?startDate=${startDate}&endDate=${endDate}`,
    }),

    // Leaves
    requestLeave: builder.mutation({
      query: (data) => ({
        url: '/leaves',
        method: 'POST',
        body: data, // { startDate, endDate, reason, leaveType, attachments }
      }),
      invalidatesTags: ['Leaves'],
    }),

    getMyLeaves: builder.query({
      query: (params) => ({
        url: '/leaves/me',
        params, // status, limit, skip
      }),
      providesTags: ['Leaves'],
    }),

    getMyLeaveBalance: builder.query({
      query: (year) => `/leaves/me/balance${year ? `?year=${year}` : ''}`,
      providesTags: ['Leaves'],
    }),

    cancelLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `/leaves/${id}/cancel`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Leaves'],
    }),

    // Profile
    getMyProfile: builder.query({
      query: () => '/staff/me',
      providesTags: ['User'],
    }),

    updateMyProfile: builder.mutation({
      query: (data) => ({
        url: '/staff/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Schedule (for doctors/nurses)
    getMySchedule: builder.query({
      query: (date) => `/schedules/me?date=${date}`,
    }),

    // Appointments (for doctors/nurses)
    getMyPatientAppointments: builder.query({
      query: (params) => ({
        url: '/appointments',
        params, // Will be filtered by backend based on role
      }),
      providesTags: ['Appointments'],
    }),

    checkInPatient: builder.mutation({
      query: ({ id, vitals }) => ({
        url: `/appointments/${id}/checkin`,
        method: 'PATCH',
        body: { vitals },
      }),
      invalidatesTags: ['Appointments'],
    }),

    completeAppointment: builder.mutation({
      query: ({ id, ...completionData }) => ({
        url: `/appointments/${id}/complete`,
        method: 'PATCH',
        body: completionData, // { checkupNotes, diagnosis, prescriptions }
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetTodayAttendanceQuery,
  useGetMyAttendanceQuery,
  useGetWorkHoursSummaryQuery,
  useRequestLeaveMutation,
  useGetMyLeavesQuery,
  useGetMyLeaveBalanceQuery,
  useCancelLeaveRequestMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetMyScheduleQuery,
  useGetMyPatientAppointmentsQuery,
  useCheckInPatientMutation,
  useCompleteAppointmentMutation,
} = staffApi;
