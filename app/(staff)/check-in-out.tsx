/**
 * Check-In/Check-Out Screen
 * Staff attendance check-in with verification
 */

import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

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
import { mockCurrentCheckIn } from '@/utils/mockData';

export default function CheckInOutScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(!!mockCurrentCheckIn);
  const [locationVerified, setLocationVerified] = useState(true);
  const [wifiVerified, setWifiVerified] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    if (!locationVerified || !wifiVerified) {
      Alert.alert(
        'Verification Failed',
        'Please ensure you are at the hospital premises with hospital WiFi'
      );
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsCheckedIn(true);
      Alert.alert('Success', 'Successfully checked in!');
    } catch (error) {
      Alert.alert('Error', 'Failed to check in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    Alert.alert('Confirm Check Out', 'Are you sure you want to check out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Check Out',
        onPress: async () => {
          setIsLoading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsCheckedIn(false);
            Alert.alert('Success', 'Successfully checked out!', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          } catch (error) {
            Alert.alert('Error', 'Failed to check out. Please try again.');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

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
            {isCheckedIn && mockCurrentCheckIn && (
              <ThemedText style={styles.statusTime}>
                Since{' '}
                {new Date(
                  mockCurrentCheckIn.checkInTime || ''
                ).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </ThemedText>
            )}
          </ThemedView>
        </Card>

        {/* Verification Status */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Verification Status
          </ThemedText>
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
                  Location
                </ThemedText>
                <ThemedText style={styles.verificationStatus}>
                  {locationVerified
                    ? 'Within hospital premises'
                    : 'Outside hospital'}
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
                    ? 'Connected to hospital WiFi'
                    : 'Not connected'}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </Card>
        </ThemedView>

        {/* Today's Summary */}
        {isCheckedIn && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Today&apos;s Summary
            </ThemedText>
            <ThemedView style={styles.summaryGrid}>
              <Card style={styles.summaryCard}>
                <ThemedText style={styles.summaryLabel}>
                  Hours Worked
                </ThemedText>
                <ThemedText style={styles.summaryValue}>7.5h</ThemedText>
              </Card>
              <Card style={styles.summaryCard}>
                <ThemedText style={styles.summaryLabel}>Status</ThemedText>
                <Badge label="On Time" variant="success" />
              </Card>
            </ThemedView>
          </ThemedView>
        )}
      </ScrollView>

      {/* Action Button */}
      <ThemedView style={styles.bottomBar}>
        <Button
          title={isCheckedIn ? 'Check Out' : 'Check In'}
          onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
          loading={isLoading}
          variant={isCheckedIn ? 'danger' : 'primary'}
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
