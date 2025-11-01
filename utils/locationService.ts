/**
 * Location Service
 * Handles GPS location and WiFi SSID detection for staff check-in
 */

import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface CheckInLocationData {
  wifiSSID: string;
  gpsCoordinates: LocationData;
}

/**
 * Request location permissions
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get current GPS coordinates
 */
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Get WiFi SSID (network name)
 * Note: On iOS, this requires specific permissions and may not work on all devices
 */
export const getWiFiSSID = async (): Promise<string> => {
  try {
    const netInfo = await NetInfo.fetch();
    
    if (netInfo.type === 'wifi' && netInfo.details) {
      // For Android and some iOS devices
      if ('ssid' in netInfo.details && netInfo.details.ssid) {
        return netInfo.details.ssid;
      }
    }

    // Fallback if WiFi SSID is not available
    return 'Unknown_WiFi';
  } catch (error) {
    console.error('Error getting WiFi SSID:', error);
    return 'Unknown_WiFi';
  }
};

/**
 * Get complete check-in location data (WiFi + GPS)
 */
export const getCheckInLocationData = async (): Promise<CheckInLocationData | null> => {
  try {
    // Get GPS coordinates
    const gpsCoordinates = await getCurrentLocation();
    if (!gpsCoordinates) {
      throw new Error('Unable to get GPS location');
    }

    // Get WiFi SSID
    const wifiSSID = await getWiFiSSID();

    return {
      wifiSSID,
      gpsCoordinates,
    };
  } catch (error) {
    console.error('Error getting check-in location data:', error);
    return null;
  }
};

/**
 * Check if location services are enabled
 */
export const isLocationEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await Location.hasServicesEnabledAsync();
    return enabled;
  } catch (error) {
    console.error('Error checking if location is enabled:', error);
    return false;
  }
};

/**
 * Calculate distance between two coordinates (in meters)
 * Using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

