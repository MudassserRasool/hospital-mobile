/**
 * Environment configuration
 * All environment variables from .env file
 */

export const ENV = {
  // API Configuration
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.yourhospital.com',

  // OAuth Configuration
  GOOGLE_OAUTH_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || '',

  // Payment Configuration
  EASYPAISA_MERCHANT_ID: process.env.EXPO_PUBLIC_EASYPAISA_MERCHANT_ID || '',

  // Hospital Location Configuration (for staff check-in verification)
  HOSPITAL_WIFI_SSID:
    process.env.EXPO_PUBLIC_HOSPITAL_WIFI_SSID || 'HospitalWiFi',
  HOSPITAL_LATITUDE: parseFloat(
    process.env.EXPO_PUBLIC_HOSPITAL_LATITUDE || '31.4697'
  ),
  HOSPITAL_LONGITUDE: parseFloat(
    process.env.EXPO_PUBLIC_HOSPITAL_LONGITUDE || '74.2728'
  ),
  HOSPITAL_RADIUS_METERS: 100, // Check-in allowed within 100 meters

  // App Configuration
  APP_NAME: 'Hospital Management',
  APP_VERSION: '1.0.0',

  // Feature Flags
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_CRASH_REPORTING: false,
} as const;

// Legacy export for backward compatibility
export const API_BASE_URL = ENV.API_BASE_URL;
