/**
 * Patient module type definitions
 */

import { AppointmentStatus, PaymentStatus } from '../common/interfaces';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  specialty: string;
  department: string;
  qualification: string;
  experience: number; // years
  rating: number;
  reviewCount: number;
  consultationFee: number;
  availability: DoctorAvailability[];
  about?: string;
}

export interface DoctorAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
}

export interface TimeSlot {
  time: string; // "09:00 AM"
  available: boolean;
  appointmentId?: string;
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
  description?: string;
  doctorCount: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctor: Doctor;
  date: string; // ISO date
  time: string; // "09:00 AM"
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  vitals?: Vitals;
  diagnosis?: string;
  prescription?: string[];
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vitals {
  bloodPressure?: string; // "120/80"
  heartRate?: number; // bpm
  temperature?: number; // celsius
  weight?: number; // kg
  height?: number; // cm
  oxygenSaturation?: number; // %
}

export interface BookAppointmentData {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  paymentMethod: 'easypaisa' | 'wallet' | 'cash';
  status: PaymentStatus;
  transactionId?: string;
  walletAmountUsed?: number;
  paidAt?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  patientId: string;
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference?: string;
  balanceAfter: number;
  createdAt: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
  specialty?: string;
}

export interface DoctorFilters {
  specialty?: string;
  department?: string;
  search?: string;
  minRating?: number;
  availability?: string; // ISO date
}
