/**
 * Edit Profile Component
 * Role-based profile editing with dynamic fields
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, Input, Select } from '@/components/ui';
import FileUploadInput from '@/components/ui/FileUploadInput/FileUploadInput';
import {
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
  StatusColors,
} from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { getFieldSections } from './profileFields.config';
// Date picker will be handled via text input with date keyboard

interface EditProfileProps {
  profileData?: any;
  isLoading?: boolean;
  isUpdating?: boolean;
  onUpdateProfile?: (updateData: any) => Promise<{ success: boolean; error?: string }>;
  refetch?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  profileData,
  isLoading = false,
  isUpdating = false,
  onUpdateProfile,
  refetch,
  onCancel,
  onSave,
}) => {
  const { user } = useAuth();
  const userRole = user?.role || 'patient';
  const isPatient = userRole === 'patient';

  const userData = profileData?.data || profileData || user;

  // Get field sections for current role
  const fieldSections = getFieldSections(userRole);

  // Initialize form data with all possible fields
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data from userData
  useEffect(() => {
    if (userData) {
      const initialData: Record<string, any> = {
        firstName:
          userData?.firstName ||
          userData?.userId?.firstName ||
          userData?.name?.split(' ')[0] ||
          '',
        lastName:
          userData?.lastName ||
          userData?.userId?.lastName ||
          userData?.name?.split(' ').slice(1).join(' ') ||
          '',
        phone: userData?.phone || userData?.userId?.phone || '',
        profilePicture:
          userData?.profilePicture ||
          userData?.userId?.profilePicture ||
          '',
        dateOfBirth: userData?.dateOfBirth
          ? new Date(userData.dateOfBirth)
          : undefined,
        gender: userData?.gender || '',
        bloodType: userData?.bloodType || '',
        allergies: userData?.allergies?.join(', ') || '',
        chronicConditions: userData?.chronicConditions?.join(', ') || '',
        medicalRecordNumber: userData?.medicalRecordNumber || '',
        insuranceProvider: userData?.insuranceProvider || '',
        insurancePolicyNumber: userData?.insurancePolicyNumber || '',
        specialization: userData?.specialization || '',
        licenseNumber: userData?.licenseNumber || '',
        experience: userData?.experience || '',
        emergencyContact: userData?.emergencyContact || {
          name: '',
          phone: '',
          relation: '',
        },
      };

      setFormData(initialData);
    }
  }, [userData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedInputChange = (
    parentField: string,
    childField: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] || {}),
        [childField]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required common fields
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate emergency contact if it exists
    if (formData.emergencyContact) {
      if (!formData.emergencyContact.name?.trim()) {
        newErrors['emergencyContact.name'] = 'Contact name is required';
      }
      if (!formData.emergencyContact.phone?.trim()) {
        newErrors['emergencyContact.phone'] = 'Contact phone is required';
      }
      if (!formData.emergencyContact.relation?.trim()) {
        newErrors['emergencyContact.relation'] = 'Relationship is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!onUpdateProfile) {
      Alert.alert('Error', 'Update function not available');
      return;
    }

    try {
      // Prepare update data based on role
      const updateData: any = {};

      // Common fields
      if (formData.firstName)
        updateData.firstName = formData.firstName.trim();
      if (formData.lastName)
        updateData.lastName = formData.lastName.trim();
      if (formData.phone !== undefined)
        updateData.phone = formData.phone.trim() || null;
      if (formData.profilePicture)
        updateData.profilePicture = formData.profilePicture;

      // Profile fields
      if (formData.dateOfBirth) {
        updateData.dateOfBirth = formData.dateOfBirth.toISOString();
      }
      if (formData.gender) updateData.gender = formData.gender;

      // Patient-specific fields
      if (isPatient) {
        if (formData.bloodType) updateData.bloodType = formData.bloodType;
        if (formData.allergies) {
          updateData.allergies = formData.allergies
            .split(',')
            .map((a: string) => a.trim())
            .filter((a: string) => a.length > 0);
        }
        if (formData.chronicConditions) {
          updateData.chronicConditions = formData.chronicConditions
            .split(',')
            .map((c: string) => c.trim())
            .filter((c: string) => c.length > 0);
        }
        if (formData.medicalRecordNumber)
          updateData.medicalRecordNumber = formData.medicalRecordNumber;
        if (formData.insuranceProvider)
          updateData.insuranceProvider = formData.insuranceProvider;
        if (formData.insurancePolicyNumber)
          updateData.insurancePolicyNumber = formData.insurancePolicyNumber;
        if (formData.emergencyContact) {
          updateData.emergencyContact = {
            name: formData.emergencyContact.name?.trim(),
            phone: formData.emergencyContact.phone?.trim(),
            relation: formData.emergencyContact.relation?.trim(),
          };
        }
      } else {
        // Staff/Owner fields
        if (['doctor', 'nurse', 'staff', 'receptionist'].includes(userRole)) {
          if (formData.specialization)
            updateData.specialization = formData.specialization;
          if (formData.licenseNumber)
            updateData.licenseNumber = formData.licenseNumber;
          if (formData.experience)
            updateData.experience = formData.experience;
        }
      }

      const result = await onUpdateProfile(updateData);

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        if (refetch) {
          await refetch();
        }
        onSave?.();
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile. Please try again.');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to update profile. Please try again.'
      );
    }
  };

  const renderField = (field: any, sectionTitle?: string) => {
    const fieldValue = formData[field.key];
    const fieldError = errors[field.key];
    // Check if section title matches field label (to avoid duplicate titles)
    const shouldShowNestedTitle = sectionTitle !== field.label;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            value={fieldValue || ''}
            onChangeText={(value) => handleInputChange(field.key, value)}
            error={fieldError}
            keyboardType={
              field.type === 'email'
                ? 'email-address'
                : field.type === 'phone'
                ? 'phone-pad'
                : 'default'
            }
            leftIcon={
              field.icon ? (
                <MaterialIcons
                  name={field.icon as any}
                  size={20}
                  color={NeutralColors.gray400}
                />
              ) : undefined
            }
            helperText={field.helperText}
          />
        );

      case 'date':
        return (
          <Input
            key={field.key}
            label={field.label}
            placeholder={field.placeholder || 'YYYY-MM-DD'}
            value={
              fieldValue
                ? new Date(fieldValue).toISOString().split('T')[0]
                : ''
            }
            onChangeText={(value) => {
              // Parse date string to Date object
              if (value) {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  handleInputChange(field.key, date);
                }
              }
            }}
            error={fieldError}
            keyboardType="default"
            leftIcon={
              field.icon ? (
                <MaterialIcons
                  name={field.icon as any}
                  size={20}
                  color={NeutralColors.gray400}
                />
              ) : undefined
            }
            helperText={field.helperText || 'Format: YYYY-MM-DD'}
          />
        );

      case 'select':
        return (
          <Select
            key={field.key}
            label={field.label}
            value={fieldValue || ''}
            options={field.options || []}
            onValueChange={(value) => handleInputChange(field.key, value)}
            placeholder={field.placeholder}
            error={fieldError}
            helperText={field.helperText}
          />
        );

      case 'multiselect':
        return (
          <Input
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            value={fieldValue || ''}
            onChangeText={(value) => handleInputChange(field.key, value)}
            error={fieldError}
            helperText={field.helperText || 'Separate items with commas'}
            leftIcon={
              field.icon ? (
                <MaterialIcons
                  name={field.icon as any}
                  size={20}
                  color={NeutralColors.gray400}
                />
              ) : undefined
            }
          />
        );

      case 'object':
        // If section title matches field label, don't wrap in Card or show nested title
        if (!shouldShowNestedTitle) {
          return (
            <ThemedView key={field.key}>
              {field.fields?.map((nestedField: any) => (
                <Input
                  key={nestedField.key}
                  label={nestedField.label}
                  placeholder={nestedField.placeholder}
                  value={
                    formData[field.key]?.[nestedField.key] || ''
                  }
                  onChangeText={(value) =>
                    handleNestedInputChange(field.key, nestedField.key, value)
                  }
                  error={errors[`${field.key}.${nestedField.key}`]}
                  leftIcon={
                    nestedField.icon ? (
                      <MaterialIcons
                        name={nestedField.icon as any}
                        size={20}
                        color={NeutralColors.gray400}
                      />
                    ) : undefined
                  }
                />
              ))}
            </ThemedView>
          );
        }
        // Otherwise, render with Card and nested title
        return (
          <Card key={field.key} style={styles.nestedCard}>
            <ThemedText style={styles.sectionTitle}>{field.label}</ThemedText>
            {field.fields?.map((nestedField: any) => (
              <Input
                key={nestedField.key}
                label={nestedField.label}
                placeholder={nestedField.placeholder}
                value={
                  formData[field.key]?.[nestedField.key] || ''
                }
                onChangeText={(value) =>
                  handleNestedInputChange(field.key, nestedField.key, value)
                }
                error={errors[`${field.key}.${nestedField.key}`]}
                leftIcon={
                  nestedField.icon ? (
                    <MaterialIcons
                      name={nestedField.icon as any}
                      size={20}
                      color={NeutralColors.gray400}
                    />
                  ) : undefined
                }
              />
            ))}
          </Card>
        );

      default:
        return null;
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
    formData.profilePicture || userData?.profilePicture || null;

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

      {/* Dynamic Form Sections */}
      {fieldSections.map((section, sectionIndex) => {
        // Filter out fields that are not editable (isEditable: false)
        const editableFields = section.fields.filter(
          (field) => field.isEditable !== false
        );

        // Don't render section if no editable fields
        if (editableFields.length === 0) {
          return null;
        }

        return (
          <Card key={sectionIndex} style={styles.formCard}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            {editableFields.map((field) => {
              // Skip profilePicture as it's handled separately
              if (field.key === 'profilePicture') {
                return (
                  <FileUploadInput
                    key={field.key}
                    label={field.label}
                    value={formData.profilePicture || ''}
                    onUploadSuccess={(url) => {
                      handleInputChange('profilePicture', url);
                    }}
                    onUploadError={(error) => {
                      Alert.alert('Upload Error', error);
                    }}
                    helperText="Upload an image from your device"
                  />
                );
              }
              return renderField(field, section.title);
            })}
          </Card>
        );
      })}

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
  formCard: {
    marginBottom: Spacing.lg,
  },
  nestedCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  required: {
    color: StatusColors.error,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NeutralColors.gray300,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 48,
    gap: Spacing.sm,
  },
  datePickerButtonError: {
    borderColor: StatusColors.error,
  },
  datePickerText: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  errorText: {
    color: StatusColors.error,
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
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
