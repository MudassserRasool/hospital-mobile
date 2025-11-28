/**
 * Edit Profile Component
 * Form for editing user profile information
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, Input } from '@/components/ui';
import FileUploadInput from '@/components/ui/FileUploadInput/FileUploadInput';
import {
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/redux/features/auth/authApi';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface EditProfileProps {
  onCancel?: () => void;
  onSave?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onCancel, onSave }) => {
  const { user } = useAuth();
  const { data: profileData, isLoading } = useGetProfileQuery(undefined, {
    skip: !user,
  });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const userData = profileData?.data || profileData || user;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: '',
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData?.firstName || userData?.name?.split(' ')[0] || '',
        lastName:
          userData?.lastName ||
          userData?.name?.split(' ').slice(1).join(' ') ||
          '',
        phone: userData?.phone || '',
        avatar: userData?.avatar || '',
      });
    }
  }, [userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const updateData: any = {};

      if (formData.firstName) updateData.firstName = formData.firstName.trim();
      if (formData.lastName) updateData.lastName = formData.lastName.trim();
      if (formData.phone !== undefined)
        updateData.phone = formData.phone.trim() || null;
      if (formData.avatar)
        updateData.avatar = formData.avatar;

      await updateProfile(updateData).unwrap();
      Alert.alert('Success', 'Profile updated successfully');
      onSave?.();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to update profile. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={BrandColors.primary} />
      </ThemedView>
    );
  }

  const displayAvatar =
    formData.avatar || userData?.avatar;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >

      {/* Profile Picture Section */}
      <Card style={styles.avatarCard}>
        <ThemedView style={styles.avatarSection}>
          <ThemedView style={styles.avatarContainer}>
            {displayAvatar ? (
              <Image source={{ uri: displayAvatar }} style={styles.avatar} />
            ) : (
              <ThemedView style={styles.avatarPlaceholder}>
                <MaterialIcons
                  name="person"
                  size={48}
                  color={NeutralColors.gray400}
                />
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </Card>

      {/* Form Card */}
      <Card style={styles.formCard}>
        <ThemedText style={styles.sectionTitle}>
          Personal Information
        </ThemedText>

        {/* First Name */}
        <Input
          label="First Name"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
          error={errors.firstName}
          leftIcon={
            <MaterialIcons
              name="person"
              size={20}
              color={NeutralColors.gray400}
            />
          }
        />

        {/* Last Name */}
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
          error={errors.lastName}
          leftIcon={
            <MaterialIcons
              name="person-outline"
              size={20}
              color={NeutralColors.gray400}
            />
          }
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          error={errors.phone}
          keyboardType="phone-pad"
          leftIcon={
            <MaterialIcons
              name="phone"
              size={20}
              color={NeutralColors.gray400}
            />
          }
        />

        {/* Profile Picture Upload */}
        <FileUploadInput
          label="Profile Picture"
          value={formData.avatar}
          onUploadSuccess={(url) => {
            handleInputChange('avatar', url);
          }}
          onUploadError={(error) => {
            Alert.alert('Upload Error', error);
          }}
          helperText="Upload an image from your device"
        />
      </Card>

      {/* Action Buttons */}
      <ThemedView style={styles.buttonContainer}>
        {onCancel && (
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.cancelButton}
            fullWidth
          />
        )}
        <Button
          title={isUpdating ? 'Saving...' : 'Save Changes'}
          onPress={handleSubmit}
          loading={isUpdating}
          fullWidth
          style={styles.saveButton}
        />
      </ThemedView>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  avatarCard: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  avatarSection: {
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
    borderWidth: 3,
    borderColor: BrandColors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: NeutralColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: NeutralColors.gray300,
  },
  avatarHint: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  cancelButton: {
    marginBottom: 0,
  },
  saveButton: {
    marginTop: 0,
  },
});
