/**
 * Owner Module Layout
 * Stack navigation for owner screens with route protection
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

export default function OwnerLayout() {
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

        // Only allow owners to access owner routes
        if (userRole !== ROLES.OWNER) {
          // Redirect based on actual role
          if (userRole === ROLES.PATIENT) {
            router.replace(PATIENT_ROUTES.DASHBOARD);
          } else if (userRole === ROLES.STAFF || ['doctor', 'nurse', 'receptionist', 'technician'].includes(userRole)) {
            router.replace(STAFF_ROUTES.DASHBOARD);
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

    if (role !== ROLES.OWNER) {
      // Redirect based on actual role
      if (role === ROLES.PATIENT) {
        router.replace(PATIENT_ROUTES.DASHBOARD);
      } else if (role === ROLES.STAFF || ['doctor', 'nurse', 'receptionist', 'technician'].includes(role)) {
        router.replace(STAFF_ROUTES.DASHBOARD);
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
      <Stack.Screen name="staff-list" />
      <Stack.Screen name="staff-details" />
      <Stack.Screen name="add-staff" />
      <Stack.Screen name="leave-approvals" />
      <Stack.Screen name="doctor-appointments" />
      <Stack.Screen name="hospital-profile" />
      <Stack.Screen name="bonuses" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
