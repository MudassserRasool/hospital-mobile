/**
 * Request Leave Screen
 * Submit new leave request
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, Input } from '@/components/ui';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function RequestLeaveScreen() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    { id: 'sick', name: 'Sick Leave', icon: 'local-hospital' },
    { id: 'vacation', name: 'Vacation', icon: 'beach-access' },
    { id: 'emergency', name: 'Emergency', icon: 'emergency' },
    { id: 'personal', name: 'Personal', icon: 'person' },
  ];

  const handleSubmit = async () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Success!',
        'Your leave request has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Request Leave',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Leave Type Selection */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Leave Type</ThemedText>
          <ThemedView style={styles.leaveTypesGrid}>
            {leaveTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.leaveTypeCard,
                  leaveType === type.id && styles.leaveTypeCardActive,
                ]}
                onPress={() => setLeaveType(type.id)}
              >
                <MaterialIcons
                  name={type.icon as any}
                  size={32}
                  color={
                    leaveType === type.id
                      ? BrandColors.primary
                      : NeutralColors.gray600
                  }
                />
                <ThemedText
                  style={[
                    styles.leaveTypeName,
                    leaveType === type.id && styles.leaveTypeNameActive,
                  ]}
                >
                  {type.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Date Selection */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Duration</ThemedText>
          <ThemedView style={styles.dateRow}>
            <ThemedView style={{ flex: 1 }}>
              <Input
                label="Start Date"
                placeholder="YYYY-MM-DD"
                value={startDate}
                onChangeText={setStartDate}
                leftIcon={
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color={NeutralColors.gray500}
                  />
                }
              />
            </ThemedView>
            <ThemedView style={{ flex: 1 }}>
              <Input
                label="End Date"
                placeholder="YYYY-MM-DD"
                value={endDate}
                onChangeText={setEndDate}
                leftIcon={
                  <MaterialIcons
                    name="event"
                    size={20}
                    color={NeutralColors.gray500}
                  />
                }
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Reason */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Reason</ThemedText>
          <Input
            placeholder="Explain the reason for your leave..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            containerStyle={styles.reasonInput}
            style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }}
          />
        </ThemedView>

        {/* Summary Card */}
        {leaveType && startDate && endDate && (
          <Card style={styles.summaryCard}>
            <ThemedText style={styles.summaryTitle}>Leave Summary</ThemedText>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Type:</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {leaveTypes.find((t) => t.id === leaveType)?.name}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Duration:</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {startDate} to {endDate}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Total Days:</ThemedText>
              <ThemedText
                style={[styles.summaryValue, { color: BrandColors.primary }]}
              >
                {Math.ceil(
                  (new Date(endDate).getTime() -
                    new Date(startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1}{' '}
                day(s)
              </ThemedText>
            </ThemedView>
          </Card>
        )}
      </ScrollView>

      {/* Submit Button */}
      <ThemedView style={styles.bottomBar}>
        <Button
          title="Submit Request"
          onPress={handleSubmit}
          loading={loading}
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  leaveTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  leaveTypeCard: {
    width: '48%',
    aspectRatio: 1.5,
    backgroundColor: NeutralColors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: NeutralColors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  leaveTypeCardActive: {
    borderColor: BrandColors.primary,
    backgroundColor: '#EFF3FF',
  },
  leaveTypeName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: NeutralColors.gray700,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  leaveTypeNameActive: {
    color: BrandColors.primary,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  reasonInput: {
    marginBottom: 0,
  },
  summaryCard: {
    marginTop: Spacing.md,
    backgroundColor: '#EFF3FF',
  },
  summaryTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  summaryValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
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
