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
    // Doctors
    getDoctors: builder.query<Doctor[], DoctorFilters>({
      query: (filters) => ({
        url: '/patient/doctors',
        params: filters,
      }),
      providesTags: ['Doctors'],
    }),

    getDoctorById: builder.query<Doctor, string>({
      query: (id) => `/patient/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctors', id }],
    }),

    getSpecialties: builder.query<Specialty[], void>({
      query: () => '/patient/specialties',
      providesTags: ['Doctors'],
    }),

    // Appointments
    getAppointments: builder.query<Appointment[], AppointmentFilters>({
      query: (filters) => ({
        url: '/patient/appointments',
        params: filters,
      }),
      providesTags: ['Appointments'],
    }),

    getAppointmentById: builder.query<Appointment, string>({
      query: (id) => `/patient/appointments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Appointments', id }],
    }),

    getAvailableTimeSlots: builder.query<TimeSlot[], { doctorId: string; date: string }>({
      query: ({ doctorId, date }) => `/patient/doctors/${doctorId}/slots?date=${date}`,
      providesTags: ['Appointments'],
    }),

    bookAppointment: builder.mutation<Appointment, BookAppointmentData>({
      query: (data) => ({
        url: '/patient/appointments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointments', 'Doctors'],
    }),

    cancelAppointment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/patient/appointments/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Appointments', 'Wallet'],
    }),

    rescheduleAppointment: builder.mutation<
      Appointment,
      { id: string; date: string; time: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/patient/appointments/${id}/reschedule`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Appointments'],
    }),

    // Payment & Wallet
    processPayment: builder.mutation<
      Payment,
      { appointmentId: string; amount: number; paymentMethod: string; walletAmountUsed?: number }
    >({
      query: (data) => ({
        url: '/patient/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointments', 'Wallet'],
    }),

    getWallet: builder.query<Wallet, void>({
      query: () => '/patient/wallet',
      providesTags: ['Wallet'],
    }),

    getWalletTransactions: builder.query<WalletTransaction[], void>({
      query: () => '/patient/wallet/transactions',
      providesTags: ['Wallet'],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetSpecialtiesQuery,
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useGetAvailableTimeSlotsQuery,
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
  useProcessPaymentMutation,
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
} = patientApi;

