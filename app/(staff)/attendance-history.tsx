/**
 * Attendance History Screen
 * View attendance records
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, Card } from '@/components/ui';
import {
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
  StatusColors,
} from '@/constants/theme';
import { mockAttendanceRecords } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

export default function AttendanceHistoryScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'late':
        return 'warning';
      case 'absent':
        return 'error';
      case 'half-day':
        return 'info';
      default:
        return 'default';
    }
  };

  const renderAttendanceCard = ({
    item,
  }: {
    item: (typeof mockAttendanceRecords)[0];
  }) => (
    <Card style={styles.attendanceCard}>
      <View style={styles.cardHeader}>
        <View>
          <ThemedText style={styles.date}>
            {new Date(item.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </ThemedText>
          <View style={styles.timeRow}>
            <MaterialIcons
              name="login"
              size={16}
              color={StatusColors.success}
            />
            <ThemedText style={styles.timeText}>
              {item.checkInTime
                ? new Date(item.checkInTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--:--'}
            </ThemedText>
            <MaterialIcons
              name="logout"
              size={16}
              color={StatusColors.error}
              style={{ marginLeft: 16 }}
            />
            <ThemedText style={styles.timeText}>
              {item.checkOutTime
                ? new Date(item.checkOutTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--:--'}
            </ThemedText>
          </View>
        </View>
        <Badge label={item.status} variant={getStatusVariant(item.status)} />
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.hoursRow}>
          <MaterialIcons
            name="schedule"
            size={16}
            color={NeutralColors.gray500}
          />
          <ThemedText style={styles.hoursText}>
            {item.totalHours}h worked
          </ThemedText>
        </View>
        {item.notes && (
          <ThemedText style={styles.notes}>{item.notes}</ThemedText>
        )}
      </View>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Attendance History',
          headerBackTitle: 'Back',
        }}
      />

      <FlatList
        data={mockAttendanceRecords}
        renderItem={renderAttendanceCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <ThemedText style={styles.statValue}>20</ThemedText>
              <ThemedText style={styles.statLabel}>Present Days</ThemedText>
            </Card>
            <Card style={styles.statCard}>
              <ThemedText style={styles.statValue}>180h</ThemedText>
              <ThemedText style={styles.statLabel}>Total Hours</ThemedText>
            </Card>
            <Card style={styles.statCard}>
              <ThemedText style={styles.statValue}>9h</ThemedText>
              <ThemedText style={styles.statLabel}>Avg/Day</ThemedText>
            </Card>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="event-busy"
              size={64}
              color={NeutralColors.gray300}
            />
            <ThemedText style={styles.emptyText}>
              No attendance records
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: BrandColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
    textAlign: 'center',
  },
  attendanceCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  date: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginLeft: 4,
  },
  cardFooter: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray100,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hoursText: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  notes: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginTop: 4,
    fontStyle: 'italic',
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
});
