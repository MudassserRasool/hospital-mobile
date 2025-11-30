/**
 * Login Screen
 * Authentication entry point with Google OAuth
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useGetHospitalByPackageIdQuery } from '@/redux/features/hospital/hospitalApi';
import { MaterialIcons } from '@expo/vector-icons';
// import { Application } from 'expo';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from './login.style';

import { ROLES } from '@/constants';
import { packageName } from '@/constants/expoConstants';
import {
  AUTH_ROUTES,
  OWNER_ROUTES,
  PATIENT_ROUTES,
  STAFF_ROUTES,
} from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import {
  useGenerateGuestTokenMutation,
  useLoginWithCredentialsMutation,
} from '@/redux/features/auth/authApi';
import { router } from 'expo-router';
// Get package name
// or

export default function LoginScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode] = useState<'email' | 'phone'>('email');
  useGetHospitalByPackageIdQuery(packageName || '', { skip: !packageName });
  const [generateGuestToken] = useGenerateGuestTokenMutation();

  const [
    loginWithCredentials,
    { isLoading: isLoggingIn },
  ] = useLoginWithCredentialsMutation();

  // const [registerDevice] = useRegisterDeviceTokenMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter email and password',
      });
      return;
    }

    try {
      let response = await loginWithCredentials({
        email,
        password,
      }).unwrap();
      response = response.data;

      if (response?.user && response?.accessToken) {
        // Sanitize user object (remove password and other sensitive fields)
        const { password, refreshTokens, ...sanitizedUser } = response.user;

        // Save credentials to AsyncStorage and Redux using useAuth hook
        await login(
          sanitizedUser,
          response.accessToken,
          response.user.role as 'patient' | 'staff' | 'owner',
          response.refreshToken
        );

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });
        // window.alert(response.user.role);
        // Navigate based on role
        setTimeout(() => {
          
          if (response.user.role === ROLES.PATIENT) {
            router.replace(PATIENT_ROUTES.DASHBOARD);
          } else if (response.user.role === ROLES.STAFF) {
            router.replace(STAFF_ROUTES.DASHBOARD);
          } else if (response.user.role === ROLES.OWNER) {
            router.replace(OWNER_ROUTES.DASHBOARD);
          }
        }, 1500);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage =
        error?.data?.message || error?.message || 'Login failed';

      // If user needs to verify with OTP, navigate to OTP screen
      if (
        errorMessage.toLowerCase().includes('verify') ||
        errorMessage.toLowerCase().includes('otp')
      ) {
        Toast.show({
          type: 'info',
          text1: 'Verification Required',
          text2: errorMessage,
        });

        setTimeout(() => {
          router.replace({
            pathname: AUTH_ROUTES.OTP_VERIFICATION,
            params: { email },
          });
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: errorMessage,
        });
      }
    }
  };

  const handleGestLogin = async () => {
    try {
      const response = await generateGuestToken(undefined).unwrap();

      if (response?.data?.guestToken && response?.data?.gestUser) {
        console.log('response---GUEST TOKEN---->', response.data);

        // Sanitize user object (remove password and other sensitive fields)
        const { password, refreshTokens, ...sanitizedUser } =
          response.data.gestUser;

        // Save credentials to AsyncStorage and Redux using useAuth hook
        await login(sanitizedUser, response.data.guestToken, ROLES.PATIENT);

        Toast.show({
          type: 'success',
          text1: 'Guest Login Successful',
          text2: 'Welcome!',
        });

        // Navigate to patient dashboard
        setTimeout(() => {
          router.replace(PATIENT_ROUTES.DASHBOARD);
        }, 500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Guest token or user not found in response',
        });
        console.log('response---GUEST TOKEN---->', response);
      }
    } catch (error: any) {
      console.error('Guest login error:', error);
      const errorMessage =
        error?.data?.message || error?.message || 'Unable to login as guest';
      Toast.show({
        type: 'error',
        text1: 'Guest Login Failed',
        text2: errorMessage,
      });
    }
  };

  const handelLoginWithPhoneNumberAndPassword = async () => {
    if (!phoneNumber || !password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter phone number and password',
      });
      return;
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

            {/* Login Mode Toggle */}
            {/* <ThemedView style={styles.modeToggle}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  loginMode === 'email' && styles.modeButtonActive,
                ]}
                onPress={() => setLoginMode('email')}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    loginMode === 'email' && styles.modeButtonTextActive,
                  ]}
                >
                  Email
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  loginMode === 'phone' && styles.modeButtonActive,
                ]}
                onPress={() => setLoginMode('phone')}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    loginMode === 'phone' && styles.modeButtonTextActive,
                  ]}
                >
                  Phone
                </ThemedText>
              </TouchableOpacity>
            </ThemedView> */}

            {/* <DebugView data={data} title="Hospital Data" /> */}

            {/* Login Form */}
            <ThemedView style={styles.form}>
              {loginMode === 'email' ? (
                <>
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
                    fullWidth
                    loading={isLoggingIn}
                    style={styles.loginButton}
                    leftIcon={
                      <MaterialIcons
                        name="login"
                        size={20}
                        color="#FFFFFF"
                        style={{ marginRight: 8 }}
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    leftIcon={
                      <MaterialIcons name="phone" size={20} color="#9CA3AF" />
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
                    title="Sign In with Phone"
                    onPress={handelLoginWithPhoneNumberAndPassword}
                    fullWidth
                    style={styles.loginButton}
                    leftIcon={
                      <MaterialIcons
                        name="phone"
                        size={20}
                        color="#FFFFFF"
                        style={{ marginRight: 8 }}
                      />
                    }
                  />
                </>
              )}
            </ThemedView>

            {/* Footer */}
            <ThemedView style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Don&apos;t have an account?{' '}
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push(AUTH_ROUTES.REGISTER)}
              >
                <ThemedText style={[styles.footerText, styles.linkText]}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* Divider */}
            <ThemedView style={styles.divider}>
              <ThemedView style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>
                Or continue with
              </ThemedText>
              <ThemedView style={styles.dividerLine} />
            </ThemedView>

            {/* Guest Login */}
            <Button
              title="Continue as Guest"
              onPress={handleGestLogin}
              variant="outline"
              fullWidth
              style={styles.guestButton}
              leftIcon={
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color={primaryColor}
                  style={{ marginRight: 8 }}
                />
              }
            />
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
