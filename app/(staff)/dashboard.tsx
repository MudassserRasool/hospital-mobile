/**
 * Staff Dashboard
 * Main screen for staff with check-in status and quick actions
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
import { useAuth } from '@/hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { 
  useGetTodayAttendanceQuery, 
  useGetMyLeaveBalanceQuery,
  useGetMyProfileQuery,
} from '@/redux/features/staff/staffApi';

export default function StaffDashboard() {
  const { user } = useAuth();
  const primaryColor = useThemeColor({}, 'primary');

  // Fetch data from APIs
  const { data: profile, isLoading: loadingProfile, refetch: refetchProfile } = useGetMyProfileQuery();
  const { data: todayAttendance, isLoading: loadingAttendance, refetch: refetchAttendance } = useGetTodayAttendanceQuery();
  const { data: leaveBalance, isLoading: loadingLeaves, refetch: refetchLeaves } = useGetMyLeaveBalanceQuery(new Date().getFullYear());

  const isCheckedIn = todayAttendance && !todayAttendance.checkOutTime;
  const workHoursToday = todayAttendance?.workHours || 0;

  // Calculate total remaining leaves
  const totalRemainingLeaves = leaveBalance ? 
    Object.values(leaveBalance).reduce((sum: number, leave: any) => sum + (leave.remaining || 0), 0) : 0;

  const onRefresh = async () => {
    await Promise.all([refetchProfile(), refetchAttendance(), refetchLeaves()]);
  };

  const refreshing = loadingProfile || loadingAttendance || loadingLeaves;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedView style={styles.userInfo}>
            {loadingProfile ? (
              <ActivityIndicator size="small" color={primaryColor} />
            ) : (
              <>
                <Image
                  source={{
                    uri: profile?.profilePicture || `https://i.pravatar.cc/150?u=${profile?._id}`,
                  }}
                  style={styles.avatar}
                />
                <ThemedView style={styles.userDetails}>
                  <ThemedText style={styles.userName}>
                    {profile?.firstName} {profile?.lastName}
                  </ThemedText>
                  <ThemedText style={styles.userRole}>
                    {profile?.role || 'Staff'} • {profile?.email}
                  </ThemedText>
                </ThemedView>
              </>
            )}
          </ThemedView>
          <Badge
            label={isCheckedIn ? 'Checked In' : 'Checked Out'}
            variant={isCheckedIn ? 'success' : 'default'}
          />
        </ThemedView>

        {/* Check-in Status Card */}
        <Card
          style={[styles.statusCard, isCheckedIn && styles.statusCardActive]}
        >
          <ThemedView style={styles.statusHeader}>
            <ThemedView>
              <ThemedText
                style={[
                  styles.statusTitle,
                  isCheckedIn && styles.statusTitleActive,
                ]}
              >
                {isCheckedIn ? 'You are checked in' : 'Not checked in'}
              </ThemedText>
              {isCheckedIn && todayAttendance && (
                <ThemedText style={styles.checkInTime}>
                  Since{' '}
                  {new Date(todayAttendance.checkInTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </ThemedText>
              )}
            </ThemedView>
            <MaterialIcons
              name={isCheckedIn ? 'check-circle' : 'access-time'}
              size={40}
              color={isCheckedIn ? StatusColors.success : NeutralColors.gray400}
            />
          </ThemedView>
          <Button
            title={isCheckedIn ? 'Check Out' : 'Check In'}
            onPress={() => router.push(STAFF_ROUTES.CHECK_IN_OUT)}
            variant={isCheckedIn ? 'secondary' : 'primary'}
            style={styles.checkInButton}
            fullWidth
          />
        </Card>

        {/* Stats Grid */}
        <ThemedView style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <ThemedView style={styles.statIcon}>
              <MaterialIcons
                name="schedule"
                size={24}
                color={BrandColors.primary}
              />
            </ThemedView>
            <ThemedText style={styles.statValue}>
              {workHoursToday.toFixed(1)}h
            </ThemedText>
            <ThemedText style={styles.statLabel}>Today's Hours</ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <ThemedView style={styles.statIcon}>
              <MaterialIcons
                name="event-available"
                size={24}
                color={StatusColors.success}
              />
            </ThemedView>
            <ThemedText style={styles.statValue}>
              {totalRemainingLeaves}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Leaves Left</ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <ThemedView style={styles.statIcon}>
              <MaterialIcons
                name="calendar-month"
                size={24}
                color={StatusColors.info}
              />
            </ThemedView>
            <ThemedText style={styles.statValue}>
              {loadingAttendance ? '-' : '0'}h
            </ThemedText>
            <ThemedText style={styles.statLabel}>This Week</ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <ThemedView style={styles.statIcon}>
              <MaterialIcons
                name="pending-actions"
                size={24}
                color={StatusColors.warning}
              />
            </ThemedView>
            <ThemedText style={styles.statValue}>
              {loadingLeaves ? '-' : '0'}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Pending</ThemedText>
          </Card>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <ThemedView style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(STAFF_ROUTES.ATTENDANCE_HISTORY)}
            >
              <ThemedView
                style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}
              >
                <MaterialIcons name="history" size={28} color="#1976D2" />
              </ThemedView>
              <ThemedText style={styles.actionText}>Attendance</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(STAFF_ROUTES.LEAVE_MANAGEMENT)}
            >
              <ThemedView
                style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}
              >
                <MaterialIcons name="event-busy" size={28} color="#7B1FA2" />
              </ThemedView>
              <ThemedText style={styles.actionText}>Leaves</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(STAFF_ROUTES.WORK_HOURS)}
            >
              <ThemedView
                style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}
              >
                <MaterialIcons name="schedule" size={28} color="#388E3C" />
              </ThemedView>
              <ThemedText style={styles.actionText}>Work Hours</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push(STAFF_ROUTES.REQUEST_LEAVE)}
            >
              <ThemedView
                style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}
              >
                <MaterialIcons name="add-circle" size={28} color="#F57C00" />
              </ThemedView>
              <ThemedText style={styles.actionText}>Request Leave</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
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
