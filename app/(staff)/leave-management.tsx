/**
 * Leave Management Screen
 * View leave balance and requests
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, Button, Card } from '@/components/ui';
import { STAFF_ROUTES } from '@/constants/routes';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
  StatusColors,
} from '@/constants/theme';
import { mockLeaveBalance, mockLeaveRequests } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LeaveManagementScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderLeaveCard = ({
    item,
  }: {
    item: (typeof mockLeaveRequests)[0];
  }) => (
    <Card style={styles.leaveCard}>
      <View style={styles.leaveHeader}>
        <View style={styles.leaveType}>
          <MaterialIcons
            name={
              item.type === 'sick'
                ? 'local-hospital'
                : item.type === 'vacation'
                ? 'beach-access'
                : 'emergency'
            }
            size={20}
            color={BrandColors.primary}
          />
          <ThemedText style={styles.leaveTypeText}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Leave
          </ThemedText>
        </View>
        <Badge
          label={item.status}
          variant={getStatusVariant(item.status)}
          size="small"
        />
      </View>

      <View style={styles.leaveDates}>
        <View style={styles.dateItem}>
          <ThemedText style={styles.dateLabel}>From</ThemedText>
          <ThemedText style={styles.dateValue}>{item.startDate}</ThemedText>
        </View>
        <MaterialIcons
          name="arrow-forward"
          size={16}
          color={NeutralColors.gray400}
        />
        <View style={styles.dateItem}>
          <ThemedText style={styles.dateLabel}>To</ThemedText>
          <ThemedText style={styles.dateValue}>{item.endDate}</ThemedText>
        </View>
      </View>

      <View style={styles.leaveInfo}>
        <ThemedText style={styles.daysText}>{item.totalDays} day(s)</ThemedText>
        {item.reason && (
          <ThemedText style={styles.reasonText} numberOfLines={2}>
            {item.reason}
          </ThemedText>
        )}
      </View>

      {item.approver && (
        <View style={styles.approverSection}>
          <ThemedText style={styles.approverText}>
            {item.status === 'approved' ? 'Approved by' : 'Reviewed by'}{' '}
            {item.approver.name}
          </ThemedText>
        </View>
      )}
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Leave Management',
          headerBackTitle: 'Back',
        }}
      />

      <FlatList
        data={mockLeaveRequests}
        renderItem={renderLeaveCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View>
            {/* Leave Balance */}
            <Card style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <ThemedText style={styles.balanceTitle}>
                  Leave Balance
                </ThemedText>
                <TouchableOpacity
                  onPress={() => router.push(STAFF_ROUTES.REQUEST_LEAVE)}
                >
                  <MaterialIcons
                    name="add-circle"
                    size={28}
                    color={BrandColors.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.balanceGrid}>
                <View style={styles.balanceItem}>
                  <ThemedText style={styles.balanceValue}>
                    {mockLeaveBalance.totalLeaves}
                  </ThemedText>
                  <ThemedText style={styles.balanceLabel}>Total</ThemedText>
                </View>
                <View style={styles.balanceItem}>
                  <ThemedText
                    style={[styles.balanceValue, { color: StatusColors.error }]}
                  >
                    {mockLeaveBalance.usedLeaves}
                  </ThemedText>
                  <ThemedText style={styles.balanceLabel}>Used</ThemedText>
                </View>
                <View style={styles.balanceItem}>
                  <ThemedText
                    style={[
                      styles.balanceValue,
                      { color: StatusColors.warning },
                    ]}
                  >
                    {mockLeaveBalance.pendingLeaves}
                  </ThemedText>
                  <ThemedText style={styles.balanceLabel}>Pending</ThemedText>
                </View>
                <View style={styles.balanceItem}>
                  <ThemedText
                    style={[
                      styles.balanceValue,
                      { color: StatusColors.success },
                    ]}
                  >
                    {mockLeaveBalance.remainingLeaves}
                  </ThemedText>
                  <ThemedText style={styles.balanceLabel}>Available</ThemedText>
                </View>
              </View>
            </Card>

            {/* Section Title */}
            <ThemedText style={styles.sectionTitle}>Leave Requests</ThemedText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="event-available"
              size={64}
              color={NeutralColors.gray300}
            />
            <ThemedText style={styles.emptyText}>No leave requests</ThemedText>
            <Button
              title="Request Leave"
              onPress={() => router.push(STAFF_ROUTES.REQUEST_LEAVE)}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(STAFF_ROUTES.REQUEST_LEAVE)}
      >
        <MaterialIcons name="add" size={28} color={NeutralColors.white} />
      </TouchableOpacity>
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
  balanceCard: {
    marginBottom: Spacing.lg,
    backgroundColor: BrandColors.primary,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  balanceTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: NeutralColors.white,
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: NeutralColors.white,
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  leaveCard: {
    marginBottom: Spacing.md,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  leaveType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  leaveTypeText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  leaveDates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: NeutralColors.gray50,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  leaveInfo: {
    marginBottom: Spacing.sm,
  },
  daysText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: BrandColors.primary,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  approverSection: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray100,
  },
  approverText: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
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
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
