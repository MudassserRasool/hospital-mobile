/**
 * App Entry Point
 * Role-based routing logic
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
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const { role, checkAuthStatus } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const init = async () => {
      // Check if user is already logged in
      const isLoggedIn = await checkAuthStatus();

      if (!isLoggedIn) {
        router.replace(AUTH_ROUTES.LOGIN);
        return;
      }

      // Get role directly from AsyncStorage since Redux state might not update immediately
      const storedUser = await AsyncStorage.getItem('@hospital_auth_user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userRole = userData.role;
        
        console.log('role', userRole);
        
        if (hasRedirected.current) return;
        hasRedirected.current = true;
        
        // Redirect based on role
        if (userRole === ROLES.PATIENT) {
          router.replace(PATIENT_ROUTES.DASHBOARD);
        } else if (userRole === ROLES.STAFF) {
          router.replace(STAFF_ROUTES.DASHBOARD);
        } else if (userRole === ROLES.OWNER) {
          router.replace(OWNER_ROUTES.DASHBOARD);
        } else {
          router.replace(AUTH_ROUTES.LOGIN);
        }
      } else {
        router.replace(AUTH_ROUTES.LOGIN);
      }
    };

    init();
  }, [checkAuthStatus]);

  // Fallback: Watch for role changes in Redux state (in case AsyncStorage approach doesn't work)
  useEffect(() => {
    if (hasRedirected.current || !role) return;

    hasRedirected.current = true;
    console.log('role from Redux', role);

    // Redirect based on role
    if (role === ROLES.PATIENT) {
      router.replace(PATIENT_ROUTES.DASHBOARD);
    } else if (role === ROLES.STAFF) {
      router.replace(STAFF_ROUTES.DASHBOARD);
    } else if (role === ROLES.OWNER) {
      router.replace(OWNER_ROUTES.DASHBOARD);
    } else {
      router.replace(AUTH_ROUTES.LOGIN);
    }
  }, [role]);

  return (
    <ThemedView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <ActivityIndicator size="large" color="#4B7BEC" />
    </ThemedView>
  );
}
