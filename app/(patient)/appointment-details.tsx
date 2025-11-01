/**
 * Appointment Details Screen
 * View detailed information about an appointment
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, Button, Card } from '@/components/ui';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  useCancelAppointmentMutation,
  useGetAppointmentByIdQuery,
  useRescheduleAppointmentMutation,
} from '@/redux/features/patient/patientApi';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const primaryColor = useThemeColor({}, 'primary');

  // Fetch appointment details
  const {
    data: appointment,
    isLoading,
    refetch,
  } = useGetAppointmentByIdQuery(id as string);
  const [cancelAppointment, { isLoading: cancelling }] =
    useCancelAppointmentMutation();
  const [rescheduleAppointment, { isLoading: rescheduling }] =
    useRescheduleAppointmentMutation();

  const handleReschedule = () => {
    Alert.alert('Reschedule', 'Reschedule functionality coming soon');
    // TODO: Navigate to reschedule screen with appointment data
  };

  const handleCancel = () => {
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
              await cancelAppointment({
                id: id as string,
                reason: 'Patient requested cancellation',
              }).unwrap();
              Alert.alert('Success', 'Appointment cancelled successfully');
              router.back();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.data?.message || 'Failed to cancel appointment'
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{ headerShown: true, title: 'Appointment Details' }}
        />
        <ThemedView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText style={{ marginTop: 16 }}>
            Loading appointment...
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!appointment) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{ headerShown: true, title: 'Appointment Details' }}
        />
        <ThemedView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <MaterialIcons
            name="error-outline"
            size={64}
            color={NeutralColors.gray400}
          />
          <ThemedText style={{ marginTop: 16 }}>
            Appointment not found
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const doctor = appointment.doctorId;
  const canCancel =
    appointment.status === 'pending' || appointment.status === 'confirmed';
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Appointment Details',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Doctor Info */}
        <Card style={styles.section}>
          <ThemedView style={styles.doctorInfo}>
            <Image
              source={{
                uri:
                  doctor?.profilePicture ||
                  `https://i.pravatar.cc/150?u=${doctor?._id}`,
              }}
              style={styles.doctorImage}
            />
            <ThemedView style={styles.doctorDetails}>
              <ThemedText style={styles.doctorName}>
                Dr. {doctor?.firstName} {doctor?.lastName}
              </ThemedText>
              <ThemedText style={styles.specialty}>
                {doctor?.specialty ||
                  doctor?.department?.name ||
                  'General Physician'}
              </ThemedText>
              <ThemedView style={styles.rating}>
                <MaterialIcons name="star" size={16} color="#FD9644" />
                <ThemedText style={styles.ratingText}>
                  {doctor?.rating || '4.8'} ({doctor?.reviewCount || '100'}{' '}
                  reviews)
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Card>

        {/* Appointment Info */}
        <Card style={styles.section}>
          <ThemedText style={styles.cardTitle}>
            Appointment Information
          </ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedView style={styles.infoItem}>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={BrandColors.primary}
              />
              <ThemedView style={styles.infoText}>
                <ThemedText style={styles.infoLabel}>Date</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {formatDate(appointment.date)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <MaterialIcons
                name="access-time"
                size={20}
                color={BrandColors.primary}
              />
              <ThemedView style={styles.infoText}>
                <ThemedText style={styles.infoLabel}>Time</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {formatTime(appointment.timeSlot.start)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedView style={styles.infoItem}>
              <MaterialIcons
                name="local-hospital"
                size={20}
                color={BrandColors.primary}
              />
              <ThemedView style={styles.infoText}>
                <ThemedText style={styles.infoLabel}>Status</ThemedText>
                <Badge
                  label={appointment.status}
                  variant={
                    appointment.status === 'completed'
                      ? 'success'
                      : appointment.status === 'confirmed'
                      ? 'info'
                      : appointment.status === 'pending'
                      ? 'warning'
                      : 'error'
                  }
                  size="small"
                />
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <MaterialIcons
                name="attach-money"
                size={20}
                color={BrandColors.primary}
              />
              <ThemedView style={styles.infoText}>
                <ThemedText style={styles.infoLabel}>Fee</ThemedText>
                <ThemedText style={styles.infoValue}>
                  Rs.{appointment.paymentAmount}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Card>

        {/* Vitals (if available) */}
        {appointment.vitals && (
          <Card style={styles.section}>
            <ThemedText style={styles.cardTitle}>Vitals Recorded</ThemedText>
            <ThemedView style={styles.vitalsGrid}>
              <ThemedView style={styles.vitalItem}>
                <ThemedText style={styles.vitalLabel}>
                  Blood Pressure
                </ThemedText>
                <ThemedText style={styles.vitalValue}>
                  {appointment.vitals.bloodPressure.systolic}/
                  {appointment.vitals.bloodPressure.diastolic}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.vitalItem}>
                <ThemedText style={styles.vitalLabel}>Heart Rate</ThemedText>
                <ThemedText style={styles.vitalValue}>
                  {appointment.vitals.heartRate} bpm
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.vitalItem}>
                <ThemedText style={styles.vitalLabel}>Temperature</ThemedText>
                <ThemedText style={styles.vitalValue}>
                  {appointment.vitals.temperature}°F
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.vitalItem}>
                <ThemedText style={styles.vitalLabel}>Weight</ThemedText>
                <ThemedText style={styles.vitalValue}>
                  {appointment.vitals.weight} kg
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </Card>
        )}

        {/* Diagnosis & Prescription */}
        {appointment.diagnosis && (
          <Card style={styles.section}>
            <ThemedText style={styles.cardTitle}>Diagnosis</ThemedText>
            <ThemedText style={styles.diagnosisText}>
              {appointment.diagnosis}
            </ThemedText>
          </Card>
        )}

        {appointment.prescription && (
          <Card style={styles.section}>
            <ThemedText style={styles.cardTitle}>Prescription</ThemedText>
            {appointment.prescription.map((med, index) => (
              <ThemedView key={index} style={styles.prescriptionItem}>
                <MaterialIcons
                  name="medication"
                  size={20}
                  color={BrandColors.primary}
                />
                <ThemedText style={styles.prescriptionText}>{med}</ThemedText>
              </ThemedView>
            ))}
          </Card>
        )}

        {/* Notes */}
        {appointment.checkupNotes && (
          <Card style={styles.section}>
            <ThemedText style={styles.cardTitle}>Doctor's Notes</ThemedText>
            <ThemedText style={styles.notesText}>
              {appointment.checkupNotes}
            </ThemedText>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {canCancel && (
        <ThemedView style={styles.bottomBar}>
          <Button
            title="Reschedule"
            variant="outline"
            onPress={handleReschedule}
            loading={rescheduling}
            style={{ flex: 1 }}
          />
          <Button
            title={cancelling ? 'Cancelling...' : 'Cancel'}
            variant="danger"
            onPress={handleCancel}
            loading={cancelling}
            style={{ flex: 1 }}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.md,
  },
  doctorInfo: {
    flexDirection: 'row',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: Spacing.md,
  },
  doctorDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  specialty: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  vitalItem: {
    width: '47%',
    padding: Spacing.md,
    backgroundColor: NeutralColors.gray50,
    borderRadius: BorderRadius.md,
  },
  vitalLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: BrandColors.primary,
  },
  diagnosisText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: NeutralColors.gray100,
  },
  prescriptionText: {
    fontSize: FontSizes.md,
    flex: 1,
  },
  notesText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    color: NeutralColors.gray700,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: NeutralColors.white,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray200,
  },
});
