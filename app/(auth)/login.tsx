/**
 * Login Screen
 * Authentication entry point with Google OAuth
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { styles } from './login.style';

export default function LoginScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('phone');

  // API hooks
  // const [registerDevice] = useRegisterDeviceTokenMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // Email/password login not implemented for mobile
    // Mobile users must use Google OAuth
  };

  const handleGestLogin = async () => {
    try {
      // Guest login implementation
    } catch {
      Alert.alert('Error', 'Guest login failed. Please try again.');
    }
  };

  const handelLoginWithPhoneNumberAndPassword = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please enter phone number and password');
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
