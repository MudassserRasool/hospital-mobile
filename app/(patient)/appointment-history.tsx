/**
 * Appointment History Screen
 * View past and upcoming appointments
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui';
import { PATIENT_ROUTES } from '@/constants/routes';
import {
  BorderRadius,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useGetMyAppointmentsQuery, useCancelAppointmentMutation } from '@/redux/features/patient/patientApi';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AppointmentHistoryScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const [selectedTab, setSelectedTab] = useState<
    'upcoming' | 'completed' | 'cancelled'
  >('upcoming');

  // Fetch appointments from API
  const { data: appointments = [], isLoading, refetch } = useGetMyAppointmentsQuery();
  const [cancelAppointment, { isLoading: cancelling }] = useCancelAppointmentMutation();

  const onRefresh = async () => {
    await refetch();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredAppointments = appointments.filter((apt: any) => {
    if (selectedTab === 'upcoming')
      return apt.status === 'confirmed' || apt.status === 'pending' || apt.status === 'checked_in';
    if (selectedTab === 'completed') return apt.status === 'completed';
    if (selectedTab === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const handleCancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? You will receive a 90% refund and 10% wallet credit.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment({ id: appointmentId, reason: 'Patient requested cancellation' }).unwrap();
              Alert.alert('Success', 'Appointment cancelled successfully');
              refetch();
            } catch (error: any) {
              Alert.alert('Error', error.data?.message || 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAppointmentCard = ({ item }: { item: any }) => {
    const doctor = item.doctorId;
    const canCancel = item.status === 'pending' || item.status === 'confirmed';

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => router.push(`${PATIENT_ROUTES.APPOINTMENT_DETAILS}?id=${item._id}`)}
      >
        <ThemedView style={styles.appointmentHeader}>
          <Image
            source={{ uri: doctor?.profilePicture || `https://i.pravatar.cc/150?u=${doctor?._id}` }}
            style={styles.doctorImage}
          />
          <ThemedView style={styles.appointmentInfo}>
            <ThemedView style={styles.infoHeader}>
              <ThemedText style={styles.doctorName}>
                Dr. {doctor?.firstName} {doctor?.lastName}
              </ThemedText>
              <Badge
                label={item.status}
                variant={getStatusVariant(item.status)}
                size="small"
              />
            </ThemedView>
            <ThemedText style={styles.specialty}>
              {doctor?.specialty || doctor?.department?.name || 'General Physician'}
            </ThemedText>
            <ThemedView style={styles.dateTimeRow}>
              <ThemedView style={styles.dateTime}>
                <MaterialIcons
                  name="calendar-today"
                  size={14}
                  color={NeutralColors.gray500}
                />
                <ThemedText style={styles.dateTimeText}>
                  {formatDate(item.date)}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.dateTime}>
                <MaterialIcons
                  name="access-time"
                  size={14}
                  color={NeutralColors.gray500}
                />
                <ThemedText style={styles.dateTimeText}>
                  {formatTime(item.timeSlot.start)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        {item.chiefComplaint && (
          <ThemedView style={styles.reasonContainer}>
            <ThemedText style={styles.reasonLabel}>Reason: </ThemedText>
            <ThemedText style={styles.reasonText}>{item.chiefComplaint}</ThemedText>
          </ThemedView>
        )}
        {canCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelAppointment(item._id)}
            disabled={cancelling}
          >
            <MaterialIcons name="cancel" size={16} color="#EF4444" />
            <ThemedText style={styles.cancelButtonText}>Cancel Appointment</ThemedText>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Appointments',
          headerBackTitle: 'Back',
        }}
      />

      {/* Tabs */}
      <ThemedView style={styles.tabs}>
        {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <ThemedText
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Appointments List */}
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <ThemedView style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={primaryColor} />
              <ThemedText style={styles.emptyText}>Loading appointments...</ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <MaterialIcons
                name="event-busy"
                size={64}
                color={NeutralColors.gray300}
              />
              <ThemedText style={styles.emptyText}>
                No {selectedTab} appointments
              </ThemedText>
            </ThemedView>
          )
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    backgroundColor: NeutralColors.gray100,
  },
  tabActive: {
    backgroundColor: '#4B7BEC',
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: NeutralColors.gray600,
  },
  tabTextActive: {
    color: NeutralColors.white,
  },
  listContent: {
    padding: Spacing.lg,
  },
  appointmentCard: {
    backgroundColor: NeutralColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: Spacing.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    flex: 1,
  },
  specialty: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: Spacing.sm,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTimeText: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
  },
  reasonContainer: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray100,
  },
  reasonLabel: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  reasonText: {
    fontSize: FontSizes.sm,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: NeutralColors.gray500,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  cancelButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: '#EF4444',
  },
});
