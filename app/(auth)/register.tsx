/**
 * Register Screen
 * User registration with Google OAuth
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { PATIENT_ROUTES } from '@/constants/routes';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/useAuth';
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
  View,
} from 'react-native';
import { styles } from './login.style'; // Reusing login styles

export default function RegisterScreen() {
  const { login } = useAuth();
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Mock registration - Replace with actual API call
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        role: 'patient' as const,
        avatar: 'https://i.pravatar.cc/150?img=12',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token-123';

      await login(mockUser, mockToken, mockUser.role);
      router.replace(PATIENT_ROUTES.DASHBOARD);
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      // Mock Google Sign Up - Replace with actual Google OAuth
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
      Alert.alert('Error', 'Google Sign Up failed. Please try again.');
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
          <View style={styles.content}>
            {/* Logo and Title */}
            <View style={styles.logoContainer}>
              <MaterialIcons
                name="local-hospital"
                size={80}
                color={primaryColor}
              />
              <ThemedText style={styles.title}>Create Account</ThemedText>
              <ThemedText style={styles.subtitle}>
                Join us for better healthcare
              </ThemedText>
            </View>

            {/* Registration Form */}
            <View style={styles.form}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
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
                secureTextEntry={!showPassword}
                leftIcon={
                  <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                }
              />

              <Button
                title="Sign Up"
                onPress={handleRegister}
                loading={loading}
                style={styles.loginButton}
                fullWidth
              />
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign Up */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignUp}
              activeOpacity={0.7}
              disabled={loading}
            >
              <MaterialIcons
                name="g-translate"
                size={24}
                color={primaryColor}
              />
              <Text style={[styles.googleButtonText, { color: textColor }]}>
                Sign up with Google
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.linkText, { color: primaryColor }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
