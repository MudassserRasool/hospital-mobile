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
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useGetDoctorByIdQuery, useBookAppointmentMutation, useCheckAvailabilityQuery } from '@/redux/features/patient/patientApi';
import { useAuth } from '@/hooks/useAuth';

export default function BookAppointmentScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const { doctorId } = useLocalSearchParams();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<any>(null);

  // Fetch doctor details
  const { data: doctor, isLoading: loadingDoctor } = useGetDoctorByIdQuery(doctorId as string);
  
  // Book appointment mutation
  const [bookAppointment, { isLoading: booking }] = useBookAppointmentMutation();

  // Generate next 5 days
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      date: date.getDate().toString(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      full: date.toISOString().split('T')[0],
    };
  });

  // Check availability for selected date
  const { data: availabilityData } = useCheckAvailabilityQuery(
    { doctorId: doctorId as string, date: selectedDate },
    { skip: !selectedDate }
  );

  const timeSlots = availabilityData?.slots || [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }

    try {
      const startDateTime = new Date(`${selectedDate}T${convertTo24Hour(selectedTime)}`);
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min appointment

      const result = await bookAppointment({
        doctorId: doctorId as string,
        patientId: user?.patientId || '',
        hospitalId: doctor?.hospitalId || '',
        date: selectedDate,
        timeSlot: {
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        },
        paymentAmount: doctor?.consultationFee || 1500,
        chiefComplaint: 'General consultation',
      }).unwrap();

      router.push(`${PATIENT_ROUTES.PAYMENT}?appointmentId=${result._id}&amount=${doctor?.consultationFee || 1500}`);
    } catch (error: any) {
      Alert.alert('Error', error.data?.message || 'Failed to book appointment');
    }
  };

  const convertTo24Hour = (time: string) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours).toString();
    
    if (period === 'PM' && hours !== '12') {
      hours = (parseInt(hours) + 12).toString();
    }
    if (period === 'AM' && hours === '12') {
      hours = '0';
    }
    
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  if (loadingDoctor) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Book Appointment' }} />
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText style={{ marginTop: 16 }}>Loading doctor details...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!doctor) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Book Appointment' }} />
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcons name="error-outline" size={64} color={NeutralColors.gray400} />
          <ThemedText style={{ marginTop: 16 }}>Doctor not found</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

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
            <Image 
              source={{ uri: doctor.profilePicture || `https://i.pravatar.cc/150?u=${doctor._id}` }} 
              style={styles.doctorImage} 
            />
            <ThemedView style={styles.doctorDetails}>
              <ThemedText style={styles.doctorName}>
                Dr. {doctor.firstName} {doctor.lastName}
              </ThemedText>
              <ThemedText style={styles.specialty}>
                {doctor.specialty || doctor.department?.name || 'General Physician'}
              </ThemedText>
              <ThemedView style={styles.rating}>
                <MaterialIcons name="star" size={16} color="#FD9644" />
                <ThemedText style={styles.ratingText}>
                  {doctor.rating || '4.8'} ({doctor.reviewCount || '100'} reviews)
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
              Rs.{doctor.consultationFee || '1500'}
            </ThemedText>
          </ThemedView>
        </Card>
      </ScrollView>

      {/* Bottom Button */}
      <ThemedView style={styles.bottomBar}>
        <Button 
          title={booking ? "Booking..." : "Continue to Payment"} 
          onPress={handleBooking} 
          loading={booking}
          disabled={!selectedDate || !selectedTime}
          fullWidth 
        />
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
