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
import { mockLeaveRequests } from '@/utils/mockData';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet } from 'react-native';

export default function LeaveApprovalsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const pendingLeaves = mockLeaveRequests.filter((l) => l.status === 'pending');

  const handleApprove = (id: string) => {
    Alert.alert('Approve Leave', 'Approve this leave request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: () => Alert.alert('Success', 'Leave approved'),
      },
    ]);
  };

  const handleReject = (id: string) => {
    Alert.alert(
      'Reject Leave',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => Alert.alert('Rejected', 'Leave request rejected'),
        },
      ]
    );
  };

  const renderLeaveCard = ({
    item,
  }: {
    item: (typeof mockLeaveRequests)[0];
  }) => (
    <Card style={styles.leaveCard}>
      <ThemedView style={styles.leaveHeader}>
        <ThemedText style={styles.staffName}>Staff Member</ThemedText>
        <Badge label={item.type} variant="info" size="small" />
      </ThemedView>
      <ThemedText style={styles.dates}>
        {item.startDate} - {item.endDate} ({item.totalDays} days)
      </ThemedText>
      <ThemedText style={styles.reason}>{item.reason}</ThemedText>
      <ThemedView style={styles.actions}>
        <Button
          title="Reject"
          variant="outline"
          style={{ flex: 1 }}
          onPress={() => handleReject(item.id)}
        />
        <Button
          title="Approve"
          variant="primary"
          style={{ flex: 1 }}
          onPress={() => handleApprove(item.id)}
        />
      </ThemedView>
    </Card>
  );

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
        data={pendingLeaves}
        renderItem={renderLeaveCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
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
