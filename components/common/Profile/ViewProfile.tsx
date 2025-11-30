/**
 * View Profile Component
 * Role-based profile display with dynamic fields
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
  StatusColors,
} from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet } from 'react-native';
import { getFieldSections } from './profileFields.config';

interface ViewProfileProps {
  profileData?: any;
  isLoading?: boolean;
  onEditPress?: () => void;
  onLogout?: () => void;
}

const ViewProfile: React.FC<ViewProfileProps> = ({
  profileData,
  isLoading = false,
  onEditPress,
  onLogout,
}) => {
  const { user } = useAuth();
  const userRole = user?.role || 'patient';
  
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
    userData?.firstName ||
    userData?.userId?.firstName ||
    `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() ||
    'User';
  const displayLastName = userData?.lastName || userData?.userId?.lastName || '';
  const fullName = displayLastName
    ? `${displayName} ${displayLastName}`.trim()
    : displayName;
  const displayEmail =
    userData?.email || userData?.userId?.email || 'Not provided';
  const displayRole = userData?.role || '';
  const displayAvatar =
    userData?.profilePicture ||
    userData?.userId?.profilePicture ||
    null;

  const getRoleDisplayName = (role: string) => {
    if (!role || role.trim() === '') {
      return 'User';
    }
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
    if (!role || role.trim() === '') {
      return 'person';
    }
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

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'Not provided';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch {
      return 'Not provided';
    }
  };

  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return 'None';
    return arr.join(', ');
  };

  // Get field sections for current role
  const fieldSections = getFieldSections(userRole);

  const renderFieldValue = (field: any) => {
    const fieldKey = field.key;
    let value: any;

    // Handle nested fields (like emergencyContact)
    if (fieldKey.includes('.')) {
      const [parent, child] = fieldKey.split('.');
      value = userData?.[parent]?.[child];
    } else {
      value = userData?.[fieldKey] || userData?.userId?.[fieldKey];
    }

    if (value === undefined || value === null || value === '') {
      return 'Not provided';
    }

    switch (field.type) {
      case 'date':
        return formatDate(value);
      case 'multiselect':
        return formatArray(Array.isArray(value) ? value : [value]);
      case 'select':
        return value;
      case 'object':
        return JSON.stringify(value);
      default:
        return String(value);
    }
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

          <ThemedText>{JSON.stringify(profileData)}</ThemedText>

          {/* Name and Role */}
          <ThemedView style={styles.nameSection}>
            <ThemedText style={styles.name}>{fullName}</ThemedText>
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

      {/* Dynamic Profile Sections */}
      {fieldSections.map((section, sectionIndex) => {
        // Show all fields in ViewProfile (including those without values and isEditable: false)
        const fieldsToShow = section.fields;

        if (fieldsToShow.length === 0) {
          return null;
        }

        return (
          <Card key={sectionIndex} style={styles.infoCard}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>

            {fieldsToShow.map((field, fieldIndex) => {
              // Skip profilePicture as it's shown in header
              if (field.key === 'profilePicture') {
                return null;
              }

              // Handle email separately (not in field config)
              if (field.key === 'email') {
                return (
                  <ThemedView
                    key={field.key}
                    style={[
                      styles.infoRow,
                      fieldIndex === fieldsToShow.length - 1 &&
                        styles.infoRowLast,
                    ]}
                  >
                    <ThemedText>{JSON.stringify(profileData)}</ThemedText>
                    <ThemedView style={styles.infoIconContainer}>
                      <MaterialIcons
                        name="email"
                        size={20}
                        color={BrandColors.primary}
                      />
                    </ThemedView>
                    <ThemedView style={styles.infoContent}>
                      <ThemedText style={styles.infoLabel}>Email</ThemedText>
                      <ThemedText style={styles.infoValue}>
                        {displayEmail}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                );
              }

              // Handle nested objects (like emergencyContact)
              if (field.type === 'object' && field.fields) {
                const objectValue = userData?.[field.key] || {};

                return (
                  <ThemedView key={field.key} style={styles.nestedSection}>
                    <ThemedText style={styles.nestedTitle}>
                      {field.label}
                    </ThemedText>
                    <ThemedText>{JSON.stringify(profileData)}</ThemedText>
                    {field.fields.map((nestedField) => {
                      const nestedValue =
                        objectValue[nestedField.key] || 'Not provided';
                      return (
                        <ThemedView
                          key={nestedField.key}
                          style={[
                            styles.infoRow,
                            nestedField === field.fields?.[field.fields.length - 1] &&
                              styles.infoRowLast,
                          ]}
                        >
                          <ThemedView style={styles.infoIconContainer}>
                            <MaterialIcons
                              name={
                                (nestedField.icon as any) || 'info'
                              }
                              size={20}
                              color={BrandColors.primary}
                            />
                          </ThemedView>
                          <ThemedView style={styles.infoContent}>
                            <ThemedText style={styles.infoLabel}>
                              {nestedField.label}
                            </ThemedText>
                            <ThemedText style={styles.infoValue}>
                              {nestedValue}
                            </ThemedText>
                          </ThemedView>
                        </ThemedView>
                      );
                    })}
                  </ThemedView>
                );
              }

              const fieldValue = renderFieldValue(field);
              const fieldIcon = field.icon || 'info';

              return (
                <ThemedView
                  key={field.key}
                  style={[
                    styles.infoRow,
                    fieldIndex === fieldsToShow.length - 1 &&
                      styles.infoRowLast,
                  ]}
                >
                  <ThemedView style={styles.infoIconContainer}>
                    <MaterialIcons
                      name={fieldIcon as any}
                      size={20}
                      color={BrandColors.primary}
                    />
                  </ThemedView>
                  <ThemedView style={styles.infoContent}>
                    <ThemedText style={styles.infoLabel}>
                      {field.label}
                    </ThemedText>
                    <ThemedText style={styles.infoValue}>
                      {fieldValue}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              );
            })}
          </Card>
        );
      })}

      {/* Action Buttons */}
      <ThemedView style={styles.buttonContainer}>
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
        {onLogout && (
          <Button
            title="Logout"
            onPress={onLogout}
            variant="outline"
            leftIcon={
              <MaterialIcons name="logout" size={20} color={StatusColors.error} />
            }
            fullWidth
            style={styles.logoutButton}
          />
        )}
      </ThemedView>
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
  nestedSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray200,
  },
  nestedTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
    color: BrandColors.primary,
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
  buttonContainer: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  editButton: {
    marginBottom: 0,
  },
  logoutButton: {
    marginTop: 0,
  },
});
