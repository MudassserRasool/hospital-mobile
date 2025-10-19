/**
 * Route definitions for the Hospital Management App
 */

export const AUTH_ROUTES = {
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
} as const;

export const PATIENT_ROUTES = {
  DASHBOARD: '/(patient)/dashboard',
  BROWSE_DOCTORS: '/(patient)/browse-doctors',
  BOOK_APPOINTMENT: '/(patient)/book-appointment',
  PAYMENT: '/(patient)/payment',
  APPOINTMENT_HISTORY: '/(patient)/appointment-history',
  APPOINTMENT_DETAILS: '/(patient)/appointment-details',
  WALLET: '/(patient)/wallet',
} as const;

export const STAFF_ROUTES = {
  DASHBOARD: '/(staff)/dashboard',
  CHECK_IN_OUT: '/(staff)/check-in-out',
  ATTENDANCE_HISTORY: '/(staff)/attendance-history',
  LEAVE_MANAGEMENT: '/(staff)/leave-management',
  REQUEST_LEAVE: '/(staff)/request-leave',
  WORK_HOURS: '/(staff)/work-hours',
} as const;

export const OWNER_ROUTES = {
  DASHBOARD: '/(owner)/dashboard',
  STAFF_LIST: '/(owner)/staff-list',
  STAFF_DETAILS: '/(owner)/staff-details',
  ADD_STAFF: '/(owner)/add-staff',
  LEAVE_APPROVALS: '/(owner)/leave-approvals',
  DOCTOR_APPOINTMENTS: '/(owner)/doctor-appointments',
  HOSPITAL_PROFILE: '/(owner)/hospital-profile',
  BONUSES: '/(owner)/bonuses',
} as const;

export const ALL_ROUTES = {
  ...AUTH_ROUTES,
  ...PATIENT_ROUTES,
  ...STAFF_ROUTES,
  ...OWNER_ROUTES,
} as const;
