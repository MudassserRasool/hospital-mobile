/**
 * Staff Dashboard
 * Main screen for staff with check-in status and quick actions
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView, ThemedText } from '@/components';
import { Card, Button, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { mockStaffProfile, mockCurrentCheckIn, mockWorkHours, mockLeaveBalance } from '@/utils/mockData';
import { STAFF_ROUTES } from '@/constants/routes';
import { StyleSheet } from 'react-native';
import { Spacing, FontSizes, FontWeights, NeutralColors, BrandColors, BorderRadius, StatusColors } from '@/constants/theme';

export default function StaffDashboard() {
  const { user } = useAuth();
  const primaryColor = useThemeColor({}, 'primary');
  const [refreshing, setRefreshing] = useState(false);

  const staff = mockStaffProfile;
  const isCheckedIn = !!mockCurrentCheckIn;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: staff.avatar || 'https://i.pravatar.cc/150?img=10' }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <ThemedText style={styles.userName}>{staff.name}</ThemedText>
              <ThemedText style={styles.userRole}>{staff.role} • {staff.employeeId}</ThemedText>
            </View>
          </View>
          <Badge label={isCheckedIn ? 'Checked In' : 'Checked Out'} variant={isCheckedIn ? 'success' : 'default'} />
        </View>

        {/* Check-in Status Card */}
        <Card style={[styles.statusCard, isCheckedIn && styles.statusCardActive]}>
          <View style={styles.statusHeader}>
            <View>
              <ThemedText style={[styles.statusTitle, isCheckedIn && styles.statusTitleActive]}>
                {isCheckedIn ? 'You are checked in' : 'Not checked in'}
              </ThemedText>
              {isCheckedIn && (
                <ThemedText style={styles.checkInTime}>
                  Since {new Date(mockCurrentCheckIn?.checkInTime || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </ThemedText>
              )}
            </View>
            <MaterialIcons
              name={isCheckedIn ? 'check-circle' : 'access-time'}
              size={40}
              color={isCheckedIn ? StatusColors.success : NeutralColors.gray400}
            />
          </View>
          <Button
            title={isCheckedIn ? 'Check Out' : 'Check In'}
            onPress={() => router.push(STAFF_ROUTES.CHECK_IN_OUT)}
            variant={isCheckedIn ? 'secondary' : 'primary'}
            style={styles.checkInButton}
            fullWidth
          />
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialIcons name="schedule" size={24} color={BrandColors.primary} />
            </View>
            <ThemedText style={styles.statValue}>{mockWorkHours.daily}h</ThemedText>
            <ThemedText style={styles.statLabel}>Today's Hours</ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialIcons name="event-available" size={24} color={StatusColors.success} />
            </View>
            <ThemedText style={styles.statValue}>{mockLeaveBalance.remainingLeaves}</ThemedText>
            <ThemedText style={styles.statLabel}>Leaves Left</ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialIcons name="calendar-month" size={24} color={StatusColors.info} />
            </View>
            <ThemedText style={styles.statValue}>{mockWorkHours.weekly}h</ThemedText>
            <ThemedText style={styles.statLabel}>This Week</ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialIcons name="pending-actions" size={24} color={StatusColors.warning} />
            </View>
            <ThemedText style={styles.statValue}>{mockLeaveBalance.pendingLeaves}</ThemedText>
            <ThemedText style={styles.statLabel}>Pending</ThemedText>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(STAFF_ROUTES.ATTENDANCE_HISTORY)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialIcons name="history" size={28} color="#1976D2" />
              </View>
              <ThemedText style={styles.actionText}>Attendance</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(STAFF_ROUTES.LEAVE_MANAGEMENT)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <MaterialIcons name="event-busy" size={28} color="#7B1FA2" />
              </View>
              <ThemedText style={styles.actionText}>Leaves</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(STAFF_ROUTES.WORK_HOURS)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialIcons name="schedule" size={28} color="#388E3C" />
              </View>
              <ThemedText style={styles.actionText}>Work Hours</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(STAFF_ROUTES.REQUEST_LEAVE)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialIcons name="add-circle" size={28} color="#F57C00" />
              </View>
              <ThemedText style={styles.actionText}>Request Leave</ThemedText>
            </TouchableOpacity>
          </View>
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
    paddingBottom: Spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing['3xl'],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  userRole: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  statusCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusCardActive: {
    backgroundColor: StatusColors.successLight + '20',
    borderWidth: 1,
    borderColor: StatusColors.success,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: 4,
  },
  statusTitleActive: {
    color: StatusColors.successDark,
  },
  checkInTime: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  checkInButton: {
    marginTop: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: Spacing.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionCard: {
    width: '48%',
    backgroundColor: NeutralColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
});
