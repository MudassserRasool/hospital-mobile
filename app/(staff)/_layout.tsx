/**
 * Staff Module Layout
 * Stack navigation for staff screens with route protection
 */

import { ThemedView } from '@/components/themed-view';
import { ROLES } from '@/constants/roles';
import {
  AUTH_ROUTES,
  OWNER_ROUTES,
  PATIENT_ROUTES,
  STAFF_ROUTES,
} from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

// Staff roles that can access staff routes
const STAFF_ROLES = [
  ROLES.STAFF,
  'doctor',
  'nurse',
  'receptionist',
  'technician',
];

export default function StaffLayout() {
  const { role, checkAuthStatus } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);
      
      // Check authentication
      const isLoggedIn = await checkAuthStatus();
      
      if (!isLoggedIn) {
        router.replace(AUTH_ROUTES.LOGIN);
        return;
      }

      // Get role from AsyncStorage (more reliable than Redux for initial check)
      const storedUser = await AsyncStorage.getItem('@hospital_auth_user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userRole = userData.role;

        // Only allow staff roles to access staff routes
        if (!STAFF_ROLES.includes(userRole)) {
          // Redirect based on actual role
          if (userRole === ROLES.PATIENT) {
            router.replace(PATIENT_ROUTES.DASHBOARD);
          } else if (userRole === ROLES.OWNER) {
            router.replace(OWNER_ROUTES.DASHBOARD);
          } else {
            router.replace(AUTH_ROUTES.LOGIN);
          }
          return;
        }
      } else {
        router.replace(AUTH_ROUTES.LOGIN);
        return;
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [checkAuthStatus]);

  // Also watch for role changes in Redux state
  useEffect(() => {
    if (isChecking || !role) return;

    if (!STAFF_ROLES.includes(role)) {
      // Redirect based on actual role
      if (role === ROLES.PATIENT) {
        router.replace(PATIENT_ROUTES.DASHBOARD);
      } else if (role === ROLES.OWNER) {
        router.replace(OWNER_ROUTES.DASHBOARD);
      } else {
        router.replace(AUTH_ROUTES.LOGIN);
      }
    }
  }, [role, isChecking]);

  if (isChecking) {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size="large" color="#4B7BEC" />
      </ThemedView>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="check-in-out" />
      <Stack.Screen name="attendance-history" />
      <Stack.Screen name="leave-management" />
      <Stack.Screen name="request-leave" />
      <Stack.Screen name="work-hours" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
