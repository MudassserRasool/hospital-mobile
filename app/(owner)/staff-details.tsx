/**
 * Staff Details Screen
 * View detailed staff information
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, Button, Card } from '@/components/ui';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { mockAttendanceSummary, mockStaffProfile } from '@/utils/mockData';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';

export default function StaffDetailsScreen() {
  const staff = mockStaffProfile;
  const attendance = mockAttendanceSummary;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Staff Details',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <Image source={{ uri: staff.avatar }} style={styles.avatar} />
          <ThemedText style={styles.name}>{staff.name}</ThemedText>
          <ThemedText style={styles.role}>
            {staff.role} • {staff.department}
          </ThemedText>
          <Badge
            label={staff.isActive ? 'Active' : 'Inactive'}
            variant="success"
          />
        </Card>

        <Card style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Employment Details
          </ThemedText>
          <View style={styles.detailRow}>
            <ThemedText style={styles.label}>Employee ID:</ThemedText>
            <ThemedText style={styles.value}>{staff.employeeId}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.label}>Joining Date:</ThemedText>
            <ThemedText style={styles.value}>{staff.joiningDate}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.label}>Contact:</ThemedText>
            <ThemedText style={styles.value}>{staff.contactNumber}</ThemedText>
          </View>
        </Card>

        <Card style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Attendance Summary
          </ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {attendance.presentDays}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Present</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {attendance.totalHours}h
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Hours</ThemedText>
            </View>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Edit Details"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => Alert.alert('Edit', 'Edit functionality')}
          />
          <Button
            title="Deactivate"
            variant="danger"
            style={{ flex: 1 }}
            onPress={() => Alert.alert('Deactivate', 'Deactivate staff')}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  role: {
    fontSize: FontSizes.md,
    color: NeutralColors.gray600,
    marginBottom: Spacing.md,
  },
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  label: { fontSize: FontSizes.sm, color: NeutralColors.gray600 },
  value: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  statsGrid: { flexDirection: 'row', gap: Spacing.md },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: NeutralColors.gray50,
    borderRadius: BorderRadius.md,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: BrandColors.primary,
  },
  statLabel: { fontSize: FontSizes.xs, color: NeutralColors.gray600 },
  actions: { flexDirection: 'row', gap: Spacing.md },
});
