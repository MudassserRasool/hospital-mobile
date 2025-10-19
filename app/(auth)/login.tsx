/**
 * Login Screen
 * Authentication entry point with Google OAuth
 */

import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
// import { ThemedText } from '@/components/themed-text';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { OWNER_ROUTES, PATIENT_ROUTES, STAFF_ROUTES } from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/useAuth';
import { styles } from './login.style';

export default function LoginScreen() {
  const { login } = useAuth();
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // Mock login - Replace with actual API call
      const mockUser = {
        id: '1',
        name: 'Andrew Ainsley',
        email: email,
        role: 'patient' as const,
        avatar: 'https://i.pravatar.cc/150?img=12',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token-123';

      await login(mockUser, mockToken, mockUser.role);

      // Navigate based on role
      if (mockUser.role === 'patient') {
        router.replace(PATIENT_ROUTES.DASHBOARD);
      } else if (mockUser.role === 'staff') {
        router.replace(STAFF_ROUTES.DASHBOARD);
      } else if (mockUser.role === 'owner') {
        router.replace(OWNER_ROUTES.DASHBOARD);
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Mock Google Sign In - Replace with actual Google OAuth
      const mockUser = {
        id: '1',
        name: 'Andrew Ainsley',
        email: 'andrew@example.com',
        role: 'patient' as const,
        avatar: 'https://i.pravatar.cc/150?img=12',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token-123';

      await login(mockUser, mockToken, mockUser.role);
      router.replace(PATIENT_ROUTES.DASHBOARD);
    } catch (error) {
      Alert.alert('Error', 'Google Sign In failed. Please try again.');
    } finally {
      setLoading(false);
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
                loading={loading}
                style={styles.loginButton}
                fullWidth
              />
            </ThemedView>

            {/* Divider */}
            <ThemedView style={styles.divider}>
              <ThemedView style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <ThemedView style={styles.dividerLine} />
            </ThemedView>

            {/* Google Sign In */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.7}
              disabled={loading}
            >
              <MaterialIcons
                name="g-translate"
                size={24}
                color={primaryColor}
              />
              <Text style={[styles.googleButtonText, { color: textColor }]}>
                Sign in with Google
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <ThemedView style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={[styles.linkText, { color: primaryColor }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
