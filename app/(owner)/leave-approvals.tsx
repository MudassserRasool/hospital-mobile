/**
 * Leave Approvals Screen
 * Approve/reject staff leave requests
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, Button, Card } from '@/components/ui';
import {
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  useApproveLeaveMutation,
  useGetPendingLeavesQuery,
  useRejectLeaveMutation,
} from '@/redux/features/owner/ownerApi';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

export default function LeaveApprovalsScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  // Fetch pending leaves
  const { data: leavesData, isLoading, refetch } = useGetPendingLeavesQuery({});
  const [approveLeave, { isLoading: approving }] = useApproveLeaveMutation();
  const [rejectLeave, { isLoading: rejecting }] = useRejectLeaveMutation();

  const handleApprove = async (id: string, staffName: string) => {
    Alert.alert('Approve Leave', `Approve leave request for ${staffName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          try {
            await approveLeave({ id, reviewerNotes: 'Approved' }).unwrap();
            Alert.alert('Success', 'Leave approved successfully');
            refetch();
          } catch (error: any) {
            Alert.alert(
              'Error',
              error.data?.message || 'Failed to approve leave'
            );
          }
        },
      },
    ]);
  };

  const handleReject = async (id: string, staffName: string) => {
    Alert.prompt(
      'Reject Leave',
      `Provide reason for rejecting ${staffName}'s leave request:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (reason) => {
            try {
              await rejectLeave({
                id,
                reason: reason || 'Not specified',
                reviewerNotes: '',
              }).unwrap();
              Alert.alert('Rejected', 'Leave request rejected');
              refetch();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.data?.message || 'Failed to reject leave'
              );
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const renderLeaveCard = ({ item }: { item: any }) => {
    const staff = item.staffId;
    const staffName = `${staff?.firstName} ${staff?.lastName}`;

    return (
      <Card style={styles.leaveCard}>
        <ThemedView style={styles.leaveHeader}>
          <ThemedText style={styles.staffName}>{staffName}</ThemedText>
          <Badge label={item.leaveType} variant="info" size="small" />
        </ThemedView>
        <ThemedText style={styles.dates}>
          {formatDate(item.startDate)} - {formatDate(item.endDate)} (
          {item.totalDays} days)
        </ThemedText>
        <ThemedText style={styles.reason}>{item.reason}</ThemedText>
        <ThemedView style={styles.actions}>
          <Button
            title="Reject"
            variant="outline"
            style={{ flex: 1 }}
            loading={rejecting}
            onPress={() => handleReject(item._id, staffName)}
          />
          <Button
            title="Approve"
            variant="primary"
            style={{ flex: 1 }}
            loading={approving}
            onPress={() => handleApprove(item._id, staffName)}
          />
        </ThemedView>
      </Card>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Leave Approvals',
          headerBackTitle: 'Back',
        }}
      />

      <FlatList
        data={leavesData?.leaves || []}
        renderItem={renderLeaveCard}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          isLoading ? (
            <ThemedView style={{ padding: 32, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={primaryColor} />
              <ThemedText style={{ marginTop: 16 }}>
                Loading leave requests...
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={{ padding: 32, alignItems: 'center' }}>
              <ThemedText>No pending leave requests</ThemedText>
            </ThemedView>
          )
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: Spacing.lg },
  leaveCard: { marginBottom: Spacing.md },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  staffName: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold },
  dates: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: Spacing.xs,
  },
  reason: { fontSize: FontSizes.sm, marginBottom: Spacing.md },
  actions: { flexDirection: 'row', gap: Spacing.md },
});
