/**
 * Login Screen
 * Authentication entry point with Google OAuth
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { ENV } from '@/constants';
import { OWNER_ROUTES, PATIENT_ROUTES, STAFF_ROUTES } from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/useAuth';
import {
  useLoginWithGoogleMutation,
  useRegisterDeviceTokenMutation,
} from '@/redux/features/auth/authApi';
import { registerForPushNotifications } from '@/utils/notificationService';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { styles } from './login.style';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { login } = useAuth();
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // API hooks
  const [loginWithGoogle, { isLoading, isSuccess }] =
    useLoginWithGoogleMutation();
  const [registerDevice] = useRegisterDeviceTokenMutation();

  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: ENV.GOOGLE_OAUTH_CLIENT_ID,
    iosClientId: ENV.GOOGLE_OAUTH_IOS_CLIENT_ID,
    androidClientId: ENV.GOOGLE_OAUTH_ANDROID_CLIENT_ID,
    webClientId: ENV.GOOGLE_OAUTH_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthResponse(response.authentication);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // Email/password login not implemented for mobile
    // Mobile users must use Google OAuth
    Alert.alert('Info', 'Please use Google Sign In for mobile app');
  };

  const handleGoogleAuthResponse = async (authentication: any) => {
    try {
      // Get user info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        }
      );
      const userInfo = await userInfoResponse.json();

      // Login to backend
      const result = await loginWithGoogle({
        googleId: userInfo.id,
        email: userInfo.email,
        firstName: userInfo.given_name || 'User',
        lastName: userInfo.family_name || '',
        profilePicture: userInfo.picture,
        role: 'patient', // Default role for mobile
      }).unwrap();

      // Save tokens
      await AsyncStorage.setItem('accessToken', result.accessToken);
      await AsyncStorage.setItem('refreshToken', result.refreshToken);

      // Login to local auth context
      await login(result.user, result.accessToken, result.user.role);

      // Register device for push notifications
      const pushToken = await registerForPushNotifications();
      if (pushToken) {
        try {
          await registerDevice(pushToken).unwrap();
        } catch (error) {
          console.error('Failed to register push token:', error);
        }
      }

      // Navigate based on role
      const userRole = result.user.role;
      if (userRole === 'patient') {
        router.replace(PATIENT_ROUTES.DASHBOARD);
      } else if (
        userRole === 'doctor' ||
        userRole === 'nurse' ||
        userRole === 'staff' ||
        userRole === 'receptionist'
      ) {
        router.replace(STAFF_ROUTES.DASHBOARD);
      } else if (userRole === 'owner') {
        router.replace(OWNER_ROUTES.DASHBOARD);
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      Alert.alert(
        'Login Failed',
        error.data?.message || 'Unable to login with Google'
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert('Error', 'Google Sign In failed. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.content}>
            {/* Logo and Title */}
            <ThemedView style={styles.logoContainer}>
              <MaterialIcons
                name="local-hospital"
                size={80}
                color={primaryColor}
              />
              <ThemedText style={styles.title}>Welcome Back!</ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign in to access your account
              </ThemedText>
            </ThemedView>

            {/* Login Form */}
            <ThemedView style={styles.form}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={
                  <MaterialIcons name="email" size={20} color="#9CA3AF" />
                }
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon={
                  <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                }
              />

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
                fullWidth
              />
            </ThemedView>

            {/* Divider */}
            <ThemedView style={styles.divider}>
              <ThemedView style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>
                Or continue with
              </ThemedText>
              <ThemedView style={styles.dividerLine} />
            </ThemedView>

            {/* Google Sign In */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.7}
              disabled={!request || isLoading}
            >
              <MaterialIcons
                name="g-translate"
                size={24}
                color={primaryColor}
              />
              <ThemedText
                style={[styles.googleButtonText, { color: textColor }]}
              >
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </ThemedText>
            </TouchableOpacity>

            {/* Footer */}
            <ThemedView style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Don&apos;t have an account?
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <ThemedText style={[styles.linkText, { color: primaryColor }]}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
