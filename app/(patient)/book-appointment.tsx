/**
 * Book Appointment Screen
 * Schedule appointment with doctor
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card } from '@/components/ui';
import { PATIENT_ROUTES } from '@/constants/routes';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { mockDoctors } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function BookAppointmentScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const doctor = mockDoctors[0]; // Mock selected doctor

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const dates = [
    { date: '20', day: 'Mon', full: '2025-10-20' },
    { date: '21', day: 'Tue', full: '2025-10-21' },
    { date: '22', day: 'Wed', full: '2025-10-22' },
    { date: '23', day: 'Thu', full: '2025-10-23' },
    { date: '24', day: 'Fri', full: '2025-10-24' },
  ];

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }
    router.push(PATIENT_ROUTES.PAYMENT);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Book Appointment',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Doctor Info Card */}
        <Card style={styles.doctorCard}>
          <ThemedView style={styles.doctorInfo}>
            <Image source={{ uri: doctor.avatar }} style={styles.doctorImage} />
            <ThemedView style={styles.doctorDetails}>
              <ThemedText style={styles.doctorName}>{doctor.name}</ThemedText>
              <ThemedText style={styles.specialty}>
                {doctor.specialty}
              </ThemedText>
              <ThemedView style={styles.rating}>
                <MaterialIcons name="star" size={16} color="#FD9644" />
                <ThemedText style={styles.ratingText}>
                  {doctor.rating} ({doctor.reviewCount} reviews)
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Card>

        {/* Select Date */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Select Date</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ThemedView style={styles.dateContainer}>
              {dates.map((item) => (
                <TouchableOpacity
                  key={item.full}
                  style={[
                    styles.dateCard,
                    selectedDate === item.full && styles.dateCardActive,
                  ]}
                  onPress={() => setSelectedDate(item.full)}
                >
                  <ThemedText
                    style={[
                      styles.dateDay,
                      selectedDate === item.full && styles.dateTextActive,
                    ]}
                  >
                    {item.day}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.dateNumber,
                      selectedDate === item.full && styles.dateTextActive,
                    ]}
                  >
                    {item.date}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ScrollView>
        </ThemedView>

        {/* Select Time */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Select Time</ThemedText>
          <ThemedView style={styles.timeContainer}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotActive,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <ThemedText
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextActive,
                  ]}
                >
                  {time}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Summary */}
        <Card style={styles.summaryCard}>
          <ThemedText style={styles.summaryTitle}>
            Appointment Summary
          </ThemedText>
          <ThemedView style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Date:</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {selectedDate || 'Not selected'}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Time:</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {selectedTime || 'Not selected'}
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.summaryRow, styles.summaryTotal]}>
            <ThemedText style={styles.summaryLabel}>
              Consultation Fee:
            </ThemedText>
            <ThemedText style={styles.totalAmount}>
              Rs.{doctor.consultationFee}
            </ThemedText>
          </ThemedView>
        </Card>
      </ScrollView>

      {/* Bottom Button */}
      <ThemedView style={styles.bottomBar}>
        <Button title="Continue to Payment" onPress={handleBooking} fullWidth />
      </ThemedView>
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
  doctorCard: {
    marginBottom: Spacing.lg,
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateCard: {
    width: 70,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: NeutralColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateCardActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  dateDay: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  dateTextActive: {
    color: NeutralColors.white,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  timeSlot: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: NeutralColors.gray100,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 100,
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  timeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: NeutralColors.gray700,
  },
  timeTextActive: {
    color: NeutralColors.white,
  },
  summaryCard: {
    marginTop: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSizes.md,
    color: NeutralColors.gray600,
  },
  summaryValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  summaryTotal: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray200,
  },
  totalAmount: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: BrandColors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: NeutralColors.white,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray200,
  },
});
