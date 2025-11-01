/**
 * Owner API endpoints
 */

import { apiSlice } from '../../apiSlice';

export const ownerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Profile
    getMyProfile: builder.query({
      query: () => '/owners/me',
      providesTags: ['User'],
    }),

    // Hospital Management
    getHospitalProfile: builder.query({
      query: () => '/owners/hospital',
      providesTags: ['Hospital'],
    }),

    updateHospitalProfile: builder.mutation({
      query: (data) => ({
        url: '/owners/hospital',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Hospital'],
    }),

    getHospitalStats: builder.query({
      query: () => '/owners/stats',
      providesTags: ['Hospital'],
    }),

    // Staff Management
    getStaffList: builder.query({
      query: (params) => ({
        url: '/owners/staff',
        params, // role, isActive, limit, skip
      }),
      providesTags: ['Staff'],
    }),

    getStaffDetails: builder.query({
      query: (staffId) => `/owners/staff/${staffId}`,
      providesTags: (result, error, staffId) => [{ type: 'Staff', id: staffId }],
    }),

    blockStaff: builder.mutation({
      query: ({ staffId, reason }) => ({
        url: `/owners/staff/${staffId}/block`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['Staff'],
    }),

    unblockStaff: builder.mutation({
      query: (staffId) => ({
        url: `/owners/staff/${staffId}/unblock`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Staff'],
    }),

    activateStaff: builder.mutation({
      query: (staffId) => ({
        url: `/owners/staff/${staffId}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Staff'],
    }),

    deactivateStaff: builder.mutation({
      query: (staffId) => ({
        url: `/owners/staff/${staffId}/deactivate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Staff'],
    }),

    // Leave Management
    getPendingLeaves: builder.query({
      query: (params) => ({
        url: '/leaves/pending',
        params, // limit, skip
      }),
      providesTags: ['Leaves'],
    }),

    getHospitalLeaves: builder.query({
      query: ({ hospitalId, ...params }) => ({
        url: `/leaves/hospital/${hospitalId}`,
        params, // status, leaveType, staffId, limit, skip
      }),
      providesTags: ['Leaves'],
    }),

    approveLeave: builder.mutation({
      query: ({ id, reviewerNotes }) => ({
        url: `/leaves/${id}/approve`,
        method: 'PATCH',
        body: { reviewerNotes },
      }),
      invalidatesTags: ['Leaves'],
    }),

    rejectLeave: builder.mutation({
      query: ({ id, reason, reviewerNotes }) => ({
        url: `/leaves/${id}/reject`,
        method: 'PATCH',
        body: { reason, reviewerNotes },
      }),
      invalidatesTags: ['Leaves'],
    }),

    // Attendance Management
    getHospitalAttendance: builder.query({
      query: ({ hospitalId, ...params }) => ({
        url: `/attendance/hospital/${hospitalId}`,
        params, // date, status, limit, skip
      }),
      providesTags: ['Attendance'],
    }),

    getStaffAttendance: builder.query({
      query: ({ staffId, ...params }) => ({
        url: `/attendance/staff/${staffId}`,
        params, // startDate, endDate, limit, skip
      }),
      providesTags: ['Attendance'],
    }),

    markAttendance: builder.mutation({
      query: (data) => ({
        url: '/attendance/mark',
        method: 'POST',
        body: data, // { staffId, hospitalId, date, status, checkInTime, checkOutTime }
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Doctor Appointments (for monitoring)
    getDoctorAppointments: builder.query({
      query: ({ doctorId, ...params }) => ({
        url: '/appointments',
        params: { doctorId, ...params },
      }),
      providesTags: ['Appointments'],
    }),

    // Bonuses
    getStaffBonuses: builder.query({
      query: (staffId) => `/bonuses/staff/${staffId}`,
      providesTags: ['Bonuses'],
    }),

    createBonus: builder.mutation({
      query: (data) => ({
        url: '/bonuses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Bonuses'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useGetHospitalProfileQuery,
  useUpdateHospitalProfileMutation,
  useGetHospitalStatsQuery,
  useGetStaffListQuery,
  useGetStaffDetailsQuery,
  useBlockStaffMutation,
  useUnblockStaffMutation,
  useActivateStaffMutation,
  useDeactivateStaffMutation,
  useGetPendingLeavesQuery,
  useGetHospitalLeavesQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useGetHospitalAttendanceQuery,
  useGetStaffAttendanceQuery,
  useMarkAttendanceMutation,
  useGetDoctorAppointmentsQuery,
  useGetStaffBonusesQuery,
  useCreateBonusMutation,
} = ownerApi;
