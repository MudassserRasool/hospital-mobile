/**
 * Check-In/Check-Out Screen
 * Staff attendance check-in with verification
 */

import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, Button, Card } from '@/components/ui';
import {
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
  StatusColors,
} from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCheckInMutation, useCheckOutMutation, useGetTodayAttendanceQuery } from '@/redux/features/staff/staffApi';
import { getCheckInLocationData } from '@/utils/locationService';

export default function CheckInOutScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [verifying, setVerifying] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);

  // Fetch today's attendance
  const { data: todayAttendance, isLoading: loadingAttendance, refetch } = useGetTodayAttendanceQuery();
  const [checkIn, { isLoading: checkingIn }] = useCheckInMutation();
  const [checkOut, { isLoading: checkingOut }] = useCheckOutMutation();

  const isCheckedIn = todayAttendance && !todayAttendance.checkOutTime;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Verify location on mount
  useEffect(() => {
    verifyLocation();
  }, []);

  const verifyLocation = async () => {
    setVerifying(true);
    try {
      const data = await getCheckInLocationData();
      setLocationData(data);
    } catch (error) {
      console.error('Location verification error:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckIn = async () => {
    if (!locationData) {
      Alert.alert(
        'Location Required',
        'Please enable location services and connect to hospital WiFi',
        [
          { text: 'Cancel' },
          { text: 'Retry', onPress: verifyLocation },
        ]
      );
      return;
    }

    try {
      await checkIn(locationData).unwrap();
      Alert.alert('Success', 'Successfully checked in!');
      refetch();
    } catch (error: any) {
      Alert.alert(
        'Check-in Failed', 
        error.data?.message || 'Location verification failed. Please ensure you are at hospital premises.',
        [
          { text: 'Cancel' },
          { text: 'Retry', onPress: verifyLocation },
        ]
      );
    }
  };

  const handleCheckOut = async () => {
    Alert.alert('Confirm Check Out', 'Are you sure you want to check out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Check Out',
        onPress: async () => {
          try {
            await checkOut().unwrap();
            Alert.alert('Success', 'Successfully checked out!');
            refetch();
          } catch (error: any) {
            Alert.alert('Error', error.data?.message || 'Failed to check out. Please try again.');
          }
        },
      },
    ]);
  };

  const calculateWorkHours = () => {
    if (!todayAttendance?.checkInTime) return '0.0';
    const start = new Date(todayAttendance.checkInTime).getTime();
    const end = todayAttendance.checkOutTime ? new Date(todayAttendance.checkOutTime).getTime() : Date.now();
    const hours = (end - start) / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  const locationVerified = !!locationData?.gpsCoordinates;
  const wifiVerified = locationData?.wifiSSID && locationData.wifiSSID !== 'Unknown_WiFi';

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Check-In / Check-Out',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Current Time */}
        <Card style={styles.timeCard}>
          <ThemedText style={styles.timeLabel}>Current Time</ThemedText>
          <ThemedText style={styles.timeValue}>
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </ThemedText>
          <ThemedText style={styles.dateValue}>
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </ThemedText>
        </Card>

        {/* Status */}
        <Card
          style={[styles.statusCard, isCheckedIn && styles.statusCardActive]}
        >
          <ThemedView style={styles.statusHeader}>
            <ThemedView style={styles.statusIconContainer}>
              <MaterialIcons
                name={isCheckedIn ? 'check-circle' : 'access-time'}
                size={60}
                color={
                  isCheckedIn ? StatusColors.success : NeutralColors.gray400
                }
              />
            </ThemedView>
            <ThemedText style={styles.statusTitle}>
              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </ThemedText>
            {isCheckedIn && todayAttendance && (
              <ThemedText style={styles.statusTime}>
                Since{' '}
                {new Date(todayAttendance.checkInTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </ThemedText>
            )}
          </ThemedView>
        </Card>

        {/* Verification Status */}
        <ThemedView style={styles.section}>
          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
            <ThemedText style={styles.sectionTitle}>
              Verification Status
            </ThemedText>
            {verifying && <ActivityIndicator size="small" color={primaryColor} />}
          </ThemedView>
          <Card style={styles.verificationCard}>
            <ThemedView style={styles.verificationItem}>
              <MaterialIcons
                name={locationVerified ? 'check-circle' : 'cancel'}
                size={24}
                color={
                  locationVerified ? StatusColors.success : StatusColors.error
                }
              />
              <ThemedView style={styles.verificationText}>
                <ThemedText style={styles.verificationLabel}>
                  GPS Location
                </ThemedText>
                <ThemedText style={styles.verificationStatus}>
                  {locationVerified
                    ? 'Within hospital premises'
                    : 'Verifying location...'}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.verificationItem}>
              <MaterialIcons
                name={wifiVerified ? 'check-circle' : 'cancel'}
                size={24}
                color={wifiVerified ? StatusColors.success : StatusColors.error}
              />
              <ThemedView style={styles.verificationText}>
                <ThemedText style={styles.verificationLabel}>
                  WiFi Connection
                </ThemedText>
                <ThemedText style={styles.verificationStatus}>
                  {wifiVerified
                    ? `Connected: ${locationData?.wifiSSID}`
                    : 'Not connected to hospital WiFi'}
                </ThemedText>
              </ThemedView>
              <TouchableOpacity onPress={verifyLocation} style={{ padding: 4 }}>
                <MaterialIcons name="refresh" size={20} color={NeutralColors.gray600} />
              </TouchableOpacity>
            </ThemedView>
          </Card>
        </ThemedView>

        {/* Today's Summary */}
        {isCheckedIn && todayAttendance && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Today&apos;s Summary
            </ThemedText>
            <ThemedView style={styles.summaryGrid}>
              <Card style={styles.summaryCard}>
                <ThemedText style={styles.summaryLabel}>
                  Hours Worked
                </ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {calculateWorkHours()}h
                </ThemedText>
              </Card>
              <Card style={styles.summaryCard}>
                <ThemedText style={styles.summaryLabel}>Status</ThemedText>
                <Badge 
                  label={todayAttendance.locationVerified ? "Verified" : "Manual"} 
                  variant={todayAttendance.locationVerified ? "success" : "warning"} 
                />
              </Card>
            </ThemedView>
          </ThemedView>
        )}
      </ScrollView>

      {/* Action Button */}
      <ThemedView style={styles.bottomBar}>
        {loadingAttendance ? (
          <ActivityIndicator size="large" color={primaryColor} />
        ) : (
          <Button
            title={isCheckedIn ? 'Check Out' : 'Check In'}
            onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
            loading={checkingIn || checkingOut}
            variant={isCheckedIn ? 'danger' : 'primary'}
            disabled={!locationVerified || !wifiVerified}
            fullWidth
          />
        )}
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
  timeCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: BrandColors.primary,
  },
  timeLabel: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  timeValue: {
    fontSize: FontSizes['4xl'],
    fontWeight: FontWeights.bold,
    color: NeutralColors.white,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statusCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  statusCardActive: {
    backgroundColor: StatusColors.successLight + '20',
    borderWidth: 2,
    borderColor: StatusColors.success,
  },
  statusHeader: {
    alignItems: 'center',
  },
  statusIconContainer: {
    marginBottom: Spacing.md,
  },
  statusTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  statusTime: {
    fontSize: FontSizes.md,
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
  verificationCard: {
    padding: 0,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NeutralColors.gray100,
  },
  verificationText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  verificationLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: 2,
  },
  verificationStatus: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: FontSizes['2xl'],
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
