/**
 * Environment configuration
 * All environment variables from .env file
 */

export const ENV = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,

  // OAuth Configuration
  GOOGLE_OAUTH_EXPO_CLIENT_ID: process.env.EXPO_PUBLIC_EXPO_CLIENT_ID || '', // ← Add this
  GOOGLE_OAUTH_ANDROID_CLIENT_ID:
    process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID || '',
  GOOGLE_OAUTH_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_IOS_CLIENT_ID || '',
  GOOGLE_OAUTH_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID || '',

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
