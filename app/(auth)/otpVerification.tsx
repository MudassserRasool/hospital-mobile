/**
 * OTP Verification Screen
 * Verify user with OTP code sent via email
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui';
import { ROLES } from '@/constants';
import {
  AUTH_ROUTES,
  OWNER_ROUTES,
  PATIENT_ROUTES,
  STAFF_ROUTES,
} from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/useAuth';
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '@/redux/features/auth/authApi';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import Toast from 'react-native-toast-message';
import { styles } from './login.style';

const RESEND_COOLDOWN_SECONDS = 30 * 60; // 30 minutes in seconds

export default function OtpVerificationScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const { login } = useAuth();
  const params = useLocalSearchParams();
  const email = (params.email as string) || '';

  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // Redirect to login if email is not provided
  useEffect(() => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email is required for OTP verification',
      });
      setTimeout(() => {
        router.replace(AUTH_ROUTES.LOGIN);
      }, 1000);
    }
  }, [email]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  // Format timer display
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid 4-digit OTP',
      });
      return;
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Email is required',
      });
      return;
    }

    try {
      let response = await verifyOtp({
        email,
        otp,
      }).unwrap();
      response = response.data;

      if (response?.user && response?.accessToken) {
        // Sanitize user object
        const { password, refreshTokens, ...sanitizedUser } = response.user;

        // Save credentials
        await login(
          sanitizedUser,
          response.accessToken,
          response.user.role as 'patient' | 'staff' | 'owner',
          response.refreshToken
        );

        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: 'Welcome! Redirecting...',
        });

        // Navigate based on role
        setTimeout(() => {
          if (response.user.role === ROLES.PATIENT) {
            router.replace(PATIENT_ROUTES.DASHBOARD);
          } else if (response.user.role === ROLES.STAFF) {
            router.replace(STAFF_ROUTES.DASHBOARD);
          } else if (response.user.role === ROLES.OWNER) {
            router.replace(OWNER_ROUTES.DASHBOARD);
          } else {
            router.replace(PATIENT_ROUTES.DASHBOARD);
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      const errorMessage =
        error?.data?.message || error?.message || 'Invalid OTP';
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: errorMessage,
      });
      // Clear OTP on error
      setOtp('');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) {
      return;
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Email is required',
      });
      return;
    }

    try {
      const response = await resendOtp({ email }).unwrap();

      // Handle success response - check both response.message and response.data.message
      const successMessage =
        response?.data?.message || response?.message || 'OTP resent successfully';

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: successMessage,
      });

      // Reset cooldown timer
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setCanResend(false);
      setOtp('');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      const errorMessage =
        error?.data?.message || error?.message || 'Failed to resend OTP';
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
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
                name="verified-user"
                size={80}
                color={primaryColor}
              />
              <ThemedText style={styles.title}>Verify Your Email</ThemedText>
              <ThemedText style={styles.subtitle}>
                We&apos;ve sent a 4-digit code to{'\n'}
                <ThemedText style={{ fontWeight: '600' }}>{email}</ThemedText>
              </ThemedText>
            </ThemedView>

            {/* OTP Input */}
            <ThemedView style={styles.form}>
              <OtpInput
                numberOfDigits={4}
                onTextChange={(text) => setOtp(text)}
                focusColor={primaryColor}
                theme={{
                  containerStyle: {
                    marginVertical: 20,
                  },
                  pinCodeContainerStyle: {
                    borderWidth: 2,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    width: 60,
                    height: 60,
                  },
                  pinCodeTextStyle: {
                    fontSize: 24,
                    fontWeight: '600',
                  },
                  focusedPinCodeContainerStyle: {
                    borderColor: primaryColor,
                    borderWidth: 2,
                  },
                }}
                autoFocus
              />

              <Button
                title="Verify OTP"
                onPress={handleVerifyOtp}
                fullWidth
                loading={isVerifying}
                disabled={otp.length !== 4}
                style={styles.loginButton}
                leftIcon={
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                }
              />

              {/* Resend OTP Section */}
              <ThemedView
                style={{
                  marginTop: 20,
                  alignItems: 'center',
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 14,
                    color: '#6B7280',
                    marginBottom: 10,
                  }}
                >
                  Didn&apos;t receive the code?
                </ThemedText>

                {canResend ? (
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={isResending}
                  >
                    <ThemedText
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: primaryColor,
                      }}
                    >
                      {isResending ? 'Sending...' : 'Resend OTP'}
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <ThemedText
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#9CA3AF',
                    }}
                  >
                    Resend OTP in {formatTimer(resendCooldown)}
                  </ThemedText>
                )}
              </ThemedView>
            </ThemedView>

            {/* Back to Login */}
            <ThemedView style={styles.footer}>
              <TouchableOpacity
                onPress={() => router.push(AUTH_ROUTES.LOGIN)}
              >
                <ThemedText style={[styles.footerText, styles.linkText]}>
                  Back to Sign In
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
