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
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  useCancelLeaveRequestMutation,
  useGetMyLeaveBalanceQuery,
  useGetMyLeavesQuery,
} from '@/redux/features/staff/staffApi';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const LeaveManagementScreen = () => {
  const primaryColor = useThemeColor({}, 'primary');

  // Fetch leaves and balance from API
  const {
    data: leavesData,
    isLoading: loadingLeaves,
    refetch,
  } = useGetMyLeavesQuery({});
  const { data: leaveBalance, isLoading: loadingBalance } =
    useGetMyLeaveBalanceQuery(new Date().getFullYear());
  const [cancelLeave] = useCancelLeaveRequestMutation();

  const onRefresh = async () => {
    await refetch();
  };

  const handleCancelLeave = async (leaveId: string) => {
    Alert.alert(
      'Cancel Leave Request',
      'Are you sure you want to cancel this leave request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelLeave(leaveId).unwrap();
              Alert.alert('Success', 'Leave request cancelled');
              refetch();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.data?.message || 'Failed to cancel leave request'
              );
            }
          },
        },
      ]
    );
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

  const renderLeaveCard = ({ item }: { item: any }) => {
    const formatDate = (date: string) =>
      new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    return (
      <Card style={styles.leaveCard}>
        <ThemedView style={styles.leaveHeader}>
          <ThemedView style={styles.leaveType}>
            <MaterialIcons
              name={
                item.leaveType === 'sick'
                  ? 'local-hospital'
                  : item.leaveType === 'annual'
                  ? 'beach-access'
                  : item.leaveType === 'emergency'
                  ? 'emergency'
                  : 'person'
              }
              size={20}
              color={BrandColors.primary}
            />
            <ThemedText style={styles.leaveTypeText}>
              {item.leaveType.charAt(0).toUpperCase() + item.leaveType.slice(1)}{' '}
              Leave
            </ThemedText>
          </ThemedView>
          <Badge
            label={item.status}
            variant={getStatusVariant(item.status)}
            size="small"
          />
        </ThemedView>

        <ThemedView style={styles.leaveDates}>
          <ThemedView style={styles.dateItem}>
            <ThemedText style={styles.dateLabel}>From</ThemedText>
            <ThemedText style={styles.dateValue}>
              {formatDate(item.startDate)}
            </ThemedText>
          </ThemedView>
          <MaterialIcons
            name="arrow-forward"
            size={16}
            color={NeutralColors.gray400}
          />
          <ThemedView style={styles.dateItem}>
            <ThemedText style={styles.dateLabel}>To</ThemedText>
            <ThemedText style={styles.dateValue}>
              {formatDate(item.endDate)}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.leaveInfo}>
          <ThemedText style={styles.daysText}>
            {item.totalDays} day(s)
          </ThemedText>
          {item.reason && (
            <ThemedText style={styles.reasonText} numberOfLines={2}>
              {item.reason}
            </ThemedText>
          )}
        </ThemedView>

        {item.approver && (
          <ThemedView style={styles.approverSection}>
            <ThemedText style={styles.approverText}>
              {item.status === 'approved' ? 'Approved by' : 'Reviewed by'}{' '}
              {item.approver.name}
            </ThemedText>
          </ThemedView>
        )}
      </Card>
    );
  };

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
        data={leavesData?.leaves || []}
        renderItem={renderLeaveCard}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loadingLeaves} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <ThemedView>
            {/* Leave Balance */}
            <Card style={styles.balanceCard}>
              <ThemedView style={styles.balanceHeader}>
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
              </ThemedView>
              <ThemedView style={styles.balanceGrid}>
                {loadingBalance ? (
                  <ActivityIndicator size="small" color={primaryColor} />
                ) : leaveBalance ? (
                  <>
                    <ThemedView style={styles.balanceItem}>
                      <ThemedText style={styles.balanceValue}>
                        {Object.values(leaveBalance).reduce(
                          (sum: number, leave: any) =>
                            sum + (leave.allowed || 0),
                          0
                        )}
                      </ThemedText>
                      <ThemedText style={styles.balanceLabel}>Total</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.balanceItem}>
                      <ThemedText
                        style={[
                          styles.balanceValue,
                          { color: StatusColors.error },
                        ]}
                      >
                        {Object.values(leaveBalance).reduce(
                          (sum: number, leave: any) => sum + (leave.taken || 0),
                          0
                        )}
                      </ThemedText>
                      <ThemedText style={styles.balanceLabel}>Used</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.balanceItem}>
                      <ThemedText
                        style={[
                          styles.balanceValue,
                          { color: StatusColors.warning },
                        ]}
                      >
                        {leavesData?.leaves?.filter(
                          (l: any) => l.status === 'pending'
                        ).length || 0}
                      </ThemedText>
                      <ThemedText style={styles.balanceLabel}>
                        Pending
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.balanceItem}>
                      <ThemedText
                        style={[
                          styles.balanceValue,
                          { color: StatusColors.success },
                        ]}
                      >
                        {Object.values(leaveBalance).reduce(
                          (sum: number, leave: any) =>
                            sum + (leave.remaining || 0),
                          0
                        )}
                      </ThemedText>
                      <ThemedText style={styles.balanceLabel}>
                        Available
                      </ThemedText>
                    </ThemedView>
                  </>
                ) : null}
              </ThemedView>
            </Card>

            {/* Section Title */}
            <ThemedText style={styles.sectionTitle}>Leave Requests</ThemedText>
          </ThemedView>
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
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
          </ThemedView>
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
};

export default LeaveManagementScreen;

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
