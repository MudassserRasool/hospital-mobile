/**
 * Common interfaces used across the application
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'patient' | 'staff' | 'owner';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type LeaveType = 'sick' | 'vacation' | 'emergency' | 'personal';

export interface Hospital {
  _id: string;
  name: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  workingHours?: Array<{
    day: string;
    openTime: string;
    closeTime: string;
  }>;
  specialties: string[];
  ownerId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
      };
  paymentConfig?: {
    easyPaisaMerchantId?: string;
    easyPaisaStoreId?: string;
    accountDetails?: any;
  };
  wifiSSID?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
  description?: string;
  facilities?: string[];
  totalStaff?: number;
  totalPatients?: number;
  mobilePackageId: string;
  createdAt?: string;
  updatedAt?: string;
}
