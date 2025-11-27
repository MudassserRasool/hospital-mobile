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
      if (role === ROLES.PATIENT) {
        router.replace(PATIENT_ROUTES.DASHBOARD);
      } else if (role === ROLES.STAFF) {
        router.replace(STAFF_ROUTES.DASHBOARD);
      } else if (role === ROLES.OWNER) {
        router.replace(OWNER_ROUTES.DASHBOARD);
      } else {
        router.replace(AUTH_ROUTES.LOGIN);
      }
    };

    init();
  }, [isAuthenticated, role]); // React to auth state changes

  return (
    <ThemedView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <ActivityIndicator size="large" color="#4B7BEC" />
    </ThemedView>
  );
}
