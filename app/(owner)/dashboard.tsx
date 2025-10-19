/**
 * Owner Dashboard
 * Hospital overview with key metrics
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, Card } from '@/components/ui';
import { OWNER_ROUTES } from '@/constants/routes';
import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
  StatusColors,
} from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { mockDashboardStats, mockLeaveRequests } from '@/utils/mockData';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const stats = mockDashboardStats;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const quickActions = [
    {
      id: 'staff',
      title: 'Staff Management',
      icon: 'people',
      route: OWNER_ROUTES.STAFF_LIST,
      color: '#4B7BEC',
    },
    {
      id: 'leaves',
      title: 'Leave Approvals',
      icon: 'event-available',
      route: OWNER_ROUTES.LEAVE_APPROVALS,
      color: '#5F27CD',
      badge: stats.pendingLeaves,
    },
    {
      id: 'appointments',
      title: 'Appointments',
      icon: 'calendar-month',
      route: OWNER_ROUTES.DOCTOR_APPOINTMENTS,
      color: '#26DE81',
    },
    {
      id: 'profile',
      title: 'Hospital Profile',
      icon: 'local-hospital',
      route: OWNER_ROUTES.HOSPITAL_PROFILE,
      color: '#FC5C65',
    },
    {
      id: 'add',
      title: 'Add Staff',
      icon: 'person-add',
      route: OWNER_ROUTES.ADD_STAFF,
      color: '#FD9644',
    },
    {
      id: 'bonus',
      title: 'Bonuses',
      icon: 'card-giftcard',
      route: OWNER_ROUTES.BONUSES,
      color: '#45AAF2',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.greeting}>Welcome Back 👋</ThemedText>
            <ThemedText style={styles.userName}>
              {user?.name || 'Admin'}
            </ThemedText>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { backgroundColor: '#EFF3FF' }]}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: BrandColors.primary },
              ]}
            >
              <MaterialIcons
                name="people"
                size={24}
                color={NeutralColors.white}
              />
            </View>
            <ThemedText style={styles.statValue}>{stats.totalStaff}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Staff</ThemedText>
            <ThemedText style={styles.statSubtext}>
              {stats.activeStaff} active
            </ThemedText>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: BrandColors.secondary },
              ]}
            >
              <MaterialIcons
                name="medical-services"
                size={24}
                color={NeutralColors.white}
              />
            </View>
            <ThemedText style={styles.statValue}>
              {stats.totalDoctors}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Doctors</ThemedText>
            <ThemedText style={styles.statSubtext}>specialists</ThemedText>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: StatusColors.success },
              ]}
            >
              <MaterialIcons
                name="event"
                size={24}
                color={NeutralColors.white}
              />
            </View>
            <ThemedText style={styles.statValue}>
              {stats.todayAppointments}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Today's Appts</ThemedText>
            <ThemedText style={styles.statSubtext}>
              {stats.monthlyAppointments} this month
            </ThemedText>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: StatusColors.warning },
              ]}
            >
              <MaterialIcons
                name="attach-money"
                size={24}
                color={NeutralColors.white}
              />
            </View>
            <ThemedText style={styles.statValue}>
              Rs.{(stats.monthlyRevenue / 1000).toFixed(0)}K
            </ThemedText>
            <ThemedText style={styles.statLabel}>Revenue</ThemedText>
            <ThemedText style={styles.statSubtext}>this month</ThemedText>
          </Card>
        </View>

        {/* Pending Leaves */}
        {stats.pendingLeaves > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Pending Leave Requests
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push(OWNER_ROUTES.LEAVE_APPROVALS)}
              >
                <ThemedText style={styles.seeAll}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            {mockLeaveRequests
              .filter((l) => l.status === 'pending')
              .slice(0, 2)
              .map((leave) => (
                <Card
                  key={leave.id}
                  style={styles.leaveCard}
                  onPress={() => router.push(OWNER_ROUTES.LEAVE_APPROVALS)}
                >
                  <View style={styles.leaveHeader}>
                    <View style={styles.leaveInfo}>
                      <ThemedText style={styles.leaveName}>
                        {leave.staffId}
                      </ThemedText>
                      <ThemedText style={styles.leaveType}>
                        {leave.type} Leave
                      </ThemedText>
                    </View>
                    <Badge label="Pending" variant="warning" size="small" />
                  </View>
                  <ThemedText style={styles.leaveDates}>
                    {leave.startDate} - {leave.endDate} ({leave.totalDays} days)
                  </ThemedText>
                </Card>
              ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: action.color + '20' },
                  ]}
                >
                  <MaterialIcons
                    name={action.icon as any}
                    size={28}
                    color={action.color}
                  />
                  {action.badge && action.badge > 0 && (
                    <View style={styles.actionBadge}>
                      <ThemedText style={styles.actionBadgeText}>
                        {action.badge}
                      </ThemedText>
                    </View>
                  )}
                </View>
                <ThemedText style={styles.actionText}>
                  {action.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hospital Rating */}
        <Card style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <MaterialIcons name="star" size={40} color="#FD9644" />
            <View style={styles.ratingInfo}>
              <ThemedText style={styles.ratingValue}>
                {stats.averageRating}
              </ThemedText>
              <ThemedText style={styles.ratingLabel}>
                Hospital Rating
              </ThemedText>
            </View>
          </View>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: Spacing['4xl'] },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing['3xl'],
  },
  greeting: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: 4,
  },
  userName: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
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
    padding: Spacing.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  seeAll: {
    fontSize: FontSizes.sm,
    color: BrandColors.primary,
    fontWeight: FontWeights.semibold,
  },
  leaveCard: {
    marginBottom: Spacing.sm,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  leaveInfo: {
    flex: 1,
  },
  leaveName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: 2,
  },
  leaveType: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  leaveDates: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionCard: {
    width: '31%',
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
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: StatusColors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  actionBadgeText: {
    color: NeutralColors.white,
    fontSize: 11,
    fontWeight: FontWeights.bold,
  },
  actionText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
  ratingCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: '#FFF3E0',
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  ratingInfo: {},
  ratingValue: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    color: '#F57C00',
  },
  ratingLabel: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
  },
});
