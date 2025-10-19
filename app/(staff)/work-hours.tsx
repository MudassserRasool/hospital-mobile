/**
 * Work Hours Screen
 * View detailed work hours statistics
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
  StatusColors,
} from '@/constants/theme';
import { mockWorkHours } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function WorkHoursScreen() {
  const workHours = mockWorkHours;

  const periods = [
    {
      id: 'daily',
      title: 'Today',
      actual: workHours.daily,
      expected: workHours.expectedDaily,
      icon: 'today',
    },
    {
      id: 'weekly',
      title: 'This Week',
      actual: workHours.weekly,
      expected: workHours.expectedWeekly,
      icon: 'date-range',
    },
    {
      id: 'monthly',
      title: 'This Month',
      actual: workHours.monthly,
      expected: workHours.expectedMonthly,
      icon: 'calendar-month',
    },
  ];

  const getPercentage = (actual: number, expected: number) => {
    return ((actual / expected) * 100).toFixed(1);
  };

  const getStatusColor = (actual: number, expected: number) => {
    const percentage = (actual / expected) * 100;
    if (percentage >= 100) return StatusColors.success;
    if (percentage >= 80) return StatusColors.info;
    if (percentage >= 60) return StatusColors.warning;
    return StatusColors.error;
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Work Hours',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <ThemedText style={styles.summaryTitle}>
            Total Hours This Month
          </ThemedText>
          <ThemedText style={styles.summaryValue}>
            {workHours.monthly}h
          </ThemedText>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    getPercentage(workHours.monthly, workHours.expectedMonthly),
                    100
                  )}%`,
                  backgroundColor: getStatusColor(
                    workHours.monthly,
                    workHours.expectedMonthly
                  ),
                },
              ]}
            />
          </View>
          <ThemedText style={styles.progressText}>
            {getPercentage(workHours.monthly, workHours.expectedMonthly)}% of{' '}
            {workHours.expectedMonthly}h expected
          </ThemedText>
        </Card>

        {/* Period Cards */}
        {periods.map((period) => (
          <Card key={period.id} style={styles.periodCard}>
            <View style={styles.periodHeader}>
              <View style={styles.periodIconContainer}>
                <MaterialIcons
                  name={period.icon as any}
                  size={24}
                  color={BrandColors.primary}
                />
              </View>
              <View style={styles.periodInfo}>
                <ThemedText style={styles.periodTitle}>
                  {period.title}
                </ThemedText>
                <View style={styles.hoursRow}>
                  <ThemedText style={styles.actualHours}>
                    {period.actual}h
                  </ThemedText>
                  <ThemedText style={styles.expectedHours}>
                    / {period.expected}h
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Mini Progress Bar */}
            <View style={styles.miniProgressBar}>
              <View
                style={[
                  styles.miniProgressFill,
                  {
                    width: `${Math.min(
                      getPercentage(period.actual, period.expected),
                      100
                    )}%`,
                    backgroundColor: getStatusColor(
                      period.actual,
                      period.expected
                    ),
                  },
                ]}
              />
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Completed</ThemedText>
                <ThemedText
                  style={[
                    styles.statValue,
                    { color: getStatusColor(period.actual, period.expected) },
                  ]}
                >
                  {getPercentage(period.actual, period.expected)}%
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Remaining</ThemedText>
                <ThemedText style={styles.statValue}>
                  {Math.max(0, period.expected - period.actual)}h
                </ThemedText>
              </View>
            </View>
          </Card>
        ))}

        {/* Breakdown */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Work Hours Breakdown
          </ThemedText>
          <Card>
            <View style={styles.breakdownItem}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: StatusColors.success },
                ]}
              />
              <ThemedText style={styles.breakdownLabel}>
                Regular Hours
              </ThemedText>
              <ThemedText style={styles.breakdownValue}>165h</ThemedText>
            </View>
            <View style={styles.breakdownItem}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: StatusColors.info },
                ]}
              />
              <ThemedText style={styles.breakdownLabel}>Overtime</ThemedText>
              <ThemedText style={styles.breakdownValue}>15h</ThemedText>
            </View>
            <View style={styles.breakdownItem}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: StatusColors.warning },
                ]}
              />
              <ThemedText style={styles.breakdownLabel}>Weekend</ThemedText>
              <ThemedText style={styles.breakdownValue}>0h</ThemedText>
            </View>
            <View style={styles.breakdownItem}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: StatusColors.error },
                ]}
              />
              <ThemedText style={styles.breakdownLabel}>Holiday</ThemedText>
              <ThemedText style={styles.breakdownValue}>0h</ThemedText>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  summaryCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: BrandColors.primary,
  },
  summaryTitle: {
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: FontSizes['5xl'],
    fontWeight: FontWeights.bold,
    color: NeutralColors.white,
    marginBottom: Spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  periodCard: {
    marginBottom: Spacing.md,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  periodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  periodInfo: {
    flex: 1,
  },
  periodTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: 4,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  actualHours: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: BrandColors.primary,
  },
  expectedHours: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginLeft: 4,
  },
  miniProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: NeutralColors.gray100,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    padding: Spacing.sm,
    backgroundColor: NeutralColors.gray50,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NeutralColors.gray100,
  },
  breakdownDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
  },
  breakdownValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
