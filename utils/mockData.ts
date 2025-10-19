/**
 * Mock Data for Development
 * This will be replaced with real API calls later
 */

import {
  Doctor,
  Specialty,
  Appointment,
  Wallet,
  WalletTransaction,
  StaffProfile,
  CheckInRecord,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  WorkHoursSummary,
  HospitalProfile,
  DashboardStats,
  Bonus,
  AttendanceSummary,
} from '@/types';

// Specialties
export const mockSpecialties: Specialty[] = [
  {
    id: '1',
    name: 'General Physician',
    icon: 'medical-services',
    description: 'General health checkups and consultations',
    doctorCount: 12,
  },
  {
    id: '2',
    name: 'Dentist',
    icon: 'mood',
    description: 'Dental care and treatments',
    doctorCount: 8,
  },
  {
    id: '3',
    name: 'Ophthalmologist',
    icon: 'visibility',
    description: 'Eye care and vision problems',
    doctorCount: 6,
  },
  {
    id: '4',
    name: 'Nutritionist',
    icon: 'restaurant',
    description: 'Diet and nutrition advice',
    doctorCount: 5,
  },
  {
    id: '5',
    name: 'Neurologist',
    icon: 'psychology',
    description: 'Brain and nervous system',
    doctorCount: 7,
  },
  {
    id: '6',
    name: 'Pediatric',
    icon: 'child-care',
    description: 'Children healthcare',
    doctorCount: 10,
  },
  {
    id: '7',
    name: 'Radiologist',
    icon: 'image-search',
    description: 'Medical imaging and diagnostics',
    doctorCount: 4,
  },
  {
    id: '8',
    name: 'More',
    icon: 'more-horiz',
    description: 'View all specialties',
    doctorCount: 0,
  },
];

// Doctors
export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    specialty: 'Cardiologist',
    department: 'Cardiology',
    qualification: 'MD, MBBS',
    experience: 15,
    rating: 4.8,
    reviewCount: 245,
    consultationFee: 1500,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '09:00', endTime: '13:00', isAvailable: true },
    ],
    about: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    specialty: 'General Physician',
    department: 'General Medicine',
    qualification: 'MBBS, MD',
    experience: 10,
    rating: 4.6,
    reviewCount: 189,
    consultationFee: 1000,
    availability: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '10:00', endTime: '14:00', isAvailable: true },
    ],
    about: 'General physician with expertise in preventive medicine and chronic disease management.',
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    email: 'emily.davis@hospital.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    specialty: 'Pediatrician',
    department: 'Pediatrics',
    qualification: 'MBBS, DCH',
    experience: 12,
    rating: 4.9,
    reviewCount: 312,
    consultationFee: 1200,
    availability: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '12:00', isAvailable: true },
    ],
    about: 'Caring pediatrician dedicated to children\'s health and wellness.',
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    specialty: 'Dentist',
    department: 'Dentistry',
    qualification: 'BDS, MDS',
    experience: 8,
    rating: 4.7,
    reviewCount: 156,
    consultationFee: 800,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '10:00', endTime: '14:00', isAvailable: true },
    ],
    about: 'Expert dentist specializing in cosmetic and restorative dentistry.',
  },
];

// Appointments
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: 'patient1',
    doctorId: '1',
    doctor: mockDoctors[0],
    date: '2025-10-22',
    time: '10:00 AM',
    status: 'confirmed',
    reason: 'Regular checkup',
    notes: 'Annual health screening',
    createdAt: '2025-10-19T10:00:00Z',
    updatedAt: '2025-10-19T10:00:00Z',
  },
  {
    id: '2',
    patientId: 'patient1',
    doctorId: '2',
    doctor: mockDoctors[1],
    date: '2025-10-15',
    time: '02:00 PM',
    status: 'completed',
    reason: 'Fever and cold',
    notes: 'Patient had mild fever',
    vitals: {
      bloodPressure: '120/80',
      heartRate: 78,
      temperature: 99.5,
      weight: 70,
      height: 175,
      oxygenSaturation: 98,
    },
    diagnosis: 'Common cold',
    prescription: ['Paracetamol 500mg', 'Vitamin C'],
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-15T15:00:00Z',
  },
  {
    id: '3',
    patientId: 'patient1',
    doctorId: '3',
    doctor: mockDoctors[2],
    date: '2025-09-28',
    time: '11:30 AM',
    status: 'completed',
    reason: 'Child vaccination',
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-09-28T12:00:00Z',
  },
];

// Wallet
export const mockWallet: Wallet = {
  id: 'wallet1',
  patientId: 'patient1',
  balance: 1250,
  transactions: [
    {
      id: 't1',
      type: 'credit',
      amount: 150,
      description: 'Refund from cancelled appointment',
      reference: 'APT123',
      balanceAfter: 1250,
      createdAt: '2025-10-18T10:00:00Z',
    },
    {
      id: 't2',
      type: 'debit',
      amount: 1000,
      description: 'Payment for appointment with Dr. Sarah Johnson',
      reference: 'APT124',
      balanceAfter: 1100,
      createdAt: '2025-10-15T14:00:00Z',
    },
    {
      id: 't3',
      type: 'credit',
      amount: 100,
      description: 'Refund from cancelled appointment',
      reference: 'APT120',
      balanceAfter: 2100,
      createdAt: '2025-10-10T09:00:00Z',
    },
  ],
};

// Staff Profile
export const mockStaffProfile: StaffProfile = {
  id: 'staff1',
  name: 'John Smith',
  email: 'john.smith@hospital.com',
  avatar: 'https://i.pravatar.cc/150?img=10',
  role: 'nurse',
  department: 'Emergency',
  employeeId: 'EMP001',
  joiningDate: '2020-01-15',
  salary: 50000,
  contactNumber: '+1234567890',
  address: '123 Main St, City, Country',
  emergencyContact: {
    name: 'Jane Smith',
    relationship: 'Spouse',
    phone: '+1234567891',
  },
  isActive: true,
  createdAt: '2020-01-15T00:00:00Z',
  updatedAt: '2025-10-19T00:00:00Z',
};

// Check-in Record
export const mockCurrentCheckIn: CheckInRecord = {
  id: 'checkin1',
  staffId: 'staff1',
  date: '2025-10-19',
  checkInTime: '2025-10-19T08:00:00Z',
  checkInLocation: {
    latitude: 31.4697,
    longitude: 74.2728,
    address: 'Hospital Main Building',
  },
  status: 'checked-in',
  createdAt: '2025-10-19T08:00:00Z',
};

// Attendance Records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att1',
    staffId: 'staff1',
    date: '2025-10-19',
    checkInTime: '2025-10-19T08:00:00Z',
    checkOutTime: '2025-10-19T17:00:00Z',
    totalHours: 9,
    status: 'present',
  },
  {
    id: 'att2',
    staffId: 'staff1',
    date: '2025-10-18',
    checkInTime: '2025-10-18T08:05:00Z',
    checkOutTime: '2025-10-18T17:10:00Z',
    totalHours: 9,
    status: 'present',
  },
  {
    id: 'att3',
    staffId: 'staff1',
    date: '2025-10-17',
    checkInTime: '2025-10-17T08:00:00Z',
    checkOutTime: '2025-10-17T17:00:00Z',
    totalHours: 9,
    status: 'present',
  },
  {
    id: 'att4',
    staffId: 'staff1',
    date: '2025-10-16',
    totalHours: 0,
    status: 'leave',
    notes: 'Sick leave',
  },
];

// Leave Balance
export const mockLeaveBalance: LeaveBalance = {
  totalLeaves: 24,
  usedLeaves: 8,
  pendingLeaves: 2,
  remainingLeaves: 14,
  sickLeaves: 3,
  vacationLeaves: 4,
  emergencyLeaves: 1,
};

// Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave1',
    staffId: 'staff1',
    type: 'sick',
    startDate: '2025-10-25',
    endDate: '2025-10-26',
    totalDays: 2,
    reason: 'Flu symptoms',
    status: 'pending',
    appliedAt: '2025-10-18T10:00:00Z',
  },
  {
    id: 'leave2',
    staffId: 'staff1',
    type: 'vacation',
    startDate: '2025-10-16',
    endDate: '2025-10-16',
    totalDays: 1,
    reason: 'Personal work',
    status: 'approved',
    approvedBy: 'owner1',
    approver: {
      id: 'owner1',
      name: 'Dr. Admin',
    },
    appliedAt: '2025-10-10T10:00:00Z',
    respondedAt: '2025-10-11T09:00:00Z',
  },
];

// Work Hours Summary
export const mockWorkHours: WorkHoursSummary = {
  daily: 9,
  weekly: 45,
  monthly: 180,
  expectedDaily: 9,
  expectedWeekly: 45,
  expectedMonthly: 195,
};

// Hospital Profile
export const mockHospitalProfile: HospitalProfile = {
  id: 'hospital1',
  name: 'City Central Hospital',
  logo: 'https://via.placeholder.com/200',
  email: 'info@cityhospital.com',
  phone: '+1234567890',
  address: '456 Hospital Road',
  city: 'New York',
  country: 'United States',
  website: 'https://cityhospital.com',
  description: 'Leading healthcare provider with state-of-the-art facilities',
  workingHours: {
    monday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    saturday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    sunday: { isOpen: true, openTime: '10:00', closeTime: '16:00' },
  },
  facilities: ['ICU', 'Emergency', 'Surgery', 'Laboratory', 'Pharmacy', 'Radiology'],
  services: ['Cardiology', 'Neurology', 'Pediatrics', 'Dentistry', 'Orthopedics'],
  createdAt: '2010-01-01T00:00:00Z',
  updatedAt: '2025-10-19T00:00:00Z',
};

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalStaff: 85,
  activeStaff: 72,
  totalDoctors: 28,
  todayAppointments: 45,
  pendingLeaves: 8,
  monthlyRevenue: 1250000,
  monthlyAppointments: 450,
  averageRating: 4.7,
};

// All Staff
export const mockAllStaff: StaffProfile[] = [
  mockStaffProfile,
  {
    id: 'staff2',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'doctor',
    department: 'Cardiology',
    employeeId: 'EMP002',
    joiningDate: '2015-03-20',
    salary: 150000,
    contactNumber: '+1234567892',
    isActive: true,
    createdAt: '2015-03-20T00:00:00Z',
    updatedAt: '2025-10-19T00:00:00Z',
  },
  {
    id: 'staff3',
    name: 'Mary Johnson',
    email: 'mary.johnson@hospital.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'receptionist',
    department: 'Administration',
    employeeId: 'EMP003',
    joiningDate: '2021-06-10',
    salary: 35000,
    contactNumber: '+1234567893',
    isActive: true,
    createdAt: '2021-06-10T00:00:00Z',
    updatedAt: '2025-10-19T00:00:00Z',
  },
];

// Bonuses
export const mockBonuses: Bonus[] = [
  {
    id: 'bonus1',
    staffId: 'staff1',
    staff: mockStaffProfile,
    amount: 5000,
    reason: 'Excellent Performance',
    description: 'Outstanding work in Q3 2025',
    grantedBy: 'owner1',
    granter: {
      id: 'owner1',
      name: 'Dr. Admin',
    },
    date: '2025-10-01',
    createdAt: '2025-10-01T10:00:00Z',
  },
];

// Attendance Summary
export const mockAttendanceSummary: AttendanceSummary = {
  totalDays: 22,
  presentDays: 20,
  absentDays: 1,
  leaveDays: 1,
  halfDays: 0,
  totalHours: 180,
  averageHoursPerDay: 9,
  expectedHours: 198,
};

