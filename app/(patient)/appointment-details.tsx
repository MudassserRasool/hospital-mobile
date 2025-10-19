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
import { mockAppointments } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';

export default function AppointmentDetailsScreen() {
  const appointment = mockAppointments[1]; // Mock completed appointment with details

  const handleReschedule = () => {
    Alert.alert('Reschedule', 'Reschedule functionality coming soon');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? 10% of the fee will be credited to your wallet.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

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
          <View style={styles.doctorInfo}>
            <Image
              source={{ uri: appointment.doctor.avatar }}
              style={styles.doctorImage}
            />
            <View style={styles.doctorDetails}>
              <ThemedText style={styles.doctorName}>
                {appointment.doctor.name}
              </ThemedText>
              <ThemedText style={styles.specialty}>
                {appointment.doctor.specialty}
              </ThemedText>
              <View style={styles.rating}>
                <MaterialIcons name="star" size={16} color="#FD9644" />
                <ThemedText style={styles.ratingText}>
                  {appointment.doctor.rating} ({appointment.doctor.reviewCount}{' '}
                  reviews)
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        {/* Appointment Info */}
        <Card style={styles.section}>
          <ThemedText style={styles.cardTitle}>
            Appointment Information
          </ThemedText>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={BrandColors.primary}
              />
              <View style={styles.infoText}>
                <ThemedText style={styles.infoLabel}>Date</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {appointment.date}
                </ThemedText>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons
                name="access-time"
                size={20}
                color={BrandColors.primary}
              />
              <View style={styles.infoText}>
                <ThemedText style={styles.infoLabel}>Time</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {appointment.time}
                </ThemedText>
              </View>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons
                name="local-hospital"
                size={20}
                color={BrandColors.primary}
              />
              <View style={styles.infoText}>
                <ThemedText style={styles.infoLabel}>Status</ThemedText>
                <Badge
                  label={appointment.status}
                  variant="success"
                  size="small"
                />
              </View>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons
                name="attach-money"
                size={20}
                color={BrandColors.primary}
              />
              <View style={styles.infoText}>
                <ThemedText style={styles.infoLabel}>Fee</ThemedText>
                <ThemedText style={styles.infoValue}>
                  Rs.{appointment.doctor.consultationFee}
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        {/* Vitals (if available) */}
        {appointment.vitals && (
          <Card style={styles.section}>
            <ThemedText style={styles.cardTitle}>Vitals Recorded</ThemedText>
            <View style={styles.vitalsGrid}>
              <View style={styles.vitalItem}>
                <ThemedText style={styles.vitalLabel}>
                  Blood Pressure
                </ThemedText>
                <ThemedText style={styles.vitalValue}>
                  {appointment.vitals.bloodPressure}
                </ThemedText>
              </View>
              <View style={styles.vitalItem}>
                <ThemedText style={styles.vitalLabel}>Heart Rate</ThemedText>
                <ThemedText style={styles.vitalValue}>
                  {appointment.vitals.heartRate} bpm
                </ThemedText>
              </View>
              <View style={styles.vitalItem}>
                <ThemedText style={styles.vitalLabel}>Temperature</ThemedText>
                <ThemedText style={styles.vitalValue}>
                  {appointment.vitals.temperature}°F
                </ThemedText>
              </View>
              <View style={styles.vitalItem}>
                <ThemedText style={styles.vitalLabel}>Weight</ThemedText>
                <ThemedText style={styles.vitalValue}>
                  {appointment.vitals.weight} kg
                </ThemedText>
              </View>
            </View>
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
              <View key={index} style={styles.prescriptionItem}>
                <MaterialIcons
                  name="medication"
                  size={20}
                  color={BrandColors.primary}
                />
                <ThemedText style={styles.prescriptionText}>{med}</ThemedText>
              </View>
            ))}
          </Card>
        )}

        {/* Notes */}
        {appointment.notes && (
          <Card style={styles.section}>
            <ThemedText style={styles.cardTitle}>Notes</ThemedText>
            <ThemedText style={styles.notesText}>
              {appointment.notes}
            </ThemedText>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {appointment.status !== 'completed' &&
        appointment.status !== 'cancelled' && (
          <View style={styles.bottomBar}>
            <Button
              title="Reschedule"
              variant="outline"
              onPress={handleReschedule}
              style={{ flex: 1 }}
            />
            <Button
              title="Cancel"
              variant="danger"
              onPress={handleCancel}
              style={{ flex: 1 }}
            />
          </View>
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
