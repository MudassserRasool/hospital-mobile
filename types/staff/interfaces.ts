/**
 * Staff module type definitions
 */

import { LeaveStatus, LeaveType } from '../common/interfaces';

export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'doctor' | 'nurse' | 'receptionist' | 'technician' | 'admin';
  department: string;
  employeeId: string;
  joiningDate: string;
  salary?: number;
  contactNumber?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInRecord {
  id: string;
  staffId: string;
  date: string; // ISO date
  checkInTime?: string; // ISO timestamp
  checkOutTime?: string; // ISO timestamp
  checkInLocation?: Location;
  checkOutLocation?: Location;
  totalHours?: number;
  status: 'checked-in' | 'checked-out' | 'absent';
  notes?: string;
  createdAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours: number;
  status: 'present' | 'absent' | 'half-day' | 'leave' | 'late';
  notes?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  halfDays: number;
  totalHours: number;
  averageHoursPerDay: number;
  expectedHours: number;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staff?: StaffProfile;
  type: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approver?: {
    id: string;
    name: string;
  };
  rejectionReason?: string;
  appliedAt: string;
  respondedAt?: string;
}

export interface LeaveBalance {
  totalLeaves: number;
  usedLeaves: number;
  pendingLeaves: number;
  remainingLeaves: number;
  sickLeaves: number;
  vacationLeaves: number;
  emergencyLeaves: number;
}

export interface WorkHoursSummary {
  daily: number;
  weekly: number;
  monthly: number;
  expectedDaily: number;
  expectedWeekly: number;
  expectedMonthly: number;
}

export interface CheckInVerification {
  isWithinGeofence: boolean;
  isOnHospitalWifi: boolean;
  currentLocation?: Location;
  distance?: number; // meters from hospital
  wifiSsid?: string;
}

export interface CreateLeaveRequestData {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}
