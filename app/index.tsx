/**
 * App Entry Point
 * Role-based routing logic
 */

import { ThemedView } from '@/components/themed-view';
import {
  AUTH_ROUTES,
  OWNER_ROUTES,
  PATIENT_ROUTES,
  STAFF_ROUTES,
} from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated, role, checkAuthStatus } = useAuth();

  useEffect(() => {
    const init = async () => {
      // Check if user is already logged in
      const isLoggedIn = await checkAuthStatus();

      if (!isLoggedIn) {
        router.replace(AUTH_ROUTES.LOGIN);
        return;
      }
      console.log('role', role);
      // Redirect based on role
      if (role === 'patient') {
        router.replace(PATIENT_ROUTES.DASHBOARD);
      } else if (role === 'staff') {
        router.replace(STAFF_ROUTES.DASHBOARD);
      } else if (role === 'owner') {
        router.replace(OWNER_ROUTES.DASHBOARD);
      } else {
        router.replace(AUTH_ROUTES.LOGIN);
      }
    };

    init();
  }, []);

  return (
    <ThemedView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <ActivityIndicator size="large" color="#4B7BEC" />
    </ThemedView>
  );
}
