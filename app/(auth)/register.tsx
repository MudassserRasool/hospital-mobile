/**
 * Register Screen
 * User registration with email and password
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { ROLES } from '@/constants';
import { packageName } from '@/constants/expoConstants';
import { AUTH_ROUTES } from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRegisterWithCredentialsMutation } from '@/redux/features/auth/authApi';
import { useGetHospitalByPackageIdQuery } from '@/redux/features/hospital/hospitalApi';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from './login.style';

export default function RegisterScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: hospitalData } = useGetHospitalByPackageIdQuery(
    packageName || '',
    { skip: !packageName }
  );

  const [
    registerWithCredentials,
    { isLoading: isRegistering },
  ] = useRegisterWithCredentialsMutation();

  const handleRegister = async () => {
    // Validation
    if (!email || !password || !firstName || !lastName) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Password must be at least 6 characters',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    try {
      const response = await registerWithCredentials({
        email,
        password,
        firstName,
        lastName,
        role: ROLES.PATIENT,
        hospitalId: hospitalData?._id,
      }).unwrap();

      // Handle success response - check both response.message and response.data.message
      const successMessage =
        response?.data?.message || response?.message || 'OTP sent successfully';

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: successMessage,
      });

      // Navigate to OTP verification screen with email
      // Use setTimeout to ensure Toast is shown before navigation
      setTimeout(() => {
        router.replace({
          pathname: AUTH_ROUTES.OTP_VERIFICATION,
          params: { email },
        });
      }, 500);
    } catch (error: any) {
      console.error('Registration error:', error);
      // Handle error response structure: error.data.message or error.message
      const errorMessage =
        error?.data?.message || error?.message || 'Registration failed';

      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
      });
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
              <ThemedText style={styles.title}>Create Account</ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign up to get started
              </ThemedText>
            </ThemedView>

            {/* Register Form */}
            <ThemedView style={styles.form}>
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                leftIcon={
                  <MaterialIcons name="person" size={20} color="#9CA3AF" />
                }
              />

              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                leftIcon={
                  <MaterialIcons name="person" size={20} color="#9CA3AF" />
                }
              />

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

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                leftIcon={
                  <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    <MaterialIcons
                      name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                }
              />

              <Button
                title="Sign Up"
                onPress={handleRegister}
                fullWidth
                loading={isRegistering}
                style={styles.loginButton}
                leftIcon={
                  <MaterialIcons
                    name="person-add"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                }
              />
            </ThemedView>

            {/* Footer */}
            <ThemedView style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Already have an account?{' '}
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push(AUTH_ROUTES.LOGIN)}
              >
                <ThemedText style={[styles.footerText, styles.linkText]}>
                  Sign In
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
