/**
 * View Profile Component
 * Displays user profile information in a beautiful card layout
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card } from '@/components/ui';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetProfileQuery,
  useLogoutMutation,
} from '@/redux/features/auth/authApi';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';

const AUTH_REFRESH_TOKEN_KEY = '@hospital_auth_refresh_token';

interface ViewProfileProps {
  onEditPress?: () => void;
}

const ViewProfile: React.FC<ViewProfileProps> = ({ onEditPress }) => {
  const { user, logout } = useAuth();
  const { data: profileData, isLoading } = useGetProfileQuery(undefined, {
    skip: !user,
  });
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [isLoggingOutState, setIsLoggingOutState] = useState(false);

  const userData = profileData?.data || profileData || user;

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={BrandColors.primary} />
      </ThemedView>
    );
  }

  const displayName =
    userData?.name ||
    `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() ||
    'User';
  const displayEmail = userData?.email || '';
  const displayPhone = userData?.phone || 'Not provided';
  const displayRole = userData?.role || '';
  const displayAvatar =
    userData?.profilePicture || userData?.avatar || userData?.profilePicture;

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      patient: 'Patient',
      doctor: 'Doctor',
      nurse: 'Nurse',
      receptionist: 'Receptionist',
      technician: 'Technician',
      admin: 'Administrator',
      owner: 'Hospital Owner',
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleIcon = (role: string) => {
    const iconMap: { [key: string]: string } = {
      patient: 'person',
      doctor: 'medical-services',
      nurse: 'local-hospital',
      receptionist: 'support-agent',
      technician: 'build',
      admin: 'admin-panel-settings',
      owner: 'business',
    };
    return iconMap[role] || 'person';
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOutState(true);
              
              // Get refresh token from AsyncStorage
              const refreshToken = await AsyncStorage.getItem(
                AUTH_REFRESH_TOKEN_KEY
              );

              // Call logout API if refresh token exists
              if (refreshToken) {
                try {
                  await logoutMutation({ refreshToken }).unwrap();
                } catch (error) {
                  // Even if API call fails, continue with local logout
                  console.error('Logout API error:', error);
                }
              }

              // Clear local storage and Redux state
              await logout();

              Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been successfully logged out',
              });

              // Navigate to root which will check auth and redirect to login
              // Use a small delay to ensure state is cleared and Redux updates
              setTimeout(() => {
                // Navigate to root - index.tsx will check auth state and redirect to login
                router.replace('/');
              }, 300);
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: 'An error occurred while logging out',
              });
            } finally {
              setIsLoggingOutState(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header Card */}
      <Card style={styles.headerCard}>
        <ThemedView style={styles.headerContent}>
          {/* Avatar */}
          <ThemedView style={styles.avatarContainer}>
            {displayAvatar ? (
              <Image source={{ uri: displayAvatar }} style={styles.avatar} />
            ) : (
              <ThemedView style={styles.avatarPlaceholder}>
                <MaterialIcons
                  name="person"
                  size={48}
                  color={NeutralColors.white}
                />
              </ThemedView>
            )}
          </ThemedView>

          {/* Name and Role */}
          <ThemedView style={styles.nameSection}>
            <ThemedText style={styles.name}>{displayName}</ThemedText>
            <ThemedView style={styles.roleContainer}>
              <MaterialIcons
                name={getRoleIcon(displayRole) as any}
                size={16}
                color={BrandColors.primary}
              />
              <ThemedText style={styles.role}>
                {getRoleDisplayName(displayRole)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Card>

      {/* Profile Information Card */}
      <Card style={styles.infoCard}>
        <ThemedText style={styles.sectionTitle}>Profile Information</ThemedText>

        {/* Email */}
        <ThemedView style={styles.infoRow}>
          <ThemedView style={styles.infoIconContainer}>
            <MaterialIcons name="email" size={20} color={BrandColors.primary} />
          </ThemedView>
          <ThemedView style={styles.infoContent}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={styles.infoValue}>{displayEmail}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Phone */}
        <ThemedView style={[styles.infoRow, styles.infoRowLast]}>
          <ThemedView style={styles.infoIconContainer}>
            <MaterialIcons name="phone" size={20} color={BrandColors.primary} />
          </ThemedView>
          <ThemedView style={styles.infoContent}>
            <ThemedText style={styles.infoLabel}>Phone</ThemedText>
            <ThemedText style={styles.infoValue}>{displayPhone}</ThemedText>
          </ThemedView>
        </ThemedView>
      </Card>

      {/* Additional Info Card (if available) */}
      {(userData?.specialization ||
        userData?.department ||
        userData?.employeeId) && (
        <Card style={styles.infoCard}>
          <ThemedText style={styles.sectionTitle}>
            Additional Information
          </ThemedText>

          {userData?.specialization && (
            <ThemedView style={styles.infoRow}>
              <ThemedView style={styles.infoIconContainer}>
                <MaterialIcons
                  name="medical-services"
                  size={20}
                  color={BrandColors.primary}
                />
              </ThemedView>
              <ThemedView style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Specialization</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {userData.specialization}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {userData?.department && (
            <ThemedView style={styles.infoRow}>
              <ThemedView style={styles.infoIconContainer}>
                <MaterialIcons
                  name="business"
                  size={20}
                  color={BrandColors.primary}
                />
              </ThemedView>
              <ThemedView style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Department</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {userData.department}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {userData?.employeeId && (
            <ThemedView style={[styles.infoRow, styles.infoRowLast]}>
              <ThemedView style={styles.infoIconContainer}>
                <MaterialIcons
                  name="badge"
                  size={20}
                  color={BrandColors.primary}
                />
              </ThemedView>
              <ThemedView style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Employee ID</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {userData.employeeId}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </Card>
      )}

      {/* Edit Button */}
      {onEditPress && (
        <Button
          title="Edit Profile"
          onPress={onEditPress}
          leftIcon={
            <MaterialIcons name="edit" size={20} color={NeutralColors.white} />
          }
          fullWidth
          style={styles.editButton}
        />
      )}

      {/* Logout Button */}
      <Button
        title={isLoggingOut || isLoggingOutState ? 'Logging out...' : 'Logout'}
        onPress={handleLogout}
        variant="danger"
        loading={isLoggingOut || isLoggingOutState}
        leftIcon={
          <MaterialIcons
            name="logout"
            size={20}
            color={NeutralColors.white}
          />
        }
        fullWidth
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};

export default ViewProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  headerCard: {
    marginBottom: Spacing.lg,
    backgroundColor: BrandColors.primary,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: NeutralColors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: NeutralColors.white,
  },
  nameSection: {
    alignItems: 'center',
  },
  name: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: NeutralColors.white,
    marginBottom: Spacing.xs,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  role: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: NeutralColors.white,
  },
  infoCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NeutralColors.gray200,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#EFF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  editButton: {
    marginTop: Spacing.md,
  },
  logoutButton: {
    marginTop: Spacing.md,
  },
});
