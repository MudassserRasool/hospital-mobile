/**
 * Patient Redux Slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, Doctor } from '@/types';

interface PatientState {
  selectedDoctor: Doctor | null;
  selectedAppointment: Appointment | null;
  selectedDate: string | null;
  selectedTime: string | null;
  bookingStep: 'doctor' | 'datetime' | 'summary' | 'payment';
}

const initialState: PatientState = {
  selectedDoctor: null,
  selectedAppointment: null,
  selectedDate: null,
  selectedTime: null,
  bookingStep: 'doctor',
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action: PayloadAction<Doctor | null>) => {
      state.selectedDoctor = action.payload;
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
    setSelectedTime: (state, action: PayloadAction<string | null>) => {
      state.selectedTime = action.payload;
    },
    setBookingStep: (
      state,
      action: PayloadAction<'doctor' | 'datetime' | 'summary' | 'payment'>
    ) => {
      state.bookingStep = action.payload;
    },
    resetBooking: (state) => {
      state.selectedDoctor = null;
      state.selectedDate = null;
      state.selectedTime = null;
      state.bookingStep = 'doctor';
    },
  },
});

export const {
  setSelectedDoctor,
  setSelectedAppointment,
  setSelectedDate,
  setSelectedTime,
  setBookingStep,
  resetBooking,
} = patientSlice.actions;

export default patientSlice.reducer;

