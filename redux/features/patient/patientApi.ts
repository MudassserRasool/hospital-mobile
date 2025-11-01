/**
 * Patient API endpoints
 */

import { apiSlice } from '../../apiSlice';
import {
  Doctor,
  Specialty,
  Appointment,
  BookAppointmentData,
  Payment,
  Wallet,
  WalletTransaction,
  DoctorFilters,
  AppointmentFilters,
  TimeSlot,
} from '@/types';

export const patientApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Patient Profile
    getMyProfile: builder.query({
      query: () => '/patients/me',
      providesTags: ['Patient'],
    }),

    updateMyProfile: builder.mutation({
      query: (data) => ({
        url: '/patients/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Patient'],
    }),

    // Doctors
    getDoctors: builder.query<Doctor[], DoctorFilters>({
      query: (filters) => ({
        url: '/doctors',
        params: filters,
      }),
      providesTags: ['Doctors'],
    }),

    getDoctorById: builder.query<Doctor, string>({
      query: (id) => `/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctors', id }],
    }),

    // Departments
    getDepartments: builder.query({
      query: (hospitalId) => `/departments/${hospitalId}`,
      providesTags: ['Doctors'],
    }),

    // Check doctor availability
    checkAvailability: builder.query({
      query: ({ doctorId, date }) => `/schedules/availability/${doctorId}/${date}`,
    }),

    // Appointments
    getMyAppointments: builder.query({
      query: () => '/appointments/me',
      providesTags: ['Appointments'],
    }),

    getAppointmentById: builder.query<Appointment, string>({
      query: (id) => `/appointments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Appointments', id }],
    }),

    bookAppointment: builder.mutation<Appointment, BookAppointmentData>({
      query: (data) => ({
        url: '/appointments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointments', 'Doctors'],
    }),

    cancelAppointment: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/appointments/${id}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['Appointments', 'Wallet'],
    }),

    rescheduleAppointment: builder.mutation({
      query: ({ id, date, timeSlot }) => ({
        url: `/appointments/${id}/reschedule`,
        method: 'POST',
        body: { date, timeSlot },
      }),
      invalidatesTags: ['Appointments'],
    }),

    // Wallet
    getMyWallet: builder.query<Wallet, void>({
      query: () => '/wallets/me',
      providesTags: ['Wallet'],
    }),

    getMyWalletBalance: builder.query({
      query: () => '/wallets/me/balance',
      providesTags: ['Wallet'],
    }),

    getMyWalletTransactions: builder.query<WalletTransaction[], void>({
      query: () => '/wallets/me/transactions',
      providesTags: ['Wallet'],
    }),

    // Payments
    processPayment: builder.mutation<
      Payment,
      { appointmentId: string; patientId: string; amount: number; walletAmountToUse?: number }
    >({
      query: (data) => ({
        url: '/payments/process',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointments', 'Wallet'],
    }),

    getPaymentById: builder.query({
      query: (id) => `/payments/${id}`,
    }),

    getPaymentHistory: builder.query({
      query: (patientId) => `/payments/patient/${patientId}`,
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetDepartmentsQuery,
  useCheckAvailabilityQuery,
  useGetMyAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
  useGetMyWalletQuery,
  useGetMyWalletBalanceQuery,
  useGetMyWalletTransactionsQuery,
  useProcessPaymentMutation,
  useGetPaymentByIdQuery,
  useGetPaymentHistoryQuery,
} = patientApi;
