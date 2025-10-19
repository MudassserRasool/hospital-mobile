/**
 * Owner module type definitions
 */

import { AttendanceSummary, StaffProfile } from '../staff/interfaces';

export interface HospitalProfile {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  description?: string;
  workingHours: WorkingHours;
  facilities: string[];
  services: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // "09:00"
  closeTime?: string; // "17:00"
}

export interface DashboardStats {
  totalStaff: number;
  activeStaff: number;
  totalDoctors: number;
  todayAppointments: number;
  pendingLeaves: number;
  monthlyRevenue: number;
  monthlyAppointments: number;
  averageRating: number;
}

export interface StaffDetails extends StaffProfile {
  attendance: AttendanceSummary;
  leaveBalance: {
    total: number;
    used: number;
    remaining: number;
  };
  performance?: {
    rating: number;
    patientsServed?: number;
    appointmentsCompleted?: number;
  };
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'check-in' | 'check-out' | 'leave-request' | 'appointment' | 'bonus';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CreateStaffData {
  name: string;
  email: string;
  role: 'doctor' | 'nurse' | 'receptionist' | 'technician' | 'admin';
  department: string;
  salary?: number;
  leaveAllowance?: number;
  joiningDate: string;
  contactNumber?: string;
  specialty?: string; // for doctors
  qualification?: string; // for doctors
}

export interface Bonus {
  id: string;
  staffId: string;
  staff?: StaffProfile;
  amount: number;
  reason: string;
  description?: string;
  grantedBy: string;
  granter?: {
    id: string;
    name: string;
  };
  date: string;
  createdAt: string;
}

export interface CreateBonusData {
  staffId: string;
  amount: number;
  reason: string;
  description?: string;
  date: string;
}

export interface StaffFilters {
  role?: string;
  department?: string;
  status?: 'active' | 'inactive';
  search?: string;
}

export interface DoctorAppointmentFilters {
  doctorId: string;
  date?: string;
  status?: string;
  patientSearch?: string;
}

export interface RevenueReport {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
}
