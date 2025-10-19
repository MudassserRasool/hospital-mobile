/**
 * useAuth Hook
 * Custom hook for authentication state management
 */

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCredentials, logout as logoutAction } from '@/redux/features/auth/authSlice';
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@hospital_auth_token';
const AUTH_USER_KEY = '@hospital_auth_user';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, role, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (userData: User, authToken: string, userRole: 'patient' | 'staff' | 'owner') => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      
      // Update Redux state
      dispatch(setCredentials({ user: userData, token: authToken, role: userRole }));
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const logout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(AUTH_USER_KEY);
      
      // Update Redux state
      dispatch(logoutAction());
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        dispatch(setCredentials({
          user: userData,
          token: storedToken,
          role: userData.role,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  };

  return {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };
}
